// Zustand store for app state management
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeliveryPartner, Order, Earnings, DeliveryHistory, RejectionReason } from '../types';
import { MOCK_DELIVERY_HISTORY, generateRandomOrder } from '../constants/mockData';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Delivery Partner
  partner: DeliveryPartner | null;
  
  // Orders
  currentOrder: Order | null;
  pendingOrderRequest: Order | null;
  
  // Earnings
  earnings: Earnings;
  
  // History
  deliveryHistory: DeliveryHistory[];
  
  // Notifications
  notifications: { id: string; message: string; type: 'info' | 'warning' | 'success' | 'error'; timestamp: number }[];
  
  // Safety
  lowBattery: boolean;
  poorNetwork: boolean;
  idleTime: number;
  
  // Actions
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loadPersistedState: () => Promise<void>;
  
  // Onboarding
  updatePartnerDetails: (details: Partial<DeliveryPartner>) => void;
  completeOnboarding: () => void;
  approveVerification: () => void;
  
  // Online status
  toggleOnline: () => { success: boolean; error?: string };
  
  // Order management
  generateNewOrderRequest: () => void;
  acceptOrder: () => void;
  rejectOrder: (reason: RejectionReason) => void;
  clearOrderRequest: () => void;
  updateOrderStatus: (status: Order['status']) => void;
  completeDelivery: (pin: string) => { success: boolean; error?: string };
  
  // Notifications
  addNotification: (message: string, type: 'info' | 'warning' | 'success' | 'error') => void;
  clearNotification: (id: string) => void;
  
  // Safety
  setLowBattery: (value: boolean) => void;
  setPoorNetwork: (value: boolean) => void;
  resetIdleTime: () => void;
  incrementIdleTime: () => void;
  checkBlockStatus: () => void;
}

const REJECTION_THRESHOLD = 3;
const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes for demo

const initialPartner: DeliveryPartner = {
  id: 'DP001',
  fullName: '',
  mobile: '',
  profilePhoto: null,
  vehicleType: 'bike',
  vehicleNumber: '',
  drivingLicense: null,
  identityProof: null,
  bankDetails: {
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  },
  isOnboarded: false,
  isVerified: false,
  isOnline: false,
  baseLocation: 'Koramangala, Bangalore',
  serviceRadius: 30,
  rejectionCount: 0,
  isBlocked: false,
  blockEndTime: null,
};

