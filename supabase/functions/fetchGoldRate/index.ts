// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

async function fetchGoldRateInINR() {
  const cutoffDate = new Date(Date.now() - (24 * 60 * 60 * 1000));
  const { data: cachedData, error: errInGetCache } = await supabase
    .from('goldRateCache')
    .select('*')
    .order('lastUpdatedAt', { ascending: false })
    .limit(2) 

  console.error('Error in errInGetCache', errInGetCache)
  console.info('Cached data', cachedData)
  if (cachedData && cachedData.length > 1 && (new Date(cachedData[0].lastUpdatedAt) > cutoffDate)) {
    console.info('Returning cached data', cachedData)
    const currentRate = cachedData[0].goldRatePerGramINR;
    const previousRate = cachedData[1]?.goldRatePerGramINR;
    const change = previousRate ? currentRate - previousRate : 0;
    const changePercent = change / previousRate * 100;
    
    return {
      goldRatePerGramINR: cachedData[0].goldRatePerGramINR,
      timestamp: cachedData[0].timestamp,
      lastUpdatedAt: cachedData[0].lastUpdatedAt,
      change,
      changePercent
    }
  }

  const apiKey = Deno.env.get('METALPRICE_API_KEY')
  const apiUrl = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=INR&currencies=XAU`
  // sample response {"success":true,"base":"INR","timestamp":1739577599,"rates":{"INRXAU":254159.770568786,"XAU":0.0000039345}}
  const response = await fetch(apiUrl)
  const { rates, success, error, timestamp: unixTimestamp } = await response.json()
  console.info('Metal API response', rates, success, error, unixTimestamp)
  if (!success) throw new Error(error?.message || 'Failed to fetch rates')

  const gramsPerTroyOunce = 31.1035
  const goldRatePerGramINR = Number(rates.INRXAU) / gramsPerTroyOunce
  const lastUpdatedAt = new Date().toISOString()
  const timestamp = new Date(unixTimestamp * 1000).toISOString()

  const previousRate = cachedData[0]?.goldRatePerGramINR;
  const change = previousRate ? goldRatePerGramINR - previousRate : 0;
  const changePercent = change / previousRate * 100;

  const { error: insertError } = await supabase
    .from('goldRateCache')
    .insert([{ goldRatePerGramINR, lastUpdatedAt, timestamp }])

  if (insertError) {
    console.error('Error while caching gold rate', insertError)
  }
  console.info('Successfully cached')

  return { goldRatePerGramINR, timestamp, lastUpdatedAt, change, changePercent }
}

Deno.serve(async (req) => {
  try {
    const response = await fetchGoldRateInINR()
    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetchGoldRate' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
