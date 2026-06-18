import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TEAM_MEMBERS = [
  { id: "anirudh", name: "Anirudh", role: "Rental Specialist", team: "rental", callTarget: 5 },
  { id: "ashit", name: "Ashit", role: "Rental Specialist", team: "rental", callTarget: 5 },
  { id: "meet", name: "Meet", role: "Rental Specialist", team: "rental", callTarget: 5 },
  { id: "anand", name: "Anand", role: "Site Visit Lead", team: "site", callTarget: 5 },
  { id: "krutika", name: "Krutika", role: "Tele-calling Lead", team: "calling", callTarget: 20 },
  { id: "vaishali", name: "Vaishali", role: "Inquiry Handler", team: "calling", callTarget: 20 },
  { id: "nisha", name: "Nisha", role: "Outbound Caller", team: "calling", callTarget: 20 },
];

const ROLE_PROMPTS: Record<string, string> = {
  anirudh: "Generate 2 specific daily tasks for Anirudh, a rental property specialist in Ahmedabad. Focus on: follow-ups for rental property leads, scheduling property visits for tenants. Return ONLY a JSON array of 2 objects with 'task' field.",
  ashit: "Generate 2 specific daily tasks for Ashit, a rental property specialist in Ahmedabad. Focus on: rental follow-ups, coordinating site visits for rental properties. Return ONLY a JSON array of 2 objects with 'task' field.",
  meet: "Generate 2 specific daily tasks for Meet, a rental property specialist in Ahmedabad. Focus on: rental lead follow-ups, scheduling and confirming site visits. Return ONLY a JSON array of 2 objects with 'task' field.",
  anand: "Generate 2 specific daily tasks for Anand, a site visit coordinator in Ahmedabad. Focus on: conducting site visits for interested clients, sourcing new properties from owners/builders. Return ONLY a JSON array of 2 objects with 'task' field.",
  krutika: "Generate 2 specific daily tasks for Krutika, a tele-calling lead in Ahmedabad. Focus on: calling leads for property requirements, updating CRM with new property listings. Return ONLY a JSON array of 2 objects with 'task' field.",
  vaishali: "Generate 2 specific daily tasks for Vaishali, an inquiry handler in Ahmedabad. Focus on: handling incoming property inquiries, searching for new listings, replying to client messages. Return ONLY a JSON array of 2 objects with 'task' field.",
  nisha: "Generate 2 specific daily tasks for Nisha, an outbound caller in Ahmedabad. Focus on: making outbound calls for property requirements, following up with potential clients. Return ONLY a JSON array of 2 objects with 'task' field.",
};

async function fetchTasks(memberId: string, apiKey: string): Promise<{ task: string }[]> {
  const prompt = ROLE_PROMPTS[memberId];
  if (!prompt) return [{ task: "Review daily assignments" }, { task: "Update progress in CRM" }];

  try {
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
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const text = data.content?.[0]?.text || "[]";

    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return [{ task: "Review daily assignments" }, { task: "Update progress in CRM" }];
    }
  } catch {
    return [{ task: "Review daily assignments" }, { task: "Update progress in CRM" }];
  }
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

    const tasksPromises = TEAM_MEMBERS.map(async (member) => {
      const tasks = await fetchTasks(member.id, apiKey);
      return {
        ...member,
        tasks: tasks.map((t) => ({ task: t.task, completed: false })),
        status: "not_started",
      };
    });

    const teamData = await Promise.all(tasksPromises);

    return new Response(
      JSON.stringify({ team: teamData, generatedAt: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
