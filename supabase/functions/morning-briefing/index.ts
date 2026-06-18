import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BRIEFING_PROMPTS: Record<string, string> = {
  marketing: `You are the Marketing Agent for Lavista group in Ahmedabad. Generate exactly 2 specific, actionable Instagram content tasks for today. One for Lavista Estate (real estate) and one for Lavista Marketing Agency (digital marketing for builders). Be specific about content type, format, and posting strategy. Return ONLY a JSON array of 2 objects with "title" and "description" fields. No markdown, no explanation, just the JSON array.`,

  sales: `You are the Sales Agent for Lavista group in Ahmedabad. Generate exactly 2 specific lead follow-up tasks for today. Focus on real estate client leads (Lavista Estate) and digital marketing prospects. Be specific about which clients or lead types to follow up with and suggested approach. Return ONLY a JSON array of 2 objects with "title" and "description" fields. No markdown, no explanation, just the JSON array.`,

  hr: `You are the HR Agent for Lavista group in Ahmedabad. Generate exactly 1 task related to team management for today. Reference team members named Twisha and Aman. Focus on attendance tracking, document management, or team coordination. Return ONLY a JSON array of 1 object with "title" and "description" fields. No markdown, no explanation, just the JSON array.`,

  operations: `You are the Operations Agent for Lavista group in Ahmedabad. Generate exactly 1 task related to client delivery or invoice management for today. Reference Lavista Estate, Imperial Media, or Creata as relevant. Return ONLY a JSON array of 1 object with "title" and "description" fields. No markdown, no explanation, just the JSON array.`,
};

async function fetchBriefing(agent: string, apiKey: string): Promise<{ agent: string; tasks: { title: string; description: string }[] }> {
  const prompt = BRIEFING_PROMPTS[agent];
  if (!prompt) throw new Error(`Unknown agent: ${agent}`);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error for ${agent}: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "[]";

  let tasks;
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    tasks = JSON.parse(cleaned);
  } catch {
    tasks = [{ title: "Task generation failed", description: text.substring(0, 100) }];
  }

  return { agent, tasks };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const agents = ["marketing", "sales", "hr", "operations"];
    const results = await Promise.all(
      agents.map((agent) => fetchBriefing(agent, apiKey))
    );

    const briefing: Record<string, { title: string; description: string }[]> = {};
    for (const result of results) {
      briefing[result.agent] = result.tasks;
    }

    return new Response(
      JSON.stringify({ briefing, generatedAt: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
