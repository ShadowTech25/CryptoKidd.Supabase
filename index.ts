import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

serve(async (req) => {
  const { data, error } = await supabase.from("articles").insert([
    {
      title: "AI Weekly Auto Article",
      content: "This is a placeholder article generated automatically.",
      slug: "ai-article-" + Date.now(),
      created_at: new Date().toISOString()
    }
  ])

  if (error) return new Response(JSON.stringify({ error }), { status: 500 })
  return new Response(JSON.stringify({ data }), { status: 200 })
})