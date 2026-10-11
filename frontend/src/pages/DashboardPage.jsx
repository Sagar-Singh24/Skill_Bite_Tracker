import React, { useEffect, useState } from 'react';
import { Card, CardHeader, AnimatedCard } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, Zap, Activity, ChevronRight, Clock, Star, Users } from 'lucide-react';
import { api } from '../utils/api';

export default function DashboardPage({ records = [], user, onNavigate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getMyStats().then(data => { if (data) setStats(data); });
  }, [records.length]);

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  const totalXP = stats?.totalXp ?? records.reduce((s, r) => s + (r.xpEarned || 0), 0);
  const accuracy = stats?.accuracy ?? (records.length > 0 ? Math.round(records.filter(r => r.isCorrect).length * 100 / records.length) : 0);
  const streak = stats?.streak ?? 0;
  const totalHours = stats ? Math.round(stats.totalTimeSpentSeconds / 3600) : 0;

  const xpChart = stats?.xpChart ?? [];
  const skillChart = stats?.skillChart?.slice(0, 5) ?? [];
  const pieChart = stats?.pieChart ?? [];

  const recentActivity = records.length > 0
    ? records.slice(-5).reverse()
    : [];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-poppins font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary animate-neon-shine drop-shadow-[0_0_10px_rgba(255,107,53,0.5)]">
            {greeting}, {user?.name?.split(' ')[0] || 'Developer'}
          </h1>
          <p className="text-sm text-accent-neutral mt-2 tracking-wide uppercase font-semibold">
            Track your progress. Crush your goals.
          </p>
        </div>
        <button onClick={() => onNavigate('daily')} className="bg-gradient-to-r from-accent-primary to-[#ff5722] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-[0_5px_15px_rgba(255,107,53,0.4)] hover:shadow-[0_8px_25px_rgba(255,107,53,0.6)] flex items-center gap-2 border-[1px] border-accent-secondary/50">
          Start Daily Bite <Zap size={18} fill="currentColor" />
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCard delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-accent-neutral font-bold uppercase tracking-wider">Total XP</span>
            <div className="p-2.5 bg-dark-bg rounded-xl text-accent-primary border border-accent-primary/20 shadow-[0_0_15px_rgba(255,107,53,0.2)]"><Trophy size={20} /></div>
          </div>
          <div className="text-2xl font-bold glow-text">{totalXP.toLocaleString()}</div>
          <p className="text-xs text-accent-success mt-2 flex items-center gap-1 font-semibold">
            <Activity size={12}/> {stats?.totalAnswers ?? records.length} challenges done
          </p>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-accent-neutral font-bold uppercase tracking-wider">Current Streak</span>
            <div className="p-2.5 bg-dark-bg rounded-xl text-accent-primary border border-accent-primary/20 shadow-[0_0_15px_rgba(255,107,53,0.2)]"><Target size={20} /></div>
          </div>
          <div className="text-2xl font-bold glow-text">{streak} Days</div>
          <p className="text-xs text-accent-success mt-2 flex items-center gap-1 font-semibold">
            <Activity size={12}/> {streak > 0 ? 'Keep it up!' : 'Start today!'}
          </p>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-accent-neutral font-bold uppercase tracking-wider">Accuracy</span>
            <div className="p-2.5 bg-dark-bg rounded-xl text-accent-primary border border-accent-primary/20 shadow-[0_0_15px_rgba(255,107,53,0.2)]"><Star size={20} /></div>
          </div>
          <div className="text-2xl font-bold glow-text">{accuracy}%</div>
          <p className="text-xs text-accent-neutral mt-2 font-semibold">
            Based on your answers
          </p>
        </AnimatedCard>

        <AnimatedCard delay={0.4}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-accent-neutral font-bold uppercase tracking-wider">Active Hours</span>
            <div className="p-2.5 bg-dark-bg rounded-xl text-accent-primary border border-accent-primary/20 shadow-[0_0_15px_rgba(255,107,53,0.2)]"><Clock size={20} /></div>
          </div>
          <div className="text-2xl font-bold glow-text">{totalHours}h</div>
          <p className="text-xs text-accent-success mt-2 flex items-center gap-1 font-semibold">
            <Activity size={12}/> Total time spent
          </p>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* XP Progression Chart */}
        <AnimatedCard delay={0.5} className="xl:col-span-1 flex flex-col min-h-[400px]">
          <CardHeader title={<span className="text-accent-primary flex items-center gap-2"><Activity size={22}/> XP Progression (30 Days)</span>} subtitle="Daily XP earned." />
          <div className="w-full mt-4 h-[300px]">
            {xpChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpChart} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#ffa500" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a0a0a0', fontSize: 10 }} dy={10} minTickGap={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a0a0a0', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#ff6b35', borderRadius: '12px', color: '#ffffff' }} itemStyle={{ color: '#ff6b35', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="xp" stroke="#ff6b35" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" activeDot={{ r: 6, fill: '#ffa500', stroke: '#1a1a1a', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-accent-neutral text-sm">Complete challenges to see your XP chart</div>
            )}
          </div>
        </AnimatedCard>

        {/* Skill Mastery Bar Chart */}
        <AnimatedCard delay={0.6} className="xl:col-span-1 flex flex-col min-h-[400px]">
          <CardHeader title={<span className="text-accent-secondary flex items-center gap-2"><Target size={22}/> Skill Mastery</span>} subtitle="Your domain proficiency." />
          <div className="w-full mt-4 h-[300px]">
            {skillChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillChart} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 600 }} width={90} />
                  <Tooltip cursor={{ fill: '#252525' }} contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333333', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="score" fill="#ffa500" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-accent-neutral text-sm">No skill data yet</div>
            )}
          </div>
        </AnimatedCard>

        {/* Focus Area Pie Chart */}
        <AnimatedCard delay={0.7} className="xl:col-span-1 flex flex-col min-h-[400px]">
          <CardHeader title={<span className="text-accent-success flex items-center gap-2"><Zap size={22}/> Focus Area</span>} subtitle="Challenge distribution." />
          <div className="w-full mt-4 h-[250px] relative z-10">
            {pieChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieChart} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {pieChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333333', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-accent-neutral text-sm">No data yet</div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4 px-2">
            {pieChart.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-xs font-semibold text-accent-neutral">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-white capitalize">{entry.name}</span>
                </div>
                <span>{entry.value} Bites</span>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Recent Challenge History */}
      <AnimatedCard delay={0.7}>
        <CardHeader title={<span className="text-white flex items-center gap-2"><Users size={22} className="text-accent-primary"/> Recent Challenge History</span>} />
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-accent-neutral uppercase border-b border-accent-border">
              <tr>
                <th className="px-4 py-4 font-bold tracking-wider">Challenge</th>
                <th className="px-4 py-4 font-bold tracking-wider text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-border">
              {recentActivity.length > 0 ? recentActivity.map((ra, i) => (
                <tr key={ra.id ?? i} className="group hover:bg-[#252525] transition-all duration-300 cursor-pointer">
                  <td className="px-4 py-4">
                    <div className="font-bold text-white group-hover:text-accent-primary transition-colors text-base">{ra.challengeName}</div>
                    <div className="text-xs text-accent-neutral mt-1 font-medium">
                      {ra.completedAt ? new Date(ra.completedAt).toLocaleDateString() : '—'} &nbsp;•&nbsp; <span className="text-accent-secondary capitalize">{ra.skillCategory}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {ra.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-dark-bg font-bold bg-accent-success px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(0,212,170,0.4)]">
                        +{ra.xpEarned} XP <ChevronRight size={14}/>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-accent-neutral font-bold bg-dark-bg border border-accent-border px-3 py-1.5 rounded-lg">
                        Failed <ChevronRight size={14}/>
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-accent-neutral text-sm">
                    No challenges yet — <button onClick={() => onNavigate('daily')} className="text-accent-primary underline">start your first Daily Bite!</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button onClick={() => onNavigate('analytics')} className="w-full mt-6 py-3 text-sm font-bold text-accent-primary border border-accent-primary/30 rounded-xl hover:bg-accent-primary/10 transition-all shadow-inner">
          View Complete Analysis Log
        </button>
      </AnimatedCard>
    </div>
  );
}
