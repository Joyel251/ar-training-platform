'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MouseFollowEffectProps {
  mousePosition: {
    x: number;
    y: number;
  };
}

const MouseFollowEffect: React.FC<MouseFollowEffectProps> = ({ mousePosition }) => {
  return (
    <motion.div 
      className="fixed pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 0.5,
        x: mousePosition.x - 300,
        y: mousePosition.y - 300,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 30,
        mass: 0.8
      }}
      style={{
        transform: 'translateZ(0)',
      }}
    >
      <div className="relative w-[600px] h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent rounded-full blur-[100px]" />
        <div className="absolute inset-[25%] bg-gradient-to-r from-white/10 to-transparent rounded-full blur-[80px]" />
      </div>
    </motion.div>
  );
};

export default MouseFollowEffect; 