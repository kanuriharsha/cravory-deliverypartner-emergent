import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, StatusBadge, Button } from '../../src/components';
import { useAppStore } from '../../src/store/appStore';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';

export default function ProfileScreen() {
  const { partner, logout, setLowBattery, setPoorNetwork } = useAppStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  // Demo controls for simulating scenarios
  const handleSimulateLowBattery = () => {
    setLowBattery(true);
    Alert.alert('Demo', 'Low battery warning enabled');
  };

  const handleSimulatePoorNetwork = () => {
    setPoorNetwork(true);
    Alert.alert('Demo', 'Poor network warning enabled');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard} variant="elevated">
          <View style={styles.profileHeader}>
            {partner?.profilePhoto ? (
              <Image
                source={{ uri: partner.profilePhoto }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={40} color={COLORS.textDisabled} />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{partner?.fullName || 'Delivery Partner'}</Text>
              <Text style={styles.profileMobile}>{partner?.mobile || 'N/A'}</Text>
              <StatusBadge status={partner?.isVerified ? 'online' : 'pending'} size="small" />
            </View>
          </View>
        </Card>

        {/* Account Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="id-card" size={20} color={COLORS.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Partner ID</Text>
              <Text style={styles.detailValue}>{partner?.id || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="car" size={20} color={COLORS.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Vehicle</Text>
              <Text style={styles.detailValue}>
                {partner?.vehicleType?.toUpperCase()} - {partner?.vehicleNumber || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location" size={20} color={COLORS.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Base Location</Text>
              <Text style={styles.detailValue}>{partner?.baseLocation || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="resize" size={20} color={COLORS.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Service Radius</Text>
              <Text style={styles.detailValue}>{partner?.serviceRadius || 0} km</Text>
            </View>
          </View>
        </Card>

        {/* Bank Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Payout Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="card" size={20} color={COLORS.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Account Holder</Text>
              <Text style={styles.detailValue}>
                {partner?.bankDetails?.accountHolderName || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="wallet" size={20} color={COLORS.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Account Number</Text>
              <Text style={styles.detailValue}>
                {'****' + (partner?.bankDetails?.accountNumber?.slice(-4) || 'XXXX')}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="business" size={20} color={COLORS.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>IFSC Code</Text>
              <Text style={styles.detailValue}>
                {partner?.bankDetails?.ifscCode || 'N/A'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Demo Controls */}
        <Card style={styles.demoCard}>
          <Text style={styles.sectionTitle}>Demo Controls</Text>
          <Text style={styles.demoHint}>
            These controls simulate real-world scenarios for testing purposes.
          </Text>
          
          <View style={styles.demoButtons}>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleSimulateLowBattery}
            >
              <Ionicons name="battery-dead" size={20} color={COLORS.warning} />
              <Text style={styles.demoButtonText}>Low Battery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleSimulatePoorNetwork}
            >
              <Ionicons name="wifi" size={20} color={COLORS.error} />
              <Text style={styles.demoButtonText}>Poor Network</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Cravory Delivery Partner</Text>
          <Text style={styles.appVersion}>Version 1.0.0 (Demo)</Text>
        </View>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  profileCard: {
    marginBottom: SPACING.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  profileMobile: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginVertical: SPACING.xs,
  },
  detailsCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  detailContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  detailLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  demoCard: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
  },
  demoHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  demoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  demoButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  appName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  appVersion: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textDisabled,
    marginTop: SPACING.xs,
  },
  logoutButton: {
    marginTop: SPACING.md,
  },
});
