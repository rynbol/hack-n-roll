import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {useAuth} from '../../hooks/useAuth';
import {Picker} from '@react-native-picker/picker';

interface Major {
  id: string;
  name: string;
  category: string;
}

export default function StudentInfoScreen() {
  const router = useRouter();
  const {user} = useAuth();

  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [classes, setClasses] = useState('');
  const [studyInterests, setStudyInterests] = useState('');

  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';
      const response = await fetch(`${backendUrl}/api/student/majors/list`);
      const result = await response.json();

      if (result.success) {
        setMajors(result.majors);
      }
    } catch (error) {
      console.error('Error fetching majors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!university.trim()) {
      Alert.alert('Required Field', 'Please enter your university');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your university email');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (!major) {
      Alert.alert('Required Field', 'Please select your major');
      return;
    }

    try {
      setSubmitting(true);

      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

      // Parse classes and interests
      const classesArray = classes
        .split(',')
        .map(c => c.trim())
        .filter(c => c);

      const interestsArray = studyInterests
        .split(',')
        .map(i => i.trim())
        .filter(i => i);

      const response = await fetch(`${backendUrl}/api/student/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          university: university.trim(),
          email: email.trim(),
          major,
          graduation_year: graduationYear ? parseInt(graduationYear) : null,
          classes: classesArray,
          study_interests: interestsArray,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save student info');
      }

      // Navigate to main app
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error('Error submitting student info:', error);
      Alert.alert('Submission Failed', error.message || 'Failed to save information');
    } finally {
      setSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 10}, (_, i) => currentYear + i);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#F26322" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="mt-8 mb-6">
          <Text
            className="text-3xl font-bold text-gray-900"
            style={{fontFamily: 'SpaceGrotesk-Bold'}}
          >
            Student Information
          </Text>
          <Text
            className="text-base text-gray-600 mt-2"
            style={{fontFamily: 'SpaceGrotesk-Regular'}}
          >
            Help us connect you with the right study partners
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* University */}
          <View className="mb-4">
            <Text
              className="text-sm text-gray-700 mb-2 font-semibold"
              style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
            >
              University *
            </Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              style={{fontFamily: 'SpaceGrotesk-Regular'}}
              placeholder="e.g., Boston University"
              value={university}
              onChangeText={setUniversity}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text
              className="text-sm text-gray-700 mb-2 font-semibold"
              style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
            >
              University Email *
            </Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              style={{fontFamily: 'SpaceGrotesk-Regular'}}
              placeholder="your.email@university.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Major */}
          <View className="mb-4">
            <Text
              className="text-sm text-gray-700 mb-2 font-semibold"
              style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
            >
              Major *
            </Text>
            <View className="bg-gray-100 rounded-xl overflow-hidden">
              <Picker
                selectedValue={major}
                onValueChange={setMajor}
                style={{fontFamily: 'SpaceGrotesk-Regular'}}
              >
                <Picker.Item label="Select your major..." value="" />
                {majors.map(m => (
                  <Picker.Item key={m.id} label={m.name} value={m.name} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Graduation Year */}
          <View className="mb-4">
            <Text
              className="text-sm text-gray-700 mb-2 font-semibold"
              style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
            >
              Expected Graduation Year
            </Text>
            <View className="bg-gray-100 rounded-xl overflow-hidden">
              <Picker
                selectedValue={graduationYear}
                onValueChange={setGraduationYear}
                style={{fontFamily: 'SpaceGrotesk-Regular'}}
              >
                <Picker.Item label="Select year..." value="" />
                {years.map(year => (
                  <Picker.Item key={year} label={year.toString()} value={year.toString()} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Classes */}
          <View className="mb-4">
            <Text
              className="text-sm text-gray-700 mb-2 font-semibold"
              style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
            >
              Current Classes
            </Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              style={{fontFamily: 'SpaceGrotesk-Regular'}}
              placeholder="CS 101, Math 201, etc. (comma separated)"
              value={classes}
              onChangeText={setClasses}
              multiline
            />
          </View>

          {/* Study Interests */}
          <View className="mb-4">
            <Text
              className="text-sm text-gray-700 mb-2 font-semibold"
              style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
            >
              Study Interests
            </Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              style={{fontFamily: 'SpaceGrotesk-Regular'}}
              placeholder="Machine Learning, Web Dev, etc. (comma separated)"
              value={studyInterests}
              onChangeText={setStudyInterests}
              multiline
            />
          </View>
        </View>

        {/* Submit Button */}
        <View className="my-8">
          <TouchableOpacity
            className="bg-[#F26322] px-6 py-4 rounded-xl items-center"
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                className="text-white font-bold text-lg"
                style={{fontFamily: 'SpaceGrotesk-Bold'}}
              >
                Complete Setup →
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
