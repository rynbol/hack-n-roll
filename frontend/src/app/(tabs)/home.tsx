import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BellIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import { ActionButton } from '../../components/ActionButton';
import DatesCard, { Profile } from '../../components/DatesCard';
import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useProfiles } from '../../hooks/useProfiles';

const android = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
const hp = (percentage: number) => (height * percentage) / 100;

// Mock profiles for testing when not authenticated
const mockProfiles: Profile[] = [
  {
    id: '1',
    imgUrl: require('../../../assets/images/GIRL.jpg'),
    name: 'Sarah',
    lastName: 'Johnson',
    age: 20,
    city: 'Boston',
    country: 'USA',
    major: 'Computer Science',
    university: 'Boston University',
    bio: 'Looking for study partners in CS courses! Love coding and coffee ☕',
  },
  {
    id: '2',
    imgUrl: require('../../../assets/images/GIRL2.png.webp'),
    name: 'Emily',
    lastName: 'Chen',
    age: 21,
    city: 'Boston',
    country: 'USA',
    major: 'Data Science',
    university: 'Boston University',
    bio: 'Data enthusiast! Always down to collaborate on projects 📊',
  },
  {
    id: '3',
    imgUrl: require('../../../assets/images/GIRL3.webp'),
    name: 'Emma',
    lastName: 'Davis',
    age: 19,
    city: 'Boston',
    country: 'USA',
    major: 'Software Engineering',
    university: 'Boston University',
    bio: 'Building cool stuff and meeting cool people! 🚀',
  },
];

export default function HomeScreen() {
  const {user, isAuthenticated} = useAuth();
  const {profiles: realProfiles, loading, likeProfile, skipProfile, refresh} = useProfiles(user?.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const carouselRef = useRef<any>(null);

  // Use mock profiles if not authenticated or no real profiles
  const profiles = isAuthenticated && realProfiles.length > 0 ? realProfiles : mockProfiles;

  const handleLike = async () => {
    if (currentIndex >= profiles.length || actionLoading) return;

    const currentProfile = profiles[currentIndex];

    // If authenticated, use real backend
    if (isAuthenticated && user) {
      try {
        setActionLoading(true);
        await likeProfile(currentProfile.id);
        Alert.alert('Liked!', `You liked ${currentProfile.name}`);
      } catch (error: any) {
        console.error('Error liking profile:', error);
        Alert.alert('Error', 'Failed to like profile');
        return;
      } finally {
        setActionLoading(false);
      }
    } else {
      // Demo mode - just show alert
      Alert.alert('Liked!', `You liked ${currentProfile.name}`);
    }

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      carouselRef.current?.snapToNext();
    } else {
      setCurrentIndex(0);
      carouselRef.current?.snapToItem(0);
    }
  };

  const handleSkip = async () => {
    if (currentIndex >= profiles.length || actionLoading) return;

    const currentProfile = profiles[currentIndex];

    // If authenticated, use real backend
    if (isAuthenticated && user) {
      try {
        setActionLoading(true);
        await skipProfile(currentProfile.id);
      } catch (error: any) {
        console.error('Error skipping profile:', error);
        Alert.alert('Error', 'Failed to skip profile');
        return;
      } finally {
        setActionLoading(false);
      }
    }

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      carouselRef.current?.snapToNext();
    } else {
      setCurrentIndex(0);
      carouselRef.current?.snapToItem(0);
    }
  };

  const handleCardClick = (item: Profile) => {
    console.log('Profile clicked:', item.name);
    // Could navigate to detailed profile view
  };

  // Only show loading if authenticated and actually fetching data
  if (isAuthenticated && loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          className="mt-4 text-gray-600"
          style={{fontFamily: 'SpaceGrotesk-Regular'}}
        >
          Loading profiles...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="bg-white flex-1 justify-between"
      style={{
        paddingTop: android ? hp(2) : 0,
      }}
    >
      {/* Header */}
      <View className="w-full flex-row justify-between items-center px-4 mb-6">
        <View>
          <Text
            className="text-3xl font-bold"
            style={{
              fontFamily: 'SpaceGrotesk-Bold',
              color: colors.primary,
            }}
          >
            Discover
          </Text>
        </View>

        {/* Notification Icon */}
        <View className="bg-black/10 p-2 rounded-full items-center justify-center">
          <TouchableOpacity>
            <BellIcon size={25} strokeWidth={2} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {profiles.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-2xl font-bold text-gray-900 mb-2 text-center"
            style={{fontFamily: 'SpaceGrotesk-Bold'}}
          >
            No More Profiles
          </Text>
          <Text
            className="text-base text-gray-600 text-center mb-6"
            style={{fontFamily: 'SpaceGrotesk-Regular'}}
          >
            Check back later for new study partners!
          </Text>
          <TouchableOpacity
            className="px-6 py-3 rounded-xl"
            style={{backgroundColor: colors.primary}}
            onPress={refresh}
          >
            <Text
              className="text-white font-bold"
              style={{fontFamily: 'SpaceGrotesk-Bold'}}
            >
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Carousel */}
          <View className="flex-1 justify-center">
            <View className="mb-6">
              <Carousel
                ref={carouselRef}
                data={profiles}
                renderItem={({item}: {item: Profile}) => (
                  <DatesCard item={item} handleClick={handleCardClick} />
                )}
                firstItem={0}
                inactiveSlideScale={0.86}
                inactiveSlideOpacity={0.6}
                sliderWidth={width}
                itemWidth={width * 0.8}
                slideStyle={{display: 'flex', alignItems: 'center'}}
                onSnapToItem={(index) => setCurrentIndex(index)}
                vertical={false}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-center items-center px-12 pb-6 pt-4">
              <ActionButton
                icon={
                  actionLoading ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Ionicons name="close" size={32} color={colors.white} />
                  )
                }
                onPress={handleSkip}
                color={colors.red}
                size="large"
                disabled={actionLoading}
                style={{marginHorizontal: 24}}
              />
              <ActionButton
                icon={
                  actionLoading ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Ionicons name="heart" size={32} color={colors.white} />
                  )
                }
                onPress={handleLike}
                color={colors.pink}
                size="large"
                disabled={actionLoading}
                style={{marginHorizontal: 24}}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
