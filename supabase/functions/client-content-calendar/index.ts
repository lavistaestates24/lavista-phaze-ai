import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContentItem {
  day: string;
  dayShort: string;
  contentType: "Reel" | "Carousel" | "Single Post" | "Story";
  topic: string;
  bestTime: string;
  assignedTo: string;
  status: "not_posted" | "posted";
}

interface Client {
  id: string;
  name: string;
  color: string;
  industry: string;
  topics: string[];
  reels: string[];
  carousels: string[];
  singlePosts: string[];
  stories: string[];
}

interface ClientPlan {
  clientId: string;
  clientName: string;
  color: string;
  items: ContentItem[];
}

interface CalendarData {
  plans: ClientPlan[];
  generatedAt: string;
  weekStart: string;
  weekEnd: string;
  managers: { name: string; role: string };
}

const CREATORS = ["Khushi", "Twisha"];

const CLIENTS: Client[] = [
  {
    id: "creata",
    name: "Creata Buildcon",
    color: "orange",
    industry: "Real Estate Construction",
    topics: ["Luxury villa projects", "Construction quality", "Design philosophy", "Client testimonials", "Smart home features", "Sustainability", "Amenities showcase", "Project updates", "Festive offers", "Location highlights"],
    reels: ["Project walkthrough with drone shots", "Client testimonial reel", "Behind the scenes at construction site", "Luxury interiors showcase", "Smart home automation demo", "Timelapse of construction progress", "Pool & amenities tour", "Festival celebration at project site", "Architect design showcase", "Location drone reel"],
    carousels: ["5 reasons to choose Creata Buildcon", "Step-by-step home buying guide", "Amenities comparison carousel", "Project phases explained", "Interior design trends for 2024", "Investment ROI in real estate", "Client success stories", "Sustainable building features", "Floor plan walkthrough", "Festive offer details"],
    singlePosts: ["New project launch announcement", "Price reveal post", "Team spotlight", "Project milestone celebration", "Feature highlight", "Award/certification post", "Happy client photo", "Location advantage infographic", "Referral program", "Limited units remaining"],
    stories: ["Daily construction update", "Poll: Which amenity do you love most?", "Q&A with architect", "This day at project site", "Behind the scenes", "Client review highlight", "Employee spotlight", "Weekend vibes at project", "Sneak peek of next project", "Engagement: Rate our design"],
  },
  {
    id: "lavista",
    name: "Lavista Marketing Agency",
    color: "gold",
    industry: "Digital Marketing & Real Estate",
    topics: ["Social media growth tips", "Reel marketing strategy", "Builder branding", "Lead generation", "Content strategy", "Instagram algorithm", "Reel editing tips", "Brand storytelling", "Real estate marketing", "Client results"],
    reels: ["How we helped builder get 100 leads", "Reel editing before & after", "Social media strategy explained", "Behind the scenes at Lavista office", "Client testimonial reel", "Quick marketing tip", "Day in life of marketing team", "Reel that went viral", "Marketing myths debunked", "Before & after social media growth"],
    carousels: ["5 social media mistakes builders make", "How to write captions that convert", "Reel script template", "Content calendar template", "Hashtag strategy for real estate", "Instagram bio optimization", "Lead funnel explained", "Reel hooks that work", "Storytelling framework", "ROI of social media marketing"],
    singlePosts: ["New client onboarding", "Team milestone celebration", "Service package announcement", "Client success metric", "Marketing insight", "Industry trend alert", "New team member welcome", "Awards/recognition", "Referral program", "Limited consultation slots"],
    stories: ["Daily marketing tip", "Poll: Instagram vs Facebook for builders?", "Q&A session", "Behind the scenes of content creation", "Client review highlight", "Quick reel hack", "Engagement sticker", "Trending audio alert", "Team fun moment", "Monday motivation"],
  },
  {
    id: "scalixo",
    name: "Scalixo Media",
    color: "teal",
    industry: "Media & Branding",
    topics: ["Brand identity design", "Content creation", "Visual storytelling", "Reel production", "Brand photography", "Digital presence", "Creative campaigns", "Media strategy", "Visual design", "Brand growth"],
    reels: ["Brand identity transformation reel", "Reel production behind the scenes", "Visual storytelling showcase", "Creative campaign highlight", "Brand photoshoot BTS", "Before & after brand redesign", "Day in life of creative director", "Client testimonial reel", "Quick design tip", "Trending creative concept"],
    carousels: ["5 elements of great brand identity", "Color psychology in branding", "Typography guide for real estate", "Visual hierarchy explained", "Brand consistency checklist", "Social media grid planning", "Brand voice guidelines", "Logo design process", "Brand audit checklist", "Creative campaign framework"],
    singlePosts: ["New brand identity reveal", "Creative team spotlight", "Project showcase", "Design philosophy post", "Client appreciation", "Industry award announcement", "Behind the scenes photoshoot", "Creative challenge invitation", "New service launch", "Limited design slots"],
    stories: ["Daily creative inspiration", "Poll: Minimalist or bold design?", "Design process timelapse", "Q&A with designer", "Team brainstorming moment", "Client review highlight", "Color palette reveal", "Engagement sticker", "Trend alert", "Friday creative roundup"],
  },
  {
    id: "nityam",
    name: "Nityam Harmony",
    color: "pink",
    industry: "Premium Real Estate & Wellness",
    topics: ["Wellness-focused living", "Premium amenities", "Community lifestyle", "Green living", "Yoga & meditation", "Nature integration", "Luxury wellness", "Festive community", "Healthy lifestyle", "Serene living"],
    reels: ["Wellness lifestyle at Nityam", "Yoga session at clubhouse", "Meditation garden tour", "Nature walk through project", "Community celebration reel", "Spa & wellness amenities", "Healthy cooking at community kitchen", "Sunrise meditation timelapse", "Premium interiors wellness design", "Community festival celebration"],
    carousels: ["5 wellness features at Nityam Harmony", "Guide to mindful living at home", "Health benefits of green spaces", "Wellness amenities checklist", "Community events calendar", "Sustainable living tips", "Interior design for wellness", "Yoga spaces at home", "Nutrition garden guide", "Festive wellness traditions"],
    singlePosts: ["Wellness program launch", "Community event announcement", "Seasonal wellness tip", "Green living milestone", "Premium amenity reveal", "Client wellness journey", "Team wellness spotlight", "Nature photography", "Community appreciation", "Limited wellness villas"],
    stories: ["Daily wellness tip", "Morning yoga poll", "Community member spotlight", "Garden update", "Wellness recipe share", "Meditation minute", "Poll: Favorite wellness amenity?", "Engagement: Wellness goals", "Community event teaser", "Sunday serenity moment"],
  },
];

