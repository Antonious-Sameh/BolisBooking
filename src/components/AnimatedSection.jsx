import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';

const AnimatedSection = ({ children, className, delay = 0, id }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;