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
    phone: '7011564838',
    address: 'Shop No. 5, Zaveri Bazaar, Bhuleshwar, Mumbai 400002',
    google_map_link: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7471839.584548672!2d69.96201888374144!3d23.876879201973956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce1873f5319b%3A0x91bea31735c8675f!2sAabhushan!5e0!3m2!1sen!2sin!4v1738431839850!5m2!1sen!2sin',
    logo_img: 'https://content.jdmagicbox.com/v2/comp/patiala/a5/9999px175.x175.240426030249.a4a5/catalogue/malabar-gold-and-diamonds-patiala-cantt-patiala-jewellery-dealers-malabar-gold-and-diamonds-pil2csv11r.jpg',
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
    phone: '7011564838',
    address: 'Block C, Inner Circle, Connaught Place, New Delhi 110001',
    gallery: [
      'https://example.com/tanishq1.jpg',
      'https://example.com/tanishq2.jpg',
    ],
    google_map_link: '',
    logo_img: 'https://stores.tanishq.co.in/static/media/logo.62aa0f563ea45ef794c7.png',
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
    phone: '7011564838',
    google_map_link: '',
    logo_img: 'https://yt3.googleusercontent.com/hq2Vk1_-sIWc44BDc1tgwz70qWXkyCil4ugfIk1T9wPwqfE4qBmFIPnBfm13TZ2M1IWq-ADz=s160-c-k-c0x00ffffff-no-rj',
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
  },
  {
    id: '4',
    name: 'Malabar Gold & Diamonds',
    locality: 'Zaveri Bazaar, Mumbai',
    makingCharges: 12, // Percentage
    goldRate: 5500, // ₹ per gram
    latitude: 18.9517,
    longitude: 72.8332,
    phone: '7011564838',
    address: 'Shop No. 5, Zaveri Bazaar, Bhuleshwar, Mumbai 400002',
    google_map_link: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7471839.584548672!2d69.96201888374144!3d23.876879201973956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce1873f5319b%3A0x91bea31735c8675f!2sAabhushan!5e0!3m2!1sen!2sin!4v1738431839850!5m2!1sen!2sin',
    logo_img: 'https://content.jdmagicbox.com/v2/comp/patiala/a5/9999px175.x175.240426030249.a4a5/catalogue/malabar-gold-and-diamonds-patiala-cantt-patiala-jewellery-dealers-malabar-gold-and-diamonds-pil2csv11r.jpg',
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
    id: '5',
    name: 'Tanishq Showroom',
    locality: 'Connaught Place, Delhi',
    makingCharges: 15, // Percentage
    goldRate: 5650, // ₹ per gram
    latitude: 28.6315,
    longitude: 77.2167,
    phone: '7011564838',
    address: 'Block C, Inner Circle, Connaught Place, New Delhi 110001',
    gallery: [
      'https://example.com/tanishq1.jpg',
      'https://example.com/tanishq2.jpg',
    ],
    google_map_link: '',
    logo_img: 'https://stores.tanishq.co.in/static/media/logo.62aa0f563ea45ef794c7.png',
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
    id: '6',
    name: 'GRT Jewellers',
    locality: 'T. Nagar, Chennai',
    makingCharges: 300, // Flat making charge per gram
    goldRate: 5450, // ₹ per gram
    latitude: 13.0391,
    longitude: 80.2359,
    address: '111 Usman Road, T. Nagar, Chennai 600017',
    phone: '7011564838',
    google_map_link: '',
    logo_img: 'https://yt3.googleusercontent.com/hq2Vk1_-sIWc44BDc1tgwz70qWXkyCil4ugfIk1T9wPwqfE4qBmFIPnBfm13TZ2M1IWq-ADz=s160-c-k-c0x00ffffff-no-rj',
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