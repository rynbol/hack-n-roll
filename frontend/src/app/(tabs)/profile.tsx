import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
import { analyzeProfileImage } from '../../lib/imageAnalysis';

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
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Image picker handler
  const handlePickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Permission result:", status);

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a profile picture.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'] as any,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      console.log("Picker result:", result);

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImageUri(imageUri);
        setUser({ ...user, imgUrl: { uri: imageUri } });

        // Analyze the image with LLM
        setIsAnalyzing(true);
        const analysis = await analyzeProfileImage(
          imageUri
        );
        setIsAnalyzing(false);

        if (analysis.success && analysis.data) {
          setAnalysisResult(analysis.data);
          console.log('Image analysis result:', analysis.data);
        } else {
          console.error('Image analysis failed:', analysis.error);
          Alert.alert('Analysis Failed', analysis.error || 'Could not analyze the image.');
        }
      }
    } catch (e) {
      console.error("Image picker error:", e);
      Alert.alert("Error", String(e));
    }
  };

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
    children
  }: {
    title: string;
    icon: React.ComponentType<any>;
    onEdit: () => void;
    children: React.ReactNode;
  }) => (
    <View
      className="bg-white"
      style={{
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <View className="flex-row items-center">
          <Icon size={18} color="#F26322" strokeWidth={2} />
          <Text
            className="text-sm font-semibold text-gray-800 ml-2"
            style={{ fontFamily: 'SpaceGrotesk-SemiBold' }}
          >
            {title}
          </Text>
        </View>
        <TouchableOpacity onPress={onEdit} className="p-1">
          <PencilIcon size={16} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 14 }}>
        {children}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(10),
        }}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={['#F26322', '#FF8A5B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: hp(20) }}
        >
          <View className="flex-1 justify-center items-center pt-12">
            <Text
              className="text-white font-bold"
              style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: 20 }}
            >
              My Profile
            </Text>
          </View>
        </LinearGradient>

        {/* Profile Photo */}
        <View className="items-center" style={{ marginTop: -hp(8) }}>
          <View
            className="bg-white rounded-full items-center justify-center"
            style={{
              width: wp(28),
              height: wp(28),
              borderWidth: 3,
              borderColor: '#fff',
            }}
          >
            <Image
              source={user.imgUrl}
              style={{
                width: wp(26),
                height: wp(26),
                borderRadius: wp(13),
              }}
              resizeMode="cover"
            />
            {isAnalyzing && (
              <View
                className="absolute items-center justify-center"
                style={{
                  width: wp(26),
                  height: wp(26),
                  borderRadius: wp(13),
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
                <Text
                  className="text-white text-xs mt-1"
                  style={{ fontFamily: 'SpaceGrotesk-Medium' }}
                >
                  Analyzing...
                </Text>
              </View>
            )}
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-[#F26322] rounded-full p-1.5"
              onPress={handlePickImage}
              disabled={isAnalyzing}
            >
              <CameraIcon size={14} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Name and Age */}
          <Text
            className="text-2xl font-bold text-gray-900 mt-3"
            style={{ fontFamily: 'SpaceGrotesk-Bold' }}
          >
            {user.name}, {user.age}
          </Text>

          {/* University */}
          <View className="flex-row items-center mt-1">
            <AcademicCapIcon size={16} color="#6B7280" strokeWidth={2} />
            <Text
              className="text-gray-500 ml-1 text-sm"
              style={{ fontFamily: 'SpaceGrotesk-Medium' }}
            >
              {user.university}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-4 mt-4">
          <View
            className="bg-white flex-1 items-center py-3 mr-1.5"
            style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text
              className="text-xl font-bold text-[#F26322]"
              style={{ fontFamily: 'SpaceGrotesk-Bold' }}
            >
              {user.classes.length}
            </Text>
            <Text
              className="text-gray-500 text-xs"
              style={{ fontFamily: 'SpaceGrotesk-Regular' }}
            >
              Courses
            </Text>
          </View>

          <View
            className="bg-white flex-1 items-center py-3 ml-1.5"
            style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text
              className="text-xl font-bold text-[#F26322]"
              style={{ fontFamily: 'SpaceGrotesk-Bold' }}
            >
              {user.interests.length}
            </Text>
            <Text
              className="text-gray-500 text-xs"
              style={{ fontFamily: 'SpaceGrotesk-Regular' }}
            >
              Interests
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View className="px-4 mt-4">
          {/* Bio Card */}
          <ProfileCard title="About Me" icon={UserIcon} onEdit={() => setEditingBio(true)}>
            <Text
              className="text-gray-600 leading-5"
              style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: 14 }}
            >
              {user.bio}
            </Text>
          </ProfileCard>

          {/* Major Card */}
          <ProfileCard title="Major" icon={AcademicCapIcon} onEdit={() => setEditingMajor(true)}>
            <Text
              className="text-gray-700"
              style={{ fontFamily: 'SpaceGrotesk-Medium', fontSize: 14 }}
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
                  className="rounded-full px-3 py-1 mr-2 mb-1.5"
                  style={{ backgroundColor: '#FEF3E2' }}
                >
                  <Text
                    className="text-[#EA580C] text-sm"
                    style={{ fontFamily: 'SpaceGrotesk-Medium' }}
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
                  className="rounded-full px-3 py-1 mr-2 mb-1.5"
                  style={{ backgroundColor: '#F3F4F6' }}
                >
                  <Text
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: 'SpaceGrotesk-Medium' }}
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
              <View className="items-center py-5 border-b border-gray-100">
                <Text
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: 'SpaceGrotesk-Bold' }}
                >
                  Edit About Me
                </Text>
              </View>

              <View className="px-5 py-5">
                <TextInput
                  value={editedBio}
                  onChangeText={setEditedBio}
                  className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-900"
                  style={{
                    fontFamily: 'SpaceGrotesk-Regular',
                    fontSize: 14,
                    minHeight: 120,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                />
              </View>

              <View className="flex-row px-5 pb-5 pt-2">
                <TouchableOpacity
                  onPress={handleCancelBio}
                  className="flex-1 py-3.5 rounded-full mr-3"
                  style={{ backgroundColor: '#F3F4F6' }}
                >
                  <Text
                    className="text-gray-700 text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15 }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveBio}
                  className="flex-1 py-3.5 rounded-full"
                  style={{ backgroundColor: '#3B82F6' }}
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
              <View className="items-center py-5 border-b border-gray-100">
                <Text
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: 'SpaceGrotesk-Bold' }}
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
                      backgroundColor: editedMajor === major ? '#FEF3E2' : '#F9FAFB',
                      borderWidth: 1.5,
                      borderColor: editedMajor === major ? '#F26322' : '#E5E7EB',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'SpaceGrotesk-Medium',
                        fontSize: 14,
                        color: editedMajor === major ? '#F26322' : '#374151',
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
                  style={{ backgroundColor: '#F3F4F6' }}
                >
                  <Text
                    className="text-gray-700 text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15 }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveMajor}
                  className="flex-1 py-3.5 rounded-full"
                  style={{ backgroundColor: '#3B82F6' }}
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
              <View className="items-center py-5 border-b border-gray-100">
                <Text
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: 'SpaceGrotesk-Bold' }}
                >
                  Edit Classes
                </Text>
              </View>

              <View className="px-5 py-4">
                <View className="flex-row mb-4">
                  <TextInput
                    value={newClass}
                    onChangeText={setNewClass}
                    className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-gray-900 flex-1 mr-2"
                    style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: 14 }}
                    placeholder="Add a class (e.g., CS 506)"
                    placeholderTextColor="#9CA3AF"
                    onSubmitEditing={handleAddClass}
                  />
                  <TouchableOpacity
                    onPress={handleAddClass}
                    className="bg-[#F26322] rounded-xl px-4 justify-center"
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
                      style={{ backgroundColor: '#FEF3E2' }}
                    >
                      <Text
                        className="text-[#EA580C] text-sm mr-1"
                        style={{ fontFamily: 'SpaceGrotesk-Medium' }}
                      >
                        {course}
                      </Text>
                      <XMarkIcon size={12} color="#EA580C" strokeWidth={2.5} />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text
                  className="text-xs text-gray-400 mt-2"
                  style={{ fontFamily: 'SpaceGrotesk-Regular' }}
                >
                  Tap a class to remove it
                </Text>
              </View>

              <View className="flex-row px-5 pb-5 pt-2">
                <TouchableOpacity
                  onPress={handleCancelClasses}
                  className="flex-1 py-3.5 rounded-full mr-3"
                  style={{ backgroundColor: '#F3F4F6' }}
                >
                  <Text
                    className="text-gray-700 text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15 }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveClasses}
                  className="flex-1 py-3.5 rounded-full"
                  style={{ backgroundColor: '#3B82F6' }}
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
              <View className="items-center py-5 border-b border-gray-100">
                <Text
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: 'SpaceGrotesk-Bold' }}
                >
                  Edit Interests
                </Text>
              </View>

              <View className="px-5 py-4">
                <View className="flex-row mb-4">
                  <TextInput
                    value={newInterest}
                    onChangeText={setNewInterest}
                    className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-gray-900 flex-1 mr-2"
                    style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: 14 }}
                    placeholder="Add an interest"
                    placeholderTextColor="#9CA3AF"
                    onSubmitEditing={handleAddInterest}
                  />
                  <TouchableOpacity
                    onPress={handleAddInterest}
                    className="bg-[#F26322] rounded-xl px-4 justify-center"
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
                      style={{ backgroundColor: '#F3F4F6' }}
                    >
                      <Text
                        className="text-gray-600 text-sm mr-1"
                        style={{ fontFamily: 'SpaceGrotesk-Medium' }}
                      >
                        {interest}
                      </Text>
                      <XMarkIcon size={12} color="#6B7280" strokeWidth={2.5} />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text
                  className="text-xs text-gray-400 mt-2"
                  style={{ fontFamily: 'SpaceGrotesk-Regular' }}
                >
                  Tap an interest to remove it
                </Text>
              </View>

              <View className="flex-row px-5 pb-5 pt-2">
                <TouchableOpacity
                  onPress={handleCancelInterests}
                  className="flex-1 py-3.5 rounded-full mr-3"
                  style={{ backgroundColor: '#F3F4F6' }}
                >
                  <Text
                    className="text-gray-700 text-center font-semibold"
                    style={{ fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 15 }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveInterests}
                  className="flex-1 py-3.5 rounded-full"
                  style={{ backgroundColor: '#3B82F6' }}
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
    </View>
  );
}

