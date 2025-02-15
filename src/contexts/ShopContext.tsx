import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Shop } from '../types';
import { createShop, getMyShops, updateShop } from '../services/shops';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import AppError from '../utils/errorHandler';

type ShopContextType = {
  myShops: Shop[];
  shopLoading: Boolean;
  fetchMyShops: () => Promise<void>;
  createMyShop: (shopData: Partial<Shop>) => Promise<void>;
  updateMyShop: (shopId: string, updates: Partial<Shop>) => Promise<void>
}

const ShopContext = createContext<ShopContextType>({} as ShopContextType);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [myShops, setMyShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(user) {
      fetchMyShops()
    } else {
      setMyShops([])
    }
  }, [user])

  const fetchMyShops = async () => {
    try {
      if(!user) return
      setLoading(true);
      const shops = await getMyShops(user?.id);
      setMyShops(shops);
    } catch (error) {
      console.error('Error in fetching shops', error);
    } finally {
      setLoading(false);
    }
  };

  const createMyShop = async (shopData: Partial<Shop>) => {
    try {
      if(!user) throw new AppError('VALIDATION', 'Authentication required!')
      setLoading(true);
      const shop = await createShop(shopData);
      setMyShops([shop, ...myShops]);
      Alert.alert('Shop created successfully');
    } catch (error) {
      Alert.alert('Error while creating shop');
    } finally {
      setLoading(false);
    }
  };

  const updateMyShop = async (shopId: string, updates: Partial<Shop>) => {
    try {
      if(!user) throw new AppError('VALIDATION', 'Authentication required!')
      setLoading(true);
      const shop = await updateShop(shopId, updates);
      const updatedShops = myShops.map(s => s.id === shopId ? shop : s);
      setMyShops(updatedShops);
      Alert.alert('Shop updated successfully');
    } catch (error) {
      Alert.alert('Error while updating shop');
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    myShops,
    shopLoading: loading,
    createMyShop,
    updateMyShop,
    fetchMyShops
  }), [myShops, loading]);

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext); 