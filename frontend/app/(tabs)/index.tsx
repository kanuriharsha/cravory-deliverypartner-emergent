import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, StatusBadge } from '../../src/components';
import { useAppStore } from '../../src/store/appStore';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { REJECTION_REASONS, RejectionReason } from '../../src/types';

export default function HomeScreen() {
  const {
    partner,
    earnings,
    currentOrder,
    pendingOrderRequest,
    toggleOnline,
    generateNewOrderRequest,
    acceptOrder,
    rejectOrder,
    clearOrderRequest,
    updateOrderStatus,
    completeDelivery,
    addNotification,
    lowBattery,
    poorNetwork,
    checkBlockStatus,
  } = useAppStore();

  const [countdown, setCountdown] = useState(30);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [deliveryPin, setDeliveryPin] = useState('');
  const [pinError, setPinError] = useState('');
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const orderCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Check block status periodically
  useEffect(() => {
    const interval = setInterval(checkBlockStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate orders when online
  useEffect(() => {
    if (partner?.isOnline && !currentOrder && !pendingOrderRequest && !partner.isBlocked) {
      // Generate a new order after random delay (5-15 seconds for demo)
      const delay = 5000 + Math.random() * 10000;
      orderCheckRef.current = setTimeout(() => {
        generateNewOrderRequest();
      }, delay);
    }

    return () => {
      if (orderCheckRef.current) {
        clearTimeout(orderCheckRef.current);
      }
    };
  }, [partner?.isOnline, currentOrder, pendingOrderRequest, partner?.isBlocked]);

  // Countdown for order request
  useEffect(() => {
    if (pendingOrderRequest) {
      setCountdown(30);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            clearOrderRequest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [pendingOrderRequest?.id]);

  const handleToggleOnline = () => {
    const result = toggleOnline();
    if (!result.success && result.error) {
      Alert.alert('Cannot Change Status', result.error);
    }
  };

  const handleReject = (reason: RejectionReason) => {
    rejectOrder(reason);
    setShowRejectModal(false);
  };

  const handleNavigate = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps://app?daddr=${encodedAddress}`,
      android: `google.navigation:q=${encodedAddress}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
    });
    
    Linking.openURL(url).catch(() => {
      // Fallback to web
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
    });
  };

  const handlePinSubmit = () => {
    if (!deliveryPin.trim()) {
      setPinError('Please enter the delivery PIN');
      return;
    }
    
    const result = completeDelivery(deliveryPin);
    if (result.success) {
      setDeliveryPin('');
      setPinError('');
    } else {
      setPinError(result.error || 'Invalid PIN');
    }
  };

  // Render order request card (full screen overlay)
  if (pendingOrderRequest) {
    return (
      <View style={styles.orderRequestOverlay}>
        <SafeAreaView style={styles.orderRequestContainer}>
          <View style={styles.orderRequestHeader}>
            <Text style={styles.orderRequestTitle}>New Delivery Request</Text>
            <View style={styles.countdownContainer}>
              <Ionicons name="time" size={20} color={COLORS.white} />
              <Text style={styles.countdownText}>{countdown}s</Text>
            </View>
          </View>

          <Card style={styles.orderRequestCard} variant="elevated">
            <View style={styles.orderRequestInfo}>
              <View style={styles.orderIdBadge}>
                <Text style={styles.orderIdText}>{pendingOrderRequest.id}</Text>
              </View>

              <View style={styles.restaurantRow}>
                <Ionicons name="restaurant" size={24} color={COLORS.primary} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>
                    {pendingOrderRequest.restaurantName}
                  </Text>
                  <Text style={styles.areaText}>
                    {pendingOrderRequest.pickupArea}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.deliveryRow}>
                <View style={styles.deliveryItem}>
                  <Ionicons name="location" size={20} color={COLORS.success} />
                  <Text style={styles.deliveryLabel}>Drop</Text>
                  <Text style={styles.deliveryValue}>
                    {pendingOrderRequest.dropArea}
                  </Text>
                </View>
                <View style={styles.deliveryItem}>
                  <Ionicons name="navigate" size={20} color={COLORS.info} />
                  <Text style={styles.deliveryLabel}>Distance</Text>
                  <Text style={styles.deliveryValue}>
                    {pendingOrderRequest.estimatedDistance} km
                  </Text>
                </View>
              </View>

              <View style={styles.earningsContainer}>
                <Text style={styles.earningsLabel}>Estimated Earnings</Text>
                <Text style={styles.earningsValue}>
                  ₹{pendingOrderRequest.estimatedEarnings}
                </Text>
              </View>
            </View>
          </Card>

          <View style={styles.orderRequestButtons}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => setShowRejectModal(true)}
            >
              <Ionicons name="close" size={24} color={COLORS.error} />
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={acceptOrder}
            >
              <Ionicons name="checkmark" size={24} color={COLORS.white} />
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>

          {/* Reject Reason Modal */}
          <Modal
            visible={showRejectModal}
            transparent
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Rejection Reason</Text>
                {REJECTION_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason.value}
                    style={styles.reasonOption}
                    onPress={() => handleReject(reason.value)}
                  >
                    <Text style={styles.reasonText}>{reason.label}</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowRejectModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    );
  }

  // Render active delivery flow
  if (currentOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.activeHeader}>
            <Text style={styles.activeTitle}>Active Delivery</Text>
            <View style={styles.orderIdBadge}>
              <Text style={styles.orderIdText}>{currentOrder.id}</Text>
            </View>
          </View>

          {/* Progress Tracker */}
          <Card style={styles.progressCard}>
            <View style={styles.progressContainer}>
              {[
                { status: 'accepted', label: 'Accepted' },
                { status: 'reached_restaurant', label: 'At Restaurant' },
                { status: 'picked_up', label: 'Picked Up' },
                { status: 'delivered', label: 'Delivered' },
              ].map((step, index) => {
                const isActive = currentOrder.status === step.status ||
                  (step.status === 'accepted' && ['accepted', 'reached_restaurant', 'picked_up', 'reached_customer'].includes(currentOrder.status)) ||
                  (step.status === 'reached_restaurant' && ['reached_restaurant', 'picked_up', 'reached_customer'].includes(currentOrder.status)) ||
                  (step.status === 'picked_up' && ['picked_up', 'reached_customer'].includes(currentOrder.status));
                
                return (
                  <View key={step.status} style={styles.progressStep}>
                    <View style={[
                      styles.progressDot,
                      isActive && styles.progressDotActive,
                    ]}>
                      {isActive && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
                    </View>
                    <Text style={[
                      styles.progressLabel,
                      isActive && styles.progressLabelActive,
                    ]}>{step.label}</Text>
                    {index < 3 && <View style={[
                      styles.progressLine,
                      isActive && styles.progressLineActive,
                    ]} />}
                  </View>
                );
              })}
            </View>
          </Card>

          {/* Step-specific Content */}
          {currentOrder.status === 'accepted' && (
            <Card style={styles.stepCard}>
              <Text style={styles.stepTitle}>Navigate to Restaurant</Text>
              <View style={styles.locationInfo}>
                <Ionicons name="restaurant" size={24} color={COLORS.primary} />
                <View style={styles.locationDetails}>
                  <Text style={styles.locationName}>{currentOrder.restaurantName}</Text>
                  <Text style={styles.locationAddress}>{currentOrder.pickupAddress}</Text>
                </View>
              </View>
              <Button
                title="Navigate to Restaurant"
                onPress={() => handleNavigate(currentOrder.pickupAddress)}
                style={styles.navButton}
              />
              <Button
                title="I've Reached Restaurant"
                onPress={() => updateOrderStatus('reached_restaurant')}
                variant="outline"
                style={styles.actionButton}
              />
            </Card>
          )}

          {currentOrder.status === 'reached_restaurant' && (
            <Card style={styles.stepCard}>
              <Text style={styles.stepTitle}>Pickup Confirmation</Text>
              <View style={styles.pickupInfo}>
                <View style={styles.pickupRow}>
                  <Text style={styles.pickupLabel}>Order ID</Text>
                  <Text style={styles.pickupValue}>{currentOrder.id}</Text>
                </View>
                <View style={styles.pickupRow}>
                  <Text style={styles.pickupLabel}>Items</Text>
                  <Text style={styles.pickupValue}>{currentOrder.itemCount} items</Text>
                </View>
              </View>
              <Button
                title="Mark Order as Picked Up"
                onPress={() => updateOrderStatus('picked_up')}
              />
            </Card>
          )}

          {(currentOrder.status === 'picked_up' || currentOrder.status === 'reached_customer') && (
            <Card style={styles.stepCard}>
              <Text style={styles.stepTitle}>
                {currentOrder.status === 'picked_up' ? 'Navigate to Customer' : 'Complete Delivery'}
              </Text>
              <View style={styles.locationInfo}>
                <Ionicons name="person" size={24} color={COLORS.success} />
                <View style={styles.locationDetails}>
                  <Text style={styles.locationName}>{currentOrder.customerName}</Text>
                  <Text style={styles.locationAddress}>{currentOrder.dropAddress}</Text>
                </View>
              </View>
              
              {currentOrder.status === 'picked_up' && (
                <>
                  <Button
                    title="Navigate to Customer"
                    onPress={() => handleNavigate(currentOrder.dropAddress)}
                    style={styles.navButton}
                  />
                  <Button
                    title="I've Reached Customer"
                    onPress={() => updateOrderStatus('reached_customer')}
                    variant="outline"
                    style={styles.actionButton}
                  />
                </>
              )}

              {currentOrder.status === 'reached_customer' && (
                <View style={styles.pinSection}>
                  <Text style={styles.pinLabel}>Enter Customer's Delivery PIN</Text>
                  <View style={styles.pinInputContainer}>
                    {[0, 1, 2, 3].map((index) => (
                      <View key={index} style={styles.pinBox}>
                        <Text style={styles.pinDigit}>
                          {deliveryPin[index] || ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.pinKeypad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.pinKey,
                          num === '' && styles.pinKeyEmpty,
                        ]}
                        onPress={() => {
                          if (num === 'del') {
                            setDeliveryPin(deliveryPin.slice(0, -1));
                          } else if (num !== '' && deliveryPin.length < 4) {
                            setDeliveryPin(deliveryPin + num);
                          }
                          setPinError('');
                        }}
                        disabled={num === ''}
                      >
                        {num === 'del' ? (
                          <Ionicons name="backspace" size={24} color={COLORS.textPrimary} />
                        ) : (
                          <Text style={styles.pinKeyText}>{num}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  {pinError ? <Text style={styles.pinError}>{pinError}</Text> : null}
                  <Button
                    title="Confirm & Complete Delivery"
                    onPress={handlePinSubmit}
                    disabled={deliveryPin.length !== 4}
                  />
                </View>
              )}
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Normal home screen
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {partner?.fullName?.split(' ')[0] || 'Partner'}!</Text>
            <Text style={styles.subGreeting}>{partner?.baseLocation}</Text>
          </View>
          <StatusBadge status={partner?.isBlocked ? 'blocked' : partner?.isOnline ? 'online' : 'offline'} />
        </View>

        {/* Warnings */}
        {lowBattery && (
          <View style={styles.warningBanner}>
            <Ionicons name="battery-dead" size={20} color={COLORS.warning} />
            <Text style={styles.warningText}>Low battery! Charge your device soon.</Text>
          </View>
        )}

        {poorNetwork && (
          <View style={styles.warningBanner}>
            <Ionicons name="wifi" size={20} color={COLORS.error} />
            <Text style={styles.warningText}>Poor network connection detected.</Text>
          </View>
        )}

        {/* Block Notice */}
        {partner?.isBlocked && (
          <View style={styles.blockNotice}>
            <Ionicons name="alert-circle" size={24} color={COLORS.error} />
            <View style={styles.blockNoticeContent}>
              <Text style={styles.blockNoticeTitle}>Temporarily Paused</Text>
              <Text style={styles.blockNoticeText}>
                You are temporarily paused due to frequent order rejections. Please try again later.
              </Text>
            </View>
          </View>
        )}

        {/* Go Online/Offline Toggle */}
        <Card style={styles.toggleCard} variant="elevated">
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>
                {partner?.isOnline ? 'You are Online' : 'You are Offline'}
              </Text>
              <Text style={styles.toggleHint}>
                {partner?.isOnline
                  ? 'Ready to receive delivery requests'
                  : 'Go online to start receiving orders'}
              </Text>
            </View>
            <Switch
              value={partner?.isOnline || false}
              onValueChange={handleToggleOnline}
              trackColor={{ false: COLORS.border, true: COLORS.success + '50' }}
              thumbColor={partner?.isOnline ? COLORS.success : COLORS.textSecondary}
              disabled={partner?.isBlocked || !partner?.isVerified}
            />
          </View>
        </Card>

        {/* Today's Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Today's Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="bicycle" size={28} color={COLORS.primary} />
              <Text style={styles.statValue}>{earnings.todayDeliveries}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="wallet" size={28} color={COLORS.success} />
              <Text style={styles.statValue}>₹{earnings.today}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>
        </Card>

        {/* Service Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>Base: {partner?.baseLocation}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="resize" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>Service Radius: {partner?.serviceRadius} km</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="car" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>
              Vehicle: {partner?.vehicleType?.toUpperCase()} - {partner?.vehicleNumber}
            </Text>
          </View>
        </Card>

        {/* Waiting Message when Online */}
        {partner?.isOnline && !partner?.isBlocked && (
          <View style={styles.waitingContainer}>
            <Ionicons name="notifications" size={40} color={COLORS.primary} />
            <Text style={styles.waitingText}>Waiting for new orders...</Text>
            <Text style={styles.waitingHint}>
              You'll receive a notification when a new delivery request arrives.
            </Text>
          </View>
        )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subGreeting: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  warningText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  blockNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.error + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  blockNoticeContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  blockNoticeTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.error,
  },
  blockNoticeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  toggleCard: {
    marginBottom: SPACING.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  toggleHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsCard: {
    marginBottom: SPACING.md,
  },
  statsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.border,
  },
  infoCard: {
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  waitingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  waitingText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  waitingHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.lg,
  },
  // Order Request Styles
  orderRequestOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
    zIndex: 100,
  },
  orderRequestContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  orderRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  orderRequestTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white + '20',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  countdownText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.xs,
  },
  orderRequestCard: {
    flex: 1,
  },
  orderRequestInfo: {
    flex: 1,
  },
  orderIdBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '15',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  orderIdText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  restaurantName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  areaText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  deliveryRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  deliveryItem: {
    flex: 1,
    alignItems: 'center',
  },
  deliveryLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  deliveryValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  earningsContainer: {
    backgroundColor: COLORS.success + '15',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.success,
  },
  earningsValue: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.success,
    marginTop: SPACING.xs,
  },
  orderRequestButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  rejectButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: SPACING.sm,
  },
  acceptButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  acceptButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  reasonOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  reasonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
  },
  cancelButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  // Active Delivery Styles
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  activeTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  progressCard: {
    marginBottom: SPACING.md,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: COLORS.success,
  },
  progressLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  progressLabelActive: {
    color: COLORS.success,
    fontWeight: '600',
  },
  progressLine: {
    position: 'absolute',
    top: 14,
    left: '75%',
    width: '50%',
    height: 2,
    backgroundColor: COLORS.border,
  },
  progressLineActive: {
    backgroundColor: COLORS.success,
  },
  stepCard: {
    marginBottom: SPACING.md,
  },
  stepTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  locationDetails: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  locationName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  locationAddress: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  navButton: {
    marginBottom: SPACING.sm,
  },
  actionButton: {
    marginTop: SPACING.sm,
  },
  pickupInfo: {
    backgroundColor: COLORS.surfaceSecondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  pickupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  pickupLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  pickupValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  pinSection: {
    marginTop: SPACING.md,
  },
  pinLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  pinInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  pinBox: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceSecondary,
  },
  pinDigit: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  pinKeypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  pinKey: {
    width: '30%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1.5%',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
  },
  pinKeyEmpty: {
    backgroundColor: 'transparent',
  },
  pinKeyText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  pinError: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});
