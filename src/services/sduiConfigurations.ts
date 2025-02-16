import { supabase } from '../lib/supabase';
import { errorHandler } from '../utils/errorHandler';
import { SduiConfigResponse } from '../types/sduiConfig';

export const getSduiConfiguration = async <T = any>(
  key: string
): Promise<SduiConfigResponse<T> | null> => {
  try {
    const { data, error } = await supabase
      .from('sduiConfigurations')
      .select('config')
      .eq('key', key)
      .single();

    if (error) throw error;
    return data?.config as SduiConfigResponse<T>;
  } catch (error) {
    errorHandler.handle(error, 'getSduiConfiguration');
    return null;
  }
}; 