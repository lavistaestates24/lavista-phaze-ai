import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, CheckSquare, Square, RefreshCw, Clapperboard, Image, FileText, Layers, Send } from 'lucide-react';

interface ContentItem {
  day: string;
  dayShort: string;
  contentType: 'Reel' | 'Carousel' | 'Single Post' | 'Story';
  topic: string;
  bestTime: string;
  assignedTo: string;
  status: 'not_posted' | 'posted';
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
  manager: { name: string; role: string };
}

const CLIENT_COLORS: Record<string, { bg: string; border: string; text: string; badge: string; dot: string; light: string }> = {
  orange: {
    bg: 'bg-orange-500/15',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300',
    dot: 'bg-orange-400',
    light: 'bg-orange-400/10',
  },
  gold: {
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
    dot: 'bg-amber-400',
    light: 'bg-amber-400/10',
  },
  teal: {
    bg: 'bg-teal-500/15',
    border: 'border-teal-500/30',
    text: 'text-teal-400',
    badge: 'bg-teal-500/20 text-teal-300',
    dot: 'bg-teal-400',
    light: 'bg-teal-400/10',
  },
  pink: {
    bg: 'bg-pink-500/15',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    badge: 'bg-pink-500/20 text-pink-300',
    dot: 'bg-pink-400',
    light: 'bg-pink-400/10',
  },
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  Reel: <Clapperboard className="w-3.5 h-3.5" />,
  Carousel: <Layers className="w-3.5 h-3.5" />,
  'Single Post': <Image className="w-3.5 h-3.5" />,
  Story: <FileText className="w-3.5 h-3.5" />,
};

const TYPE_COLOR: Record<string, string> = {
  Reel: 'text-rose-400 bg-rose-500/15',
  Carousel: 'text-blue-400 bg-blue-500/15',
  'Single Post': 'text-emerald-400 bg-emerald-500/15',
  Story: 'text-gray-400 bg-gray-500/15',
};

