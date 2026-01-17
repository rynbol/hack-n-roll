import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase';

interface Message {
  id: string;
  message: string;
  sender: 'me' | 'them';
  timestamp: string;
  created_at: string;
}

interface ChatChannel {
  id: string;
  name: string;
  age: number;
  imgUrl: any;
  lastMessage: string;
  timeSent: string;
  isOnline: boolean;
}

/**
 * Chat hook for managing chat channels and messages
 */
export function useChat(userId: string | undefined) {
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChannels = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get channels from chat.channels table
      const {data, error: queryError} = await supabase
        .from('chat.channels')
        .select(
          `
          *,
          participants:chat.channel_participants (
            user_id,
            profiles (name, age, photo_url)
          )
        `
        )
        .contains('participants', [{user_id: userId}])
        .order('updated_at', {ascending: false});

      if (queryError) throw queryError;

      // Transform to ChatChannel format
      const transformedChannels: ChatChannel[] = (data || []).map((channel: any) => {
        const otherParticipant = channel.participants?.find(
          (p: any) => p.user_id !== userId
        );
        const profile = otherParticipant?.profiles;

        return {
          id: channel.id,
          name: profile?.name?.split(' ')[0] || 'Unknown',
          age: profile?.age || 0,
          imgUrl: profile?.photo_url
            ? {uri: profile.photo_url}
            : require('../../assets/HeartIcon.png'),
          lastMessage: channel.last_message || '',
          timeSent: formatTimestamp(channel.updated_at),
          isOnline: false, // TODO: Implement presence
        };
      });

      setChannels(transformedChannels);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();

    // Subscribe to realtime updates
    if (userId) {
      const subscription = supabase
        .channel('chat_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'chat',
            table: 'channels',
          },
          () => {
            fetchChannels();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId]);

  return {
    channels,
    loading,
    error,
    refresh: fetchChannels,
  };
}

/**
 * Hook for managing messages in a specific channel
 */
export function useMessages(channelId: string | undefined, userId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = async () => {
    if (!channelId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const {data, error: queryError} = await supabase
        .from('chat.messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', {ascending: true});

      if (queryError) throw queryError;

      // Transform to Message format
      const transformedMessages: Message[] = (data || []).map((msg: any) => ({
        id: msg.id,
        message: msg.content,
        sender: msg.sender_id === userId ? 'me' : 'them',
        timestamp: formatTimestamp(msg.created_at),
        created_at: msg.created_at,
      }));

      setMessages(transformedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    if (channelId) {
      const subscription = supabase
        .channel(`messages_${channelId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'chat',
            table: 'messages',
            filter: `channel_id=eq.${channelId}`,
          },
          payload => {
            const newMessage: Message = {
              id: payload.new.id,
              message: payload.new.content,
              sender: payload.new.sender_id === userId ? 'me' : 'them',
              timestamp: formatTimestamp(payload.new.created_at),
              created_at: payload.new.created_at,
            };
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [channelId, userId]);

  /**
   * Send a message
   */
  const sendMessage = async (content: string) => {
    if (!channelId || !userId || !content.trim()) return;

    try {
      const {error} = await supabase.from('chat.messages').insert({
        channel_id: channelId,
        sender_id: userId,
        content: content.trim(),
      });

      if (error) throw error;

      // Update channel's last_message and updated_at
      await supabase
        .from('chat.channels')
        .update({
          last_message: content.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', channelId);
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    refresh: fetchMessages,
  };
}

/**
 * Helper function to format timestamps
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
