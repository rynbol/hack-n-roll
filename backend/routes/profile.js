import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import profileGenerator from '../services/ai/profileGenerator.js';
import supabase from '../config/supabaseClient.js';

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

/**
 * POST /api/profile/generate
 * Upload photo and generate AI profile
 */
router.post('/generate', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: 'No photo uploaded'});
    }

    const {userId, major, university, classes, study_interests} = req.body;

    if (!userId) {
      return res.status(400).json({error: 'userId is required'});
    }

    // Process and optimize image
    const processedImage = await sharp(req.file.buffer)
      .resize(1024, 1024, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({quality: 85})
      .toBuffer();

    // Upload to Supabase Storage
    const fileName = `${userId}/${Date.now()}.jpg`;
    const {data: uploadData, error: uploadError} = await supabase.storage
      .from('profiles')
      .upload(fileName, processedImage, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const {
      data: {publicUrl},
    } = supabase.storage.from('profiles').getPublicUrl(fileName);

    // Prepare user context
    const userContext = {
      major: major || 'Unknown',
      university: university || 'Unknown',
      classes: classes ? JSON.parse(classes) : [],
      study_interests: study_interests ? JSON.parse(study_interests) : [],
    };

    // Generate profile using AI
    const profileData = await profileGenerator.generateFromPhoto(
      processedImage,
      userId,
      userContext
    );

    // Save profile to database
    const savedProfile = await profileGenerator.saveProfile(userId, publicUrl, profileData);

    // Automatically set as active if it's the first profile
    await profileGenerator.setActiveProfile(userId, savedProfile.id);

    res.json({
      success: true,
      profile: savedProfile,
      message: 'Profile generated successfully',
    });
  } catch (error) {
    console.error('Generate profile error:', error);
    res.status(500).json({
      error: 'Failed to generate profile',
      message: error.message,
    });
  }
});

/**
 * POST /api/profile/regenerate
 * Regenerate profile with different AI provider
 */
router.post('/regenerate', async (req, res) => {
  try {
    const {userId, photoUrl, provider, major, university, classes, study_interests} = req.body;

    if (!userId || !photoUrl) {
      return res.status(400).json({error: 'userId and photoUrl are required'});
    }

    const userContext = {
      major: major || 'Unknown',
      university: university || 'Unknown',
      classes: classes || [],
      study_interests: study_interests || [],
    };

    const newProfile = await profileGenerator.regenerateProfile(
      userId,
      photoUrl,
      userContext,
      provider
    );

    await profileGenerator.setActiveProfile(userId, newProfile.id);

    res.json({
      success: true,
      profile: newProfile,
      message: 'Profile regenerated successfully',
    });
  } catch (error) {
    console.error('Regenerate profile error:', error);
    res.status(500).json({
      error: 'Failed to regenerate profile',
      message: error.message,
    });
  }
});

/**
 * GET /api/profile/:userId
 * Get active profile for a user
 */
router.get('/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    const profile = await profileGenerator.getActiveProfile(userId);

    if (!profile) {
      return res.status(404).json({error: 'No active profile found'});
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: error.message,
    });
  }
});

/**
 * GET /api/profile/:userId/all
 * Get all profiles for a user
 */
router.get('/:userId/all', async (req, res) => {
  try {
    const {userId} = req.params;

    const profiles = await profileGenerator.getUserProfiles(userId);

    res.json({
      success: true,
      profiles,
      count: profiles.length,
    });
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({
      error: 'Failed to get profiles',
      message: error.message,
    });
  }
});

/**
 * PUT /api/profile/:userId/activate/:profileId
 * Set a profile as active
 */
router.put('/:userId/activate/:profileId', async (req, res) => {
  try {
    const {userId, profileId} = req.params;

    const profile = await profileGenerator.setActiveProfile(userId, profileId);

    res.json({
      success: true,
      profile,
      message: 'Profile activated successfully',
    });
  } catch (error) {
    console.error('Activate profile error:', error);
    res.status(500).json({
      error: 'Failed to activate profile',
      message: error.message,
    });
  }
});

export default router;
