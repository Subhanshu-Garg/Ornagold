import React from 'react';
import { Shop } from '../types';
import SectionHeader from './SectionHeader';
import ShopList from './ShopList';

type ShopListContainerProps = {
  title: string;
  shops: Shop[];
  filter?: (shop: Shop) => boolean;
  onShopPress: (shop: Shop) => void;
  location?: Location.LocationObject | null;
  showDistance?: boolean;
};


const ShopListContainer = ({ 
  title, 
  shops, 
  filter, 
  onShopPress, 
  location,
  showDistance = true
}: ShopListContainerProps) => {
  const filteredShops = filter ? shops.filter(filter) : shops;
  
  return (
    <>
      <SectionHeader title={title} />
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