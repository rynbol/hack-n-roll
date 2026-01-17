import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase';

interface Match {
  id: string;
  name: string;
  age: number;
  imgUrl: any;
  matchedAt: string;
}

/**
 * Matches hook for fetching mutual matches
 */
export function useMatches(userId: string | undefined) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMatches = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get mutual matches from interactions table
      const {data, error: queryError} = await supabase
        .from('interactions')
        .select(
          `
          *,
          user1:user_id_1 (
            id,
            profiles (name, age, photo_url)
          ),
          user2:user_id_2 (
            id,
            profiles (name, age, photo_url)
          )
        `
        )
        .eq('action', 'like')
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
        .order('created_at', {ascending: false});

      if (queryError) throw queryError;

      // Filter for mutual matches and transform data
      const mutualMatches: Match[] = [];
      const matchedUserIds = new Set<string>();

      for (const interaction of data || []) {
        const isUser1 = interaction.user_id_1 === userId;
        const otherUserId = isUser1 ? interaction.user_id_2 : interaction.user_id_1;

        // Skip if already processed
        if (matchedUserIds.has(otherUserId)) continue;

        // Check if the other user also liked back
        const {data: reverseMatch} = await supabase
          .from('interactions')
          .select('*')
          .eq('user_id_1', otherUserId)
          .eq('user_id_2', userId)
          .eq('action', 'like')
          .single();

        if (reverseMatch) {
          matchedUserIds.add(otherUserId);

          const otherUser = isUser1 ? interaction.user2 : interaction.user1;
          const profile = otherUser?.profiles;

          if (profile) {
            mutualMatches.push({
              id: otherUserId,
              name: profile.name?.split(' ')[0] || 'Unknown',
              age: profile.age || 0,
              imgUrl: profile.photo_url
                ? {uri: profile.photo_url}
                : require('../../assets/HeartIcon.png'),
              matchedAt: interaction.created_at,
            });
          }
        }
      }

      setMatches(mutualMatches);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [userId]);

  /**
   * Unmatch with a user
   */
  const unmatch = async (matchedUserId: string) => {
    if (!userId) return;

    try {
      const {error} = await supabase.rpc('unmatch', {
        p_user_id: userId,
        p_matched_user_id: matchedUserId,
      });

      if (error) throw error;

      // Remove from matches list
      setMatches(prev => prev.filter(m => m.id !== matchedUserId));
    } catch (err) {
      console.error('Error unmatching:', err);
      throw err;
    }
  };

  return {
    matches,
    loading,
    error,
    unmatch,
    refresh: fetchMatches,
  };
}
