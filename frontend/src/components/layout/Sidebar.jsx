import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Home, BarChart2, CheckSquare, Trophy, Settings, LogOut } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard',   icon: Home,        path: 'dashboard' },
  { name: 'Daily Bite',  icon: CheckSquare, path: 'daily' },
  { name: 'Leaderboard', icon: Trophy,      path: 'leaderboard' },
  { name: 'Analytics',   icon: BarChart2,   path: 'analytics' },
  { name: 'Profile',     icon: Settings,    path: 'profile' },
];

export default function Sidebar({ isOpen, setIsOpen, activePage, onNavigate, onLogout }) {
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 80 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col bg-dark-surface/90 backdrop-blur-xl border-r border-accent-neutral/20 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header & Logo Toggle */}
        <div className={`p-3 border-b border-accent-neutral/20 overflow-hidden`}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center transition-all duration-300 rounded-2xl p-2 hover:bg-white/5 active:scale-95 group ${isOpen ? 'justify-start gap-4' : 'justify-center'}`}
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <motion.div 
              layout
              className={`shrink-0 overflow-hidden rounded-xl border border-accent-primary/50 shadow-[0_0_15px_rgba(255,107,53,0.3)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(255,107,53,0.5)] group-hover:border-accent-primary ${isOpen ? 'w-10 h-10' : 'w-12 h-12'}`}
            >
              <img src="/skill_bite_logo.png" alt="Skill Bite Logo" className="w-full h-full object-cover" />
            </motion.div>
            
            <AnimatePresence>
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-black font-logo text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a0a0a0] tracking-wider whitespace-nowrap"
                >
                  SKILL BITE
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>




        <nav className={`flex-1 py-6 ${isOpen ? 'px-4' : 'px-2'} space-y-2 overflow-y-auto`}>
          {menuItems.map((item) => {
            const isActive = activePage === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  onNavigate(item.path);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center ${isOpen ? 'gap-4 px-3' : 'justify-center px-0'} py-3 rounded-2xl transition-all duration-200 group relative ${isActive ? 'bg-accent-neutral/15 text-accent-light border border-accent-neutral/30 shadow-inner' : 'text-accent-neutral hover:bg-dark-bg/50 hover:text-accent-light'}`}
                title={!isOpen ? item.name : undefined}
              >
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-accent-light/5 rounded-2xl border border-accent-light/20" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
                <Icon size={isOpen ? 22 : 24} className={`shrink-0 z-10 transition-all ${isActive ? 'text-accent-light scale-110' : 'text-accent-light/60 group-hover:text-accent-light group-hover:scale-110'}`} />
                {isOpen && <span className="font-medium text-sm whitespace-nowrap z-10">{item.name}</span>}
              </button>
            );
          })}
        </nav>


        <div className={`p-4 border-t border-accent-neutral/20 whitespace-nowrap transition-all duration-300 ${!isOpen ? 'px-2' : 'px-4'}`}>
          <button 
            onClick={onLogout}
            className={`w-full flex items-center justify-center bg-dark-bg hover:bg-dark-bg/80 border border-accent-neutral/30 transition-all text-red-400/80 hover:text-red-400 hover:border-red-500/30 group ${isOpen ? 'h-10 rounded-xl px-4' : 'h-12 w-12 mx-auto rounded-2xl'}`}
            title={!isOpen ? "Sign Out" : undefined}
          >
            {isOpen ? (
              <span className="flex items-center gap-2 text-xs font-bold">
                <LogOut size={16} />
                Sign Out
              </span>
            ) : (
              <LogOut size={20} />
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
