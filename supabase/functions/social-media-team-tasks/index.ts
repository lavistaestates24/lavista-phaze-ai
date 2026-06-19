import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: "content" | "sales" | "calling" | "creative" | "dev" | "design";
  target: string;
  taskTypes: string[];
}

interface TeamTask {
  task: string;
  completed: boolean;
}

interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  team: "content" | "sales" | "calling" | "creative" | "dev" | "design";
  target: string;
  tasks: TeamTask[];
  status: "not_started" | "in_progress" | "done";
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: "khushi", name: "Khushi", role: "Social Media Executive", team: "content", target: "2 posts", taskTypes: ["content_creation", "posting", "captions"] },
  { id: "twisha", name: "Twisha", role: "Social Media Executive", team: "content", target: "2 posts", taskTypes: ["content_creation", "posting", "captions"] },
  { id: "vandita", name: "Vandita", role: "Social Media Sales Executive", team: "sales", target: "5 outreach", taskTypes: ["client_outreach", "social_media_services"] },
  { id: "jinal", name: "Jinal", role: "Social Media Sales Executive", team: "sales", target: "5 outreach", taskTypes: ["client_outreach", "social_media_services"] },
  { id: "zeel", name: "Zeel", role: "Tele-calling", team: "calling", target: "15 calls", taskTypes: ["cold_calling", "social_media_clients"] },
  { id: "aman", name: "Aman", role: "Web Developer", team: "dev", target: "1 dev task", taskTypes: ["website_development", "dashboard_development"] },
  { id: "akshay", name: "Akshay", role: "Video Editor", team: "creative", target: "1 edit", taskTypes: ["reel_editing", "video_editing"] },
  { id: "nihal", name: "Nihal", role: "Videographer", team: "creative", target: "1 shoot", taskTypes: ["shoot_scheduling", "footage"] },
  { id: "nayan", name: "Nayan", role: "Videographer", team: "creative", target: "1 shoot", taskTypes: ["shoot_scheduling", "footage"] },
  { id: "harsh", name: "Harsh", role: "Graphic Designer", team: "design", target: "3 designs", taskTypes: ["post_designs", "carousels", "branding_assets"] },
];

