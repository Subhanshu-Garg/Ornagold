import React from 'react';
import { Shop } from '../types';
import SectionHeader from './SectionHeader';
import ShopList from './ShopList';
import * as Location from 'expo-location';

type ShopListContainerProps = {
  title: string;
  shops: Shop[];
  filter?: (shop: Shop) => boolean;
  onShopPress: (shop: Shop) => void;
  location?: Location.LocationObject | null;
  showDistance?: boolean;
  horizontal?: boolean;
  onViewAll?: () => void;
};


const ShopListContainer = ({ 
  title, 
  shops, 
  filter, 
  onShopPress, 
  location,
  showDistance = true,
  horizontal = true,
  onViewAll
}: ShopListContainerProps) => {
  const filteredShops = filter ? shops.filter(filter) : shops;
  
  return (
    <>
      <SectionHeader 
        title={title}
        onViewAll={onViewAll}
      />
      <ShopList
        shops={filteredShops.slice(0, 4)}
        onShopPress={onShopPress}
        horizontal
        showDistance
        location={location}
      />
    </>
  );
}; 


export default ShopListContainer