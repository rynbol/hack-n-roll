import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase';
import {Profile} from '../components/DatesCard';

/**
 * Profiles hook for fetching swipeable profiles
 */
export function useProfiles(userId: string | undefined, limit: number = 10) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfiles = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call the get_student_profiles function
      const {data, error: rpcError} = await supabase.rpc('get_student_profiles', {
        p_user_id: userId,
        p_limit: limit,
        p_offset: 0,
      });

      if (rpcError) throw rpcError;

      // Transform database format to Profile format
      const transformedProfiles: Profile[] = (data || []).map((profile: any) => ({
        id: profile.profile_id,
        imgUrl: profile.photo_url ? {uri: profile.photo_url} : require('../../assets/HeartIcon.png'),
        name: profile.name?.split(' ')[0] || 'Unknown',
        lastName: profile.name?.split(' ').slice(1).join(' ') || '',
        age: profile.age || 0,
        city: profile.city || 'Unknown',
        country: profile.country || 'Unknown',
        major: profile.major,
        university: profile.university,
        bio: profile.bio,
      }));

      setProfiles(transformedProfiles);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [userId, limit]);

  /**
   * Like a profile
   */
  const likeProfile = async (profileId: string) => {
    if (!userId) return;

    try {
      const {data, error} = await supabase.rpc('like_profile', {
        p_user_id: userId,
        p_liked_user_id: profileId,
      });

      if (error) throw error;

      // Remove liked profile from list
      setProfiles(prev => prev.filter(p => p.id !== profileId));

      return data;
    } catch (err) {
      console.error('Error liking profile:', err);
      throw err;
    }
  };

  /**
   * Skip a profile
   */
  const skipProfile = async (profileId: string) => {
    if (!userId) return;

    try {
      const {error} = await supabase.rpc('skip_profile', {
        p_user_id: userId,
        p_skipped_user_id: profileId,
      });

      if (error) throw error;

      // Remove skipped profile from list
      setProfiles(prev => prev.filter(p => p.id !== profileId));
    } catch (err) {
      console.error('Error skipping profile:', err);
      throw err;
    }
  };

  return {
    profiles,
    loading,
    error,
    likeProfile,
    skipProfile,
    refresh: fetchProfiles,
  };
}
