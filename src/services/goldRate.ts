import { supabase } from "../lib/supabase";
import moment from 'moment'

export const fetchGoldRate = async () => {
  const { data, error } = await supabase.functions.invoke("fetchGoldRate");
  if (error) {
    throw error;
  }
  const symbol = data.change >= 0 ? '↑' : '↓'
  return {
    rate: `₹ ${Number(data.goldRatePerGramINR).toFixed(0).toString()}/gm`,
    change: data.change,
    changePercent: `${symbol} ${data.changePercent}%`,
    lastUpdated: moment(data.timestamp).calendar()
  };
};
