import { Session, User } from "@supabase/supabase-js";

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
  logo_img: string;
  google_map_link: string;
  gallery: string[];
  reviews: Review[];
  phone: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  queueAction: (action: () => Promise<void>) => void | null;
  signUp: (email: string, password: string, fullName: string, isShopOwner: boolean) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  handleAuthSuccess: () => void;  
}

export type RootStackParamList = {
  Home: undefined;
  Shop: { shop: Shop };
  Auth: AuthContextType
};