const initialEarnings: Earnings = {
  today: 485,
  todayDeliveries: 6,
  thisWeek: 3250,
  weeklyDeliveries: 42,
  thisMonth: 12800,
  monthlyDeliveries: 165,
};

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  partner: null,
  currentOrder: null,
  pendingOrderRequest: null,
  earnings: initialEarnings,
  deliveryHistory: MOCK_DELIVERY_HISTORY,
  notifications: [],
  lowBattery: false,
  poorNetwork: false,
  idleTime: 0,
  
  login: async (username: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (username === 'delivery123' && password === 'delivery123') {
      const savedPartner = await AsyncStorage.getItem('partner');
      const partner = savedPartner ? JSON.parse(savedPartner) : initialPartner;
      
      set({ isAuthenticated: true, partner });
      await AsyncStorage.setItem('isAuthenticated', 'true');
      return { success: true };
    }
    
    return { success: false, error: 'Invalid username or password' };
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('isAuthenticated');
    set({ 
      isAuthenticated: false, 
      partner: null, 
      currentOrder: null, 
      pendingOrderRequest: null,
    });
  },
  
  loadPersistedState: async () => {
    try {
      const isAuth = await AsyncStorage.getItem('isAuthenticated');
      const savedPartner = await AsyncStorage.getItem('partner');
      
      if (isAuth === 'true' && savedPartner) {
        const partner = JSON.parse(savedPartner);
        set({ 
          isAuthenticated: true, 
          partner,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  updatePartnerDetails: (details: Partial<DeliveryPartner>) => {
    const { partner } = get();
    if (partner) {
      const updatedPartner = { ...partner, ...details };
      set({ partner: updatedPartner });
      AsyncStorage.setItem('partner', JSON.stringify(updatedPartner));
    }
  },
  
  completeOnboarding: () => {
    const { partner, addNotification } = get();
    if (partner) {
      const updatedPartner = { ...partner, isOnboarded: true };
      set({ partner: updatedPartner });
      AsyncStorage.setItem('partner', JSON.stringify(updatedPartner));
      addNotification('Onboarding completed! Awaiting verification...', 'info');
    }
  },
  
  approveVerification: () => {
    const { partner, addNotification } = get();
    if (partner) {
      const updatedPartner = { ...partner, isVerified: true };
      set({ partner: updatedPartner });
      AsyncStorage.setItem('partner', JSON.stringify(updatedPartner));
      addNotification('Your account has been verified! You can now go online.', 'success');
    }
  },
  
  toggleOnline: () => {
    const { partner, currentOrder, addNotification, lowBattery, poorNetwork, checkBlockStatus } = get();
    
    if (!partner) return { success: false, error: 'Not logged in' };
    
    // Check block status first
    checkBlockStatus();
    
    if (partner.isBlocked) {
      return { success: false, error: 'You are temporarily blocked due to frequent rejections' };
    }
    
    if (!partner.isVerified) {
      return { success: false, error: 'Account not verified yet' };
    }
    
    if (partner.isOnline && currentOrder) {
      return { success: false, error: 'Cannot go offline during active delivery' };
    }
    
    if (!partner.isOnline && lowBattery) {
      addNotification('Warning: Low battery detected. Charge your device soon.', 'warning');
    }
    
    if (!partner.isOnline && poorNetwork) {
      addNotification('Warning: Poor network connection detected.', 'warning');
    }
    
    const updatedPartner = { ...partner, isOnline: !partner.isOnline };
    set({ partner: updatedPartner });
    AsyncStorage.setItem('partner', JSON.stringify(updatedPartner));
    
    addNotification(
      updatedPartner.isOnline ? 'You are now online and ready to receive orders!' : 'You are now offline.',
      'info'
    );
    
    return { success: true };
  },
  
  generateNewOrderRequest: () => {
    const { partner, currentOrder, pendingOrderRequest } = get();
    
    if (!partner?.isOnline || currentOrder || pendingOrderRequest || partner.isBlocked) {
      return;
    }
    
    const newOrder = generateRandomOrder();
    set({ pendingOrderRequest: newOrder });
    get().addNotification(`New order request from ${newOrder.restaurantName}!`, 'info');
  },
  
  acceptOrder: () => {
    const { pendingOrderRequest, addNotification, partner } = get();
    
    if (!pendingOrderRequest) return;
    
    const acceptedOrder = { ...pendingOrderRequest, status: 'accepted' as const };
    set({ 
      currentOrder: acceptedOrder, 
      pendingOrderRequest: null,
    });
    
    // Reset rejection count on successful accept
    if (partner) {
      const updatedPartner = { ...partner, rejectionCount: 0 };
      set({ partner: updatedPartner });
      AsyncStorage.setItem('partner', JSON.stringify(updatedPartner));
    }
    
    addNotification('Order accepted! Navigate to the restaurant.', 'success');
  },
  
  rejectOrder: (reason: RejectionReason) => {
    const { pendingOrderRequest, partner, addNotification } = get();
    
    if (!pendingOrderRequest || !partner) return;
    
    const newRejectionCount = partner.rejectionCount + 1;
    let isBlocked = false;
    let blockEndTime = null;
    
    if (newRejectionCount >= REJECTION_THRESHOLD) {
      isBlocked = true;
      blockEndTime = Date.now() + BLOCK_DURATION;
      addNotification('You are temporarily paused due to frequent order rejections. Please try again later.', 'warning');
    }
    
    const updatedPartner = { 
      ...partner, 
      rejectionCount: newRejectionCount,
      isBlocked,
      blockEndTime,
      isOnline: isBlocked ? false : partner.isOnline,
    };
    
    set({ 
      pendingOrderRequest: null, 
      partner: updatedPartner,
    });
    AsyncStorage.setItem('partner', JSON.stringify(updatedPartner));
    
    if (!isBlocked) {
      addNotification(`Order rejected: ${reason}`, 'info');
    }
  },
  
  clearOrderRequest: () => {
    const { partner, addNotification } = get();
    set({ pendingOrderRequest: null });
    
    // Auto-reject counts as rejection
    if (partner) {
      const newRejectionCount = partner.rejectionCount + 1;
      let isBlocked = false;
      let blockEndTime = null;
      
      if (newRejectionCount >= REJECTION_THRESHOLD) {
        isBlocked = true;
        blockEndTime = Date.now() + BLOCK_DURATION;
        addNotification('You are temporarily paused due to frequent order rejections.', 'warning');
      }
      
      const updatedPartner = { 
        ...partner, 
        rejectionCount: newRejectionCount,
        isBlocked,
        blockEndTime,
        isOnline: isBlocked ? false : partner.isOnline,
      };
      
      set({ partner: updatedPartner });
      AsyncStorage.setItem('partner', JSON.stringify(updatedPartner));
    }
    
    addNotification('Order request expired', 'info');
  },
  
  updateOrderStatus: (status: Order['status']) => {
    const { currentOrder, addNotification } = get();
    
    if (!currentOrder) return;
    
    const updatedOrder = { ...currentOrder, status };
    set({ currentOrder: updatedOrder });
    
    const statusMessages: Record<string, string> = {
      'reached_restaurant': 'Marked as reached restaurant',
      'picked_up': 'Order picked up! Navigate to customer.',
      'reached_customer': 'Reached customer location',
    };
    
    if (statusMessages[status]) {
      addNotification(statusMessages[status], 'info');
    }
  },
  
  completeDelivery: (pin: string) => {
    const { currentOrder, partner, earnings, deliveryHistory, addNotification } = get();
    
    if (!currentOrder || !partner) {
      return { success: false, error: 'No active order' };
    }
    
    if (pin !== currentOrder.deliveryPin) {
      return { success: false, error: 'Invalid PIN. Please check with customer.' };
    }
    
    // Add to history
    const historyEntry: DeliveryHistory = {
      id: String(deliveryHistory.length + 1),
      orderId: currentOrder.id,
      date: new Date().toISOString().split('T')[0],
      restaurantName: currentOrder.restaurantName,
      dropArea: currentOrder.dropArea,
      status: 'delivered',
      earnings: currentOrder.estimatedEarnings,
    };
    
    // Update earnings
    const updatedEarnings: Earnings = {
      ...earnings,
      today: earnings.today + currentOrder.estimatedEarnings,
      todayDeliveries: earnings.todayDeliveries + 1,
      thisWeek: earnings.thisWeek + currentOrder.estimatedEarnings,
      weeklyDeliveries: earnings.weeklyDeliveries + 1,
      thisMonth: earnings.thisMonth + currentOrder.estimatedEarnings,
      monthlyDeliveries: earnings.monthlyDeliveries + 1,
    };
    
    set({ 
      currentOrder: null,
      deliveryHistory: [historyEntry, ...deliveryHistory],
      earnings: updatedEarnings,
    });
    
    addNotification(`Delivery completed! Earned ₹${currentOrder.estimatedEarnings}`, 'success');
    
    return { success: true };
  },
  
  addNotification: (message: string, type: 'info' | 'warning' | 'success' | 'error') => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
    };
    
    set(state => ({
      notifications: [notification, ...state.notifications].slice(0, 10),
    }));
  },
  
  clearNotification: (id: string) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
  
  setLowBattery: (value: boolean) => set({ lowBattery: value }),
  setPoorNetwork: (value: boolean) => set({ poorNetwork: value }),
  
  resetIdleTime: () => set({ idleTime: 0 }),
  
  incrementIdleTime: () => {
    const { idleTime, partner, addNotification } = get();
    const newIdleTime = idleTime + 1;
    
    // Warn after 5 minutes of idle (for demo, using shorter time)
    if (partner?.isOnline && newIdleTime === 5) {
      addNotification('You have been idle for a while. Stay active to receive orders!', 'warning');
    }
    
    set({ idleTime: newIdleTime });
  },
  
  checkBlockStatus: () => {
    const { partner } = get();
    
    if (partner?.isBlocked && partner.blockEndTime) {
      if (Date.now() > partner.blockEndTime) {
        const updatedPartner = { 
          ...partner, 
          isBlocked: false, 
          blockEndTime: null,
          rejectionCount: 0,
        };
        set({ partner: updatedPartner });
        AsyncStorage.setItem('partner', JSON.stringify(updatedPartner));
        get().addNotification('Your temporary block has been lifted. You can now go online.', 'success');
      }
    }
  },
}));
