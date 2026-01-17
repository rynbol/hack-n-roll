import {Tabs} from 'expo-router';
import {HomeIcon, ChatBubbleLeftIcon, UserIcon} from 'react-native-heroicons/solid';
import {colors} from '../../constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'SpaceGrotesk-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Discover',
          tabBarIcon: ({color, size}) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chats',
          tabBarIcon: ({color, size}) => (
            <ChatBubbleLeftIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({color, size}) => <UserIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
