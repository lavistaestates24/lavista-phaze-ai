import { useState } from 'react';
import MorningBriefing from './MorningBriefing';
import {
  Bot,
  Play,
  MessageCircle,
  ExternalLink,
  TrendingUp,
  Users,
  Briefcase,
  FileText,
  Activity,
  Clock,
  ChevronRight,
  X,
  Send,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';

// Types
interface Task {
  id: string;
  title: string;
  department: string;
  priority: 'HIGH' | 'MED' | 'LOW';
  status: 'pending' | 'in_progress' | 'completed';
}

interface ActivityLogItem {
  id: string;
  agent: string;
  action: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning';
}

interface Department {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
}

// Company context for AI responses
const COMPANY_CONTEXT = {
  lavistaEstate: 'Lavista Estate - Real estate company based in Ahmedabad, specializing in premium residential and commercial properties.',
  lavistaMarketing: 'Lavista Marketing Agency - Digital marketing agency focused on builders and real estate developers.',
  imperialMedia: 'Imperial Media - New agency launch currently in development phase.',
  creata: 'Creata - Content creation studio for marketing collateral and brand assets.',
};

// Sample data
const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Analyze Instagram engagement metrics', department: 'Marketing', priority: 'HIGH', status: 'pending' },
  { id: '2', title: 'Review Q2 lead pipeline', department: 'Sales', priority: 'HIGH', status: 'pending' },
  { id: '3', title: 'Prepare client delivery report', department: 'Operations', priority: 'MED', status: 'in_progress' },
  { id: '4', title: 'Update team attendance records', department: 'HR', priority: 'MED', status: 'pending' },
  { id: '5', title: 'Draft Instagram content calendar', department: 'Marketing', priority: 'MED', status: 'pending' },
  { id: '6', title: 'Follow up with Imperial Media leads', department: 'Sales', priority: 'HIGH', status: 'pending' },
];

const DEPARTMENTS: Department[] = [
  {
    id: 'marketing',
    name: 'Marketing Agent',
    description: 'Instagram campaigns, content strategy, and brand positioning',
    icon: <TrendingUp className="w-5 h-5" />,
    details: ['Instagram Management', 'Content Strategy', 'Brand Positioning'],
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    description: 'Lead pipeline management and client outreach',
    icon: <Target className="w-5 h-5" />,
    details: ['Leads Pipeline', 'Client Outreach', 'CRM Updates'],
  },
  {
    id: 'hr',
    name: 'HR Agent',
    description: 'Team management and document processing',
    icon: <Users className="w-5 h-5" />,
    details: ['Team Management', 'Documents', 'Attendance'],
  },
  {
    id: 'operations',
    name: 'Operations Agent',
    description: 'Client delivery and invoice management',
    icon: <Briefcase className="w-5 h-5" />,
    details: ['Client Delivery', 'Invoices', 'Reports'],
  },
];

const INITIAL_ACTIVITIES: ActivityLogItem[] = [
  { id: '1', agent: 'CEO Agent', action: 'Completed morning market analysis', timestamp: '2 min ago', type: 'success' },
  { id: '2', agent: 'Marketing Agent', action: 'Published 3 Instagram posts for Lavista Estate', timestamp: '15 min ago', type: 'info' },
  { id: '3', agent: 'Sales Agent', action: 'New lead captured: Imperial Media inquiry', timestamp: '32 min ago', type: 'success' },
  { id: '4', agent: 'Operations Agent', action: 'Invoice generated for Creata project', timestamp: '1 hour ago', type: 'info' },
  { id: '5', agent: 'HR Agent', action: 'Monthly attendance report generated', timestamp: '2 hours ago', type: 'info' },
  { id: '6', agent: 'Marketing Agent', action: 'Campaign performance below target', timestamp: '3 hours ago', type: 'warning' },
];

// AI Response Generator
const generateAIResponse = (department: string, _userMessage: string): string => {
  const responses: Record<string, string[]> = {
    marketing: [
      `Based on current Instagram analytics for Lavista Estate, engagement is up 23% this week. I recommend focusing on property showcase reels to boost visibility.`,
      `Content strategy update: The Creata team has delivered new brand assets. Scheduling posts for Imperial Media launch campaign.`,
      `Analyzing Lavista Marketing Agency's Instagram performance - carousel posts are outperforming reels by 15%. Adjusting content mix accordingly.`,
    ],
    sales: [
      `Lead pipeline analysis: 12 new qualified leads for Lavista Estate properties. 3 hot leads for Imperial Media launch services.`,
      `Following up with 5 prospects from last week's Creata inquiry. Estimated conversion rate: 40%.`,
      `CRM updated: Lavista Marketing Agency now has 8 active client accounts. Revenue projection for Q2: 15% growth.`,
    ],
    hr: [
      `Team attendance for this week: 96% across all departments. 2 pending leave requests for review.`,
      `Generated onboarding documents for new Imperial Media team member. Training schedule prepared.`,
      `Employee satisfaction survey results: 4.2/5 average. Key improvement area: communication tools.`,
    ],
    operations: [
      `Client delivery status: 4 projects on track, 1 at risk (Creata deadline). Initiating escalation protocol.`,
      `Invoice summary: 12 pending payments totaling Rs. 8.5L. Average payment cycle: 18 days.`,
      `Resource allocation optimized for Lavista Estate campaign. Budget utilization: 78%.`,
    ],
  };

  const deptResponses = responses[department] || ['Processing your request...'];
  return deptResponses[Math.floor(Math.random() * deptResponses.length)];
};

