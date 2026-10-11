/* eslint-disable no-unused-vars */
import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Folder, Star, Package, MapPin, Link as LinkIcon, Mail, Users, Flame, ChevronRight } from 'lucide-react';
import { AnimatedCard } from '../components/ui/Card';
import { api } from '../utils/api';

function generateContributionMap(records) {
  const map = {};
  records.forEach(r => {
    if (!r.completedAt) return;
    const key = r.completedAt.substring(0, 10);
    map[key] = (map[key] || 0) + 1;
  });
  const days = [];
  for (let i = 363; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().substring(0, 10);
    const count = map[key] || 0;
    days.push(count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4);
  }
  return days;
}

export default function ProfilePage({ user, records = [], onLogout }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getMyStats().then(data => { if (data) setStats(data); });
  }, [records.length]);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'S';
  const heatmapData = useMemo(() => {
    if (stats?.heatmap?.length > 0) return stats.heatmap;
    return generateContributionMap(records);
  }, [stats, records]);
  const totalContributions = stats?.totalAnswers ?? records.length;

  return (
    <div className="flex-1 w-full pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-12">

          {/* Left Column: User Context */}
          <div className="lg:col-span-3">
            <AnimatedCard delay={0.1} className="p-6 lg:sticky lg:top-24">
              <div className="flex flex-col items-center text-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-40 h-40 rounded-full object-cover border-[3px] border-[#333333] shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6 z-10" />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-dark-surface to-[#1a1a1a] border-[3px] border-[#333333] shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center mb-6 relative overflow-hidden z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/20 to-[#ff6b35]/20 z-0"></div>
                    <span className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#888888] z-10 font-logo tracking-tighter">
                      {initial}
                    </span>
                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-dark-bg border border-accent-neutral/30 rounded-full flex items-center justify-center z-20 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                      <span className="text-lg">🔥</span>
                    </div>
                  </div>
                )}

                <h1 className="text-2xl font-black text-white mb-1">{user?.name || 'Developer Name'}</h1>
                <h2 className="text-sm text-[#00d4aa] font-bold mb-6 pb-6 border-b border-accent-neutral/10 w-full tracking-wide">@{user?.name?.toLowerCase().replace(' ', '') || 'skillbiteuser'}</h2>

                <p className="text-[14px] text-accent-light leading-relaxed mb-8 italic">
                  "Passionate developer constantly crushing <span className="text-[#ff6b35] font-semibold not-italic">Daily Bites</span> to level up inside the React architecture framework."
                </p>

                <div className="flex flex-col gap-3 text-sm text-accent-neutral w-full bg-dark-bg/60 p-4 rounded-xl border border-accent-neutral/10 mb-8">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-[#ff6b35] shrink-0" />
                    <span className="truncate">Remote Environment</span>
                  </div>
                  <div className="flex items-center gap-3 hover:text-[#00d4aa] cursor-pointer transition-colors group">
                    <LinkIcon size={16} className="text-[#00d4aa] shrink-0" />
                    <a href="#" className="font-bold truncate group-hover:underline">skillbite.app/@{user?.name?.toLowerCase().replace(' ', '') || 'dev'}</a>
                  </div>
                  <div className="flex items-center gap-3 hover:text-[#00aafe] cursor-pointer transition-colors group">
                    <Mail size={16} className="text-[#00aafe] shrink-0" />
                    <a href="#" className="font-bold truncate group-hover:underline">{user?.email || 'dev@skillbite.app'}</a>
                  </div>
                </div>

                <div className="w-full">
                  <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-4 text-center">Achievements</h3>
                  <div className="flex justify-center gap-3">
                    <div className="w-12 h-12 rounded-xl border border-accent-neutral/20 bg-gradient-to-br from-dark-surface to-dark-bg flex items-center justify-center shadow-[0_0_15px_rgba(255,107,53,0.1)] hover:border-[#ff6b35]/50 transition-colors cursor-pointer group">
                      <span className="text-xl group-hover:scale-110 transition-transform">🏆</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl border border-accent-neutral/20 bg-gradient-to-br from-dark-surface to-dark-bg flex items-center justify-center shadow-[0_0_15px_rgba(0,212,170,0.1)] hover:border-[#00d4aa]/50 transition-colors cursor-pointer group">
                      <span className="text-xl group-hover:scale-110 transition-transform">⚡</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl border border-accent-neutral/20 bg-gradient-to-br from-dark-surface to-dark-bg flex items-center justify-center shadow-[0_0_15px_rgba(0,170,254,0.1)] hover:border-[#00aafe]/50 transition-colors cursor-pointer group">
                      <span className="text-xl group-hover:scale-110 transition-transform">🚀</span>
                    </div>
                  </div>
                </div>

                <button onClick={onLogout} className="mt-8 w-full py-3 rounded-xl font-black text-xs text-red-500/80 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 transition-all uppercase tracking-[0.15em] hover:text-red-400">
                  Sign Out
                </button>
              </div>
            </AnimatedCard>
          </div>

          {/* Right Column: Dynamic Matrix (75% width) */}
          <div className="lg:col-span-9 flex flex-col gap-8 lg:pl-4">

            {/* Streak Matrix (Heatmap) */}
            <AnimatedCard delay={0.3} className="pt-2">
              <div className="flex items-center justify-between mb-2 px-6 pt-6">
                <h3 className="text-sm font-normal text-white">Work Streak</h3>
                <span className="text-xs font-semibold text-accent-neutral hover:text-white cursor-pointer transition-colors">Settings ▼</span>
              </div>
              <div className="p-6 border border-accent-border rounded-xl bg-dark-surface w-full overflow-hidden">
                <div className="flex gap-1 w-full justify-start items-start">
                  <div className="flex flex-col gap-[2px] text-[9.5px] text-accent-neutral mr-4 font-bold shrink-0">
                    <span className="h-[11px] flex items-center">Sun</span>
                    <span className="h-[11px] flex items-center">Mon</span>
                    <span className="h-[11px] flex items-center">Tue</span>
                    <span className="h-[11px] flex items-center">Wed</span>
                    <span className="h-[11px] flex items-center">Thu</span>
                    <span className="h-[11px] flex items-center">Fri</span>
                    <span className="h-[11px] flex items-center">Sat</span>
                  </div>
                  {/* Map Cols (53 weeks for full year) */}
                  <div className="flex gap-[2px] items-start">
                    {Array.from({ length: 53 }).map((_, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-[2px]">
                        {Array.from({ length: 7 }).map((_, rowIndex) => {
                          const idx = colIndex * 7 + rowIndex;
                          const intensity = heatmapData[idx % heatmapData.length];
                          const bgColors = [
                            'bg-[#1a1a1a] border transition-colors border-white/30 hover:border-white/60',
                            'bg-[#ff6b35]/25 border border-white/20',
                            'bg-[#ff6b35]/50 border border-white/20',
                            'bg-[#ff6b35]/80 border border-white/20',
                            'bg-[#ff6b35] shadow-[0_0_8px_rgba(255,107,53,0.7)] border border-white/30'
                          ];
                          return (
                            <div
                              key={rowIndex}
                              className={`w-[11px] h-[11px] rounded-[2.5px] transition-colors hover:border hover:border-white ${bgColors[intensity]} cursor-pointer shrink-0`}
                              title={`${intensity} contributions on this day`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 w-full px-2">
                  <span></span>
                  <div className="flex items-center gap-1.5 text-[11px] text-accent-neutral font-semibold">
                    <span>Less</span>
                    <div className="w-[11px] h-[11px] rounded-[2.5px] bg-[#1a1a1a] border border-white/30"></div>
                    <div className="w-[11px] h-[11px] rounded-[2.5px] bg-[#ff6b35]/25 border border-white/20"></div>
                    <div className="w-[11px] h-[11px] rounded-[2.5px] bg-[#ff6b35]/50 border border-white/20"></div>
                    <div className="w-[11px] h-[11px] rounded-[2.5px] bg-[#ff6b35]/80 border border-white/20"></div>
                    <div className="w-[11px] h-[11px] rounded-[2.5px] bg-[#ff6b35] border border-white/30"></div>
                    <span>More</span>
                  </div>
                </div>

                {/* Animated Data Section */}
                <div className="mt-8 pt-8 border-t border-accent-neutral/10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-accent-neutral uppercase tracking-[0.2em]">Total Contributions</span>
                    <div className="flex items-baseline gap-2">
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xl font-bold text-white shadow-[#ff6b35]/20 drop-shadow-sm"
                      >
                        {totalContributions.toLocaleString()}
                      </motion.span>
                      <span className="text-xs text-[#00d4aa] font-bold">+12% vs last month</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-accent-neutral uppercase tracking-[0.2em]">Current Streak</span>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-white flex items-center gap-2">
                        <Flame size={18} className="text-[#ff6b35] animate-pulse" />
                        {stats?.streak || 0} Days
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Contribution Timeline */}
            <div className="mt-2 text-white">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-base font-normal text-white">Running Progress</h3>
                <button className="bg-gradient-to-r from-[#00d4aa] to-[#00a884] hover:brightness-110 text-[#0a0a0a] text-xs font-black px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(0,212,170,0.3)]">
                  {new Date().getFullYear()}
                </button>
              </div>

              <div className="relative pl-6 space-y-12">
                {/* Timeline Axis Line */}
                <div className="absolute top-2 bottom-0 left-[27px] w-[2px] bg-accent-neutral/20 z-0"></div>

              <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border-[2px] border-accent-neutral/30 flex items-center justify-center shrink-0">
                        <Flame size={16} className="text-[#ff6b35]" />
                      </div>
                      <span className="text-[15px] font-semibold text-white group-hover:text-[#ff6b35] transition-colors">Completed {totalContributions} bites in multiple tracks</span>
                    </div>
                  </div>

                  <div className="ml-12 p-1 relative border-l border-r border-[#ff6b35]/10 flex flex-col gap-2">
                    {stats?.skillChart?.length > 0 ? stats.skillChart.slice(0, 3).map((skill, i) => {
                      const colors = ['#00d4aa', '#ff6b35', '#00aafe'];
                      const color = colors[i % colors.length];
                      const pct = Math.min(100, skill.score);
                      return (
                        <div key={skill.subject} className="relative">
                          <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-[5px] h-[2px] bg-[#ff6b35]/50"></div>
                          <div className="px-4 py-3 bg-dark-bg/60 rounded-xl border border-accent-neutral/10 flex justify-between items-center group cursor-pointer hover:bg-dark-surface transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold capitalize" style={{ color }}>{skill.subject}</span>
                              <span className="text-xs text-accent-neutral leading-none tracking-wide ml-2 bg-dark-surface px-2 py-1 rounded-full border border-accent-neutral/10">{pct}% mastery</span>
                            </div>
                            <div className="w-32 h-2.5 bg-dark-surface rounded-full overflow-hidden shrink-0 border border-accent-neutral/20">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${color}, ${color}cc)`, boxShadow: `0 0 10px ${color}80` }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="px-4 py-3 text-sm text-accent-neutral">Complete challenges to see skill progress</div>
                    )}
                  </div>
                </div>

                {/* Timeline Block 2 — Recent Activity */}
                <div className="relative z-10 pb-6 mt-8">
                  <div className="flex justify-between items-center mb-4 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border-[2px] border-accent-neutral/30 flex items-center justify-center shrink-0">
                        <Folder size={16} className="text-[#00aafe]" />
                      </div>
                      <span className="text-[15px] font-semibold text-white group-hover:text-[#00aafe] transition-colors">Recent Activity</span>
                    </div>
                  </div>

                  <div className="ml-12 p-1 relative border-l border-r border-[#00aafe]/10 flex flex-col gap-2">
                    {records.slice(-5).reverse().map((r, i) => {
                      const colors = ['#00aafe', '#9d4edd', '#ff3366', '#ff6b35', '#00d4aa'];
                      const color = colors[i % colors.length];
                      return (
                        <div key={r.id ?? i} className="relative">
                          <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-[5px] h-[2px] bg-[#00aafe]/50"></div>
                          <div className="px-4 py-3 bg-dark-bg/60 rounded-xl border border-accent-neutral/10 flex justify-between items-center group cursor-pointer hover:bg-dark-surface transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold capitalize" style={{ color }}>{r.challengeName}</span>
                              <span className="text-xs text-accent-neutral leading-none tracking-wide ml-2 bg-dark-surface px-2 py-1 rounded-full border border-accent-neutral/10 capitalize">{r.skillCategory}</span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${r.isCorrect ? 'text-accent-success' : 'text-red-400'}`}>
                              {r.isCorrect ? `+${r.xpEarned} XP` : 'Failed'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {records.length === 0 && (
                      <div className="px-4 py-3 text-sm text-accent-neutral">No recent activity yet</div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
