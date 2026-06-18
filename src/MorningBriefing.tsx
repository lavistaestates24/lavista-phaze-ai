import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Smartphone, Briefcase, Users, Settings, Check } from 'lucide-react';

interface BriefingTask {
  title: string;
  description: string;
}

interface BriefingData {
  marketing: BriefingTask[];
  sales: BriefingTask[];
  hr: BriefingTask[];
  operations: BriefingTask[];
}

interface CheckedState {
  [key: string]: boolean;
}

const AGENT_CONFIG = [
  {
    id: 'marketing',
    label: 'Marketing',
    icon: <Smartphone className="w-4 h-4" />,
    color: 'teal',
    bgClass: 'bg-teal-500/15',
    borderClass: 'border-teal-500/30',
    textClass: 'text-teal-400',
    dotClass: 'bg-teal-400',
    badgeClass: 'bg-teal-500/20 text-teal-300',
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: <Briefcase className="w-4 h-4" />,
    color: 'blue',
    bgClass: 'bg-blue-500/15',
    borderClass: 'border-blue-500/30',
    textClass: 'text-blue-400',
    dotClass: 'bg-blue-400',
    badgeClass: 'bg-blue-500/20 text-blue-300',
  },
  {
    id: 'hr',
    label: 'HR',
    icon: <Users className="w-4 h-4" />,
    color: 'purple',
    bgClass: 'bg-purple-500/15',
    borderClass: 'border-purple-500/30',
    textClass: 'text-purple-400',
    dotClass: 'bg-purple-400',
    badgeClass: 'bg-purple-500/20 text-purple-300',
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: <Settings className="w-4 h-4" />,
    color: 'orange',
    bgClass: 'bg-orange-500/15',
    borderClass: 'border-orange-500/30',
    textClass: 'text-orange-400',
    dotClass: 'bg-orange-400',
    badgeClass: 'bg-orange-500/20 text-orange-300',
  },
] as const;

function SkeletonPulse() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-3/4 rounded bg-gray-700/50 animate-pulse" />
      <div className="h-3 w-full rounded bg-gray-700/30 animate-pulse" />
    </div>
  );
}

function SkeletonSection() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-5 h-5 rounded border border-gray-700 bg-gray-800 animate-pulse mt-0.5" />
          <div className="flex-1"><SkeletonPulse /></div>
        </div>
      ))}
    </div>
  );
}

export default function MorningBriefing() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<CheckedState>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchBriefing = useCallback(async () => {
    setLoading(true);
    setChecked({});
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/morning-briefing`, {
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
      if (!res.ok) throw new Error('Briefing fetch failed');
      const data = await res.json();
      setBriefing(data.briefing);
    } catch (err) {
      console.error('Briefing error:', err);
      // Fallback static briefing
      setBriefing({
        marketing: [
          { title: 'Lavista Estate Reel — Property Walkthrough', description: 'Create a 30-second reel showcasing the new Shela residential project amenities for Instagram.' },
          { title: 'Lavista Marketing — Carousel Post', description: 'Design a 5-slide carousel on "5 reasons builders need digital marketing" for Instagram feed.' },
        ],
        sales: [
          { title: 'Follow up — Lavista Estate hot leads', description: 'Call 3 qualified leads from last week\'s property expo. Focus on 3BHK units in South Ahmedabad.' },
          { title: 'Imperial Media outreach', description: 'Send proposal to 2 builder clients who inquired about launch marketing packages.' },
        ],
        hr: [
          { title: 'Twisha — Attendance audit', description: 'Review Twisha\'s half-day leave requests for this week and update the attendance tracker.' },
        ],
        operations: [
          { title: 'Creata — Invoice follow-up', description: 'Check payment status on Invoice #CR-024 for Creata content project delivered last month.' },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleCheck = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalTasks = briefing
    ? Object.values(briefing).reduce((sum, tasks) => sum + tasks.length, 0)
    : 6;
  const completedCount = Object.values(checked).filter(Boolean).length;
  const progressPct = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  const allDone = completedCount === totalTasks && totalTasks > 0;

  const today = currentTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStr = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <section className="rounded-2xl bg-dark-card p-6 glow-border-mixed mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            🌅 <span className="text-gradient-purple">Good Morning, Lavista</span>
            <span className="text-gray-400 text-base font-normal">— Today&apos;s Briefing</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {today} &middot; {timeStr}
          </p>
        </div>
        <button
          onClick={fetchBriefing}
          disabled={loading}
          className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">
            {completedCount} of {totalTasks} tasks completed today
          </span>
          <span className="text-xs text-gray-500">{Math.round(progressPct)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-dark-bg overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background: allDone
                ? 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)'
                : 'linear-gradient(90deg, #8b5cf6, #14b8a6)',
            }}
          />
        </div>
        {allDone && (
          <p className="text-sm text-green-400 font-medium mt-2 animate-pulse">
            🎉 All done for today!
          </p>
        )}
      </div>

      {/* Agent Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENT_CONFIG.map((agent) => (
          <div
            key={agent.id}
            className={`rounded-xl border ${agent.borderClass} ${agent.bgClass} p-4`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={agent.textClass}>{agent.icon}</span>
              <span className={`text-sm font-semibold ${agent.textClass}`}>{agent.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${agent.badgeClass}`}>
                {loading ? '...' : (briefing?.[agent.id as keyof BriefingData]?.length ?? 0)} tasks
              </span>
            </div>

            {loading ? (
              agent.id === 'hr' || agent.id === 'operations' ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border border-gray-700 bg-gray-800 animate-pulse mt-0.5" />
                    <div className="flex-1"><SkeletonPulse /></div>
                  </div>
                </div>
              ) : (
                <SkeletonSection />
              )
            ) : (
              <div className="space-y-3">
                {(briefing?.[agent.id as keyof BriefingData] ?? []).map((task, idx) => {
                  const checkKey = `${agent.id}-${idx}`;
                  const isChecked = checked[checkKey] ?? false;
                  return (
                    <div key={checkKey} className="flex items-start gap-3 group">
                      <button
                        onClick={() => toggleCheck(checkKey)}
                        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
                          isChecked
                            ? `${agent.dotClass} border-transparent`
                            : 'border-gray-600 bg-dark-bg hover:border-gray-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium transition-all duration-300 ${isChecked ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                          {task.title}
                        </p>
                        <p className={`text-xs mt-0.5 transition-all duration-300 ${isChecked ? 'line-through text-gray-700' : 'text-gray-500'}`}>
                          {task.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
