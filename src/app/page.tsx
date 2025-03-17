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
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [icons, setIcons] = useState<Icons>({
    vr: { isExpanded: false, level: 1, description: "VR Training", position: 'left' },
    game: { isExpanded: false, level: 1, description: "Game Elements", position: 'center' },
    trophy: { isExpanded: false, level: 1, description: "Achievements", position: 'right' }
  });
  const router = useRouter();

  // Optimize scroll progress calculation
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Update mouse position handler with hover state
  const handleMouseMove = useMemo(
    () =>
      throttle((e: MouseEvent) => {
        if (isClient) {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }
      }, 16),
    [isClient]
  );

  // Add hover handlers
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  useEffect(() => {
    setIsClient(true);
    
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove]);

  // Initial render with minimal content
  if (!isClient) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-black">
        <div className="flex items-center justify-center min-h-screen">
          {/* Static content for initial render */}
          <h1 className={`text-6xl md:text-8xl font-bold mb-8 relative px-4 ${syne.className} tracking-tight break-words`}>
            AR Training
          </h1>
        </div>
      </main>
    );
  }

  const backgroundVariants: Variants = {
    initial: {
      backgroundColor: '#000000'
    },
    animate: {
      backgroundColor: ['#000000', '#1a1a2e', '#000000'],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: "mirror"
      }
    }
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const features: Feature[] = [
    {
      icon: <FaVrCardboard className="text-4xl text-blue-400" />,
      title: "Immersive AR Learning",
      description: "Step into a new dimension of training with our state-of-the-art AR technology. Experience hands-on learning like never before.",
      gradient: "from-blue-400 to-blue-600",
      level: "Beginner Friendly",
      stats: { users: "1000+", rating: "4.8/5" },
      difficulty: "Beginner Friendly"
    },
    {
      icon: <FaRobot className="text-4xl text-green-400" />,
      title: "Smart AI Guidance",
      description: "Our advanced AI adapts to your learning style, providing real-time feedback and personalized training paths.",
      gradient: "from-green-400 to-green-600",
      level: "Advanced AI",
      stats: { accuracy: "98%", responses: "Real-time" },
      difficulty: "Advanced AI"
    },
    {
      icon: <FaGamepad className="text-4xl text-purple-400" />,
      title: "Gamified Training",
      description: "Transform your learning journey into an exciting adventure with interactive challenges and reward systems.",
      gradient: "from-purple-400 to-purple-600",
      level: "Interactive",
      stats: { challenges: "50+", rewards: "25+" },
      difficulty: "Interactive"
    },
    {
      icon: <FaChartLine className="text-4xl text-yellow-400" />,
      title: "Smart Analytics",
      description: "Track your progress with detailed insights and visualizations. Watch your skills grow in real-time.",
      gradient: "from-yellow-400 to-yellow-600",
      level: "Real-time Stats",
      stats: { metrics: "15+", insights: "Daily" },
      difficulty: "Real-time Stats"
    },
    {
      icon: <FaBrain className="text-4xl text-red-400" />,
      title: "Skill Mastery",
      description: "Master complex skills through practical scenarios and progressive learning paths.",
      gradient: "from-red-400 to-red-600",
      level: "Skill Tree",
      stats: { skills: "30+", paths: "10+" },
      difficulty: "Skill Tree"
    },
    {
      icon: <FaTrophy className="text-4xl text-orange-400" />,
      title: "Achievement System",
      description: "Unlock achievements, earn certificates, and showcase your expertise as you progress.",
      gradient: "from-orange-400 to-orange-600",
      level: "Rewards",
      stats: { badges: "40+", certificates: "12" },
      difficulty: "Rewards"
    }
  ];

  const handleIconClick = (iconKey: keyof Icons) => {
    setIcons(prev => ({
      ...prev,
      [iconKey]: {
        ...prev[iconKey],
        isExpanded: !prev[iconKey].isExpanded,
        level: prev[iconKey].isExpanded ? prev[iconKey].level : prev[iconKey].level + 1
      }
    }));

    // Add haptic feedback if supported
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }

    // Play click sound
    const audio = new Audio('/click.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  return (
    <main 
      className="min-h-screen relative overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ScrollProgress />
      
      <Fragment>
        <DynamicAnimatedBackground />
        <DynamicFloatingElements />
        <DynamicClickEffect />
        {isHovering && mousePosition.x > 0 && (
          <DynamicMouseFollowEffect mousePosition={mousePosition} />
        )}

        {/* Content sections with updated backgrounds */}
        <div className="relative z-10">
          {/* Intro Hero Section */}
          <Section className="min-h-screen flex-col items-center justify-center">
            <motion.div
              className="text-center relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {/* Interactive Icons */}
              <div className="flex justify-center gap-20 mb-24">
                {Object.entries(icons).map(([key, value]) => (
                  <motion.div
                    key={key}
                    className="relative"
                    initial={false}
                    animate={{
                      x: value.isExpanded ? (value.position === 'left' ? -100 : value.position === 'right' ? 100 : 0) : 0,
                      y: value.isExpanded ? 20 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <MagneticButton>
                      <motion.div
                        className="relative cursor-pointer"
                        onClick={() => handleIconClick(key as keyof Icons)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="relative z-10"
                          animate={{
                            rotate: value.isExpanded ? 360 : 0,
                            scale: value.isExpanded ? 1.2 : 1,
                          }}
                          transition={{ 
                            duration: 0.5,
                            rotate: { type: "spring", stiffness: 200 },
                            scale: { type: "spring", stiffness: 300 }
                          }}
                        >
                          <motion.div
                            className="absolute -inset-4 rounded-full"
                            style={{
                              background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3), transparent)',
                              filter: 'blur(8px)',
                            }}
                            animate={{
                              scale: value.isExpanded ? [1, 1.2, 1] : 1,
                              opacity: value.isExpanded ? [0.5, 0.8, 0.5] : 0.3,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                          <motion.div
                            className="relative text-4xl"
                            whileHover={{
                              filter: "brightness(1.2) saturate(1.2)",
                              textShadow: "0 0 15px currentColor",
                            }}
                          >
                            {key === 'vr' ? (
                              <FaVrCardboard className="text-blue-400" />
                            ) : key === 'game' ? (
                              <FaGamepad className="text-purple-400" />
                            ) : (
                              <FaTrophy className="text-yellow-400" />
                            )}
                          </motion.div>
                        </motion.div>

                        {value.isExpanded && (
                          <motion.div
                            className={`absolute ${
                              value.position === 'left' ? 'left-16' :
                              value.position === 'right' ? 'right-16' :
                              'left-1/2 transform -translate-x-1/2'
                            } top-0 bg-gray-900/90 backdrop-blur-lg rounded-xl p-4 md:p-6 w-[250px] md:w-[300px]
                            border border-gray-800/50 shadow-xl`}
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                          >
                            <motion.div
                              className="absolute inset-0 rounded-xl overflow-hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                className="absolute inset-0"
                                style={{
                                  background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.1), transparent 120%)',
                                }}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </motion.div>
                            
                            <div className="relative z-10 space-y-3 md:space-y-4">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                              
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <h3 className={`text-lg md:text-xl font-bold text-white mb-2 ${syne.className} tracking-tight line-clamp-1`}>
                                  Level {value.level}
                                </h3>
                                <p className={`text-sm md:text-base text-gray-400 ${inter.className} font-light line-clamp-2`}>
                                  {value.description}
                                </p>
                              </motion.div>

                              <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <motion.div
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 360],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <FaBolt className="text-yellow-400 text-xl" />
                                </motion.div>
                                <span className="text-sm text-gray-300">+{value.level * 10} XP</span>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </MagneticButton>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced title with dynamic effects */}
              <motion.h1
                className={`text-6xl md:text-8xl font-bold mb-8 relative px-4 ${syne.className} tracking-tight break-words cursor-default`}
                style={{
                  background: 'linear-gradient(to right, #4a90e2, #67b26f, #4a90e2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 100%',
                }}
                whileHover={{
                  scale: 1.05,
                  textShadow: "0 0 80px rgba(74, 144, 226, 0.5)",
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  backgroundPosition: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                AR Training
              </motion.h1>

              {/* Enhanced description with hover effect */}
              <motion.p
                className={`text-xl md:text-3xl mb-24 mx-auto px-4 ${spaceGrotesk.className} font-light max-w-[90%] md:max-w-3xl`}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background: 'linear-gradient(to right, #a8b2ff, #ffffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Step into the future of immersive learning
              </motion.p>

              {/* Add ScrollPrompt here */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                <ScrollPrompt />
              </div>
            </motion.div>
          </Section>

          {/* Description Section */}
          <Section className="bg-gradient-to-b from-transparent to-black/20 relative">
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
              }}
            />
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center space-y-8"
              >
                <h2 className={`text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 ${syne.className} tracking-tight mb-6 px-4`}>
                  Welcome to the Future of Training
                </h2>
                <p className={`text-base md:text-xl text-gray-300 leading-relaxed ${inter.className} font-light px-4 max-w-[90%] md:max-w-4xl mx-auto`}>
                  Our AR Training Platform combines cutting-edge augmented reality technology with 
                  artificial intelligence to create an immersive learning experience. Whether you're 
                  a beginner or an expert, our adaptive system guides you through personalized 
                  training modules, helping you master complex skills in an engaging and interactive way.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 px-4">
                  <div className="bg-blue-900/20 p-4 md:p-6 rounded-lg backdrop-blur-sm">
                    <h3 className={`text-2xl md:text-3xl font-bold text-blue-400 mb-2 ${syne.className}`}>500+</h3>
                    <p className={`text-sm md:text-base text-gray-400 ${inter.className} font-light`}>Active Learners</p>
                  </div>
                  <div className="bg-purple-900/20 p-4 md:p-6 rounded-lg backdrop-blur-sm">
                    <h3 className={`text-2xl md:text-3xl font-bold text-purple-400 mb-2 ${syne.className}`}>50+</h3>
                    <p className={`text-gray-400 ${inter.className} font-light`}>Training Modules</p>
                  </div>
                  <div className="bg-pink-900/20 p-4 md:p-6 rounded-lg backdrop-blur-sm">
                    <h3 className={`text-2xl md:text-3xl font-bold text-pink-400 mb-2 ${syne.className}`}>98%</h3>
                    <p className={`text-gray-400 ${inter.className} font-light`}>Success Rate</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Section>

          {/* Features Section */}
          <Section className="bg-gradient-to-b from-black/20 to-transparent relative">
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)'
              }}
            />
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.h2
                  className={`text-6xl font-bold text-center mb-16 ${syne.className} tracking-tight`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    background: 'linear-gradient(to right, #4a90e2, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Training Features
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} index={index} />
                  ))}
                </div>
              </motion.div>
            </div>
          </Section>

          {/* Call to Action Section */}
          <Section className="bg-gradient-to-b from-transparent to-black relative min-h-[70vh]">
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.1) 0%, transparent 70%)'
              }}
            />
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2
                className={`text-6xl font-bold mb-8 ${syne.className} tracking-tight`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  background: 'linear-gradient(to right, #4a90e2, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ready to Begin?
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Link
                  href="/training"
                  className={`group relative inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                             text-white font-bold py-4 md:py-5 px-6 md:px-10 rounded-full text-base md:text-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${spaceGrotesk.className}`}
                >
                  <motion.span 
                    className="relative z-10 tracking-wide whitespace-nowrap"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Begin Your Journey
                  </motion.span>
                  <motion.span
                    className="relative z-10"
                    animate={{
                      x: [0, 5, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      x: { duration: 1.5, repeat: Infinity },
                      rotate: { duration: 2, repeat: Infinity },
                    }}
                  >
                    <FaArrowRight className="text-xl" />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </Section>
        </div>
      </Fragment>
    </main>
  );
}
