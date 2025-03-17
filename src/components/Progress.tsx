import { motion } from 'framer-motion';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

interface ProgressStats {
  completedModules: number;
  totalModules: number;
  averageScore: number;
  timeSpent: number;
  achievements: Achievement[];
}

interface ProgressProps {
  stats: ProgressStats;
}

export default function Progress({ stats }: ProgressProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Your Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg text-gray-300 mb-2">Completion Rate</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">
              {Math.round((stats.completedModules / stats.totalModules) * 100)}%
            </span>
            <span className="text-gray-400 text-sm mb-1">
              ({stats.completedModules}/{stats.totalModules} modules)
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 rounded-full h-2"
              style={{
                width: `${(stats.completedModules / stats.totalModules) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg text-gray-300 mb-2">Average Score</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">
              {Math.round(stats.averageScore)}%
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 rounded-full h-2"
              style={{ width: `${stats.averageScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Time Spent</h3>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m
            </span>
            <span className="text-gray-400">total training time</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg ${
                achievement.completed
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                  : 'bg-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-semibold text-white">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 