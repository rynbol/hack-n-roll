import {useRouter} from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ArrowUpRightIcon} from 'react-native-heroicons/outline';

const {width, height} = Dimensions.get('window');
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1" style={{width: wp(100)}}>
      <StatusBar barStyle="dark-content" />

      <View
        className="justify-center items-center"
        style={{
          width: wp(100),
          height: hp(100),
        }}>
        {/* Heart Icon */}
        <View
          className="pt-1 justify-center items-center my-4"
          style={{
            width: wp(100),
          }}>
          <Image
            source={require('../../assets/HeartIcon.png')}
            style={{
              width: wp(100),
              height: hp(40),
              resizeMode: 'contain',
            }}
          />
        </View>

        {/* Welcome Text */}
        <View className="w-full p-6 px-10">
          <Text
            className="font-semibold tracking-widest leading-none"
            style={{
              fontSize: wp(10),
              fontFamily: 'SpaceGrotesk-SemiBold',
            }}>
            Find Your
          </Text>

          <Text
            className="font-semibold tracking-widest w-[70%] leading-none"
            style={{
              fontSize: wp(10),
              fontFamily: 'SpaceGrotesk-SemiBold',
            }}>
            Study Partner
          </Text>

          <Text
            className="text-gray-800 leading-6 tracking-wider w-[80%] mt-2"
            style={{
              fontSize: wp(3.5),
              fontFamily: 'SpaceGrotesk-Regular',
            }}>
            Connect with students at your university. Find study partners, join
            groups, and make meaningful academic connections.
          </Text>
        </View>

        {/* Button */}
        <View className="w-full px-10">
          <TouchableOpacity
            className="bg-[#F26322] px-4 py-4 rounded-xl flex-row justify-center items-center w-[45%]"
            onPress={() => router.push('/(tabs)/home')}>
            <Text
              className="text-white font-bold mr-2"
              style={{
                fontSize: wp(3.5),
                fontFamily: 'SpaceGrotesk-Bold',
              }}>
              Get Started
            </Text>
            <ArrowUpRightIcon color={'white'} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
