import { supabase } from "../lib/supabase"

export const fetchGoldRate = async () => {
    const { data, error} = await supabase.functions.invoke('fetchGoldRate')
    if(error) {
        throw error
    }
    return `₹ ${Number(data.goldRatePerGramINR).toFixed(0).toString()}/gm`
}