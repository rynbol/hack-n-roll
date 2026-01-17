import {
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {CheckBadgeIcon} from 'react-native-heroicons/solid';
import {LinearGradient} from 'expo-linear-gradient';
import {colors} from '../constants/colors';

const {width, height} = Dimensions.get('window');

export interface Profile {
  id: string;
  imgUrl: any;
  name: string;
  lastName: string;
  age: number;
  city: string;
  country: string;
  major?: string;
  university?: string;
  bio?: string;
}

interface DatesCardProps {
  item: Profile;
  handleClick: (item: Profile) => void;
}

export default function DatesCard({item, handleClick}: DatesCardProps) {
  return (
    <View className="relative">
      <TouchableWithoutFeedback onPress={() => handleClick(item)}>
        <Image
          source={item.imgUrl}
          style={{
            width: width * 0.8,
            height: height * 0.55,
          }}
          resizeMode="cover"
          className="rounded-3xl"
        />
      </TouchableWithoutFeedback>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '100%',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
        start={{x: 0.5, y: 0.5}}
        end={{x: 0.5, y: 1}}
      />

      <View className="absolute bottom-10 justify-start w-full items-start pl-4">
        <View className="flex-row justify-center items-center">
          <Text
            className="text-2xl text-white font-bold"
            style={{fontFamily: 'SpaceGrotesk-Bold'}}
          >
            {item.name} {item.lastName}, {item.age}
          </Text>
          <CheckBadgeIcon size={25} color={colors.badgeBlue} style={{marginLeft: 8}} />
        </View>

        {/* Location */}
        <View className="flex-row justify-center items-center">
          <Text
            className="text-lg text-white font-regular"
            style={{fontFamily: 'SpaceGrotesk-Regular'}}
          >
            {item.city}, {item.country}
          </Text>
        </View>

        {/* Major and University for student matching */}
        {item.major && (
          <View className="mt-2">
            <Text
              className="text-base text-white/90 font-medium"
              style={{fontFamily: 'SpaceGrotesk-Medium'}}
            >
              {item.major}
            </Text>
          </View>
        )}

        {/* Bio preview */}
        {item.bio && (
          <View className="mt-2 pr-4">
            <Text
              className="text-sm text-white/80 font-regular"
              numberOfLines={2}
              style={{fontFamily: 'SpaceGrotesk-Regular'}}
            >
              {item.bio}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
