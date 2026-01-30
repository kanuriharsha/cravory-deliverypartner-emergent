// Types for Cravory Delivery Partner App

export interface DeliveryPartner {
  id: string;
  fullName: string;
  mobile: string;
  profilePhoto: string | null;
  vehicleType: 'bike' | 'bicycle' | 'scooter';
  vehicleNumber: string;
  drivingLicense: string | null;
  identityProof: string | null;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  isOnboarded: boolean;
  isVerified: boolean;
  isOnline: boolean;
  baseLocation: string;
  serviceRadius: number; // in km
  rejectionCount: number;
  isBlocked: boolean;
  blockEndTime: number | null;
}

export interface Order {
  id: string;
  restaurantName: string;
  pickupAddress: string;
  pickupArea: string;
  customerName: string;
  dropAddress: string;
  dropArea: string;
  itemCount: number;
  estimatedEarnings: number;
  estimatedDistance: number;
  deliveryPin: string;
  status: 'pending' | 'accepted' | 'reached_restaurant' | 'picked_up' | 'reached_customer' | 'delivered' | 'cancelled';
  createdAt: number;
  completedAt?: number;
}

export interface Earnings {
  today: number;
  todayDeliveries: number;
  thisWeek: number;
  weeklyDeliveries: number;
  thisMonth: number;
  monthlyDeliveries: number;
}

export interface DeliveryHistory {
  id: string;
  orderId: string;
  date: string;
  restaurantName: string;
  dropArea: string;
  status: 'delivered' | 'cancelled';
  earnings: number;
}

export type RejectionReason = 
  | 'too_far'
  | 'vehicle_issue'
  | 'personal_emergency'
  | 'already_busy'
  | 'other';

export const REJECTION_REASONS: { value: RejectionReason; label: string }[] = [
  { value: 'too_far', label: 'Too far away' },
  { value: 'vehicle_issue', label: 'Vehicle issue' },
  { value: 'personal_emergency', label: 'Personal emergency' },
  { value: 'already_busy', label: 'Already busy' },
  { value: 'other', label: 'Other reason' },
];
