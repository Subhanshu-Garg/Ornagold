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

  if (error) throw error;

  return {
    shops: data || [],
    hasMore: data?.length === PAGE_SIZE
  };
};
// Add other shop-related operations here as needed 