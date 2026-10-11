import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/ui/Card';
import {
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { ClipboardCheck, Target, TrendingUp, GraduationCap, Calendar } from 'lucide-react';
import { api } from '../utils/api';

export default function AnalyticsPage({ user, records = [] }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getMyStats().then(data => { if (data) setStats(data); });
  }, [records.length]);

  const totalCompleted = stats?.totalAnswers ?? records.length;
  const accuracy = stats?.accuracy ?? (records.length > 0 ? (records.filter(r => r.isCorrect).length / records.length * 100).toFixed(0) : 0);
  const totalXp = stats?.totalXp ?? records.reduce((sum, r) => sum + (r.xpEarned || 0), 0);

  // Radar: skill mastery from real data
  const radarData = stats?.skillChart?.length > 0
    ? stats.skillChart.slice(0, 6).map(s => ({ subject: s.subject, initial: Math.max(5, s.score - 40), current: s.score, fullMark: 100 }))
    : [
        { subject: 'Data Structures', initial: 30, current: 85, fullMark: 100 },
        { subject: 'Algorithms', initial: 20, current: 80, fullMark: 100 },
        { subject: 'Web Technologies', initial: 40, current: 90, fullMark: 100 },
        { subject: 'Database Systems', initial: 10, current: 75, fullMark: 100 },
        { subject: 'Operating Systems', initial: 15, current: 60, fullMark: 100 },
        { subject: 'Computer Networks', initial: 5, current: 40, fullMark: 100 },
      ];

  // Weekly chart from real data
  const weeklyChart = stats?.weeklyChart ?? [
    { day: 'Mon', pending: 8, study: 3 },
    { day: 'Tue', pending: 6, study: 4 },
    { day: 'Wed', pending: 5, study: 5 },
    { day: 'Thu', pending: 3, study: 7 },
    { day: 'Fri', pending: 2, study: 8 },
    { day: 'Sat', pending: 2, study: 9 },
    { day: 'Sun', pending: 1, study: 9 },
  ];

  const activityNotes = records.length > 0 ? records.slice(-4).reverse() : null;

  const summaryCards = [
    { title: 'Challenges Completed', value: totalCompleted.toString(), subtext: 'Total Bites consumed', icon: ClipboardCheck, color: 'text-accent-success', borderColor: 'border-accent-success/20' },
    { title: 'Response Accuracy', value: `${accuracy}%`, subtext: 'Based on test history', icon: Target, color: 'text-[#ff6b35]', borderColor: 'border-[#ff6b35]/20' },
    { title: 'Total XP Accrued', value: totalXp.toLocaleString(), subtext: 'Global leaderboard tier', icon: TrendingUp, color: 'text-[#da70d6]', borderColor: 'border-[#da70d6]/20' }
  ];
  return (
    <div className="space-y-6 pb-10">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <AnimatedCard key={idx} delay={0.1 * idx} className="p-6 border border-accent-border hover:border-accent-neutral/50 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-bold text-accent-neutral uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 bg-dark-bg rounded-xl border shadow-inner ${card.color} ${card.borderColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="text-4xl font-black text-white glow-text mb-2">{card.value}</div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${card.color}`}>
                + {card.subtext}
              </p>
            </AnimatedCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student Progress Context */}
        <AnimatedCard delay={0.4} className="lg:col-span-1 flex flex-col p-6 min-h-[500px] h-full border border-accent-border shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap size={24} className="text-accent-success" />
            <h2 className="text-xl font-bold text-white tracking-wide">Student Progress</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-10 text-center sm:text-left">
            <div className="w-20 h-20 overflow-hidden rounded-full bg-gradient-to-tr from-dark-bg to-dark-surface border-[3px] border-accent-neutral/30 flex items-center justify-center shrink-0 shadow-lg">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-accent-primary to-accent-secondary">
                  {user?.name ? user.name.charAt(0) : 'SB'}
                </span>
              )}
            </div>
            <div className="mt-2 sm:mt-0">
              <h3 className="text-2xl font-black text-white">{user?.name || 'Student Profile'}</h3>
              <p className="text-sm text-accent-neutral mt-1 font-semibold">Track: {user?.title || 'Computer Science'}</p>
              <p className="text-sm text-accent-neutral font-semibold">Status: Active Student</p>
              <p className="text-sm text-accent-neutral mt-3 flex items-center justify-center sm:justify-start gap-1 font-bold bg-[#252525] inline-flex px-3 py-1 rounded-full">
                <Calendar size={14} className="text-[#ff6b35]"/> Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>

          <div className="relative mb-12 px-1 mt-4 w-full">
            {/* Timeline Line */}
            <div className="absolute top-3.5 left-6 right-6 h-1 bg-accent-border z-0 rounded-full"></div>
            <div className="absolute top-3.5 left-6 w-1/2 h-1 bg-accent-success z-0 rounded-full shadow-[0_0_10px_rgba(0,212,170,0.5)]"></div>
            
            <div className="relative z-10 flex justify-between">
              {['Setup', 'Day 1-2', 'Day 3-4', 'Day 5-6', 'Day 7'].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${i < 2 ? 'bg-accent-success border-accent-success text-dark-bg shadow-lg cursor-pointer hover:scale-110' : i === 2 ? 'bg-accent-primary border-accent-primary text-dark-bg shadow-[0_0_15px_rgba(255,107,53,0.6)] cursor-pointer scale-110 ring-2 ring-accent-primary/30 ring-offset-2 ring-offset-dark-surface' : 'bg-dark-bg border-accent-neutral text-accent-neutral'}`}>
                    {i < 2 ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold w-12 text-center ${i === 2 ? 'text-accent-primary drop-shadow-[0_0_5px_rgba(255,107,53,0.4)]' : 'text-accent-neutral'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4">
             <h4 className="text-lg font-bold text-white mb-2 ml-1">Recent Executions</h4>
             {activityNotes ? activityNotes.map((note, i) => (
                <div key={i} className={`px-4 py-3 bg-[#111111] rounded-lg border-l-4 font-semibold text-sm transition-colors hover:bg-[#202020] cursor-pointer ${i === 0 ? 'border-[#ff6b35] text-white shadow-[0_4px_15px_rgba(0,0,0,0.5)]' : 'border-[#00d4aa]/70 text-accent-light/80'}`}>
                  {new Date(note.completedAt).toLocaleDateString()} - {note.challengeName} <span className="opacity-60 text-xs">({note.skillCategory})</span>
                </div>
             )) : (
                <div className="px-4 py-3 bg-[#111111] rounded-lg border-l-4 border-accent-neutral/30 font-semibold text-sm text-accent-neutral">
                  No activity captured. Complete a Daily Bite!
                </div>
             )}
          </div>
        </AnimatedCard>

        {/* Right Column: Dynamic Charts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <AnimatedCard delay={0.5} className="flex-1 p-6 border border-accent-border relative overflow-hidden shadow-lg h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 lg:mb-2 text-center lg:text-left">Skill Metrics: Initial vs Current Profile</h3>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-end gap-x-8 gap-y-2 mb-2 lg:-mt-8 z-10 relative">
              <span className="text-[11px] uppercase tracking-wider font-bold text-accent-neutral flex items-center gap-2"><div className="w-6 h-1 bg-[#a0a0a0] rounded-full"></div> Initial Assessment</span>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#00d4aa] flex items-center gap-2"><div className="w-6 h-1 bg-[#00d4aa] rounded-full shadow-[0_0_8px_rgba(0,212,170,0.8)]"></div> Current Mastery</span>
            </div>
            
            <div className="w-full h-[300px] mt-4 z-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#333333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '10px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.7)' }} 
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Radar name="Initial Assessment" dataKey="initial" stroke="#a0a0a0" strokeWidth={2} fill="#a0a0a0" fillOpacity={0.15} />
                  <Radar name="Current Proficiency" dataKey="current" stroke="#00d4aa" strokeWidth={3} fill="#00d4aa" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.6} className="flex-1 p-6 border border-accent-border relative overflow-hidden shadow-lg h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 lg:mb-2 text-center lg:text-left">Weekly Academic Velocity</h3>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-end gap-x-8 gap-y-2 mb-4 lg:-mt-8 z-10 relative">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#ff6b35] flex items-center gap-2"><div className="w-6 h-1 bg-[#ff6b35] rounded-full shadow-[0_0_8px_rgba(255,107,53,0.8)]"></div> Assignments Pending</span>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#00d4aa] flex items-center gap-2"><div className="w-6 h-1 bg-[#00d4aa] rounded-full shadow-[0_0_8px_rgba(0,212,170,0.8)]"></div> Daily Study Hours</span>
            </div>

            <div className="w-full h-[260px] relative z-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyChart} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                  <XAxis dataKey="day" stroke="#a0a0a0" tick={{ fill: '#a0a0a0', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#a0a0a0" tick={{ fill: '#a0a0a0', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', borderColor: '#333', color: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    labelStyle={{ color: '#a0a0a0', marginBottom: '5px' }}
                  />
                  <Area type="monotone" dataKey="pending" name="Assignments Pending" stroke="#ff6b35" strokeWidth={4} fill="#ff6b35" fillOpacity={0.1} activeDot={{ r: 6, fill: '#ff6b35', stroke: '#1a1a1a', strokeWidth: 2 }}/>
                  <Area type="monotone" dataKey="study" name="Study Hours" stroke="#00d4aa" strokeWidth={4} fill="#00d4aa" fillOpacity={0.15} activeDot={{ r: 6, fill: '#00d4aa', stroke: '#1a1a1a', strokeWidth: 2 }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
          
        </div>
      </div>
    </div>
  );
}
