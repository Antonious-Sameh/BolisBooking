import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingEffect = ({ text, className, speed = 60 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentLength = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      currentLength++;
      setDisplayedText(text.slice(0, currentLength));
      
      if (currentLength >= text.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: isTyping ? [1, 0] : 0 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle translate-y-[-2px]"
      />
    </span>
  );
};

export default TypingEffect;