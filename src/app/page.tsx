'use client';

import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { motion, AnimatePresence, Variants, useSpring, useTransform, useScroll, useInView, useMotionValue, MotionValue } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaVrCardboard, FaGamepad, FaTrophy, FaArrowRight, FaLevelUpAlt, FaStar, FaGem, FaBrain, FaAtom, FaBolt } from 'react-icons/fa';
import { Orbitron, Space_Grotesk, Inter, Syne } from 'next/font/google';
import Link from 'next/link';
import dynamic from 'next/dynamic';

interface IconState {
  isExpanded: boolean;
  level: number;
  description: string;
  position: 'left' | 'center' | 'right';
}

interface Icons {
  vr: IconState;
  game: IconState;
  trophy: IconState;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  level: string;
  stats: {
    [key: string]: string;
  };
  difficulty: string;
}

interface InteractiveElement {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  isActive: boolean;
}

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
}

interface IconCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
  isExpanded: boolean;
}

const iconDescriptions = {
  vr: "Master AR technology through hands-on practice",
  game: "Complete challenges and earn rewards",
  trophy: "Track your progress and achievements"
};

const orbitron = Orbitron({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });
const syne = Syne({ subsets: ['latin'] });

const FloatingIcon = ({ Icon, delay = 0, x = 0, y = 0 }: { Icon: any, delay?: number, x?: number, y?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.2, 1],
      y: [y, y - 10, y],
      x: [x, x + 5, x],
      rotate: [0, 360]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatType: "reverse"
    }}
  >
    <Icon className="text-4xl text-blue-400" />
  </motion.div>
);

const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`min-h-screen flex items-center justify-center relative ${className}`}
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </motion.div>
      {children}
    </motion.section>
  );
};

const ParallaxText: React.FC<{ children: string, baseVelocity?: number }> = ({ children, baseVelocity = 100 }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const textScrollVelocity = useTransform(scrollY as MotionValue<number>, [0, 100], [0, baseVelocity]);
  const smoothTextVelocity = useSpring(textScrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothTextVelocity, [0, 1000], [0, 5], {
    clamp: false
  });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    function animate() {
      if (timeoutId) clearTimeout(timeoutId);
      baseX.set(baseX.get() + baseVelocity);
      timeoutId = setTimeout(animate, 1000 / 60);
    }
    animate();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [baseVelocity, baseX]);

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div
        className="text-4xl font-bold text-white/10 uppercase tracking-tight"
        style={{ x }}
      >
        <span className="mr-4">{children}</span>
        <span className="mr-4">{children}</span>
        <span className="mr-4">{children}</span>
        <span className="mr-4">{children}</span>
      </motion.div>
    </div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
      style={{ scaleX }}
    />
  );
};

const ScrollPrompt = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-gray-400 space-y-2"
      style={{ opacity }}
    >
      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <FaArrowRight className="text-2xl rotate-90 text-blue-400" />
      </motion.div>
      <span className={`text-sm font-medium tracking-wider text-gray-300 ${spaceGrotesk.className}`}>
        Scroll to Explore
      </span>
    </motion.div>
  );
};

const InteractiveBackground: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const [elements, setElements] = useState<InteractiveElement[]>([]);
  const maxElements = 5;

  const handleClick = (e: React.MouseEvent) => {
    const newElement = {
      x: e.clientX,
      y: e.clientY,
      scale: 1,
      rotation: Math.random() * 360,
      isActive: true
    };

    setElements(prev => {
      if (prev.length >= maxElements) {
        return [...prev.slice(1), newElement];
      }
      return [...prev, newElement];
    });
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-auto cursor-crosshair"
      onClick={handleClick}
    >
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute w-40 h-40 pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.5, 0],
            scale: [1, 2, 3],
            x: element.x - 80,
            y: element.y - 80,
            rotate: [0, 90]
          }}
          transition={{
            duration: 2,
            ease: "easeOut"
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl" />
        </motion.div>
      ))}
    </div>
  );
};

