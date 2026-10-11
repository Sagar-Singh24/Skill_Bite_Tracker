import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const SUGGESTIONS = [
  "How can I improve my daily streak?",
  "Suggest a Python challenge.",
  "What is my strongest skill?",
  "How does the scoring work?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your Skill Bite assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking and responding
    setTimeout(() => {
      let botText = "That's a great question! However, I am currently a prototype assistant. I will be fully functional soon.";
      
      // Simple keyword matching for mock responses
      const lowerText = text.toLowerCase();
      if (lowerText.includes('streak')) {
        botText = "To improve your daily streak, make sure to complete at least one 'Daily Bite' challenge every day! Consistency is key.";
      } else if (lowerText.includes('python')) {
        botText = "Here is a quick Python challenge: Write a function to reverse a string without using built-in reverse methods.";
      } else if (lowerText.includes('skill')) {
        botText = "Based on your dashboard (mocked check), you excel in React and Frontend fundamentals!";
      } else if (lowerText.includes('scoring') || lowerText.includes('score')) {
        botText = "You earn points for each Daily Bite completed, and bonus consecutive points for maintaining a long streak.";
      }

      const botMessage = { id: Date.now() + 1, text: botText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col bg-dark-surface/95 backdrop-blur-xl border border-accent-neutral/30 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-accent-neutral/20 bg-dark-bg/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center border border-accent-primary/50 shadow-[0_0_10px_rgba(255,107,53,0.2)] text-accent-light">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Skill Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_theme(colors.green.500)] animate-pulse"></span>
                    <span className="text-xs text-accent-neutral">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-accent-neutral hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex max-w-[85%] gap-2 items-end">
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 shrink-0 rounded-full bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30 mb-1">
                        <Bot size={12} className="text-accent-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-accent-primary/80 border border-accent-primary text-white rounded-br-sm'
                          : 'bg-[#2a2a2a] border border-accent-neutral/20 text-accent-light rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 shrink-0 rounded-full bg-dark-surface flex items-center justify-center border border-accent-neutral/30 mb-1">
                        <User size={12} className="text-accent-neutral" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-[85%] gap-2 items-end">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30 mb-1">
                      <Bot size={12} className="text-accent-primary" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-[#2a2a2a] border border-accent-neutral/20 rounded-bl-sm flex gap-1.5 items-center justify-center h-[42px]">
                      <span className="w-1.5 h-1.5 bg-accent-neutral rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-accent-neutral rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-accent-neutral rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 3 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-dark-bg border border-accent-neutral/40 hover:border-accent-primary/50 text-accent-neutral hover:text-white px-3 py-1.5 rounded-full transition-all text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-accent-neutral/20 bg-dark-bg/30">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputMessage); }}
                className="flex items-center gap-2 bg-[#1a1a1a] border border-accent-neutral/30 rounded-xl px-2 py-1.5 focus-within:ring-1 focus-within:ring-accent-primary/50 focus-within:border-accent-primary/50 transition-all"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2 placeholder:text-accent-neutral/70"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-8 h-8 rounded-lg bg-accent-primary/20 hover:bg-accent-primary hover:shadow-[0_0_10px_rgba(255,107,53,0.5)] text-accent-primary hover:text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent-primary/20 disabled:hover:text-accent-primary disabled:hover:shadow-none shrink-0"
                >
                  <Send size={14} className={inputMessage.trim() ? "translate-x-[1px] translate-y-[-1px]" : ""} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-colors border-2 ${
          isOpen 
            ? 'bg-dark-surface border-accent-primary/50 text-accent-light' 
            : 'bg-accent-primary border-transparent text-white'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "close" : "open"}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={26} className="mt-[2px]" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
