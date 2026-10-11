import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Chatbot from '../ui/Chatbot';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

export default function Layout({ children, activePage, onNavigate, user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-transparent text-accent-light overflow-hidden">
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage={activePage} onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
        <TopNav isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} onLogout={onLogout} onNavigate={onNavigate} activePage={activePage} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Chatbot />
    </div>
  );
}

