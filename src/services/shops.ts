import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase'; // Assuming you have supabase initialized
import { RootStackParamList, Shop } from '../types';
import { errorHandler } from '../utils/errorHandler';

export const getShops = async (
  searchQuery?: string,
  page = 1,
  filters?: RootStackParamList['ShopList']['filters'],
  sort?: RootStackParamList['ShopList']['sort']
): Promise<{ shops: Shop[]; hasMore: boolean }> => {
  const PAGE_SIZE = 10;
  let query = supabase
    .from('shops')
    .select('*')
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  // Search
  if (searchQuery) {
    query = query.or(
      `name.ilike.%${searchQuery}%,locality.ilike.%${searchQuery}%`
    );
  }

  // Filters
  filters?.forEach(({ field, operator, value }) => {
    query = query.filter(field, operator, value);
  });

  // Sorting
  if (sort) {
    query = query.order(sort.field, { ascending: sort.order === 'asc' });
  }

  const { data, error } = await query;

  if (error) throw errorHandler.handle(error);

  return {
    shops: data || [],
    hasMore: data?.length === PAGE_SIZE
  };
};
// Add other shop-related operations here as needed 

export const createShop = async (shopData: Partial<Shop>): Promise<Shop> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('shops')
    .insert([shopData])
    .single();

  if (error || !data) throw errorHandler.handle(error);

  const shop = data as Shop
  // Add owner to shop_owners table
  const { error: ownerError } = await supabase
    .from('shop_owners')
    .insert([{ 
      shopId: shop.id, 
      userId: user.id 
    }]);

  if (ownerError) throw errorHandler.handle(ownerError);

  return shop;
};

export const updateShop = async (shopId: string, updates: Partial<Shop>): Promise<Shop> => {
  const { data, error } = await supabase
    .from('shops')
    .update(updates)
    .eq('id', shopId)
    .single();

  if (error) throw errorHandler.handle(error);
  return data as Shop;
};

export const getMyShops = async (): Promise<Shop[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('shop_owners')
    .select('shops(*)')
    .eq('userId', user.id);

  if (error) return [];
  return (data?.map(owner => owner.shops) || []) as unknown as Shop[];
};

