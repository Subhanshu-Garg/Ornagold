import { supabase } from "../lib/supabase";
import moment from 'moment'

export const fetchGoldRate = async () => {
  const { data, error } = await supabase.functions.invoke("fetchGoldRate");
  if (error) {
    throw error;
  }
  const symbol = data.change >= 0 ? '↑' : '↓'
  return {
    rate: `₹ ${Number(data.goldRatePerGramINR).toFixed(0)}/gm`,
    change: data.change,
    changePercent: `${symbol} ${Math.abs(Number(data.changePercent)).toFixed(2)}%`,
    lastUpdated: moment(data.timestamp).calendar()
  };
};