function SkeletonClientCard() {
  return (
    <div className="rounded-xl border border-gray-700 bg-dark-card p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gray-700" />
        <div className="h-4 w-32 rounded bg-gray-700" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-12 rounded bg-gray-700/50" />
            <div className="h-3 flex-1 rounded bg-gray-700/30" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientContentCalendar() {
  const [plans, setPlans] = useState<ClientPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [postedItems, setPostedItems] = useState<Record<string, boolean>>({});
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [weekLabel, setWeekLabel] = useState('');

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/client-content-calendar`, {
        headers: { Authorization: `Bearer ${supabaseKey}` },
      });
      if (!res.ok) throw new Error('Fetch failed');
      const data: CalendarData = await res.json();
      setPlans(data.plans);
      setWeekLabel(`${data.weekStart} - ${data.weekEnd}`);
    } catch (err) {
      console.error('Calendar fetch error:', err);
      // Fallback
      setPlans([
        {
          clientId: 'creata',
          clientName: 'Creata Buildcon',
          color: 'orange',
          items: [
            { day: 'Monday', dayShort: 'Mon', contentType: 'Reel', topic: 'Project walkthrough with drone shots', bestTime: '7:00 - 9:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Tuesday', dayShort: 'Tue', contentType: 'Carousel', topic: '5 reasons to choose Creata Buildcon', bestTime: '12:00 - 1:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Reel', topic: 'Client testimonial reel', bestTime: '7:00 - 9:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Thursday', dayShort: 'Thu', contentType: 'Carousel', topic: 'Step-by-step home buying guide', bestTime: '6:00 - 7:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Friday', dayShort: 'Fri', contentType: 'Reel', topic: 'Behind the scenes at construction site', bestTime: '7:00 - 9:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Saturday', dayShort: 'Sat', contentType: 'Single Post', topic: 'New project launch announcement', bestTime: '10:00 - 11:00 AM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Single Post', topic: 'Price reveal post', bestTime: '10:00 - 11:00 AM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Monday', dayShort: 'Mon', contentType: 'Story', topic: 'Daily construction update', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Tuesday', dayShort: 'Tue', contentType: 'Story', topic: 'Poll: Which amenity do you love most?', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Story', topic: 'Q&A with architect', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Thursday', dayShort: 'Thu', contentType: 'Story', topic: 'This day at project site', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Friday', dayShort: 'Fri', contentType: 'Story', topic: 'Behind the scenes', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Saturday', dayShort: 'Sat', contentType: 'Story', topic: 'Client review highlight', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
          ],
        },
        {
          clientId: 'lavista',
          clientName: 'Lavista Marketing Agency',
          color: 'gold',
          items: [
            { day: 'Monday', dayShort: 'Mon', contentType: 'Reel', topic: 'How we helped builder get 100 leads', bestTime: '7:00 - 9:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Tuesday', dayShort: 'Tue', contentType: 'Carousel', topic: '5 social media mistakes builders make', bestTime: '12:00 - 1:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Reel', topic: 'Reel editing before & after', bestTime: '7:00 - 9:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Thursday', dayShort: 'Thu', contentType: 'Carousel', topic: 'How to write captions that convert', bestTime: '6:00 - 7:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Friday', dayShort: 'Fri', contentType: 'Reel', topic: 'Social media strategy explained', bestTime: '7:00 - 9:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Saturday', dayShort: 'Sat', contentType: 'Single Post', topic: 'New client onboarding', bestTime: '10:00 - 11:00 AM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Single Post', topic: 'Team milestone celebration', bestTime: '10:00 - 11:00 AM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Monday', dayShort: 'Mon', contentType: 'Story', topic: 'Daily marketing tip', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Tuesday', dayShort: 'Tue', contentType: 'Story', topic: 'Poll: Instagram vs Facebook for builders?', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Story', topic: 'Q&A session', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Thursday', dayShort: 'Thu', contentType: 'Story', topic: 'Behind the scenes of content creation', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Friday', dayShort: 'Fri', contentType: 'Story', topic: 'Client review highlight', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Saturday', dayShort: 'Sat', contentType: 'Story', topic: 'Quick reel hack', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
          ],
        },
        {
          clientId: 'scalixo',
          clientName: 'Scalixo Media',
          color: 'teal',
          items: [
            { day: 'Monday', dayShort: 'Mon', contentType: 'Reel', topic: 'Brand identity transformation reel', bestTime: '7:00 - 9:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Tuesday', dayShort: 'Tue', contentType: 'Carousel', topic: '5 elements of great brand identity', bestTime: '12:00 - 1:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Reel', topic: 'Reel production behind the scenes', bestTime: '7:00 - 9:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Thursday', dayShort: 'Thu', contentType: 'Carousel', topic: 'Color psychology in branding', bestTime: '6:00 - 7:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Friday', dayShort: 'Fri', contentType: 'Reel', topic: 'Visual storytelling showcase', bestTime: '7:00 - 9:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Saturday', dayShort: 'Sat', contentType: 'Single Post', topic: 'New brand identity reveal', bestTime: '10:00 - 11:00 AM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Single Post', topic: 'Creative team spotlight', bestTime: '10:00 - 11:00 AM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Monday', dayShort: 'Mon', contentType: 'Story', topic: 'Daily creative inspiration', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Tuesday', dayShort: 'Tue', contentType: 'Story', topic: 'Poll: Minimalist or bold design?', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Story', topic: 'Design process timelapse', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Thursday', dayShort: 'Thu', contentType: 'Story', topic: 'Q&A with designer', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Friday', dayShort: 'Fri', contentType: 'Story', topic: 'Team brainstorming moment', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Saturday', dayShort: 'Sat', contentType: 'Story', topic: 'Client review highlight', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
          ],
        },
        {
          clientId: 'nityam',
          clientName: 'Nityam Harmony',
          color: 'pink',
          items: [
            { day: 'Monday', dayShort: 'Mon', contentType: 'Reel', topic: 'Wellness lifestyle at Nityam', bestTime: '7:00 - 9:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Tuesday', dayShort: 'Tue', contentType: 'Carousel', topic: '5 wellness features at Nityam Harmony', bestTime: '12:00 - 1:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Reel', topic: 'Yoga session at clubhouse', bestTime: '7:00 - 9:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Thursday', dayShort: 'Thu', contentType: 'Carousel', topic: 'Guide to mindful living at home', bestTime: '6:00 - 7:00 PM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Friday', dayShort: 'Fri', contentType: 'Reel', topic: 'Meditation garden tour', bestTime: '7:00 - 9:00 PM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Saturday', dayShort: 'Sat', contentType: 'Single Post', topic: 'Wellness program launch', bestTime: '10:00 - 11:00 AM', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Single Post', topic: 'Community event announcement', bestTime: '10:00 - 11:00 AM', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Monday', dayShort: 'Mon', contentType: 'Story', topic: 'Daily wellness tip', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Tuesday', dayShort: 'Tue', contentType: 'Story', topic: 'Morning yoga poll', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Wednesday', dayShort: 'Wed', contentType: 'Story', topic: 'Community member spotlight', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Thursday', dayShort: 'Thu', contentType: 'Story', topic: 'Garden update', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
            { day: 'Friday', dayShort: 'Fri', contentType: 'Story', topic: 'Wellness recipe share', bestTime: 'Anytime', assignedTo: 'Khushi', status: 'not_posted' },
            { day: 'Saturday', dayShort: 'Sat', contentType: 'Story', topic: 'Meditation minute', bestTime: 'Anytime', assignedTo: 'Twisha', status: 'not_posted' },
          ],
        },
      ]);
      const now = new Date();
      const start = new Date(now);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      setWeekLabel(
        `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const togglePosted = (clientId: string, itemIdx: number) => {
    const key = `${clientId}-${itemIdx}`;
    setPostedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getPostedCount = () => {
    return Object.values(postedItems).filter(Boolean).length;
  };

  const getTotalItems = () => {
    return plans.reduce((sum, p) => sum + p.items.length, 0);
  };

  const regenerateClient = async (clientId: string) => {
    setRegenerating(clientId);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/client-content-calendar`, {
        headers: { Authorization: `Bearer ${supabaseKey}` },
      });
      if (!res.ok) throw new Error('Fetch failed');
      const data: CalendarData = await res.json();
      const freshPlan = data.plans.find((p) => p.clientId === clientId);
      if (freshPlan) {
        setPlans((prev) => prev.map((p) => (p.clientId === clientId ? freshPlan : p)));
      }
    } catch (err) {
      console.error('Regenerate error:', err);
    } finally {
      setRegenerating(null);
    }
  };

  const exportReport = () => {
    let report = `📅 *Client Content Calendar Report*\n📆 Week: ${weekLabel}\n\n`;
    const posted = getPostedCount();
    const total = getTotalItems();
    report += `📊 Progress: ${posted}/${total} items posted\n\n`;

    plans.forEach((plan) => {
      report += `━━━━━━━━━━━━━━━━━━\n`;
      report += `🏢 *${plan.clientName}*\n\n`;
      plan.items.forEach((item, idx) => {
        const key = `${plan.clientId}-${idx}`;
        const isPosted = postedItems[key] || false;
        const check = isPosted ? '✅' : '⬜';
        report += `${check} *${item.day}* | ${item.contentType} | ${item.topic}\n`;
        report += `   👤 ${item.assignedTo} | ⏰ ${item.bestTime}\n\n`;
      });
    });

    report += `_Generated by Lavista Business OS_`;
    navigator.clipboard.writeText(report);
    alert('Report copied to clipboard! Paste in WhatsApp.');
  };

  const posted = getPostedCount();
  const total = getTotalItems();

  return (
    <section className="rounded-2xl bg-dark-card p-6 glow-border-purple mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-400" />
            <span className="text-gradient-teal">Client Content Calendar</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Weekly content plan | {weekLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCalendar} disabled={loading} className="btn-secondary flex items-center gap-2 text-xs disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={exportReport} className="btn-primary flex items-center gap-2 text-xs">
            <Send className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Manager Overview Card */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold">
            P
          </div>
          <div>
            <p className="font-semibold text-purple-300">Piyush</p>
            <p className="text-xs text-gray-400">Manager</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{total}</p>
              <p className="text-xs text-gray-500">Scheduled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{posted}</p>
              <p className="text-xs text-gray-500">Posted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-400">{total - posted}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          {posted} of {total} content items posted across all clients this week
        </p>
      </div>

      {/* Client Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonClientCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const colors = CLIENT_COLORS[plan.color];
            const clientPosted = plan.items.filter((_, idx) => postedItems[`${plan.clientId}-${idx}`]).length;
            const clientTotal = plan.items.length;

            return (
              <div key={plan.clientId} className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}>
                {/* Client Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${colors.dot} flex items-center justify-center text-white text-sm font-semibold`}>
                      {plan.clientName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-200">{plan.clientName}</p>
                      <p className="text-xs text-gray-500">
                        {clientPosted}/{clientTotal} posted
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => regenerateClient(plan.clientId)}
                    disabled={regenerating === plan.clientId}
                    className="text-xs px-2 py-1 rounded bg-dark-bg hover:bg-dark-hover text-gray-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${regenerating === plan.clientId ? 'animate-spin' : ''}`} />
                    {regenerating === plan.clientId ? 'Generating...' : 'Regenerate'}
                  </button>
                </div>

                {/* Content Items Table */}
                <div className="space-y-1.5">
                  {/* Header Row */}
                  <div className="grid grid-cols-[28px_60px_80px_1fr_80px_60px_28px] gap-1 text-[10px] text-gray-500 uppercase tracking-wider px-1">
                    <span></span>
                    <span>Day</span>
                    <span>Type</span>
                    <span>Topic</span>
                    <span>Time</span>
                    <span>Assign</span>
                    <span></span>
                  </div>

                  {plan.items.map((item, idx) => {
                    const key = `${plan.clientId}-${idx}`;
                    const isPosted = postedItems[key] || false;
                    const typeColor = TYPE_COLOR[item.contentType];

                    return (
                      <div
                        key={key}
                        className={`grid grid-cols-[28px_60px_80px_1fr_80px_60px_28px] gap-1 items-center rounded px-1 py-1.5 transition-colors ${
                          isPosted ? 'bg-green-500/5' : 'hover:bg-white/5'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => togglePosted(plan.clientId, idx)}
                          className="flex items-center justify-center"
                        >
                          {isPosted ? (
                            <CheckSquare className="w-4 h-4 text-green-400" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-600 hover:text-gray-400" />
                          )}
                        </button>

                        {/* Day */}
                        <span className={`text-xs font-medium ${isPosted ? 'text-gray-500' : 'text-gray-300'}`}>
                          {item.dayShort}
                        </span>

                        {/* Type */}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 w-fit ${typeColor}`}>
                          {TYPE_ICON[item.contentType]}
                          {item.contentType === 'Single Post' ? 'Post' : item.contentType === 'Story' ? 'Story' : item.contentType}
                        </span>

                        {/* Topic */}
                        <p className={`text-xs truncate ${isPosted ? 'text-gray-500 line-through' : 'text-gray-400'}`} title={item.topic}>
                          {item.topic}
                        </p>

                        {/* Time */}
                        <span className="text-[10px] text-gray-500 truncate">{item.bestTime}</span>

                        {/* Assigned */}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.light} ${colors.text}`}>
                          {item.assignedTo}
                        </span>

                        {/* Status badge */}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded w-fit ${isPosted ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
                          {isPosted ? 'Posted' : 'Draft'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
