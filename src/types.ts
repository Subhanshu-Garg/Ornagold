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
  | { method: 'phone'; phone: string; code?: string; displayName: string };

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (params: SignInParams) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signOut: () => Promise<void>;
  authError: AuthError | null;
}

export type RootStackParamList = {
  Home: undefined;
  Shop: { shop: Shop };
  Auth: undefined
};