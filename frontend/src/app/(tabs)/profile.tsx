import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {CameraIcon} from 'react-native-heroicons/outline';

const {width, height} = Dimensions.get('window');
const hp = (percentage: number) => (height * percentage) / 100;
const wp = (percentage: number) => (width * percentage) / 100;

interface UserProfile {
  id: string;
  name: string;
  age: number;
  imgUrl: any;
  bio: string;
  university: string;
  major: string;
  classes: string[];
  interests: string[];
}

// Mock user profile - will be replaced with Supabase auth user data
const mockUser: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  age: 20,
  imgUrl: require('../../../assets/icon.png'),
  bio: 'Computer Science student passionate about AI and machine learning. Always looking for study partners and project collaborators!',
  university: 'Boston University',
  major: 'Computer Science',
  classes: ['CS 506', 'CS 542', 'Math 411'],
  interests: ['Machine Learning', 'Web Dev', 'Coffee'],
};

export default function ProfileScreen() {
  const [user] = useState<UserProfile>(mockUser);

  return (
    <ScrollView
      className="relative bg-white flex-1"
      contentContainerStyle={{
        paddingBottom: hp(5),
      }}
    >
      {/* Image */}
      <View>
        <Image
          source={user.imgUrl}
          style={{
            width: wp(100),
            height: hp(60),
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        />
      </View>

      {/* Header */}
      <View className="w-full absolute flex-row justify-end items-center pt-10">
        <View className="p-2 rounded-full bg-black/40 mr-5 justify-center items-center">
          <TouchableOpacity>
            <CameraIcon size={hp(3.5)} color="white" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bio */}
      <View className="w-full justify-start items-start px-6 space-y-4 mt-6">
        {/* User name and age */}
        <View className="flex-row space-x-2 justify-between w-full items-center">
          <View className="flex-row">
            <Text
              className="text-black text-center font-bold text-xl"
              style={{fontFamily: 'SpaceGrotesk-Bold'}}
            >
              {user.name}
              {', '}
            </Text>
            <Text
              className="text-black text-center font-bold text-xl"
              style={{fontFamily: 'SpaceGrotesk-Bold'}}
            >
              {user.age}
            </Text>
          </View>

          <TouchableOpacity>
            <Text
              className="text-[#F26322] font-semibold"
              style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
            >
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        {/* University and Major */}
        <View>
          <Text
            className="uppercase font-semibold text-neutral-500 tracking-wider mb-2"
            style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
          >
            EDUCATION
          </Text>
          <Text
            className="text-black font-medium text-base"
            style={{fontFamily: 'SpaceGrotesk-Medium'}}
          >
            {user.major}
          </Text>
          <Text
            className="text-black/70 font-regular text-sm"
            style={{fontFamily: 'SpaceGrotesk-Regular'}}
          >
            {user.university}
          </Text>
        </View>

        {/* Current Classes */}
        <View>
          <Text
            className="uppercase font-semibold text-neutral-500 tracking-wider mb-2"
            style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
          >
            CURRENT CLASSES
          </Text>
          <View className="flex-row flex-wrap">
            {user.classes?.map((course, index) => (
              <View
                key={index}
                style={{
                  borderRadius: 20,
                  padding: 5,
                  paddingHorizontal: 10,
                  marginRight: 5,
                  marginBottom: 5,
                }}
                className="bg-[#F26322]/10"
              >
                <Text
                  className="text-[#F26322] font-medium"
                  style={{fontFamily: 'SpaceGrotesk-Medium'}}
                >
                  {course}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View>
          <Text
            className="uppercase font-semibold text-neutral-500 tracking-wider mb-2"
            style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
          >
            INTERESTS
          </Text>
          <View className="flex-row flex-wrap">
            {user.interests?.map((interest, index) => (
              <View
                key={index}
                style={{
                  borderRadius: 20,
                  padding: 5,
                  paddingHorizontal: 10,
                  marginRight: 5,
                  marginBottom: 5,
                }}
                className="bg-[#d3d3d3]"
              >
                <Text
                  className="text-black"
                  style={{fontFamily: 'SpaceGrotesk-Regular'}}
                >
                  {interest}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Bio */}
        <View>
          <Text
            className="uppercase font-semibold text-neutral-500 tracking-wider mb-2"
            style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
          >
            BIO
          </Text>

          <Text
            className="text-black/80 text-left font-medium text-sm"
            style={{fontFamily: 'SpaceGrotesk-Regular'}}
          >
            {user.bio}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
