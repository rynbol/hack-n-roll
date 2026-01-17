import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import MatchesList from '../../components/MatchesList';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {useRouter} from 'expo-router';
import {useAuth} from '../../hooks/useAuth';
import {useMatches} from '../../hooks/useMatches';
import {useChat} from '../../hooks/useChat';
import {Badge} from '../../components/Badge';
import {VerifiedBadge} from '../../components/VerifiedBadge';
import {colors} from '../../constants/colors';

const android = Platform.OS === 'android';
const {height} = Dimensions.get('window');
const hp = (percentage: number) => (height * percentage) / 100;

export default function ChatScreen() {
  const router = useRouter();
  const {user} = useAuth();
  const {matches, loading: matchesLoading} = useMatches(user?.id);
  const {channels, loading: chatsLoading} = useChat(user?.id);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (matchesLoading || chatsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className=""
      style={{
        paddingTop: android ? hp(3) : 0,
      }}
    >
      <View className="px-4">
        <Text
          className="uppercase font-bold tracking-wider text-lg"
          style={{
            fontFamily: 'SpaceGrotesk-Bold',
            color: colors.primary,
          }}
        >
          New Matches
        </Text>
      </View>
      <MatchesList
        data={matches}
        onMatchPress={(match) => {
          router.push({
            pathname: '/chat/[id]',
            params: {
              id: match.id,
              name: match.name,
              age: match.age,
            },
          });
        }}
      />

      {/* Search Bar */}
      <View className="mx-4 mt-6 flex-row items-center rounded-2xl bg-neutral-200 px-3 py-4">
        <TextInput
          placeholder="Search"
          placeholderTextColor={'gray'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            fontSize: hp(1.7),
            fontFamily: 'SpaceGrotesk-Regular',
          }}
          className="flex-1 text-base mb-1 pl-1 tracking-widest"
        />

        <View>
          <MagnifyingGlassIcon size={hp(2.5)} color={'gray'} strokeWidth={3} />
        </View>
      </View>

      {/* Chat List */}
      <View className="px-4">
        <View className="border-b border-neutral-300 py-4">
          <Text
            className="uppercase font-bold tracking-wider text-lg"
            style={{
              fontFamily: 'SpaceGrotesk-Bold',
              color: colors.primary,
            }}
          >
            Messages
          </Text>
        </View>

        {filteredChannels.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text
              className="text-gray-500 text-center"
              style={{fontFamily: 'SpaceGrotesk-Regular'}}
            >
              {searchQuery
                ? 'No chats match your search'
                : 'No conversations yet. Start connecting!'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredChannels}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                className="w-full py-3 items-center flex-row border-b border-neutral-300"
                onPress={() =>
                  router.push({
                    pathname: '/chat/[id]',
                    params: {
                      id: item.id,
                      name: item.name,
                      age: item.age,
                    },
                  })
                }
              >
                {/* Avatar */}
                <View
                  className="w-[17%] justify-center"
                  style={{
                    width: hp(7),
                    height: hp(7),
                    position: 'relative',
                  }}
                >
                  <Image
                    source={item.imgUrl}
                    style={{
                      width: '90%',
                      height: '90%',
                    }}
                    className="rounded-full"
                  />
                  {(item.unreadCount ?? 0) > 0 ? (
                    <Badge
                      count={item.unreadCount}
                      size="small"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                      }}
                    />
                  ) : null}
                </View>

                {/* Information */}
                <View
                  className="w-[82%]"
                  style={{
                    height: hp(6),
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <View className="flex-row">
                        <Text
                          className="font-bold text-base mr-1"
                          style={{fontFamily: 'SpaceGrotesk-Bold'}}
                        >
                          {item.name}, {item.age}
                        </Text>
                      </View>
                      {item.verified && (
                        <VerifiedBadge verified={item.verified} size={16} />
                      )}
                      {item.isOnline && (
                        <View className="justify-center items-center ml-2">
                          <View
                            className="w-2 h-2 rounded-full"
                            style={{backgroundColor: colors.primary}}
                          />
                        </View>
                      )}
                    </View>
                    <Text
                      className="text-sm tracking-tight"
                      style={{fontFamily: 'SpaceGrotesk-Regular'}}
                    >
                      {item.timeSent}
                    </Text>
                  </View>
                  <View>
                    <Text
                      className="font-semibold text-xs text-neutral-500"
                      style={{fontFamily: 'SpaceGrotesk-Medium'}}
                    >
                      {item.sentByUser ? 'You: ' : ''}
                      {item.lastMessage.length > 45
                        ? item.lastMessage.slice(0, 45) + '...'
                        : item.lastMessage}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
