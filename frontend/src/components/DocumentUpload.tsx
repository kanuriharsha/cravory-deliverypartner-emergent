import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface DocumentUploadProps {
  label: string;
  value: string | null;
  onChange: (uri: string) => void;
  acceptTypes?: ('image' | 'pdf')[];
  placeholder?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  value,
  onChange,
  acceptTypes = ['image'],
  placeholder = 'Tap to upload',
}) => {
  const handlePick = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant gallery access to upload documents.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Use base64 for storage
        if (asset.base64) {
          onChange(`data:image/jpeg;base64,${asset.base64}`);
        } else {
          onChange(asset.uri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera access to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          onChange(`data:image/jpeg;base64,${asset.base64}`);
        } else {
          onChange(asset.uri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showOptions = () => {
    Alert.alert(
      'Upload Document',
      'Choose an option',
      [
        { text: 'Camera', onPress: handleCamera },
        { text: 'Gallery', onPress: handlePick },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.uploadBox, value && styles.uploadBoxFilled]}
        onPress={showOptions}
        activeOpacity={0.7}
      >
        {value ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: value }} style={styles.preview} />
            <View style={styles.successBadge}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              <Text style={styles.successText}>Uploaded</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="cloud-upload-outline" size={40} color={COLORS.textSecondary} />
            <Text style={styles.placeholder}>{placeholder}</Text>
            <Text style={styles.hint}>
              {acceptTypes.includes('pdf') ? 'Images or PDF' : 'Images only'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    backgroundColor: COLORS.surfaceSecondary,
  },
  uploadBoxFilled: {
    borderStyle: 'solid',
    borderColor: COLORS.success,
    backgroundColor: COLORS.white,
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholder: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  hint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textDisabled,
    marginTop: SPACING.xs,
  },
  previewContainer: {
    alignItems: 'center',
    width: '100%',
  },
  preview: {
    width: '100%',
    height: 120,
    borderRadius: BORDER_RADIUS.md,
    resizeMode: 'cover',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  successText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});
