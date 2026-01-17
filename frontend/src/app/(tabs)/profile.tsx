import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CameraIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
  UserIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');
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

// Mock user profile
const mockUser: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  age: 20,
  imgUrl: require('../../../assets/HeartIcon.png'),
  bio: 'Computer Science student passionate about AI and machine learning. Always looking for study partners and project collaborators!',
  university: 'Boston University',
  major: 'Computer Science',
  classes: ['CS 506', 'CS 542', 'Math 411'],
  interests: ['Machine Learning', 'Web Dev', 'Coffee'],
};

// Common majors for dropdown
const commonMajors = [
  'Computer Science',
  'Engineering',
  'Business',
  'Mathematics',
  'Biology',
  'Psychology',
  'Economics',
  'Other',
];

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile>(mockUser);

  // Edit modal states
  const [editingBio, setEditingBio] = useState(false);
  const [editingMajor, setEditingMajor] = useState(false);
  const [editingClasses, setEditingClasses] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);

  // Edited values
  const [editedBio, setEditedBio] = useState(user.bio);
  const [editedMajor, setEditedMajor] = useState(user.major);
  const [editedClasses, setEditedClasses] = useState<string[]>(user.classes);
  const [editedInterests, setEditedInterests] = useState<string[]>(user.interests);
  const [newClass, setNewClass] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Bio handlers
  const handleSaveBio = () => {
    setUser({ ...user, bio: editedBio });
    setEditingBio(false);
  };

  const handleCancelBio = () => {
    setEditedBio(user.bio);
    setEditingBio(false);
  };

  // Major handlers
  const handleSaveMajor = () => {
    setUser({ ...user, major: editedMajor });
    setEditingMajor(false);
  };

  const handleCancelMajor = () => {
    setEditedMajor(user.major);
    setEditingMajor(false);
  };

  // Classes handlers
  const handleAddClass = () => {
    if (newClass.trim() && !editedClasses.includes(newClass.trim())) {
      setEditedClasses([...editedClasses, newClass.trim()]);
      setNewClass('');
    }
  };

  const handleRemoveClass = (classToRemove: string) => {
    setEditedClasses(editedClasses.filter(c => c !== classToRemove));
  };

  const handleSaveClasses = () => {
    setUser({ ...user, classes: editedClasses });
    setEditingClasses(false);
  };

  const handleCancelClasses = () => {
    setEditedClasses(user.classes);
    setNewClass('');
    setEditingClasses(false);
  };

  // Interests handlers
  const handleAddInterest = () => {
    if (newInterest.trim() && !editedInterests.includes(newInterest.trim())) {
      setEditedInterests([...editedInterests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setEditedInterests(editedInterests.filter(i => i !== interestToRemove));
  };

  const handleSaveInterests = () => {
    setUser({ ...user, interests: editedInterests });
    setEditingInterests(false);
  };

  const handleCancelInterests = () => {
    setEditedInterests(user.interests);
    setNewInterest('');
    setEditingInterests(false);
  };

  // Card component for consistency
  const ProfileCard = ({
    title,
    icon: Icon,
    onEdit,
    children,
  }: {
    title: string;
    icon: React.ComponentType<any>;
    onEdit: () => void;
    children: React.ReactNode;
  }) => (
    <View
      className="bg-white"
      style={{
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View className="flex-row items-center">
          <Icon size={18} color={colors.primary} strokeWidth={2} />
          <Text
            className="text-sm font-semibold ml-2"
            style={{ fontFamily: 'SpaceGrotesk-SemiBold', color: colors.textPrimary }}
          >
            {title}
          </Text>
        </View>
        <TouchableOpacity onPress={onEdit} className="p-1">
          <PencilIcon size={16} color={colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 16 }}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.backgroundGray }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(10),
        }}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: hp(18) }}
        >
          <View className="flex-1 justify-center items-center pt-6">
            <Text
              className="text-white font-bold"
              style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: 22 }}
            >
              My Profile
            </Text>
          </View>
        </LinearGradient>

        {/* Profile Photo */}
        <View className="items-center" style={{ marginTop: -hp(7) }}>
          <View
            className="bg-white rounded-full items-center justify-center"
            style={{
              width: wp(30),
              height: wp(30),
              borderWidth: 4,
              borderColor: colors.white,
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Image
              source={user.imgUrl}
              style={{
                width: wp(28),
                height: wp(28),
                borderRadius: wp(14),
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 rounded-full p-2"
              style={{
                backgroundColor: colors.primary,
                borderWidth: 3,
                borderColor: colors.white,
              }}
            >
              <CameraIcon size={16} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Name and Age */}
          <Text
            className="text-2xl font-bold mt-3"
            style={{ fontFamily: 'SpaceGrotesk-Bold', color: colors.textPrimary }}
          >
            {user.name}, {user.age}
          </Text>

          {/* University */}
          <View className="flex-row items-center mt-1">
            <AcademicCapIcon size={16} color={colors.textSecondary} strokeWidth={2} />
            <Text
              className="ml-1 text-sm"
              style={{ fontFamily: 'SpaceGrotesk-Medium', color: colors.textSecondary }}
            >
              {user.university}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-4 mt-5">
          <View
            className="bg-white flex-1 items-center py-4 mr-2"
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              className="text-2xl font-bold"
              style={{ fontFamily: 'SpaceGrotesk-Bold', color: colors.primary }}
            >
              {user.classes.length}
            </Text>
            <Text
              className="text-xs"
              style={{ fontFamily: 'SpaceGrotesk-Regular', color: colors.textSecondary }}
            >
              Courses
            </Text>
          </View>

          <View
            className="bg-white flex-1 items-center py-4 ml-2"
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              className="text-2xl font-bold"
              style={{ fontFamily: 'SpaceGrotesk-Bold', color: colors.primary }}
            >
              {user.interests.length}
            </Text>
            <Text
              className="text-xs"
              style={{ fontFamily: 'SpaceGrotesk-Regular', color: colors.textSecondary }}
            >
              Interests
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View className="px-4 mt-5">
          {/* Bio Card */}
          <ProfileCard title="About Me" icon={UserIcon} onEdit={() => setEditingBio(true)}>
            <Text
              className="leading-5"
              style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: colors.textSecondary }}
            >
              {user.bio}
            </Text>
          </ProfileCard>

          {/* Major Card */}
          <ProfileCard title="Major" icon={AcademicCapIcon} onEdit={() => setEditingMajor(true)}>
            <Text
              style={{ fontFamily: 'SpaceGrotesk-Medium', fontSize: 14, color: colors.textPrimary }}
            >
              {user.major}
            </Text>
          </ProfileCard>

          {/* Classes Card */}
          <ProfileCard title="Current Classes" icon={BookOpenIcon} onEdit={() => setEditingClasses(true)}>
            <View className="flex-row flex-wrap">
              {user.classes.map((course, index) => (
                <View
                  key={index}
                  className="rounded-full px-3 py-1.5 mr-2 mb-2"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Text
                    className="text-sm"
                    style={{ fontFamily: 'SpaceGrotesk-Medium', color: colors.primary }}
                  >
                    {course}
                  </Text>
                </View>
              ))}
            </View>
          </ProfileCard>

          {/* Interests Card */}
          <ProfileCard title="Interests" icon={SparklesIcon} onEdit={() => setEditingInterests(true)}>
            <View className="flex-row flex-wrap">
              {user.interests.map((interest, index) => (
                <View
                  key={index}
                  className="rounded-full px-3 py-1.5 mr-2 mb-2"
                  style={{ backgroundColor: colors.backgroundGray }}
                >
                  <Text
                    className="text-sm"
                    style={{ fontFamily: 'SpaceGrotesk-Medium', color: colors.textSecondary }}
                  >
                    {interest}
                  </Text>
                </View>
              ))}
            </View>
          </ProfileCard>
        </View>
      </ScrollView>

      {/* Bio Edit Modal */}
      <Modal
        visible={editingBio}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelBio}
        statusBarTranslucent
      >
        <View className="flex-1">
          <BlurView intensity={50} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-center items-center"
          >
            <Pressable
              onPress={handleCancelBio}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View
              className="bg-white rounded-3xl mx-6"
              style={{ width: wp(85), maxHeight: hp(60) }}
            >
              <View className="items-center py-5 border-b" style={{ borderBottomColor: colors.border }}>
                <Text
                  className="text-lg font-bold"
                  style={{ fontFamily: 'SpaceGrotesk-Bold', color: colors.textPrimary }}
                >
                  Edit About Me
                </Text>
              </View>

              <View className="px-5 py-5">
                <TextInput
                  value={editedBio}
                  onChangeText={setEditedBio}
                  className="border px-4 py-3 rounded-xl"
                  style={{
                    fontFamily: 'SpaceGrotesk-Regular',
                    fontSize: 14,
                    minHeight: 120,
                    textAlignVertical: 'top',
                    backgroundColor: colors.backgroundGray,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
              </View>

              <View className="flex-row px-5 pb-5 pt-2">
                <TouchableOpacity
                  onPress={handleCancelBio}
                  className="flex-1 py-3.5 rounded-full mr-3"
                  style={{ backgroundColor: colors.backgroundGray }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.textPrimary }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveBio}
                  className="flex-1 py-3.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text
                    className="text-white text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15 }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Major Edit Modal */}
      <Modal
        visible={editingMajor}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelMajor}
        statusBarTranslucent
      >
        <View className="flex-1">
          <BlurView intensity={50} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-center items-center"
          >
            <Pressable
              onPress={handleCancelMajor}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View
              className="bg-white rounded-3xl mx-6"
              style={{ width: wp(85), maxHeight: hp(70) }}
            >
              <View className="items-center py-5 border-b" style={{ borderBottomColor: colors.border }}>
                <Text
                  className="text-lg font-bold"
                  style={{ fontFamily: 'SpaceGrotesk-Bold', color: colors.textPrimary }}
                >
                  Edit Major
                </Text>
              </View>

              <ScrollView
                className="px-5 py-4"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ maxHeight: hp(40) }}
              >
                {commonMajors.map((major, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setEditedMajor(major)}
                    className="rounded-xl px-4 py-3.5 mb-2"
                    style={{
                      backgroundColor: editedMajor === major ? `${colors.primary}15` : colors.backgroundGray,
                      borderWidth: 1.5,
                      borderColor: editedMajor === major ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'SpaceGrotesk-Medium',
                        fontSize: 14,
                        color: editedMajor === major ? colors.primary : colors.textPrimary,
                      }}
                    >
                      {major}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View className="flex-row px-5 pb-5 pt-2">
                <TouchableOpacity
                  onPress={handleCancelMajor}
                  className="flex-1 py-3.5 rounded-full mr-3"
                  style={{ backgroundColor: colors.backgroundGray }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.textPrimary }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveMajor}
                  className="flex-1 py-3.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text
                    className="text-white text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15 }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Classes Edit Modal */}
      <Modal
        visible={editingClasses}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelClasses}
        statusBarTranslucent
      >
        <View className="flex-1">
          <BlurView intensity={50} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-center items-center"
          >
            <Pressable
              onPress={handleCancelClasses}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View
              className="bg-white rounded-3xl mx-6"
              style={{ width: wp(85), maxHeight: hp(60) }}
            >
              <View className="items-center py-5 border-b" style={{ borderBottomColor: colors.border }}>
                <Text
                  className="text-lg font-bold"
                  style={{ fontFamily: 'SpaceGrotesk-Bold', color: colors.textPrimary }}
                >
                  Edit Classes
                </Text>
              </View>

              <View className="px-5 py-4">
                <View className="flex-row mb-4">
                  <TextInput
                    value={newClass}
                    onChangeText={setNewClass}
                    className="border px-4 py-2.5 rounded-xl flex-1 mr-2"
                    style={{
                      fontFamily: 'SpaceGrotesk-Regular',
                      fontSize: 14,
                      backgroundColor: colors.backgroundGray,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                    placeholder="Add a class (e.g., CS 506)"
                    placeholderTextColor={colors.textSecondary}
                    onSubmitEditing={handleAddClass}
                  />
                  <TouchableOpacity
                    onPress={handleAddClass}
                    className="rounded-xl px-4 justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <PlusIcon size={20} color="white" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap">
                  {editedClasses.map((course, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRemoveClass(course)}
                      className="rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
                      style={{ backgroundColor: `${colors.primary}15` }}
                    >
                      <Text
                        className="text-sm mr-1"
                        style={{ fontFamily: 'SpaceGrotesk-Medium', color: colors.primary }}
                      >
                        {course}
                      </Text>
                      <XMarkIcon size={12} color={colors.primary} strokeWidth={2.5} />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text
                  className="text-xs mt-2"
                  style={{ fontFamily: 'SpaceGrotesk-Regular', color: colors.textSecondary }}
                >
                  Tap a class to remove it
                </Text>
              </View>

              <View className="flex-row px-5 pb-5 pt-2">
                <TouchableOpacity
                  onPress={handleCancelClasses}
                  className="flex-1 py-3.5 rounded-full mr-3"
                  style={{ backgroundColor: colors.backgroundGray }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.textPrimary }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveClasses}
                  className="flex-1 py-3.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text
                    className="text-white text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15 }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Interests Edit Modal */}
      <Modal
        visible={editingInterests}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelInterests}
        statusBarTranslucent
      >
        <View className="flex-1">
          <BlurView intensity={50} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-center items-center"
          >
            <Pressable
              onPress={handleCancelInterests}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View
              className="bg-white rounded-3xl mx-6"
              style={{ width: wp(85), maxHeight: hp(60) }}
            >
              <View className="items-center py-5 border-b" style={{ borderBottomColor: colors.border }}>
                <Text
                  className="text-lg font-bold"
                  style={{ fontFamily: 'SpaceGrotesk-Bold', color: colors.textPrimary }}
                >
                  Edit Interests
                </Text>
              </View>

              <View className="px-5 py-4">
                <View className="flex-row mb-4">
                  <TextInput
                    value={newInterest}
                    onChangeText={setNewInterest}
                    className="border px-4 py-2.5 rounded-xl flex-1 mr-2"
                    style={{
                      fontFamily: 'SpaceGrotesk-Regular',
                      fontSize: 14,
                      backgroundColor: colors.backgroundGray,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                    placeholder="Add an interest"
                    placeholderTextColor={colors.textSecondary}
                    onSubmitEditing={handleAddInterest}
                  />
                  <TouchableOpacity
                    onPress={handleAddInterest}
                    className="rounded-xl px-4 justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <PlusIcon size={20} color="white" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap">
                  {editedInterests.map((interest, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRemoveInterest(interest)}
                      className="rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
                      style={{ backgroundColor: colors.backgroundGray }}
                    >
                      <Text
                        className="text-sm mr-1"
                        style={{ fontFamily: 'SpaceGrotesk-Medium', color: colors.textSecondary }}
                      >
                        {interest}
                      </Text>
                      <XMarkIcon size={12} color={colors.textSecondary} strokeWidth={2.5} />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text
                  className="text-xs mt-2"
                  style={{ fontFamily: 'SpaceGrotesk-Regular', color: colors.textSecondary }}
                >
                  Tap an interest to remove it
                </Text>
              </View>

              <View className="flex-row px-5 pb-5 pt-2">
                <TouchableOpacity
                  onPress={handleCancelInterests}
                  className="flex-1 py-3.5 rounded-full mr-3"
                  style={{ backgroundColor: colors.backgroundGray }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.textPrimary }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveInterests}
                  className="flex-1 py-3.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text
                    className="text-white text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15 }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
