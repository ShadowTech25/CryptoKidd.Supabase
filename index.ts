import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'

serve(async (req) => {
  const OPENAI_KEY = Deno.env.get("OPENAI_KEY");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");

  const topicRes = await fetch(`${supabaseUrl}/rest/v1/article_queue?status=eq.pending&limit=1`, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Content-Type": "application/json"
    }
  });

  const topics = await topicRes.json();
  if (!topics.length) {
    return new Response(JSON.stringify({ error: "No topics in queue" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  const topic = topics[0].topic;

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a crypto blogger for beginners." },
        { role: "user", content: `Write a blog post titled: "${topic}" with intro, 3 sections, and a conclusion.` }
      ]
    })
  });

  const json = await openaiRes.json();
  const content = json.choices?.[0]?.message?.content || "Error: No content returned";

  await fetch(`${supabaseUrl}/rest/v1/articles`, {
    method: "POST",
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({
      title: topic,
      content: content,
      author: "CryptoKid AI",
      created_at: new Date().toISOString(),
      status: "draft",
      reviewed: false
    })
  });

  await fetch(`${supabaseUrl}/rest/v1/article_queue?id=eq.${topics[0].id}`, {
    method: "PATCH",
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: "used" })
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
});