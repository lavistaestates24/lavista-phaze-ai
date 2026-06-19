import { useState, useEffect, useCallback } from 'react';
import { Users, Image, Phone, Monitor, Video, Palette, Paintbrush, CheckCircle, Clock, Circle, Download, RefreshCw } from 'lucide-react';

interface TeamTask {
  task: string;
  completed: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: 'content' | 'sales' | 'calling' | 'creative' | 'dev' | 'design';
  target: string;
  tasks: TeamTask[];
  status: 'not_started' | 'in_progress' | 'done';
}

interface TeamData {
  team: TeamMember[];
  generatedAt: string;
  date: string;
  manager: { name: string; role: string };
}

const TEAM_COLORS = {
  content: {
    bg: 'bg-pink-500/15',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    badge: 'bg-pink-500/20 text-pink-300',
    dot: 'bg-pink-400',
    icon: <Image className="w-3.5 h-3.5" />,
  },
  sales: {
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
    dot: 'bg-purple-400',
    icon: <Phone className="w-3.5 h-3.5" />,
  },
  calling: {
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
    dot: 'bg-purple-400',
    icon: <Phone className="w-3.5 h-3.5" />,
  },
  creative: {
    bg: 'bg-orange-500/15',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300',
    dot: 'bg-orange-400',
    icon: <Video className="w-3.5 h-3.5" />,
  },
  dev: {
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300',
    dot: 'bg-blue-400',
    icon: <Monitor className="w-3.5 h-3.5" />,
  },
  design: {
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    badge: 'bg-rose-500/20 text-rose-300',
    dot: 'bg-rose-400',
    icon: <Palette className="w-3.5 h-3.5" />,
  },
};

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', icon: <Circle className="w-3.5 h-3.5" />, color: 'text-gray-400 bg-gray-500/20' },
  in_progress: { label: 'In Progress', icon: <Clock className="w-3.5 h-3.5" />, color: 'text-yellow-400 bg-yellow-500/20' },
  done: { label: 'Done', icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-green-400 bg-green-500/20' },
};

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-700 bg-dark-card p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gray-700" />
        <div className="flex-1">
          <div className="h-4 w-24 rounded bg-gray-700" />
          <div className="h-3 w-16 rounded bg-gray-700/50 mt-1" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-700/30" />
        <div className="h-3 w-3/4 rounded bg-gray-700/30" />
      </div>
    </div>
  );
}

