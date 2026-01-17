import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import DatesCard, {Profile} from '../../components/DatesCard';
import {BellIcon} from 'react-native-heroicons/outline';

const android = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
const hp = (percentage: number) => (height * percentage) / 100;

// Temporary mock data - will be replaced with Supabase data
const mockProfiles: Profile[] = [
  {
    id: '1',
    imgUrl: require('../../../assets/HeartIcon.png'),
    name: 'Sarah',
    lastName: 'Johnson',
    age: 20,
    city: 'Boston',
    country: 'USA',
    major: 'Computer Science',
    university: 'Boston University',
    bio: 'Looking for study partners in CS courses! Love coding and coffee.',
  },
  {
    id: '2',
    imgUrl: require('../../../assets/HeartIcon.png'),
    name: 'Mike',
    lastName: 'Chen',
    age: 21,
    city: 'Boston',
    country: 'USA',
    major: 'Data Science',
    university: 'Boston University',
    bio: 'Data enthusiast! Always down to collaborate on projects.',
  },
  {
    id: '3',
    imgUrl: require('../../../assets/HeartIcon.png'),
    name: 'Emma',
    lastName: 'Davis',
    age: 19,
    city: 'Boston',
    country: 'USA',
    major: 'Software Engineering',
    university: 'Boston University',
    bio: 'Building cool stuff and meeting cool people!',
  },
];

export default function HomeScreen() {
  const [profiles] = useState<Profile[]>(mockProfiles);

  const handleCardClick = (item: Profile) => {
    console.log('Profile clicked:', item.name);
    // TODO: Navigate to profile details or handle swipe
  };

  return (
    <SafeAreaView
      className="bg-white flex-1 justify-between"
      style={{
        paddingTop: android ? hp(2) : 0,
      }}
    >
      {/* Header */}
      <View className="w-full flex-row justify-between items-center px-4 mb-8">
        <View className="rounded-full items-center justify-center">
          <Image
            source={require('../../../assets/icon.png')}
            style={{
              width: hp(4.5),
              height: hp(4.5),
              resizeMode: 'cover',
            }}
            className="rounded-full"
          />
        </View>

        <View>
          <Text
            className="text-xl font-semibold text-center uppercase"
            style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
          >
            Double
          </Text>
        </View>

        {/* Notification Icon */}
        <View className="bg-black/10 p-2 rounded-full items-center justify-center">
          <TouchableOpacity>
            <BellIcon size={25} strokeWidth={2} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Carousel */}
      <View className="pb-4">
        <View className="mx-4 mb-4">
          <Text
            className="capitalize text-2xl font-semibold"
            style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
          >
            Find study partners
          </Text>
        </View>

        <View>
          <Carousel
            data={profiles}
            renderItem={({item}) => (
              <DatesCard item={item} handleClick={handleCardClick} />
            )}
            firstItem={1}
            inactiveSlideScale={0.86}
            inactiveSlideOpacity={0.6}
            sliderWidth={width}
            itemWidth={width * 0.8}
            slideStyle={{display: 'flex', alignItems: 'center'}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