// Schedule template for each day
const WEEKLY_SCHEDULE = [
  { day: "Monday", dayShort: "Mon", contentType: "Reel" as const, bestTime: "7:00 - 9:00 PM" },
  { day: "Tuesday", dayShort: "Tue", contentType: "Carousel" as const, bestTime: "12:00 - 1:00 PM" },
  { day: "Wednesday", dayShort: "Wed", contentType: "Reel" as const, bestTime: "7:00 - 9:00 PM" },
  { day: "Thursday", dayShort: "Thu", contentType: "Carousel" as const, bestTime: "6:00 - 7:00 PM" },
  { day: "Friday", dayShort: "Fri", contentType: "Reel" as const, bestTime: "7:00 - 9:00 PM" },
  { day: "Saturday", dayShort: "Sat", contentType: "Single Post" as const, bestTime: "10:00 - 11:00 AM" },
  { day: "Sunday", dayShort: "Sun", contentType: "Story" as const, bestTime: "Anytime" },
];

function seededRandom(seed: number): number {
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

function getWeeklySeed(): number {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  return startOfWeek.getFullYear() * 10000 + (startOfWeek.getMonth() + 1) * 100 + startOfWeek.getDate();
}

function getWeekStartDate(): string {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  return startOfWeek.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getWeekEndDate(): string {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return endOfWeek.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function generateContentForSlot(client: Client, schedule: typeof WEEKLY_SCHEDULE[0], creatorIndex: number, seed: number): ContentItem {
  let pool: string[];
  switch (schedule.contentType) {
    case "Reel":
      pool = client.reels;
      break;
    case "Carousel":
      pool = client.carousels;
      break;
    case "Single Post":
      pool = client.singlePosts;
      break;
    case "Story":
      pool = client.stories;
      break;
    default:
      pool = client.topics;
  }

  const shuffled = shuffleArray(pool, seed + client.id.length + schedule.day.length * 3);
  const topic = shuffled[0];

  return {
    day: schedule.day,
    dayShort: schedule.dayShort,
    contentType: schedule.contentType,
    topic,
    bestTime: schedule.bestTime,
    assignedTo: CREATORS[creatorIndex % CREATORS.length],
    status: "not_posted",
  };
}

function generateClientPlan(client: Client, seed: number): ClientPlan {
  const items: ContentItem[] = [];
  let creatorIndex = 0;

  // Main scheduled content
  WEEKLY_SCHEDULE.forEach((slot, idx) => {
    items.push(generateContentForSlot(client, slot, creatorIndex, seed + idx * 100));
    creatorIndex++;
  });

  // Additional single post for mid-week
  const extraSinglePostDay = "Wednesday";
  const extraSinglePost = {
    day: extraSinglePostDay,
    dayShort: "Wed",
    contentType: "Single Post" as const,
    topic: shuffleArray(client.singlePosts, seed + 500)[1],
    bestTime: "10:00 - 11:00 AM",
    assignedTo: CREATORS[(creatorIndex + 1) % CREATORS.length],
    status: "not_posted" as const,
  };
  items.push(extraSinglePost);

  // Stories for all days
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  days.forEach((day, idx) => {
    const dayShort = day.slice(0, 3);
    items.push({
      day,
      dayShort,
      contentType: "Story" as const,
      topic: shuffleArray(client.stories, seed + idx * 200 + 1000)[0],
      bestTime: "Anytime",
      assignedTo: CREATORS[idx % CREATORS.length],
      status: "not_posted" as const,
    });
  });

  return {
    clientId: client.id,
    clientName: client.name,
    color: client.color,
    items,
  };
}

function generateWeeklyPlans(): ClientPlan[] {
  const seed = getWeeklySeed();
  return CLIENTS.map((client, idx) => generateClientPlan(client, seed + idx * 1000));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const plans = generateWeeklyPlans();
    return new Response(
      JSON.stringify({
        plans,
        generatedAt: new Date().toISOString(),
        weekStart: getWeekStartDate(),
        weekEnd: getWeekEndDate(),
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
