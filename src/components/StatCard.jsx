import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 1.11, 0.81, 0.99] }}
      className="bg-card rounded-2xl p-6 shadow-md border border-border/60 backdrop-blur-sm hover:border-primary/20 transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-muted-foreground/90 tracking-wide">
          {title}
        </h3>
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5 shadow-inner">
          <Icon className="w-5.5 h-5.5 text-primary" />
        </div>
      </div>
      <p 
        className="text-3xl font-bold text-foreground tracking-tight" 
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </p>
    </motion.div>
  );
};

export default StatCard;