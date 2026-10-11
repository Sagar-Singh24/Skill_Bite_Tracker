import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-dark-surface/90 backdrop-blur-md rounded-2xl border border-accent-neutral/30 shadow-lg p-5 transition-all duration-300 hover:shadow-xl hover:border-accent-neutral/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-bold text-accent-light flex items-center gap-2">{title}</h3>
        {subtitle && <p className="text-xs text-accent-light/60 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function AnimatedCard({ className, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="h-full"
    >
      <Card className={cn("h-full", className)}>{children}</Card>
    </motion.div>
  );
}
