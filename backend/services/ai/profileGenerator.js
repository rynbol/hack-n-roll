import aiProviderFactory from './providers/factory.js';
import supabase from '../../config/supabaseClient.js';

/**
 * Profile Generator Service
 * Orchestrates AI-powered profile generation from photos
 */
class ProfileGenerator {
  /**
   * Generate a complete profile from a photo
   * @param {Buffer} imageBuffer - The photo data
   * @param {string} userId - The user's ID
   * @param {Object} userContext - Additional user context (major, university, etc.)
   * @param {string} providerName - AI provider to use (optional)
   * @returns {Promise<Object>} Generated profile data
   */
  async generateFromPhoto(imageBuffer, userId, userContext = {}, providerName = null) {
    try {
      // Get AI provider
      const provider = aiProviderFactory.getProvider(providerName);
      console.log(`Using ${provider.getName()} for profile generation`);

      // Step 1: Analyze the photo
      console.log('Analyzing photo...');
      const photoAnalysis = await provider.analyzePhoto(imageBuffer);
      console.log('Photo analysis complete:', photoAnalysis);

      // Step 2: Generate profile content
      console.log('Generating profile...');
      const profileContent = await provider.generateProfile(photoAnalysis, userContext);
      console.log('Profile generation complete');

      // Step 3: Combine analysis and generated content
      const result = {
        generated_bio: profileContent.bio,
        personality_traits: profileContent.personality_traits,
        interests: [...photoAnalysis.interests, ...(userContext.study_interests || [])],
        conversation_starters: profileContent.conversation_starters,
        ai_provider: provider.getName(),
        photo_analysis: photoAnalysis,
      };

      return result;
    } catch (error) {
      console.error('Profile generation error:', error);
      throw error;
    }
  }

  /**
   * Save generated profile to database
   * @param {string} userId - The user's ID
   * @param {string} photoUrl - URL of the uploaded photo
   * @param {Object} profileData - Generated profile data
   * @returns {Promise<Object>} Saved profile record
   */
  async saveProfile(userId, photoUrl, profileData) {
    try {
      // Insert into ai_profiles table
      const {data, error} = await supabase
        .from('ai_profiles')
        .insert({
          user_id: userId,
          photo_url: photoUrl,
          generated_bio: profileData.generated_bio,
          personality_traits: profileData.personality_traits,
          interests: profileData.interests,
          conversation_starters: profileData.conversation_starters,
          ai_provider: profileData.ai_provider,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save profile: ${error.message}`);
      }

      console.log('Profile saved to database:', data.id);
      return data;
    } catch (error) {
      console.error('Save profile error:', error);
      throw error;
    }
  }

  /**
   * Get active AI profile for a user
   * @param {string} userId - The user's ID
   * @returns {Promise<Object|null>} Active profile or null
   */
  async getActiveProfile(userId) {
    try {
      const {data, error} = await supabase
        .from('ai_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', {ascending: false})
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get active profile error:', error);
      throw error;
    }
  }

  /**
   * Set a profile as active and deactivate others
   * @param {string} userId - The user's ID
   * @param {string} profileId - The profile ID to activate
   * @returns {Promise<Object>} Updated profile
   */
  async setActiveProfile(userId, profileId) {
    try {
      // Deactivate all other profiles
      await supabase
        .from('ai_profiles')
        .update({is_active: false})
        .eq('user_id', userId);

      // Activate the selected profile
      const {data, error} = await supabase
        .from('ai_profiles')
        .update({is_active: true})
        .eq('id', profileId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update the profiles table to link to this AI profile
      await supabase
        .from('profiles')
        .update({active_ai_profile_id: profileId})
        .eq('user_id', userId);

      return data;
    } catch (error) {
      console.error('Set active profile error:', error);
      throw error;
    }
  }

  /**
   * Get all profiles for a user
   * @param {string} userId - The user's ID
   * @returns {Promise<Array>} List of profiles
   */
  async getUserProfiles(userId) {
    try {
      const {data, error} = await supabase
        .from('ai_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false});

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Get user profiles error:', error);
      throw error;
    }
  }

  /**
   * Regenerate profile with a different AI provider
   * @param {string} userId - The user's ID
   * @param {string} photoUrl - URL of the photo
   * @param {Object} userContext - User context
   * @param {string} providerName - AI provider to use
   * @returns {Promise<Object>} New generated profile
   */
  async regenerateProfile(userId, photoUrl, userContext, providerName) {
    try {
      // Download the photo from storage
      const {data: photoData, error: downloadError} = await supabase.storage
        .from('profiles')
        .download(photoUrl.replace(/^.*\/profiles\//, ''));

      if (downloadError) {
        throw new Error(`Failed to download photo: ${downloadError.message}`);
      }

      // Convert blob to buffer
      const imageBuffer = Buffer.from(await photoData.arrayBuffer());

      // Generate new profile
      const profileData = await this.generateFromPhoto(
        imageBuffer,
        userId,
        userContext,
        providerName
      );

      // Save to database
      const savedProfile = await this.saveProfile(userId, photoUrl, profileData);

      return savedProfile;
    } catch (error) {
      console.error('Regenerate profile error:', error);
      throw error;
    }
  }
}

export default new ProfileGenerator();
