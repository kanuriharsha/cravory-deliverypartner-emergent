import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, DocumentUpload, Card } from '../src/components';
import { useAppStore } from '../src/store/appStore';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';

type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;
type VehicleType = 'bike' | 'bicycle' | 'scooter';

export default function OnboardingScreen() {
  const [step, setStep] = useState<OnboardingStep>(1);
  const { partner, updatePartnerDetails, completeOnboarding } = useAppStore();

  // Form state
  const [fullName, setFullName] = useState(partner?.fullName || '');
  const [mobile, setMobile] = useState(partner?.mobile || '');
  const [profilePhoto, setProfilePhoto] = useState(partner?.profilePhoto || null);
  const [vehicleType, setVehicleType] = useState<VehicleType>(partner?.vehicleType || 'bike');
  const [vehicleNumber, setVehicleNumber] = useState(partner?.vehicleNumber || '');
  const [drivingLicense, setDrivingLicense] = useState(partner?.drivingLicense || null);
  const [identityProof, setIdentityProof] = useState(partner?.identityProof || null);
  const [accountNumber, setAccountNumber] = useState(partner?.bankDetails?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(partner?.bankDetails?.ifscCode || '');
  const [accountHolderName, setAccountHolderName] = useState(partner?.bankDetails?.accountHolderName || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
        else if (!/^[0-9]{10}$/.test(mobile)) newErrors.mobile = 'Enter valid 10-digit mobile';
        break;
      case 2:
        if (!profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
        break;
      case 3:
        if (!vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
        break;
      case 4:
        if (!drivingLicense) newErrors.drivingLicense = 'Driving license is required';
        break;
      case 5:
        if (!identityProof) newErrors.identityProof = 'Identity proof is required';
        break;
      case 6:
        if (!accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
        if (!ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
        if (!accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    // Save current step data
    updatePartnerDetails({
      fullName,
      mobile,
      profilePhoto,
      vehicleType,
      vehicleNumber,
      drivingLicense,
      identityProof,
      bankDetails: {
        accountNumber,
        ifscCode,
        accountHolderName,
      },
    });

    if (step < 6) {
      setStep((step + 1) as OnboardingStep);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as OnboardingStep);
    }
  };

  const handleSubmit = () => {
    completeOnboarding();
    router.replace('/verification-pending');
  };

  // Demo skip function - fills demo data and completes onboarding
  const handleSkipDemo = () => {
    Alert.alert(
      'Skip for Demo',
      'This will fill in demo data and complete onboarding. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // Fill demo data
            updatePartnerDetails({
              fullName: 'Raj Kumar',
              mobile: '9876543210',
              profilePhoto: 'https://ui-avatars.com/api/?name=Raj+Kumar&background=FF5722&color=fff',
              vehicleType: 'bike',
              vehicleNumber: 'KA01AB1234',
              drivingLicense: 'https://via.placeholder.com/400x300?text=Demo+License',
              identityProof: 'https://via.placeholder.com/400x300?text=Demo+ID',
              bankDetails: {
                accountNumber: '1234567890',
                ifscCode: 'HDFC0001234',
                accountHolderName: 'Raj Kumar',
              },
            });
            completeOnboarding();
            router.replace('/verification-pending');
          },
        },
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <View
          key={s}
          style={[
            styles.stepDot,
            s === step && styles.stepDotActive,
            s < step && styles.stepDotCompleted,
          ]}
        >
          {s < step ? (
            <Ionicons name="checkmark" size={12} color={COLORS.white} />
          ) : (
            <Text style={[
              styles.stepNumber,
              s === step && styles.stepNumberActive,
            ]}>{s}</Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Personal Details</Text>
            <Text style={styles.stepSubtitle}>Enter your basic information</Text>
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
            />
            <Input
              label="Mobile Number"
              placeholder="Enter 10-digit mobile"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.mobile}
            />
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Profile Photo</Text>
            <Text style={styles.stepSubtitle}>Upload a clear photo of yourself</Text>
            
            <DocumentUpload
              label="Profile Photo"
              value={profilePhoto}
              onChange={setProfilePhoto}
              placeholder="Take a selfie or upload photo"
            />
            {errors.profilePhoto && (
              <Text style={styles.errorText}>{errors.profilePhoto}</Text>
            )}
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Vehicle Details</Text>
            <Text style={styles.stepSubtitle}>Select your vehicle type and enter details</Text>
            
            <Text style={styles.fieldLabel}>Vehicle Type</Text>
            <View style={styles.vehicleOptions}>
              {(['bike', 'bicycle', 'scooter'] as VehicleType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.vehicleOption,
                    vehicleType === type && styles.vehicleOptionActive,
                  ]}
                  onPress={() => setVehicleType(type)}
                >
                  <Ionicons
                    name={type === 'bicycle' ? 'bicycle' : 'speedometer'}
                    size={28}
                    color={vehicleType === type ? COLORS.primary : COLORS.textSecondary}
                  />
                  <Text style={[
                    styles.vehicleText,
                    vehicleType === type && styles.vehicleTextActive,
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Input
              label="Vehicle Number"
              placeholder="e.g., KA01AB1234"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              autoCapitalize="characters"
              error={errors.vehicleNumber}
            />
          </View>
        );

      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Driving License</Text>
            <Text style={styles.stepSubtitle}>Upload your valid driving license</Text>
            
            <DocumentUpload
              label="Driving License (Front)"
              value={drivingLicense}
              onChange={setDrivingLicense}
              acceptTypes={['image', 'pdf']}
              placeholder="Upload license document"
            />
            {errors.drivingLicense && (
              <Text style={styles.errorText}>{errors.drivingLicense}</Text>
            )}
          </View>
        );

      case 5:
        return (
          <View>
            <Text style={styles.stepTitle}>Identity Proof</Text>
            <Text style={styles.stepSubtitle}>Upload a government ID (Aadhaar, PAN, etc.)</Text>
            
            <DocumentUpload
              label="Identity Proof"
              value={identityProof}
              onChange={setIdentityProof}
              acceptTypes={['image', 'pdf']}
              placeholder="Upload ID document"
            />
            {errors.identityProof && (
              <Text style={styles.errorText}>{errors.identityProof}</Text>
            )}
          </View>
        );

      case 6:
        return (
          <View>
            <Text style={styles.stepTitle}>Bank Details</Text>
            <Text style={styles.stepSubtitle}>For payout settlements</Text>
            
            <Input
              label="Account Holder Name"
              placeholder="Enter name as per bank"
              value={accountHolderName}
              onChangeText={setAccountHolderName}
              error={errors.accountHolderName}
            />
            <Input
              label="Account Number"
              placeholder="Enter account number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              error={errors.accountNumber}
            />
            <Input
              label="IFSC Code"
              placeholder="e.g., HDFC0001234"
              value={ifscCode}
              onChangeText={setIfscCode}
              autoCapitalize="characters"
              error={errors.ifscCode}
            />
          </View>
        );
    }
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
            <Text style={styles.title}>Onboarding</Text>
            <Text style={styles.subtitle}>Complete verification to start deliveries</Text>
          </View>

          {renderStepIndicator()}

          {/* Step Content */}
          <Card style={styles.card}>
            {renderStep()}
          </Card>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {step > 1 && (
              <Button
                title="Back"
                onPress={handleBack}
                variant="outline"
                style={styles.backButton}
              />
            )}
            <Button
              title={step === 6 ? 'Submit for Verification' : 'Next'}
              onPress={handleNext}
              style={step > 1 ? styles.nextButtonHalf : styles.nextButtonFull}
            />
          </View>

          {/* Skip for Demo button */}
          <TouchableOpacity style={styles.skipDemoButton} onPress={handleSkipDemo}>
            <Ionicons name="flash" size={18} color={COLORS.secondary} />
            <Text style={styles.skipDemoText}>Skip for Demo</Text>
          </TouchableOpacity>
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
    marginBottom: SPACING.lg,
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepDotCompleted: {
    backgroundColor: COLORS.success,
  },
  stepNumber: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stepNumberActive: {
    color: COLORS.white,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  stepTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  stepSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  vehicleOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  vehicleOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSecondary,
  },
  vehicleOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  vehicleText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  vehicleTextActive: {
    color: COLORS.primary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  backButton: {
    flex: 1,
  },
  nextButtonHalf: {
    flex: 2,
  },
  nextButtonFull: {
    flex: 1,
  },
  skipDemoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    padding: SPACING.md,
  },
  skipDemoText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.secondary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
});