export default function SocialMediaTeamTracker() {
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskChecks, setTaskChecks] = useState<Record<string, boolean>>({});
  const [memberStatuses, setMemberStatuses] = useState<Record<string, 'not_started' | 'in_progress' | 'done'>>({});

  const fetchTeamTasks = useCallback(async () => {
    setLoading(true);
    setTaskChecks({});
    setMemberStatuses({});
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/social-media-team-tasks`, {
        headers: { Authorization: `Bearer ${supabaseKey}` },
      });
      if (!res.ok) throw new Error('Fetch failed');
      const data: TeamData = await res.json();
      setTeamData(data.team);
    } catch (err) {
      console.error('Social media team tasks error:', err);
      // Fallback static data
      setTeamData([
        { id: 'khushi', name: 'Khushi', role: 'Social Media Executive', team: 'content', target: '2 posts', tasks: [{ task: 'Create carousel content for Lavista Estate Instagram', completed: false }, { task: 'Write engaging captions for 2 posts for this week', completed: false }], status: 'not_started' },
        { id: 'twisha', name: 'Twisha', role: 'Social Media Executive', team: 'content', target: '2 posts', tasks: [{ task: 'Draft Instagram Reel script for new property launch', completed: false }, { task: 'Post new property listing on Instagram stories', completed: false }], status: 'not_started' },
        { id: 'vandita', name: 'Vandita', role: 'Social Media Sales Executive', team: 'sales', target: '5 outreach', tasks: [{ task: 'Send pitch deck to 2 new real estate builder prospects', completed: false }, { task: 'Follow up with 3 clients from last week inquiry list', completed: false }], status: 'not_started' },
        { id: 'jinal', name: 'Jinal', role: 'Social Media Sales Executive', team: 'sales', target: '5 outreach', tasks: [{ task: 'Reach out to 5 builders on Instagram DM', completed: false }, { task: 'Send social media package proposal to 2 potential clients', completed: false }], status: 'not_started' },
        { id: 'zeel', name: 'Zeel', role: 'Tele-calling', team: 'calling', target: '15 calls', tasks: [{ task: 'Make 15 cold calls to builders for social media services', completed: false }, { task: 'Call 15 real estate agents for Lavista Marketing partnership', completed: false }], status: 'not_started' },
        { id: 'aman', name: 'Aman', role: 'Web Developer', team: 'dev', target: '1 dev task', tasks: [{ task: 'Update Lavista Estate website with new property listings', completed: false }, { task: 'Fix responsive layout issues on mobile dashboard', completed: false }], status: 'not_started' },
        { id: 'akshay', name: 'Akshay', role: 'Video Editor', team: 'creative', target: '1 edit', tasks: [{ task: 'Edit property showcase reel for Lavista Estate', completed: false }, { task: 'Create 30-second reel for builder client promotion', completed: false }], status: 'not_started' },
        { id: 'nihal', name: 'Nihal', role: 'Videographer', team: 'creative', target: '1 shoot', tasks: [{ task: 'Schedule property shoot for Lavista Estate new project', completed: false }, { task: 'Capture B-roll footage for upcoming property reel', completed: false }], status: 'not_started' },
        { id: 'nayan', name: 'Nayan', role: 'Videographer', team: 'creative', target: '1 shoot', tasks: [{ task: 'Coordinate drone shoot for aerial project footage', completed: false }, { task: 'Shoot client interview for testimonial video', completed: false }], status: 'not_started' },
        { id: 'harsh', name: 'Harsh', role: 'Graphic Designer', team: 'design', target: '3 designs', tasks: [{ task: 'Create 3 Instagram post designs for property listings', completed: false }, { task: 'Design carousel for property buying guide', completed: false }], status: 'not_started' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamTasks();
  }, [fetchTeamTasks]);

  const toggleTask = (memberId: string, taskIdx: number) => {
    const key = `${memberId}-${taskIdx}`;
    setTaskChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateStatus = (memberId: string, status: 'not_started' | 'in_progress' | 'done') => {
    setMemberStatuses((prev) => ({ ...prev, [memberId]: status }));
  };

  const getMemberStatus = (memberId: string) => memberStatuses[memberId] || 'not_started';

  const getTeamStats = () => {
    const started = Object.values(memberStatuses).filter((s) => s !== 'not_started').length;
    const done = Object.values(memberStatuses).filter((s) => s === 'done').length;
    return { started, done, total: teamData.length };
  };

  const exportReport = () => {
    const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    let report = `📋 *Social Media Team Daily Report*\n📅 ${date}\n\n`;

    const stats = getTeamStats();
    report += `👥 Team Progress: ${stats.started}/${stats.total} started | ${stats.done}/${stats.total} completed\n\n`;

    report += `━━━━━━━━━━━━━━━━━━\n`;
    report += `📱 CONTENT TEAM:\n`;
    teamData.filter((m) => m.team === 'content').forEach((m) => {
      const status = getMemberStatus(m.id);
      const statusEmoji = status === 'done' ? '✅' : status === 'in_progress' ? '🔄' : '⏳';
      report += `\n${statusEmoji} *${m.name}* (${m.role})\n`;
      m.tasks.forEach((t, i) => {
        const check = taskChecks[`${m.id}-${i}`] ? '☑️' : '⬜';
        report += `  ${check} ${t.task}\n`;
      });
      report += `  🎯 Target: ${m.target}\n`;
    });

    report += `\n━━━━━━━━━━━━━━━━━━\n`;
    report += `📞 SALES & CALLING TEAM:\n`;
    teamData.filter((m) => m.team === 'sales' || m.team === 'calling').forEach((m) => {
      const status = getMemberStatus(m.id);
      const statusEmoji = status === 'done' ? '✅' : status === 'in_progress' ? '🔄' : '⏳';
      report += `\n${statusEmoji} *${m.name}* (${m.role})\n`;
      m.tasks.forEach((t, i) => {
        const check = taskChecks[`${m.id}-${i}`] ? '☑️' : '⬜';
        report += `  ${check} ${t.task}\n`;
      });
      report += `  🎯 Target: ${m.target}\n`;
    });

    report += `\n━━━━━━━━━━━━━━━━━━\n`;
    report += `🎨 CREATIVE TEAM:\n`;
    teamData.filter((m) => m.team === 'creative').forEach((m) => {
      const status = getMemberStatus(m.id);
      const statusEmoji = status === 'done' ? '✅' : status === 'in_progress' ? '🔄' : '⏳';
      report += `\n${statusEmoji} *${m.name}* (${m.role})\n`;
      m.tasks.forEach((t, i) => {
        const check = taskChecks[`${m.id}-${i}`] ? '☑️' : '⬜';
        report += `  ${check} ${t.task}\n`;
      });
      report += `  🎯 Target: ${m.target}\n`;
    });

    report += `\n━━━━━━━━━━━━━━━━━━\n`;
    report += `💻 DEV & DESIGN:\n`;
    teamData.filter((m) => m.team === 'dev' || m.team === 'design').forEach((m) => {
      const status = getMemberStatus(m.id);
      const statusEmoji = status === 'done' ? '✅' : status === 'in_progress' ? '🔄' : '⏳';
      report += `\n${statusEmoji} *${m.name}* (${m.role})\n`;
      m.tasks.forEach((t, i) => {
        const check = taskChecks[`${m.id}-${i}`] ? '☑️' : '⬜';
        report += `  ${check} ${t.task}\n`;
      });
      report += `  🎯 Target: ${m.target}\n`;
    });

    report += `\n━━━━━━━━━━━━━━━━━━\n`;
    report += `_Generated by Lavista Business OS_`;

    navigator.clipboard.writeText(report);
    alert('Report copied to clipboard! Paste in WhatsApp.');
  };

  const stats = getTeamStats();

  return (
    <section className="rounded-2xl bg-dark-card p-6 glow-border-purple mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-gradient-teal">Social Media Team Daily Tracker</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Auto-generated tasks for {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchTeamTasks} disabled={loading} className="btn-secondary flex items-center gap-2 text-xs disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={exportReport} className="btn-primary flex items-center gap-2 text-xs">
            <Download className="w-3.5 h-3.5" />
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
              <p className="text-2xl font-bold text-purple-400">{stats.started}</p>
              <p className="text-xs text-gray-500">Started</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{stats.done}</p>
              <p className="text-xs text-gray-500">Done</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-400">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400">Team Status: {stats.started} of {stats.total} members have started work today</p>
      </div>

      {/* Team Members Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {teamData.map((member) => {
            const colors = TEAM_COLORS[member.team];
            const status = getMemberStatus(member.id);
            const statusCfg = STATUS_CONFIG[status];

            return (
              <div key={member.id} className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}>
                {/* Member Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full ${colors.dot} flex items-center justify-center text-white text-sm font-semibold`}>
                    {member.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-200 truncate">{member.name}</p>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs ${colors.text}`}>{colors.icon}</span>
                      <span className={`text-xs ${colors.text} truncate`}>{member.role}</span>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-2 mb-3">
                  {member.tasks.map((t, idx) => {
                    const key = `${member.id}-${idx}`;
                    const checked = taskChecks[key] || false;
                    return (
                      <div key={key} className="flex items-start gap-2">
                        <button
                          onClick={() => toggleTask(member.id, idx)}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-all ${
                            checked ? `${colors.dot} border-transparent` : 'border-gray-600 bg-dark-bg hover:border-gray-400'
                          }`}
                        >
                          {checked && <CheckCircle className="w-3 h-3 text-white" />}
                        </button>
                        <p className={`text-xs transition-all ${checked ? 'line-through text-gray-600' : 'text-gray-400'}`}>
                          {t.task}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Target and Status */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Paintbrush className="w-3 h-3" />
                    <span>{member.target}</span>
                  </div>
                  <select
                    value={status}
                    onChange={(e) => updateStatus(member.id, e.target.value as typeof status)}
                    className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${statusCfg.color}`}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
