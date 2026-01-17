import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {CameraIcon, PhotoIcon} from 'react-native-heroicons/outline';
import {useAuth} from '../../hooks/useAuth';

const {width, height} = Dimensions.get('window');
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

export default function PhotoUploadScreen() {
  const router = useRouter();
  const {user} = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  /**
   * Request camera permissions and take photo
   */
  const takePhoto = async () => {
    try {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  /**
   * Request photo library permissions and pick image
   */
  const pickImage = async () => {
    try {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Photo library permission is required to select photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };

  /**
   * Upload photo and generate profile with AI
   */
  const handleContinue = async () => {
    if (!selectedImage || !user) return;

    try {
      setUploading(true);

      // Create FormData
      const formData = new FormData();

      // Fetch the image and create blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      formData.append('photo', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      formData.append('userId', user.id);

      // Call backend API
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';
      const uploadResponse = await fetch(`${backendUrl}/api/profile/generate`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      // Navigate to preview screen with generated profile
      router.push({
        pathname: '/(onboarding)/preview',
        params: {profileId: result.profile.id},
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      Alert.alert('Upload Failed', error.message || 'Failed to generate profile');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="mt-8 mb-6">
          <Text
            className="text-3xl font-bold text-gray-900"
            style={{fontFamily: 'SpaceGrotesk-Bold'}}
          >
            Upload Your Photo
          </Text>
          <Text
            className="text-base text-gray-600 mt-2"
            style={{fontFamily: 'SpaceGrotesk-Regular'}}
          >
            Our AI will create a fun profile based on your photo!
          </Text>
        </View>

        {/* Photo Preview */}
        <View className="flex-1 justify-center items-center">
          {selectedImage ? (
            <View className="w-full items-center">
              <Image
                source={{uri: selectedImage}}
                style={{
                  width: wp(80),
                  height: hp(50),
                  borderRadius: 20,
                }}
                resizeMode="cover"
              />
              <TouchableOpacity
                className="mt-4 px-6 py-2 bg-gray-200 rounded-full"
                onPress={() => setSelectedImage(null)}
              >
                <Text
                  className="text-gray-700 font-semibold"
                  style={{fontFamily: 'SpaceGrotesk-SemiBold'}}
                >
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="w-full items-center">
              <View className="w-64 h-64 bg-gray-100 rounded-3xl items-center justify-center mb-8">
                <CameraIcon size={80} color="#9CA3AF" />
              </View>

              {/* Upload Options */}
              <View className="w-full space-y-4">
                <TouchableOpacity
                  className="bg-[#F26322] px-6 py-4 rounded-xl flex-row justify-center items-center"
                  onPress={takePhoto}
                >
                  <CameraIcon size={24} color="white" />
                  <Text
                    className="text-white font-bold text-lg ml-3"
                    style={{fontFamily: 'SpaceGrotesk-Bold'}}
                  >
                    Take Photo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-800 px-6 py-4 rounded-xl flex-row justify-center items-center"
                  onPress={pickImage}
                >
                  <PhotoIcon size={24} color="white" />
                  <Text
                    className="text-white font-bold text-lg ml-3"
                    style={{fontFamily: 'SpaceGrotesk-Bold'}}
                  >
                    Choose from Library
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Continue Button */}
        {selectedImage && (
          <View className="mb-8">
            <TouchableOpacity
              className="bg-[#F26322] px-6 py-4 rounded-xl items-center"
              onPress={handleContinue}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  className="text-white font-bold text-lg"
                  style={{fontFamily: 'SpaceGrotesk-Bold'}}
                >
                  Continue →
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
