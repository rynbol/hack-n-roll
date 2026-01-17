import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import MatchesList from '../../components/MatchesList';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {useRouter} from 'expo-router';

const android = Platform.OS === 'android';
const {height} = Dimensions.get('window');
const hp = (percentage: number) => (height * percentage) / 100;

interface ChatItem {
  id: string;
  name: string;
  age: number;
  imgUrl: any;
  lastMessage: string;
  timeSent: string;
  isOnline: boolean;
}

// Mock data - will be replaced with Supabase data
const mockMatches = [
  {
    id: '1',
    name: 'Sarah',
    age: 20,
    imgUrl: require('../../../assets/icon.png'),
  },
  {
    id: '2',
    name: 'Mike',
    age: 21,
    imgUrl: require('../../../assets/icon.png'),
  },
  {
    id: '3',
    name: 'Emma',
    age: 19,
    imgUrl: require('../../../assets/icon.png'),
  },
];

const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 20,
    imgUrl: require('../../../assets/icon.png'),
    lastMessage: 'Hey! Want to study for the CS exam together?',
    timeSent: '2m ago',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Mike',
    age: 21,
    imgUrl: require('../../../assets/icon.png'),
    lastMessage: 'Great working with you on the project!',
    timeSent: '1h ago',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emma',
    age: 19,
    imgUrl: require('../../../assets/icon.png'),
    lastMessage: 'Thanks for the notes!',
    timeSent: '3h ago',
    isOnline: true,
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const [chats] = useState<ChatItem[]>(mockChats);

  return (
    <SafeAreaView
      className=""
      style={{
        paddingTop: android ? hp(3) : 0,
      }}
    >
      <View className="px-4">
        <Text
          className="uppercase font-semibold text-neutral-500 tracking-wider"
          style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
        >
          Connections
        </Text>
      </View>
      <MatchesList data={mockMatches} />

      {/* Search Bar */}
      <View className="mx-4 mt-6 flex-row items-center rounded-2xl bg-neutral-200 px-3 py-4">
        <TextInput
          placeholder="Search"
          placeholderTextColor={'gray'}
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
            className="uppercase font-semibold text-neutral-500 tracking-wider"
            style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
          >
            CHAT
          </Text>
        </View>

        <FlatList
          data={chats}
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
              </View>

              {/* Information */}
              <View
                className="w-[82%]"
                style={{
                  height: hp(6),
                }}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row justify-center">
                    <View className="flex-row">
                      <Text
                        className="font-bold text-base"
                        style={{fontFamily: 'SpaceGrotesk-Bold'}}
                      >
                        {item.name}
                        {', '}
                      </Text>
                      <Text
                        className="font-bold text-base mr-1"
                        style={{fontFamily: 'SpaceGrotesk-Bold'}}
                      >
                        {item.age}
                      </Text>
                    </View>
                    {item.isOnline && (
                      <View className="justify-center items-center">
                        <View className="w-2 h-2 bg-[#F26322] rounded-full ml-1 justify-center items-center" />
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
                    {item.lastMessage.length > 45
                      ? item.lastMessage.slice(0, 45) + '...'
                      : item.lastMessage}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
