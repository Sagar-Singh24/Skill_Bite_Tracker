import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, User, LogOut, Settings, ChevronRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { SKILL_CATEGORIES } from '../../data/questions';
import { api } from '../../utils/api';

export default function TopNav({ isOpen, setIsOpen, user, onLogout, onNavigate, activePage }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [students, setStudents] = useState([]);
  const searchRef = useRef(null);

  const isLeaderboard = activePage === 'leaderboard';

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'SB';

  useEffect(() => {
    // Only fetch students if on leaderboard? 
    // Actually, always fetching is safer for fast transitions, but let's hide them.
    api.getLeaderboard().then(data => {
      setStudents(Array.isArray(data) ? data : []);
    }).catch(() => setStudents([]));
  }, []);

  const filteredCategories = searchQuery.trim().length > 1
    ? SKILL_CATEGORIES.filter(cat => 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cat.sub.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredStudents = (searchQuery.trim().length > 1 && isLeaderboard)
    ? students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.rollNumber && s.rollNumber.includes(searchQuery))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (cat) => {
    setSearchQuery('');
    setShowSearch(false);
    window.history.pushState(null, '', `/daily/${cat.id}`);
    onNavigate('daily');
  };

  const handleStudentSelect = (_student) => {
    setSearchQuery('');
    setShowSearch(false);
    // Move to leaderboard or profile? User pointed to leaderboard list.
    onNavigate('leaderboard');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-dark-bg/80 backdrop-blur-xl border-b border-accent-neutral/20 w-full transition-all">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 -ml-2 text-accent-neutral hover:text-accent-light hover:bg-dark-surface rounded-xl transition-all"
        >
          <Menu size={20} />
        </button>
        
        <div ref={searchRef} className="hidden sm:block relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-dark-surface/50 border border-accent-neutral/20 rounded-xl w-64 focus-within:ring-2 focus-within:ring-accent-light/40 transition-shadow">
            <Search size={16} className="text-accent-neutral" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              placeholder={isLeaderboard ? "Search tasks, categories, students..." : "Search tasks & categories..."}
              className="bg-transparent border-none outline-none text-xs text-accent-light w-full placeholder:text-accent-neutral"
            />
          </div>

          <AnimatePresence>
            {showSearch && (filteredCategories.length > 0 || filteredStudents.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 min-w-[220px] max-w-[350px] w-full bg-black backdrop-blur-xl border border-accent-neutral/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden z-[60] max-h-80 overflow-y-auto"
              >
                {/* Categories Section */}
                {filteredCategories.length > 0 && (
                  <>
                    <div className="px-3 py-2 border-b border-accent-neutral/5 bg-white/5">
                      <span className="text-[9px] font-black text-accent-neutral uppercase tracking-[0.2em]">Learning Paths</span>
                    </div>
                    <div className="py-1">
                      {filteredCategories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => handleSearchSelect(cat)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg group-hover:scale-110 transition-transform">{cat.emoji}</span>
                            <div>
                              <p className="text-[13px] font-bold text-blue-500 group-hover:text-accent-primary transition-colors">{cat.title}</p>
                              <p className="text-[10px] text-accent-neutral line-clamp-1">{cat.sub}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Students Section */}
                {filteredStudents.length > 0 && (
                  <>
                    <div className="px-3 py-2 border-b border-t border-accent-neutral/5 bg-white/5">
                      <span className="text-[9px] font-black text-accent-neutral uppercase tracking-[0.2em]">Students</span>
                    </div>
                    <div className="py-1">
                      {filteredStudents.map(student => (
                        <button
                          key={student.email}
                          onClick={() => handleStudentSelect(student)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-neutral/10 border border-accent-neutral/20 flex items-center justify-center text-[10px] text-accent-light font-bold">
                              {student.name.substring(0, 1)}
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-white group-hover:text-accent-secondary transition-colors">{student.name}</p>
                              <p className="text-[10px] text-accent-neutral line-clamp-1">Rank #{student.rank || '—'} · {student.xp || 0} XP</p>
                            </div>
                          </div>
                          <ChevronRight size={12} className="text-accent-neutral/30" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-surface/80 border border-accent-neutral/30 shadow-sm">
          <span className="text-sm">🔥</span>
          <span className="text-sm font-bold font-mono text-accent-light glow-text">{user?.streak || 0}</span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className={`relative p-2 rounded-xl text-accent-neutral hover:text-accent-light hover:bg-dark-surface transition-all group ${isNotifOpen ? 'bg-dark-surface text-accent-light ring-2 ring-accent-primary/20' : ''}`}
          >
            <Bell size={20} className="group-hover:scale-110 transition-transform" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-72 rounded-2xl bg-dark-surface border border-accent-border shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col"
              >
                <div className="px-4 py-3 border-b border-accent-border flex justify-between items-center">
                  <p className="text-sm font-bold text-white">Notifications</p>
                  <span className="text-xs text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-full">2 New</span>
                </div>
                
                <div className="flex flex-col max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-accent-border/50 hover:bg-[#252525] transition-colors cursor-pointer flex gap-3 opacity-100">
                    <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-lg">🔥</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">24 Day Streak!</p>
                      <p className="text-xs text-accent-neutral mt-0.5">You've hit a new personal best.</p>
                      <p className="text-[10px] text-accent-neutral/60 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 border-b border-accent-border/50 hover:bg-[#252525] transition-colors cursor-pointer flex gap-3 opacity-100">
                    <div className="w-8 h-8 rounded-full bg-accent-secondary/20 flex items-center justify-center shrink-0">
                      <span className="text-lg">⭐</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">React Master</p>
                      <p className="text-xs text-accent-neutral mt-0.5">You ranked in the top 5% globally.</p>
                      <p className="text-[10px] text-accent-neutral/60 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 border-t border-accent-border text-center hover:bg-[#252525] transition-colors cursor-pointer" onClick={() => setIsNotifOpen(false)}>
                  <span className="text-xs font-semibold text-accent-primary">Mark all as read</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className={`w-10 h-10 rounded-full bg-gradient-to-tr from-[#1a1a1a] to-dark-surface border-2 flex items-center justify-center overflow-hidden hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,107,53,0.3)] ${isProfileOpen ? 'border-accent-primary ring-2 ring-accent-primary/20' : 'border-accent-primary/50'}`}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-tr from-accent-primary to-accent-secondary">{initials}</span>
            )}
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 rounded-2xl bg-dark-surface border border-accent-border shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col py-2"
              >
                <div className="px-4 py-3 border-b border-accent-border mb-1">
                  <p className="text-sm font-bold text-white truncate">{user?.name || 'Developer User'}</p>
                  <p className="text-xs text-accent-neutral truncate">{user?.email || 'dev@skillbite.app'}</p>
                </div>

                <button 
                  onClick={() => { setIsProfileOpen(false); onNavigate('profile'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-accent-neutral hover:text-white hover:bg-[#252525] transition-colors text-left"
                >
                  <Settings size={16} className="text-accent-primary" />
                  Account Settings
                </button>
                
                <button 
                  onClick={() => { setIsProfileOpen(false); if(onLogout) onLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-white hover:bg-red-500/10 transition-colors text-left border-t border-accent-border mt-1"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
