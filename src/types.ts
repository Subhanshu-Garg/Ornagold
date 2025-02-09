import { AuthError, Session, User } from "@supabase/supabase-js";

export interface Shop {
  id: string;
  name: string;
  locality: string;
  phone: string;
  makingCharges: number;
  goldRate: number;
  latitude: number;
  longitude: number;
  address: string;
  logoImage: string;
  google_map_link: string;
  gallery: string[];
}

export interface Review {
  id: string;
  rating: number;
  shopId: string;
  userId: string;
  displayName: string;
  comment: string;
  createdAt: string;
}


export type SignInParams = 
  | { method: 'email'; email: string; password: string }
  | { method: 'google' }
  | {
    method: 'otp'; phone: string; code?: string 
};

export type SignUpParams =
  | { method: 'email'; email: string; password: string; displayName: string }
  | { method: 'phone'; phone: string; code?: string; password: string; displayName: string };

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (params: SignInParams) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signOut: () => Promise<void>;
  authError: AuthError | null;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Shop: { shop: Shop };
  Auth: undefined;
  Home: undefined;
  ShopList: {
    title: string;
    searchQuery?: string;
    filters?: {
      field: string;
      operator: string;
      value: any;
    }[];
    sort?: {
      field: string;
      order: 'asc' | 'des'
    };
  };
  FAQs: undefined;
  PrivacyPolicy: undefined;
  Settings: undefined;
  ShopProfile: undefined;
};

export type TabStackParamList = {
  Home: undefined;
  Discover: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type Banner = {
  bannerTitle: string,
  bannerText: string,
  ctaText: string,
  uri: string,
  color: string
}