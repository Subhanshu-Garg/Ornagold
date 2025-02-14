import { supabase, supabaseStorageUrl } from '../lib/supabase';
import { RootStackParamList, Shop, shopView } from '../types';
import { errorHandler } from '../utils/errorHandler';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

export const getShops = async (
  searchQuery?: string,
  page = 1,
  filters?: RootStackParamList['ShopList']['filters'],
  sort?: RootStackParamList['ShopList']['sort']
): Promise<{ shops: Shop[]; hasMore: boolean }> => {
  const PAGE_SIZE = 10;
  let query = supabase
    .from('shops')
    .select(shopView)
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
    .select(shopView)
    .single();

  if (error) throw errorHandler.handle(error);

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
  const { location, ...safeUpdates } = updates;
  const { data, error } = await supabase
    .from('shops')
    .update(safeUpdates)
    .eq('id', shopId)
    .select(shopView)
    .single();

  if (error) throw errorHandler.handle(error, 'updateShop');
  return data as Shop;
};

export const getMyShops = async (userId?: String): Promise<Shop[]> => {
  if(!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    userId = user.id
  }

  const { data, error } = await supabase
    .from('shop_owners')
    .select(`shops(${shopView})`)
    .eq('userId', userId);

  if (error) return [];
  return (data?.map(owner => owner.shops) || []) as unknown as Shop[];
};

export const uploadFile = async (localUri: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileName = `shop-logo-${Date.now()}`;
    const fileType = localUri.split('/').pop()?.split('.').pop() || 'jpeg';
    const filePath = `${user.id}/${fileName}`;

    const fileData = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { data, error } = await supabase.storage
      .from('shop-logos')
      .upload(filePath, decode(fileData), {
        contentType: `image/${fileType}`,
        upsert: false,
      });

    if (error) throw error;
    return { 
      path: data.path, 
      url: `${supabaseStorageUrl}/shop-logos/${data.path}`
    };
  } catch (error) {
    throw errorHandler.handle(error, 'file_upload');
  }
};

// Add this utility function
const decode = (base64: string) => {
  const bs64 = base64.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(bs64, 'base64');
  return buffer;
};