const FeatureCard: React.FC<{ feature: Feature, index: number }> = ({ feature, index }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.8,
          delay: index * 0.2,
          ease: "easeOut"
        }
      } : {}}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div 
        className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl"
        animate={{
          scale: isHovered ? [1, 1.1, 1] : 1,
          rotate: isHovered ? [0, 5, -5, 0] : 0
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative bg-gray-900/80 backdrop-blur-sm p-4 md:p-8 rounded-xl border border-gray-700/50 group-hover:border-gray-600 transition-all duration-300">
        <div className="relative z-10">
          <motion.div 
            className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-blue-900/20 group-hover:to-purple-900/20 transition-all duration-300"
            >
              {feature.icon}
            </motion.div>
            <div>
              <motion.h3 
                className={`text-lg md:text-xl font-semibold text-white ${syne.className} tracking-tight line-clamp-2`}
              >
                {feature.title}
              </motion.h3>
              <p className={`text-xs md:text-sm text-gray-400 mt-1 ${inter.className}`}>{feature.difficulty}</p>
            </div>
          </motion.div>

          <motion.p 
            className={`text-sm md:text-base text-gray-300 mb-4 md:mb-6 ${inter.className} font-light leading-relaxed line-clamp-3`}
          >
            {feature.description}
          </motion.p>

          <motion.div 
            className="flex items-center justify-between text-sm"
            animate={{
              y: isHovered ? [0, 2, 0] : 0
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center gap-2 text-gray-400">
              <motion.div
                animate={{
                  rotate: isHovered ? [0, 360] : 0,
                  scale: isHovered ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: 2,
                  repeat: isHovered ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <FaBolt className="text-yellow-400" />
              </motion.div>
              <span>{feature.level}</span>
            </div>
            <div className="flex gap-4">
              {Object.entries(feature.stats).map(([key, value], i) => (
                <motion.div 
                  key={key} 
                  className="text-right"
                  animate={{
                    y: isHovered ? [0, -3, 0] : 0
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <div className="text-sm font-semibold text-gray-300">{value}</div>
                  <div className="text-xs text-gray-500 capitalize">{key}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl"
          animate={{
            scaleX: isHovered ? [0, 1] : 0
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(to right, ${feature.gradient})`
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const MagneticButton: React.FC<MagneticProps> = ({ children, className = "" }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.15;
    const y = (clientY - (top + height / 2)) * 0.15;
    setPosition({ x, y });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const IconCard: React.FC<IconCardProps> = ({ icon: Icon, title, description, onClick, isExpanded }) => (
  <MagneticButton className="relative group cursor-pointer">
    <motion.div
      onClick={onClick}
      className="relative p-6 rounded-xl bg-gray-900/50 backdrop-blur-lg border border-gray-800/50 
                 transition-all duration-300 group-hover:border-gray-700/50"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 
                   rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1), transparent)",
            "radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.1), transparent)",
            "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1), transparent)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div className="relative z-10">
        <Icon className="text-4xl mb-4" />
        <h3 className={`text-xl font-bold text-white mb-2 ${syne.className} tracking-tight`}>{title}</h3>
        <p className={`text-gray-400 ${inter.className} font-light`}>{description}</p>
      </motion.div>
    </motion.div>
  </MagneticButton>
);

// Optimized throttle function
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Add new AnimatedGrid component
const AnimatedGrid = React.memo(() => (
  <div className="fixed inset-0 z-0">
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, rgba(74, 144, 226, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(74, 144, 226, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  </div>
));

AnimatedGrid.displayName = 'AnimatedGrid';

// Update AnimatedBackground with client-side only rendering
const AnimatedBackground = React.memo(() => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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
          x: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0
          },
          y: {
            duration: 35,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0
          }
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
          x: {
            duration: 35,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0
          },
          y: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0
          }
        }}
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.1 }}
        animate={{
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 0
        }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

// Update MouseFollowEffect with client-side only rendering
const MouseFollowEffect = React.memo<{ mousePosition: { x: number; y: number } }>(({ mousePosition }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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
      <div 
        className="relative w-[600px] h-[600px]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent rounded-full blur-[100px]" />
        <div className="absolute inset-[25%] bg-gradient-to-r from-white/10 to-transparent rounded-full blur-[80px]" />
      </div>
    </motion.div>
  );
});

MouseFollowEffect.displayName = 'MouseFollowEffect';

// Optimized particle system
const renderParticles = () => {
  const particleCount = 5;
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {[...Array(particleCount)].map((_, id) => (
        <motion.div
          key={id}
          className="absolute w-1 h-1 rounded-full bg-blue-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: id * 0.5
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Add new FloatingElements component
const FloatingElements = React.memo(() => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Floating squares */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`square-${i}`}
        className="absolute w-4 h-4 rounded-sm border border-white/10"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          rotate: [0, 180, 360],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10 + Math.random() * 5,
          repeat: Infinity,
          ease: "linear",
          delay: i * 0.5,
        }}
      />
    ))}
    
    {/* Floating dots */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={`dot-${i}`}
        className="absolute w-1 h-1 rounded-full bg-white/20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
));

// Add new ClickEffect component
const ClickEffect = React.memo(() => {
  const [clicks, setClicks] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const newClick = {
      x: e.clientX,
      y: e.clientY,
      id: Date.now(),
    };
    setClicks((prev) => [...prev, newClick]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((click) => click.id !== newClick.id));
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-auto"
      onClick={handleClick}
    >
      {clicks.map((click) => (
        <motion.div
          key={click.id}
          initial={{ scale: 0, x: click.x - 25, y: click.y - 25, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute w-12 h-12 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
      ))}
    </div>
  );
});

// Dynamically import components that use client-side only features
const DynamicAnimatedBackground = dynamic(() => Promise.resolve(AnimatedBackground), { ssr: false });
const DynamicMouseFollowEffect = dynamic(() => Promise.resolve(MouseFollowEffect), { ssr: false });
const DynamicFloatingElements = dynamic(() => Promise.resolve(FloatingElements), { ssr: false });
const DynamicClickEffect = dynamic(() => Promise.resolve(ClickEffect), { ssr: false });

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Initial server-side render or loading state
  if (!isMounted) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-black">
        <div className="flex items-center justify-center min-h-screen">
          <h1 className={`text-6xl md:text-8xl font-bold mb-8 relative px-4 ${syne.className} tracking-tight break-words text-white`}>
            AR Training
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen relative overflow-hidden bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      <Fragment>
        <DynamicAnimatedBackground />
        {isHovering && mousePosition.x > 0 && (
          <DynamicMouseFollowEffect mousePosition={mousePosition} />
        )}
        
        {/* Main content */}
        <div className="relative z-10">
          {/* Your existing content */}
        </div>
      </Fragment>
    </main>
  );
}
