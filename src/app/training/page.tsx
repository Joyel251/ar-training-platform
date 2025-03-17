'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaVrCardboard, FaGamepad, FaBrain, FaTrophy, FaArrowRight, FaLock } from 'react-icons/fa';

const trainingModules = [
  {
    id: 1,
    title: "AR Basics",
    description: "Learn the fundamentals of Augmented Reality",
    icon: FaVrCardboard,
    difficulty: "Beginner",
    duration: "2 hours",
    unlocked: true,
    progress: 0
  },
  {
    id: 2,
    title: "Interactive Controls",
    description: "Master AR interface interactions",
    icon: FaGamepad,
    difficulty: "Intermediate",
    duration: "3 hours",
    unlocked: false,
    progress: 0
  },
  {
    id: 3,
    title: "Advanced Techniques",
    description: "Explore advanced AR concepts and applications",
    icon: FaBrain,
    difficulty: "Advanced",
    duration: "4 hours",
    unlocked: false,
    progress: 0
  }
];

export default function TrainingPage() {
  return (
    <main className="min-h-screen bg-[#030014] text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-blue-900/20 to-transparent py-16"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Training Modules
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto">
            Select a module to begin your AR training journey. Complete modules to unlock advanced content.
          </p>
        </div>
      </motion.div>

      {/* Module Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainingModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`relative group ${!module.unlocked ? 'opacity-80' : ''}`}
            >
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-blue-900/20">
                    <module.icon className="text-3xl text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{module.title}</h3>
                    <p className="text-sm text-gray-400">{module.difficulty}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">{module.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{module.duration}</span>
                  <div className="flex items-center gap-2">
                    {module.unlocked ? (
                      <>
                        <span>Start Module</span>
                        <FaArrowRight />
                      </>
                    ) : (
                      <>
                        <span>Locked</span>
                        <FaLock />
                      </>
                    )}
                  </div>
                </div>
                {module.unlocked && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-800/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-2">0/3</h3>
              <p className="text-gray-400">Modules Completed</p>
            </div>
            <div className="bg-purple-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-purple-400 mb-2">0</h3>
              <p className="text-gray-400">Achievements Earned</p>
            </div>
            <div className="bg-pink-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-pink-400 mb-2">Beginner</h3>
              <p className="text-gray-400">Current Level</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 