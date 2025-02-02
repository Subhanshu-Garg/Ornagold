import { supabase } from '../lib/supabase'; // Assuming you have supabase initialized
import { Shop } from '../types';
import { errorHandler } from '../utils/errorHandler';

export const getShops = async (
  searchQuery?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{ shops: Shop[]; hasMore: boolean }> => {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from('shops')
      .select('*')
      .order('createdAt', { ascending: false })
      .range(start, end);

    if (searchQuery) {
      query = query.or(
        `name.ilike.%${searchQuery}%,locality.ilike.%${searchQuery}%`
      );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      shops: data as Shop[],
      hasMore: (count || 0) >= pageSize
    };
  } catch (error) {
    throw errorHandler.normalize(error);
  }
};
// Add other shop-related operations here as needed 