import React, { useState } from 'react';
import { View, Image, ScrollView, Alert } from 'react-native';
import { Button, Text, YStack, XStack, Card } from 'tamagui';
import { router, useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage() {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadCapturedImages();
    }, [])
  );

  const loadCapturedImages = async () => {
    try {
      const savedImages = await AsyncStorage.getItem('capturedImages');
      if (savedImages) {
        setCapturedImages(JSON.parse(savedImages));
      }
    } catch (error) {
      console.error('Error loading images:', error);
      Alert.alert('Error', 'Failed to load captured images');
    }
  };

  const openCamera = () => {
    router.push('/camera');
  };

  const clearImages = async () => {
    try {
      // Delete all image files
      for (const imageUri of capturedImages) {
        await FileSystem.deleteAsync(imageUri, { idempotent: true });
      }
      // Clear from storage
      await AsyncStorage.removeItem('capturedImages');
      setCapturedImages([]);
      Alert.alert('Success', 'All images have been cleared');
    } catch (error) {
      console.error('Error clearing images:', error);
      Alert.alert('Error', 'Failed to clear images. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <YStack flex={1} padding="$4" space="$4">
        <YStack space="$2" alignItems="center" paddingTop="$8">
          <Text fontSize="$8" fontWeight="bold" color="$blue10">
            Camera App
          </Text>
          <Text fontSize="$4" color="$gray10" textAlign="center">
            Take photos of rectangular objects
          </Text>
        </YStack>

        <Button
          size="$6"
          backgroundColor="$blue10"
          color="white"
          onPress={openCamera}
          borderRadius="$4"
          marginVertical="$4"
          accessibilityLabel="Open camera"
          accessibilityHint="Opens the camera to take photos"
        >
          <Text color="white" fontSize="$5" fontWeight="bold">
            📸 Open Camera
          </Text>
        </Button>

        {capturedImages.length > 0 && (
          <YStack space="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Captured Images ({capturedImages.length})
              </Text>
              <Button
                size="$3"
                backgroundColor="$red10"
                color="white"
                onPress={clearImages}
                borderRadius="$3"
                accessibilityLabel="Clear all images"
                accessibilityHint="Deletes all captured images"
              >
                <Text color="white" fontSize="$3">
                  Clear All
                </Text>
              </Button>
            </XStack>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack space="$3" paddingVertical="$2">
                {capturedImages.map((imageUri, index) => (
                  <Card key={index} padding="$2" backgroundColor="white" borderRadius="$4">
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                      accessibilityLabel={`Captured image ${index + 1}`}
                    />
                  </Card>
                ))}
              </XStack>
            </ScrollView>
          </YStack>
        )}

        {capturedImages.length === 0 && (
          <YStack flex={1} justifyContent="center" alignItems="center" space="$3">
            <Text fontSize="$6" color="$gray8">
              📷
            </Text>
            <Text fontSize="$4" color="$gray10" textAlign="center">
              No images captured yet
            </Text>
            <Text fontSize="$3" color="$gray8" textAlign="center">
              Tap the camera button to start taking photos
            </Text>
          </YStack>
        )}
      </YStack>
    </View>
  );
} 