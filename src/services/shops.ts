import { supabase } from '../lib/supabase'; // Assuming you have supabase initialized
import { Shop } from '../types';
import { errorHandler } from '../utils/errorHandler';

export const getShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.log('Error in get shops', error)
      throw error;
    }

    return data as Shop[];
  } catch (error) {
    throw errorHandler.normalize(error);
  }
};
// Add other shop-related operations here as needed 