const TASK_POOLS: Record<string, string[]> = {
  content_creation: [
    "Create carousel content for Lavista Estate Instagram",
    "Draft Instagram Reel script for new property launch",
    "Write engaging captions for 2 posts for this week",
    "Create story content for Lavista Marketing Agency",
    "Prepare content for Imperial Media launch campaign",
  ],
  posting: [
    "Schedule 2 posts for Lavista Estate Instagram page",
    "Post new property listing on Instagram stories",
    "Upload reel for Lavista Marketing client campaign",
    "Publish carousel post about upcoming project",
    "Share behind-the-scenes content on Instagram",
  ],
  captions: [
    "Write SEO-friendly captions for 2 posts",
    "Draft engaging CTAs for weekend property posts",
    "Create hashtag strategy for new content batch",
    "Write caption for client testimonial post",
    "Prepare bilingual captions for regional audience",
  ],
  client_outreach: [
    "Send pitch deck to 2 new real estate builder prospects",
    "Follow up with 3 clients from last week inquiry list",
    "Reach out to 5 builders on Instagram DM",
    "Send social media package proposal to 2 potential clients",
    "Schedule demo call with 2 interested builders",
  ],
  social_media_services: [
    "Prepare social media audit report for prospect",
    "Create sample content strategy for builder pitch",
    "Send pricing package for Instagram management services",
    "Follow up with 2 clients interested in reel creation",
    "Send case study of Lavista Marketing success to prospect",
  ],
  cold_calling: [
    "Make 15 cold calls to builders for social media services",
    "Call 15 real estate agents for Lavista Marketing partnership",
    "Cold call 15 property developers for content packages",
    "Make 15 calls to previous inquiry list for follow-up",
    "Call 15 new prospects from Google Ads lead list",
  ],
  social_media_clients: [
    "Follow up with 5 interested social media clients",
    "Call 3 clients who viewed pricing on website",
    "Reach out to 5 builders from Instagram story viewers",
    "Call 2 clients who abandoned inquiry form",
    "Follow up with 5 referrals from existing clients",
  ],
  website_development: [
    "Update Lavista Estate website with new property listings",
    "Fix responsive layout issues on mobile dashboard",
    "Integrate new lead capture form on website",
    "Optimize website loading speed for SEO",
    "Add new project gallery to website homepage",
  ],
  dashboard_development: [
    "Build new analytics widget for sales dashboard",
    "Fix API integration issue in team tracker component",
    "Add export functionality to reporting dashboard",
    "Implement real-time notification system for dashboard",
    "Update dashboard UI with new design system",
  ],
  reel_editing: [
    "Edit property showcase reel for Lavista Estate",
    "Create 30-second reel for builder client promotion",
    "Add captions and music to new property tour reel",
    "Edit client testimonial reel for Instagram",
    "Create 3 variations of reel for A/B testing",
  ],
  video_editing: [
    "Edit site visit video for client presentation",
    "Create 2-minute promotional video for new project",
    "Add color grading to drone footage for reel",
    "Edit walkthrough video for property listing",
    "Create highlight reel from team event footage",
  ],
  shoot_scheduling: [
    "Schedule property shoot for Lavista Estate new project",
    "Coordinate drone shoot for aerial project footage",
    "Plan site visit shoot for client testimonial",
    "Schedule team shoot for brand content creation",
    "Coordinate with builder for model flat shoot",
  ],
  footage: [
    "Capture B-roll footage for upcoming property reel",
    "Shoot client interview for testimonial video",
    "Record site visit footage for 2 new properties",
    "Capture aerial footage for project overview",
    "Shoot behind-the-scenes for team content",
  ],
  post_designs: [
    "Create 3 Instagram post designs for property listings",
    "Design story templates for Lavista Marketing",
    "Create infographic post for market trends",
    "Design promotional banner for new project launch",
    "Create 3 post designs for client testimonial series",
  ],
  carousels: [
    "Design carousel for property buying guide",
    "Create carousel showcasing Lavista Estate amenities",
    "Design 5-slide carousel for builder services",
    "Create carousel for real estate investment tips",
    "Design carousel for client success stories",
  ],
  branding_assets: [
    "Create branding assets for Imperial Media launch",
    "Design business cards for Lavista Estate team",
    "Create brand guideline document for Creata",
    "Design social media profile banners for all clients",
    "Create logo variations for new property project",
  ],
};

// Deterministic seeded random
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function generateTasksForMember(member: TeamMember, seed: number): TeamTask[] {
  const tasks: TeamTask[] = [];
  const usedTasks = new Set<string>();

  for (let i = 0; i < 2; i++) {
    const typeIdx = Math.floor(seededRandom(seed + i * 100 + member.id.length) * member.taskTypes.length);
    const taskType = member.taskTypes[typeIdx];
    const pool = TASK_POOLS[taskType] || [];
    const shuffled = shuffleArray(pool, seed + i * 50 + member.id.length * 3);
    const task = shuffled.find((t) => !usedTasks.has(t));
    if (task) {
      usedTasks.add(task);
      tasks.push({ task, completed: false });
    }
  }

  // Fallback if we couldn't get unique tasks
  if (tasks.length < 2) {
    const fallback = TASK_POOLS[member.taskTypes[0]] || ["Complete daily assigned tasks"];
    for (let i = tasks.length; i < 2; i++) {
      tasks.push({ task: fallback[i % fallback.length], completed: false });
    }
  }

  return tasks;
}

function generateDailyTasks(): TeamMemberData[] {
  const seed = getDailySeed();
  return TEAM_MEMBERS.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    team: member.team,
    target: member.target,
    tasks: generateTasksForMember(member, seed),
    status: "not_started" as const,
  }));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const team = generateDailyTasks();
    return new Response(
      JSON.stringify({
        team,
        generatedAt: new Date().toISOString(),
        date: new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        manager: { name: "Piyush", role: "Manager" },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
