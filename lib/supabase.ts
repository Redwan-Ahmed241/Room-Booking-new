import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a comprehensive mock that handles all Supabase method chains
function createMockSupabase() {
  const mockQuery = {
    select: () => mockQuery,
    eq: () => mockQuery,
    neq: () => mockQuery,
    or: () => mockQuery,
    order: () => mockQuery,
    single: () =>
      Promise.resolve({
        data: null,
        error: { message: "Supabase not configured - using demo data" },
      }),
    insert: () => mockQuery,
    delete: () => mockQuery,
    gte: () => mockQuery,
    lte: () => mockQuery,
    ilike: () => mockQuery,
    overlaps: () => mockQuery,
    not: () => mockQuery,
    limit: () => mockQuery,
    then: (resolve: any) =>
      resolve({
        data: [],
        error: { message: "Supabase not configured - using demo data" },
      }),
  }

  return {
    from: () => mockQuery,
  }
}

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : (createMockSupabase() as any)

// Enhanced logging
if (!supabaseUrl || !supabaseKey) {
  console.log(`
🔧 SUPABASE SETUP STATUS:
- URL: ${supabaseUrl ? "✅ Set" : "❌ Missing"}  
- Key: ${supabaseKey ? "✅ Set" : "❌ Missing"}
- Using demo data until configured
`)
}
