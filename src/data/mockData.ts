import { Shop } from '../types';

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Malabar Gold & Diamonds',
    locality: 'Zaveri Bazaar, Mumbai',
    makingCharges: 12, // Percentage
    goldRate: 5500, // ₹ per gram
    latitude: 18.9517,
    longitude: 72.8332,
    address: 'Shop No. 5, Zaveri Bazaar, Bhuleshwar, Mumbai 400002',
    gallery: [
      'https://example.com/malabar1.jpg',
      'https://example.com/malabar2.jpg',
    ],
    reviews: [
      {
        id: '1',
        userName: 'Rahul Sharma',
        rating: 4.8,
        comment: 'Best rates for gold jewellery with BIS certification',
        date: '15-01-2024'
      },
      {
        id: '2',
        userName: 'Priya Patel',
        rating: 4.5,
        comment: 'Good collection of traditional designs',
        date: '14-01-2024'
      }
    ]
  },
  {
    id: '2',
    name: 'Tanishq Showroom',
    locality: 'Connaught Place, Delhi',
    makingCharges: 15, // Percentage
    goldRate: 5650, // ₹ per gram
    latitude: 28.6315,
    longitude: 77.2167,
    address: 'Block C, Inner Circle, Connaught Place, New Delhi 110001',
    gallery: [
      'https://example.com/tanishq1.jpg',
      'https://example.com/tanishq2.jpg',
    ],
    reviews: [
      {
        id: '1',
        userName: 'Anjali Mehta',
        rating: 4.7,
        comment: 'Trusted brand with excellent customer service',
        date: '16-01-2024'
      }
    ]
  },
  {
    id: '3',
    name: 'GRT Jewellers',
    locality: 'T. Nagar, Chennai',
    makingCharges: 300, // Flat making charge per gram
    goldRate: 5450, // ₹ per gram
    latitude: 13.0391,
    longitude: 80.2359,
    address: '111 Usman Road, T. Nagar, Chennai 600017',
    gallery: [
      'https://example.com/grt1.jpg',
      'https://example.com/grt2.jpg',
    ],
    reviews: [
      {
        id: '1',
        userName: 'Vijay Kumar',
        rating: 4.6,
        comment: 'Good collection of temple jewellery',
        date: '12-01-2024'
      }
    ]
  }
];