import { AuthError, Session, User } from "@supabase/supabase-js";

export interface Shop {
  id: string;
  name: string;
  locality: string;
  phone: string;
  makingCharges: string;
  goldRate: string;
  latitude: number;
  longitude: number;
  address: string;
  logoImage: string;
  gallery: string[];
}

export const shopView = `id, name, locality, phone, makingCharges, goldRate, latitude, longitude, address, logoImage, gallery`
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

export interface UpdateProfileParams {
  name: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (params: SignInParams) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (params: UpdateProfileParams) => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  authError: AuthError | null;
  myShops: Shop[];
  fetchMyShops: () => Promise<void>;
  createMyShop: (shopData: Partial<Shop>) => Promise<void>;
  updateMyShop: (shopId: string, updates: Partial<Shop>) => Promise<void>
}

export type RootStackParamList = {
  MainTabs: undefined;
  Shop: { shop: Shop, isMyShop?: Boolean };
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
    isMyShops?: Boolean;
  };
  FAQs: undefined;
  PrivacyPolicy: undefined;
  Settings: undefined;
  Inventory: undefined;
  CreateShop: { title: 'Create Shop' } | { title: 'Update Shop'; shop: Shop };
  ShopAnalytics: undefined;
};

export type TabStackParamList = {
  Home: undefined;
  Discover: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type Banner = {
  key?: number,
  bannerTitle: string,
  bannerText: string,
  ctaText: string,
  uri: string,
  color: string
}