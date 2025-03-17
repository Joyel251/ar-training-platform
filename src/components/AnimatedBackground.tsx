'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Primary moving light */}
      <motion.div
        className="absolute w-[800px] h-[800px]"
        initial={{ x: '-20%', y: '-20%' }}
        animate={{
          x: ['-20%', '120%', '-20%'],
          y: ['-20%', '120%', '-20%'],
        }}
        transition={{
          x: { duration: 30, repeat: Infinity, ease: "linear" },
          y: { duration: 35, repeat: Infinity, ease: "linear" }
        }}
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Secondary moving light */}
      <motion.div
        className="absolute w-[600px] h-[600px]"
        initial={{ x: '120%', y: '120%' }}
        animate={{
          x: ['120%', '-20%', '120%'],
          y: ['120%', '-20%', '120%'],
        }}
        transition={{
          x: { duration: 35, repeat: Infinity, ease: "linear" },
          y: { duration: 30, repeat: Infinity, ease: "linear" }
        }}
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
};

export default AnimatedBackground; 