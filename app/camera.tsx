import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Text, YStack, XStack } from 'tamagui';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const RECTANGLE_WIDTH = width * 0.8;
const RECTANGLE_HEIGHT = height * 0.4;
const RECTANGLE_X = (width - RECTANGLE_WIDTH) / 2;
const RECTANGLE_Y = (height - RECTANGLE_HEIGHT) / 2;

export default function CameraPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        // Save the image to local storage
        const fileName = `photo_${Date.now()}.jpg`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        
        await FileSystem.moveAsync({
          from: photo.uri,
          to: fileUri,
        });

        // Save the file path to AsyncStorage
        const savedImages = await AsyncStorage.getItem('capturedImages');
        const images = savedImages ? JSON.parse(savedImages) : [];
        images.push(fileUri);
        await AsyncStorage.setItem('capturedImages', JSON.stringify(images));

        Alert.alert('Success', 'Photo captured and saved!');
        router.back();
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const flipCamera = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back');
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <YStack space="$4" alignItems="center" justifyContent="center">
          <Text fontSize="$6" color="$red10">No access to camera</Text>
          <Text fontSize="$4" color="$gray10" textAlign="center">
            Please grant camera permission to use this app
          </Text>
          <Button
            size="$4"
            backgroundColor="$blue10"
            color="white"
            onPress={() => router.back()}
            borderRadius="$3"
          >
            <Text color="white" fontSize="$4">
              Go Back
            </Text>
          </Button>
        </YStack>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        ratio="16:9"
      >
        {/* Semi-transparent overlay */}
        <View style={styles.overlay}>
          {/* Top area */}
          <View style={[styles.overlayArea, { height: RECTANGLE_Y }]} />
          
          {/* Middle area with rectangle cutout */}
          <View style={styles.middleRow}>
            <View style={[styles.overlayArea, { width: RECTANGLE_X }]} />
            <View style={styles.rectangleCutout} />
            <View style={[styles.overlayArea, { width: RECTANGLE_X }]} />
          </View>
          
          {/* Bottom area */}
          <View style={[styles.overlayArea, { height: RECTANGLE_Y }]} />
        </View>

        {/* Rectangle border */}
        <View style={styles.rectangleBorder} />

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            Position the rectangular object within the frame
          </Text>
        </View>

        {/* Camera controls */}
        <View style={styles.controlsContainer}>
          <XStack space="$4" alignItems="center" justifyContent="center">
            <Button
              size="$5"
              backgroundColor="$gray8"
              color="white"
              onPress={() => router.back()}
              borderRadius="$3"
              width={60}
              height={60}
              alignItems="center"
              justifyContent="center"
              padding={0}
            >
              <Ionicons name="close" size={24} color="white" />
            </Button>

            <Button
              size="$6"
              backgroundColor="$blue10"
              color="white"
              onPress={takePicture}
              borderRadius="$6"
              width={80}
              height={80}
              alignItems="center"
              justifyContent="center"
              padding={0}
            >
              <Ionicons name="camera" size={32} color="white" />
            </Button>

            <Button
              size="$5"
              backgroundColor="$gray8"
              color="white"
              onPress={flipCamera}
              borderRadius="$3"
              width={60}
              height={60}
              alignItems="center"
              justifyContent="center"
              padding={0}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </Button>
          </XStack>
        </View>
              </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleRow: {
    flexDirection: 'row',
    height: RECTANGLE_HEIGHT,
  },
  rectangleCutout: {
    width: RECTANGLE_WIDTH,
    height: RECTANGLE_HEIGHT,
    backgroundColor: 'transparent',
  },
  rectangleBorder: {
    position: 'absolute',
    top: RECTANGLE_Y,
    left: RECTANGLE_X,
    width: RECTANGLE_WIDTH,
    height: RECTANGLE_HEIGHT,
    borderWidth: 3,
    borderColor: '#00ff00',
    backgroundColor: 'transparent',
  },
  instructionsContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
}); 