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
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelBio}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Pressable
            onPress={handleCancelBio}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingBottom: Platform.OS === 'ios' ? 34 : 20,
              }}
            >
              {/* Handle bar */}
              <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
                <View style={{ width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 }} />
              </View>

              {/* Header */}
              <View style={{ paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: colors.textPrimary, textAlign: 'center' }}>
                  Edit About Me
                </Text>
              </View>

              {/* Content */}
              <View style={{ padding: 20 }}>
                <TextInput
                  value={editedBio}
                  onChangeText={setEditedBio}
                  style={{
                    fontFamily: 'SpaceGrotesk-Regular',
                    fontSize: 14,
                    minHeight: 120,
                    textAlignVertical: 'top',
                    backgroundColor: colors.backgroundGray,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    color: colors.textPrimary,
                  }}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12 }}>
                <TouchableOpacity
                  onPress={handleCancelBio}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: colors.backgroundGray,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.textPrimary }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveBio}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.white }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Major Edit Modal */}
      <Modal
        visible={editingMajor}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelMajor}
      >
        <Pressable
          onPress={handleCancelMajor}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: Platform.OS === 'ios' ? 34 : 20,
              maxHeight: hp(70),
            }}
          >
            {/* Handle bar */}
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
              <View style={{ width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 }} />
            </View>

            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: colors.textPrimary, textAlign: 'center' }}>
                Edit Major
              </Text>
            </View>

            {/* Content */}
            <ScrollView
              style={{ maxHeight: hp(40) }}
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {commonMajors.map((major, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setEditedMajor(major)}
                  style={{
                    backgroundColor: editedMajor === major ? `${colors.primary}15` : colors.backgroundGray,
                    borderWidth: 1.5,
                    borderColor: editedMajor === major ? colors.primary : colors.border,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'SpaceGrotesk-Medium',
                      fontSize: 15,
                      color: editedMajor === major ? colors.primary : colors.textPrimary,
                    }}
                  >
                    {major}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 12, gap: 12 }}>
              <TouchableOpacity
                onPress={handleCancelMajor}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: colors.backgroundGray,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.textPrimary }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveMajor}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.white }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Classes Edit Modal */}
      <Modal
        visible={editingClasses}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelClasses}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Pressable
            onPress={handleCancelClasses}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingBottom: Platform.OS === 'ios' ? 34 : 20,
              }}
            >
              {/* Handle bar */}
              <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
                <View style={{ width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 }} />
              </View>

              {/* Header */}
              <View style={{ paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: colors.textPrimary, textAlign: 'center' }}>
                  Edit Classes
                </Text>
              </View>

              {/* Content */}
              <View style={{ padding: 20 }}>
                {/* Input row */}
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <TextInput
                    value={newClass}
                    onChangeText={setNewClass}
                    style={{
                      flex: 1,
                      fontFamily: 'SpaceGrotesk-Regular',
                      fontSize: 14,
                      backgroundColor: colors.backgroundGray,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      padding: 14,
                      marginRight: 10,
                      color: colors.textPrimary,
                    }}
                    placeholder="Add a class (e.g., CS 506)"
                    placeholderTextColor={colors.textSecondary}
                    onSubmitEditing={handleAddClass}
                  />
                  <TouchableOpacity
                    onPress={handleAddClass}
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      justifyContent: 'center',
                    }}
                  >
                    <PlusIcon size={22} color="white" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                {/* Tags */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', minHeight: 50 }}>
                  {editedClasses.map((course, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRemoveClass(course)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: `${colors.primary}15`,
                        borderRadius: 20,
                        paddingVertical: 8,
                        paddingLeft: 14,
                        paddingRight: 10,
                        marginRight: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ fontFamily: 'SpaceGrotesk-Medium', fontSize: 14, color: colors.primary, marginRight: 6 }}>
                        {course}
                      </Text>
                      <XMarkIcon size={14} color={colors.primary} strokeWidth={2.5} />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
                  Tap a class to remove it
                </Text>
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12 }}>
                <TouchableOpacity
                  onPress={handleCancelClasses}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: colors.backgroundGray,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.textPrimary }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveClasses}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.white }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Interests Edit Modal */}
      <Modal
        visible={editingInterests}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelInterests}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Pressable
            onPress={handleCancelInterests}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingBottom: Platform.OS === 'ios' ? 34 : 20,
              }}
            >
              {/* Handle bar */}
              <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
                <View style={{ width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 }} />
              </View>

              {/* Header */}
              <View style={{ paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: colors.textPrimary, textAlign: 'center' }}>
                  Edit Interests
                </Text>
              </View>

              {/* Content */}
              <View style={{ padding: 20 }}>
                {/* Input row */}
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <TextInput
                    value={newInterest}
                    onChangeText={setNewInterest}
                    style={{
                      flex: 1,
                      fontFamily: 'SpaceGrotesk-Regular',
                      fontSize: 14,
                      backgroundColor: colors.backgroundGray,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      padding: 14,
                      marginRight: 10,
                      color: colors.textPrimary,
                    }}
                    placeholder="Add an interest"
                    placeholderTextColor={colors.textSecondary}
                    onSubmitEditing={handleAddInterest}
                  />
                  <TouchableOpacity
                    onPress={handleAddInterest}
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      justifyContent: 'center',
                    }}
                  >
                    <PlusIcon size={22} color="white" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                {/* Tags */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', minHeight: 50 }}>
                  {editedInterests.map((interest, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRemoveInterest(interest)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.backgroundGray,
                        borderRadius: 20,
                        paddingVertical: 8,
                        paddingLeft: 14,
                        paddingRight: 10,
                        marginRight: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ fontFamily: 'SpaceGrotesk-Medium', fontSize: 14, color: colors.textSecondary, marginRight: 6 }}>
                        {interest}
                      </Text>
                      <XMarkIcon size={14} color={colors.textSecondary} strokeWidth={2.5} />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
                  Tap an interest to remove it
                </Text>
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12 }}>
                <TouchableOpacity
                  onPress={handleCancelInterests}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: colors.backgroundGray,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.textPrimary }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveInterests}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15, color: colors.white }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
