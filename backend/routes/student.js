import express from 'express';
import supabase from '../config/supabaseClient.js';

const router = express.Router();

/**
 * POST /api/student/setup
 * Set up or update student profile information
 */
router.post('/setup', async (req, res) => {
  try {
    const {userId, university, email, major, graduation_year, classes, study_interests} =
      req.body;

    if (!userId || !university || !email) {
      return res.status(400).json({
        error: 'userId, university, and email are required',
      });
    }

    // Check if profile already exists
    const {data: existing} = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;

    if (existing) {
      // Update existing profile
      const {data, error} = await supabase
        .from('student_profiles')
        .update({
          university,
          email,
          major,
          graduation_year,
          classes: classes || [],
          study_interests: study_interests || [],
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new profile
      const {data, error} = await supabase
        .from('student_profiles')
        .insert({
          user_id: userId,
          university,
          email,
          major,
          graduation_year,
          classes: classes || [],
          study_interests: study_interests || [],
        })
        .select()
        .single();

      if (error) throw error;
      result = data;

      // Link to main profile
      await supabase
        .from('profiles')
        .update({student_profile_id: result.id})
        .eq('user_id', userId);
    }

    res.json({
      success: true,
      profile: result,
      message: 'Student profile saved successfully',
    });
  } catch (error) {
    console.error('Setup student profile error:', error);
    res.status(500).json({
      error: 'Failed to save student profile',
      message: error.message,
    });
  }
});

/**
 * GET /api/student/:userId
 * Get student profile
 */
router.get('/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    const {data, error} = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      return res.status(404).json({error: 'Student profile not found'});
    }

    res.json({
      success: true,
      profile: data,
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      error: 'Failed to get student profile',
      message: error.message,
    });
  }
});

/**
 * GET /api/student/majors
 * Get list of all majors
 */
router.get('/majors/list', async (req, res) => {
  try {
    const {data, error} = await supabase
      .from('majors')
      .select('*')
      .order('name', {ascending: true});

    if (error) throw error;

    res.json({
      success: true,
      majors: data,
      count: data.length,
    });
  } catch (error) {
    console.error('Get majors error:', error);
    res.status(500).json({
      error: 'Failed to get majors',
      message: error.message,
    });
  }
});

/**
 * GET /api/student/majors/:category
 * Get majors by category
 */
router.get('/majors/:category', async (req, res) => {
  try {
    const {category} = req.params;

    const {data, error} = await supabase
      .from('majors')
      .select('*')
      .eq('category', category)
      .order('name', {ascending: true});

    if (error) throw error;

    res.json({
      success: true,
      majors: data,
      count: data.length,
    });
  } catch (error) {
    console.error('Get majors by category error:', error);
    res.status(500).json({
      error: 'Failed to get majors',
      message: error.message,
    });
  }
});

/**
 * POST /api/student/classes/add
 * Add a class to student's schedule
 */
router.post('/classes/add', async (req, res) => {
  try {
    const {userId, classCode, className, university, semester} = req.body;

    if (!userId || !classCode || !className || !university) {
      return res.status(400).json({
        error: 'userId, classCode, className, and university are required',
      });
    }

    // Get or create the class
    let classId;
    const {data: existingClass} = await supabase
      .from('classes')
      .select('id')
      .eq('code', classCode)
      .eq('university', university)
      .single();

    if (existingClass) {
      classId = existingClass.id;
    } else {
      const {data: newClass, error: createError} = await supabase
        .from('classes')
        .insert({
          code: classCode,
          name: className,
          university,
        })
        .select()
        .single();

      if (createError) throw createError;
      classId = newClass.id;
    }

    // Add to student_classes
    const {data, error} = await supabase
      .from('student_classes')
      .insert({
        student_id: userId,
        class_id: classId,
        semester,
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate entries
      if (error.code === '23505') {
        return res.status(400).json({
          error: 'Class already added to your schedule',
        });
      }
      throw error;
    }

    res.json({
      success: true,
      enrollment: data,
      message: 'Class added successfully',
    });
  } catch (error) {
    console.error('Add class error:', error);
    res.status(500).json({
      error: 'Failed to add class',
      message: error.message,
    });
  }
});

/**
 * GET /api/student/:userId/classes
 * Get student's classes
 */
router.get('/:userId/classes', async (req, res) => {
  try {
    const {userId} = req.params;

    const {data, error} = await supabase
      .from('student_classes')
      .select(
        `
        *,
        classes:class_id (*)
      `
      )
      .eq('student_id', userId);

    if (error) throw error;

    res.json({
      success: true,
      classes: data,
      count: data.length,
    });
  } catch (error) {
    console.error('Get student classes error:', error);
    res.status(500).json({
      error: 'Failed to get classes',
      message: error.message,
    });
  }
});

export default router;