function App() {
  const [tasks] = useState<Task[]>(INITIAL_TASKS);
  const [activities, setActivities] = useState<ActivityLogItem[]>(INITIAL_ACTIVITIES);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [newMessage, setNewMessage] = useState('');
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

  const runMorningAnalysis = () => {
    setIsRunningAnalysis(true);
    setTimeout(() => {
      const newActivity: ActivityLogItem = {
        id: Date.now().toString(),
        agent: 'CEO Agent',
        action: 'Morning analysis complete: All systems operational',
        timestamp: 'Just now',
        type: 'success',
      };
      setActivities([newActivity, ...activities]);
      setIsRunningAnalysis(false);
    }, 2000);
  };

  const openChat = (departmentId: string) => {
    setActiveChat(departmentId);
    if (!chatMessages[departmentId]) {
      setChatMessages({
        ...chatMessages,
        [departmentId]: [
          {
            id: '1',
            sender: 'agent',
            content: `Hello! I'm the ${DEPARTMENTS.find(d => d.id === departmentId)?.name}. How can I assist you today?`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      });
    }
  };

  const closeChat = () => {
    setActiveChat(null);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    const currentMessages = chatMessages[activeChat] || [];
    setChatMessages({
      ...chatMessages,
      [activeChat]: [...currentMessages, userMessage],
    });
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: generateAIResponse(activeChat, newMessage),
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), aiResponse],
      }));
    }, 1000);
  };

  const getPriorityBadge = (priority: 'HIGH' | 'MED' | 'LOW') => {
    switch (priority) {
      case 'HIGH':
        return <span className="badge-high">HIGH</span>;
      case 'MED':
        return <span className="badge-medium">MED</span>;
      case 'LOW':
        return <span className="badge-low">LOW</span>;
    }
  };

  const activeDepartment = DEPARTMENTS.find(d => d.id === activeChat);

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-purple">Lavista Business OS</h1>
              <p className="text-sm text-gray-500">Ahmedabad, India</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Activity className="w-4 h-4" />
              System Status
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Left 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Auto-Briefing Section */}
            <MorningBriefing />
            {/* CEO Agent Section */}
            <section className="glow-border-mixed rounded-2xl bg-dark-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">CEO Agent</h2>
                      <span className="status-dot-idle"></span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Central intelligence for Lavista group operations</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">Managing:</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Lavista Estate</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">Lavista Marketing</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Imperial Media</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">Creata</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={runMorningAnalysis}
                  disabled={isRunningAnalysis}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <Play className={`w-4 h-4 ${isRunningAnalysis ? 'animate-spin' : ''}`} />
                  {isRunningAnalysis ? 'Running Analysis...' : 'Run Morning Analysis'}
                </button>
              </div>
            </section>

            {/* Task Queue Section */}
            <section className="glow-border-purple rounded-2xl bg-dark-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Task Queue
                </h2>
                <span className="text-sm text-gray-400">{tasks.filter(t => t.status === 'pending').length} pending tasks</span>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin pr-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 hover:bg-dark-hover transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPriorityBadge(task.priority)}
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {task.status === 'in_progress' ? 'In Progress' : task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Department Agents Grid */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                Department Agents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEPARTMENTS.map(dept => (
                  <div
                    key={dept.id}
                    className="glow-border-teal rounded-xl bg-dark-card p-5 hover:scale-[1.02] transition-transform duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark-bg flex items-center justify-center text-teal-400">
                          {dept.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{dept.name}</h3>
                            <span className="status-dot-idle"></span>
                          </div>
                          <p className="text-xs text-gray-500">IDLE</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{dept.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dept.details.map((detail, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded bg-dark-bg text-gray-400">
                          {detail}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary flex items-center gap-2 flex-1">
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </button>
                      <button
                        onClick={() => openChat(dept.id)}
                        className="btn-chat flex items-center gap-2 flex-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Activity Log Sidebar - Right column */}
          <div className="lg:col-span-1">
            <div className="glow-border-purple rounded-2xl bg-dark-card p-5 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Activity Log
              </h2>
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin pr-2">
                {activities.map(activity => (
                  <div
                    key={activity.id}
                    className="p-3 rounded-lg bg-dark-bg/50 hover:bg-dark-hover transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-400' :
                        activity.type === 'warning' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`}></span>
                      <span className="text-xs font-medium text-gray-300">{activity.agent}</span>
                    </div>
                    <p className="text-sm text-gray-400">{activity.action}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel Overlay */}
      {activeChat && activeDepartment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg h-[600px] bg-dark-card rounded-2xl glow-border-mixed flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-teal-400">
                  {activeDepartment.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{activeDepartment.name}</h3>
                  <p className="text-xs text-gray-500">Online - Ready to assist</p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="w-8 h-8 rounded-lg bg-dark-bg hover:bg-dark-hover flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-4">
              {(chatMessages[activeChat] || []).map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                        : 'bg-dark-bg border border-gray-800 text-gray-300'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  className="btn-chat flex items-center justify-center w-12"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Context: {COMPANY_CONTEXT.lavistaEstate.substring(0, 60)}...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
