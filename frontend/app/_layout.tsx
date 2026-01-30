import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useAppStore } from '../src/store/appStore';
import { NotificationBanner } from '../src/components';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  const { loadPersistedState, isLoading } = useAppStore();

  useEffect(() => {
    loadPersistedState();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <NotificationBanner />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: COLORS.background },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});
