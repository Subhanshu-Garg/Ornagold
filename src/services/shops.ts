import { supabase, supabaseStorageUrl } from '../lib/supabase';
import { Filter, Shop, shopView, Sort } from '../types';
import { errorHandler } from '../utils/errorHandler';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

export const getShops = async (
  searchQuery?: string,
  page = 1,
  filters?: Filter[],
  sorts?: Sort[]
): Promise<{ shops: Shop[]; hasMore: boolean }> => {
  const PAGE_SIZE = 6;
  console.log('filters', filters)
  console.log('sorts', sorts)
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

  sorts?.forEach(({ field, order }) => {
    query = query.order(field, { ascending: order === 'asc' });
  })

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
  const { data, error } = await supabase
    .from('shops')
    .update(updates)
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

export const uploadFile = async (localUri: string, fileName: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const fileType = localUri.split('/').pop()?.split('.').pop() || 'jpeg';
    const filePath = `${user.id}/${fileName}`;

    const fileData = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { data, error } = await supabase.storage
      .from('shop-logos')
      .upload(filePath, decode(fileData), {
        contentType: `image/${fileType}`,
        upsert: true,
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

