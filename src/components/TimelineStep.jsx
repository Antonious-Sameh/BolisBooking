import React from 'react';
import { motion } from 'framer-motion';

const TimelineStep = ({ number, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start gap-6 relative"
    >
      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-lg">
        <span className="text-3xl font-bold text-primary-foreground" style={{ letterSpacing: '-0.02em' }}>
          {number}
        </span>
      </div>
      <div className="flex-1 pb-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default TimelineStep;