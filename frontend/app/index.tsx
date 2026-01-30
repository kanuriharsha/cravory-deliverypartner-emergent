import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../src/store/appStore';
import { COLORS, FONTS, SPACING } from '../src/constants/theme';

export default function Index() {
  const { isAuthenticated, partner, isLoading } = useAppStore();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          if (!partner?.isOnboarded) {
            router.replace('/onboarding');
          } else if (!partner?.isVerified) {
            router.replace('/verification-pending');
          } else {
            router.replace('/(tabs)');
          }
        } else {
          router.replace('/login');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, partner, isLoading]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.appName}>Cravory</Text>
        <Text style={styles.tagline}>Delivery Partner</Text>
      </View>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  appName: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.white,
    opacity: 0.9,
  },
  loadingText: {
    position: 'absolute',
    bottom: 60,
    fontSize: FONTS.sizes.md,
    color: COLORS.white,
    opacity: 0.7,
  },
});
