import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../src/components';
import { useAppStore } from '../src/store/appStore';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAppStore();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(username, password);

    setLoading(false);

    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleDemoLogin = () => {
    setUsername('delivery123');
    setPassword('delivery123');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={styles.title}>Cravory</Text>
            <Text style={styles.subtitle}>Delivery Partner Login</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <Input
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.passwordContainer}>
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            {/* Demo Login Helper */}
            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoLogin}
            >
              <Ionicons name="flash" size={18} color={COLORS.secondary} />
              <Text style={styles.demoText}>Use Demo Credentials</Text>
            </TouchableOpacity>
          </View>

          {/* Info Note */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              Delivery partner accounts are created by Admin only. Public signup is not available.
            </Text>
          </View>

          {/* Demo Credentials */}
          <View style={styles.credentialsBox}>
            <Text style={styles.credentialsTitle}>Demo Credentials:</Text>
            <Text style={styles.credentialsText}>Username: delivery123</Text>
            <Text style={styles.credentialsText}>Password: delivery123</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.md,
    top: 38,
  },
  error: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: SPACING.sm,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    padding: SPACING.sm,
  },
  demoText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.secondary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.info + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  credentialsBox: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  credentialsTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  credentialsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
