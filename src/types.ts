export interface Shop {
  id: string;
  name: string;
  locality: string;
  makingCharges: number;
  goldRate: number;
  latitude: number;
  longitude: number;
  address: string;
  gallery: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export type RootStackParamList = {
  Home: undefined;
  Shop: { shop: Shop };
};