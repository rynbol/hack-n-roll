import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ChevronLeftIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  PhotoIcon,
} from 'react-native-heroicons/outline';
import {EllipsisHorizontalIcon} from 'react-native-heroicons/solid';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {useAuth} from '../../hooks/useAuth';
import {useMessages} from '../../hooks/useChat';

const android = Platform.OS === 'android';
const {height} = Dimensions.get('window');
const hp = (percentage: number) => (height * percentage) / 100;

export default function ChatDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {id, name, age} = params;
  const {user} = useAuth();

  const {messages, loading, sendMessage} = useMessages(
    id as string,
    user?.id
  );
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    try {
      setSending(true);
      await sendMessage(messageText);
      setMessageText('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#F26322" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="justify-center items-center relative bg-white"
      style={{
        paddingTop: android ? hp(4) : 0,
      }}
    >
      {/* Header */}
      <View className="justify-between items-center flex-row w-full px-4 pb-2 border-b border-neutral-400">
        {/* Back button and user info */}
        <TouchableOpacity
          className="w-2/3 flex-row items-center"
          onPress={() => router.back()}
        >
          <ChevronLeftIcon size={hp(2.5)} color={'black'} strokeWidth={2} />
          <View className="border-2 rounded-full border-red-400 mr-2 ml-4">
            <Image
              source={require('../../../assets/HeartIcon.png')}
              style={{
                width: hp(4.5),
                height: hp(4.5),
              }}
              className="rounded-full"
            />
          </View>
          <View className="justify-center items-start">
            <Text
              className="font-bold text-base"
              style={{fontFamily: 'SpaceGrotesk-Bold'}}
            >
              {name}
              {', '}
              {age}
            </Text>
            <Text
              className="text-xs text-neutral-400"
              style={{fontFamily: 'SpaceGrotesk-Regular'}}
            >
              You matched today
            </Text>
          </View>
        </TouchableOpacity>

        {/* Options menu */}
        <View className="w-1/3 items-end">
          <View className="bg-black/5 rounded-full p-1">
            <EllipsisHorizontalIcon
              size={hp(3)}
              color={'black'}
              strokeWidth={2}
            />
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <View className="w-full h-full">
        <Text
          className="text-center text-neutral-400 pt-4"
          style={{fontFamily: 'SpaceGrotesk-Regular'}}
        >
          Today
        </Text>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: hp(15),
          }}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: item.sender === 'me' ? 'row-reverse' : 'row',
                padding: 10,
                paddingVertical: item.sender === 'me' ? 13 : 3,
              }}
            >
              <View
                style={{
                  width: 'auto',
                  maxWidth: '70%',
                }}
              >
                <View
                  style={{
                    borderBottomRightRadius: item.sender === 'me' ? 0 : 10,
                    borderBottomLeftRadius: item.sender === 'me' ? 10 : 0,
                    backgroundColor:
                      item.sender === 'me' ? '#171717' : '#3B82F6',
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    className="text-white text-base leading-5"
                    style={{fontFamily: 'SpaceGrotesk-Regular'}}
                  >
                    {item.message}
                  </Text>
                </View>

                {item.sender === 'me' && (
                  <Text
                    className="text-xs font-semibold text-neutral-500 text-right"
                    style={{fontFamily: 'SpaceGrotesk-Medium'}}
                  >
                    {'Read '}
                    {item.timestamp}
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      </View>

      {/* Text Input */}
      <View className="absolute flex-row justify-between items-center w-full px-4 pb-12 pt-2 bg-white bottom-0">
        <View className="flex-row items-center rounded-2xl bg-neutral-200 px-3 py-3 w-[85%]">
          <TextInput
            placeholder="Write your message here"
            placeholderTextColor={'gray'}
            value={messageText}
            onChangeText={setMessageText}
            style={{
              fontSize: hp(1.7),
              fontFamily: 'SpaceGrotesk-Regular',
            }}
            className="flex-1 text-base mb-1 pl-1 tracking-wider"
          />

          <View className="flex-row justify-center items-center space-x-1">
            <PhotoIcon color={'gray'} strokeWidth={2} />
            <FaceSmileIcon size={hp(2.5)} color={'gray'} strokeWidth={2} />
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-500 rounded-2xl py-3 w-[13%] justify-center items-center"
          onPress={handleSendMessage}
          disabled={sending || !messageText.trim()}
        >
          {sending ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <PaperAirplaneIcon color={'white'} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
