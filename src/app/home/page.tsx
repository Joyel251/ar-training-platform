'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, MotionValue, useVelocity, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { FaVrCardboard, FaRobot, FaTrophy, FaChartLine, FaGamepad, FaBrain, FaArrowRight, FaStar, FaBolt, FaBrain as FaAi, FaArrowLeft } from 'react-icons/fa';
import { Orbitron, Space_Grotesk } from 'next/font/google';
import { useRouter } from 'next/navigation';

const orbitron = Orbitron({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

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
      {children}
    </motion.section>
  );
};

const ParallaxText = ({ children, baseVelocity = 100 }: { children: string, baseVelocity?: number }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
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
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-400"
      animate={{
        y: [0, 10, 0],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <FaArrowRight className="text-2xl rotate-90" />
      <span className="text-sm mt-2">Scroll to Begin</span>
    </motion.div>
  );
};

const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
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
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
      
      <div className="relative bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 group-hover:border-gray-600 transition-all duration-300">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-blue-900/20 group-hover:to-purple-900/20 transition-all duration-300">
              {feature.icon}
            </div>
            <div>
              <h3 className={`text-xl font-semibold text-white ${spaceGrotesk.className}`}>
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{feature.difficulty}</p>
            </div>
          </div>

          <p className={`text-gray-300 mb-6 ${spaceGrotesk.className} leading-relaxed`}>
            {feature.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <FaBolt className="text-yellow-400" />
              <span>{feature.level}</span>
            </div>
            <div className="flex gap-4">
              {Object.entries(feature.stats).map(([key, value]) => (
                <div key={key} className="text-right">
                  <div className="text-sm font-semibold text-gray-300">{value}</div>
                  <div className="text-xs text-gray-500 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
          <motion.div
            className="h-full"
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
            style={{
              background: `linear-gradient(to right, ${feature.gradient})`
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity || 0, {
    damping: 50,
    stiffness: 400
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    setIsMounted(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
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

  // Only render scroll-dependent components after mounting
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold">Loading...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020010] text-white relative overflow-hidden">
      <ScrollProgress />
      
      {/* Back Button */}
      <motion.button
        onClick={() => router.push('/')}
        className="fixed top-6 left-6 z-50 bg-gray-900/80 hover:bg-gray-800/80 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-gray-700/50 backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FaArrowRight className="rotate-180" />
        <span className={`${spaceGrotesk.className}`}>Back</span>
      </motion.button>

      {/* Enhanced Animated background grid */}
      <div className="fixed inset-0 z-0">
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(74, 144, 226, 0.1) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020010]/70 to-[#020010]" />
      </div>

      {/* Enhanced Floating particles */}
      {windowSize.width > 0 && [...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            background: i % 2 === 0 ? 'rgba(74, 144, 226, 0.4)' : 'rgba(168, 85, 247, 0.4)',
            boxShadow: i % 2 === 0 ? '0 0 10px rgba(74, 144, 226, 0.4)' : '0 0 10px rgba(168, 85, 247, 0.4)',
          }}
          animate={{
            x: [
              Math.random() * windowSize.width,
              Math.random() * windowSize.width,
            ],
            y: [
              Math.random() * windowSize.height,
              Math.random() * windowSize.height,
            ],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Content sections */}
      <div className="relative z-10">
        {/* Hero Section with enhanced animations */}
        <Section className="flex-col space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-center relative"
          >
            {/* Enhanced background glow effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-3xl" />
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced title animation */}
            <motion.h1
              className={`text-8xl font-bold mb-8 relative ${orbitron.className}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.span
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% auto',
                }}
              >
                Training Hub
              </motion.span>
              {/* Enhanced rotating star */}
              <motion.div
                className="absolute -top-8 -right-8 w-16 h-16"
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">
                    <FaStar className="text-yellow-400" />
                  </div>
                </div>
              </motion.div>
            </motion.h1>

            {/* Enhanced parallax text */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <ParallaxText baseVelocity={-2}>
                Immersive Learning • AI-Powered • Interactive Training
              </ParallaxText>
            </motion.div>
          </motion.div>
          <ScrollPrompt />
        </Section>

        {/* Description Section */}
        <Section className="bg-gradient-to-b from-transparent to-blue-900/20">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Welcome to the Future of Training
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Our AR Training Platform combines cutting-edge augmented reality technology with 
                artificial intelligence to create an immersive learning experience. Whether you're 
                a beginner or an expert, our adaptive system guides you through personalized 
                training modules, helping you master complex skills in an engaging and interactive way.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-blue-900/20 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">500+</h3>
                  <p className="text-gray-400">Active Learners</p>
                </div>
                <div className="bg-purple-900/20 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">50+</h3>
                  <p className="text-gray-400">Training Modules</p>
                </div>
                <div className="bg-pink-900/20 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-pink-400 mb-2">98%</h3>
                  <p className="text-gray-400">Success Rate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Immersive Learning Section */}
        <Section className="bg-gradient-to-b from-transparent to-blue-900/20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl font-bold mb-6"
                >
                  Immersive Learning
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl text-gray-300"
                >
                  Experience training like never before with our cutting-edge AR technology.
                  Step into a world where learning becomes an adventure.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative w-full h-96 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
                  <FaVrCardboard className="absolute inset-0 m-auto text-9xl text-blue-400" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* AI-Powered Section */}
        <Section className="bg-gradient-to-b from-blue-900/20 to-purple-900/20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative order-2 md:order-1"
              >
                <div className="relative w-full h-96 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse" />
                  <FaAi className="absolute inset-0 m-auto text-9xl text-purple-400" />
                </div>
              </motion.div>
              <div className="order-1 md:order-2">
                <motion.h2
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl font-bold mb-6"
                >
                  AI-Powered Guidance
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl text-gray-300"
                >
                  Let our advanced AI system guide your learning journey.
                  Receive personalized feedback and adaptive training paths.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Features Grid Section */}
        <Section className="bg-gradient-to-b from-purple-900/20 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2
                className="text-5xl font-bold text-center mb-16"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
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
        <Section className="bg-gradient-to-b from-transparent to-[#030014]">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2
              className="text-5xl font-bold mb-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
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
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-5 px-10 rounded-full text-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10">Begin Your Journey</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FaArrowRight className="text-xl" />
                </motion.span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    transform: 'skewX(-20deg) translateX(-100%)',
                  }}
                  animate={{
                    x: ['0%', '200%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </Link>
            </motion.div>
          </motion.div>
        </Section>
      </div>
    </main>
  );
}

// Helper function for ParallaxText
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
} 