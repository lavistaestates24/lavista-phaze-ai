import { useState, useEffect, useCallback } from 'react';
import { Users, Phone, MapPin, RefreshCw, Download, CheckCircle, Clock, Circle } from 'lucide-react';

interface TeamTask {
  task: string;
  completed: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: 'rental' | 'site' | 'calling';
  callTarget: number;
  tasks: TeamTask[];
  status: 'not_started' | 'in_progress' | 'done';
}

interface TeamData {
  team: TeamMember[];
  generatedAt: string;
}

const TEAM_COLORS = {
  rental: {
    bg: 'bg-teal-500/15',
    border: 'border-teal-500/30',
    text: 'text-teal-400',
    badge: 'bg-teal-500/20 text-teal-300',
    dot: 'bg-teal-400',
    icon: <MapPin className="w-3.5 h-3.5" />,
  },
  site: {
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300',
    dot: 'bg-blue-400',
    icon: <MapPin className="w-3.5 h-3.5" />,
  },
  calling: {
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
    dot: 'bg-purple-400',
    icon: <Phone className="w-3.5 h-3.5" />,
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

export default function SalesTeamTracker() {
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
      const res = await fetch(`${supabaseUrl}/functions/v1/sales-team-tasks`, {
        headers: { Authorization: `Bearer ${supabaseKey}` },
      });
      if (!res.ok) throw new Error('Fetch failed');
      const data: TeamData = await res.json();
      setTeamData(data.team);
    } catch (err) {
      console.error('Team tasks error:', err);
      // Fallback static data
      setTeamData([
        { id: 'anirudh', name: 'Anirudh', role: 'Rental Specialist', team: 'rental', callTarget: 5, tasks: [{ task: 'Follow up with 3 rental leads from Shela area', completed: false }, { task: 'Schedule site visit for 2BHK in Prahlad Nagar', completed: false }], status: 'not_started' },
        { id: 'ashit', name: 'Ashit', role: 'Rental Specialist', team: 'rental', callTarget: 5, tasks: [{ task: 'Call back rental inquiry from SG Highway', completed: false }, { task: 'Coordinate visit for commercial space in Bodakdev', completed: false }], status: 'not_started' },
        { id: 'meet', name: 'Meet', role: 'Rental Specialist', team: 'rental', callTarget: 5, tasks: [{ task: 'Confirm 3 site visits for weekend', completed: false }, { task: 'Update rental database with new listings', completed: false }], status: 'not_started' },
        { id: 'anand', name: 'Anand', role: 'Site Visit Lead', team: 'site', callTarget: 5, tasks: [{ task: 'Conduct site visit at Lavista Estate project', completed: false }, { task: 'Source new properties from Satyamev builders', completed: false }], status: 'not_started' },
        { id: 'krutika', name: 'Krutika', role: 'Tele-calling Lead', team: 'calling', callTarget: 20, tasks: [{ task: 'Call 20 leads from last week inquiry list', completed: false }, { task: 'Update CRM with 5 new property listings', completed: false }], status: 'not_started' },
        { id: 'vaishali', name: 'Vaishali', role: 'Inquiry Handler', team: 'calling', callTarget: 20, tasks: [{ task: 'Handle incoming inquiries from Google ads', completed: false }, { task: 'Search 5 new rental listings in Bopal area', completed: false }], status: 'not_started' },
        { id: 'nisha', name: 'Nisha', role: 'Outbound Caller', team: 'calling', callTarget: 20, tasks: [{ task: 'Make 20 outbound calls for 3BHK requirements', completed: false }, { task: 'Follow up with yesterday interested prospects', completed: false }], status: 'not_started' },
        { id: 'harsh', name: 'Harsh', role: 'Outbound Caller', team: 'calling', callTarget: 20, tasks: [{ task: 'Make 20 outbound calls for 2BHK requirements', completed: false }, { task: 'Follow up with today interested prospects', completed: false }], status: 'not_started' },
        { id: 'krunal', name: 'Krunal', role: 'Outbound Caller', team: 'calling', callTarget: 20, tasks: [{ task: 'Make 20 outbound calls for 1BHK requirements', completed: false }, { task: 'Follow up with interested prospects', completed: false }], status: 'not_started' },
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
    let report = `📋 *Lavista Sales Team Daily Report*\n📅 ${date}\n\n`;

    const stats = getTeamStats();
    report += `👥 Team Progress: ${stats.started}/${stats.total} started | ${stats.done}/${stats.total} completed\n\n`;

    report += `━━━━━━━━━━━━━━━━━━\n`;
    report += `🏠 RENTAL TEAM:\n`;
    teamData.filter((m) => m.team === 'rental').forEach((m) => {
      const status = getMemberStatus(m.id);
      const statusEmoji = status === 'done' ? '✅' : status === 'in_progress' ? '🔄' : '⏳';
      report += `\n${statusEmoji} *${m.name}* (${m.role})\n`;
      m.tasks.forEach((t, i) => {
        const check = taskChecks[`${m.id}-${i}`] ? '☑️' : '⬜';
        report += `  ${check} ${t.task}\n`;
      });
      report += `  📞 Target: ${m.callTarget} follow-ups\n`;
    });

    report += `\n━━━━━━━━━━━━━━━━━━\n`;
    report += `🚗 SITE VISIT TEAM:\n`;
    teamData.filter((m) => m.team === 'site').forEach((m) => {
      const status = getMemberStatus(m.id);
      const statusEmoji = status === 'done' ? '✅' : status === 'in_progress' ? '🔄' : '⏳';
      report += `\n${statusEmoji} *${m.name}* (${m.role})\n`;
      m.tasks.forEach((t, i) => {
        const check = taskChecks[`${m.id}-${i}`] ? '☑️' : '⬜';
        report += `  ${check} ${t.task}\n`;
      });
      report += `  📞 Target: ${m.callTarget} follow-ups\n`;
    });

    report += `\n━━━━━━━━━━━━━━━━━━\n`;
    report += `📞 CALLING TEAM:\n`;
    teamData.filter((m) => m.team === 'calling').forEach((m) => {
      const status = getMemberStatus(m.id);
      const statusEmoji = status === 'done' ? '✅' : status === 'in_progress' ? '🔄' : '⏳';
      report += `\n${statusEmoji} *${m.name}* (${m.role})\n`;
      m.tasks.forEach((t, i) => {
        const check = taskChecks[`${m.id}-${i}`] ? '☑️' : '⬜';
        report += `  ${check} ${t.task}\n`;
      });
      report += `  📞 Target: ${m.callTarget} calls\n`;
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
            <span className="text-gradient-teal">Sales Team Daily Tracker</span>
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
            A
          </div>
          <div>
            <p className="font-semibold text-purple-300">Arti</p>
            <p className="text-xs text-gray-400">Sales Manager</p>
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
          {[...Array(7)].map((_, i) => <SkeletonCard key={i} />)}
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

                {/* Call Target and Status */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone className="w-3 h-3" />
                    <span>{member.callTarget} calls</span>
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
