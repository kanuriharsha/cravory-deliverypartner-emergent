// Mock data for demo purposes
import { DeliveryHistory, Order } from '../types';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD001',
    restaurantName: 'Burger King',
    pickupAddress: '123 Food Court, Mall Road',
    pickupArea: 'Koramangala',
    customerName: 'Rahul Sharma',
    dropAddress: '456 Park Street, Apartment 12B',
    dropArea: 'Indiranagar',
    itemCount: 3,
    estimatedEarnings: 85,
    estimatedDistance: 4.2,
    deliveryPin: '1234',
    status: 'pending',
    createdAt: Date.now(),
  },
  {
    id: 'ORD002',
    restaurantName: 'Pizza Hut',
    pickupAddress: '789 Main Street',
    pickupArea: 'HSR Layout',
    customerName: 'Priya Singh',
    dropAddress: '321 Lake View, Floor 3',
    dropArea: 'Bellandur',
    itemCount: 2,
    estimatedEarnings: 72,
    estimatedDistance: 3.5,
    deliveryPin: '5678',
    status: 'pending',
    createdAt: Date.now(),
  },
  {
    id: 'ORD003',
    restaurantName: 'Dominos',
    pickupAddress: '555 Food Plaza',
    pickupArea: 'Marathahalli',
    customerName: 'Amit Kumar',
    dropAddress: '888 Garden View',
    dropArea: 'Whitefield',
    itemCount: 4,
    estimatedEarnings: 95,
    estimatedDistance: 5.8,
    deliveryPin: '9012',
    status: 'pending',
    createdAt: Date.now(),
  },
];

export const MOCK_DELIVERY_HISTORY: DeliveryHistory[] = [
  {
    id: '1',
    orderId: 'ORD100',
    date: '2025-07-13',
    restaurantName: 'McDonald\'s',
    dropArea: 'Koramangala',
    status: 'delivered',
    earnings: 65,
  },
  {
    id: '2',
    orderId: 'ORD099',
    date: '2025-07-13',
    restaurantName: 'Subway',
    dropArea: 'Indiranagar',
    status: 'delivered',
    earnings: 78,
  },
  {
    id: '3',
    orderId: 'ORD098',
    date: '2025-07-12',
    restaurantName: 'KFC',
    dropArea: 'HSR Layout',
    status: 'delivered',
    earnings: 82,
  },
  {
    id: '4',
    orderId: 'ORD097',
    date: '2025-07-12',
    restaurantName: 'Starbucks',
    dropArea: 'Bellandur',
    status: 'cancelled',
    earnings: 0,
  },
  {
    id: '5',
    orderId: 'ORD096',
    date: '2025-07-11',
    restaurantName: 'Taco Bell',
    dropArea: 'Whitefield',
    status: 'delivered',
    earnings: 90,
  },
  {
    id: '6',
    orderId: 'ORD095',
    date: '2025-07-11',
    restaurantName: 'Cafe Coffee Day',
    dropArea: 'MG Road',
    status: 'delivered',
    earnings: 55,
  },
  {
    id: '7',
    orderId: 'ORD094',
    date: '2025-07-10',
    restaurantName: 'Biryani Blues',
    dropArea: 'JP Nagar',
    status: 'delivered',
    earnings: 105,
  },
];

export const generateRandomOrder = (): Order => {
  const restaurants = ['Burger King', 'Pizza Hut', 'Dominos', 'KFC', 'McDonald\'s', 'Subway', 'Taco Bell', 'Biryani Blues'];
  const areas = ['Koramangala', 'Indiranagar', 'HSR Layout', 'Bellandur', 'Whitefield', 'Marathahalli', 'JP Nagar', 'MG Road'];
  const names = ['Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Neha Gupta', 'Vikram Patel', 'Anjali Verma'];
  
  const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randomPin = () => Math.floor(1000 + Math.random() * 9000).toString();
  
  return {
    id: `ORD${Math.floor(100 + Math.random() * 900)}`,
    restaurantName: randomFrom(restaurants),
    pickupAddress: `${Math.floor(100 + Math.random() * 900)} ${randomFrom(['Main St', 'Food Court', 'Mall Road', 'Plaza'])}`,
    pickupArea: randomFrom(areas),
    customerName: randomFrom(names),
    dropAddress: `${Math.floor(100 + Math.random() * 900)} ${randomFrom(['Park Street', 'Garden View', 'Lake View', 'Apartment'])}`,
    dropArea: randomFrom(areas),
    itemCount: Math.floor(1 + Math.random() * 5),
    estimatedEarnings: Math.floor(50 + Math.random() * 80),
    estimatedDistance: Math.round((2 + Math.random() * 8) * 10) / 10,
    deliveryPin: randomPin(),
    status: 'pending',
    createdAt: Date.now(),
  };
};
