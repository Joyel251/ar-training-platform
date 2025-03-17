import { useState } from 'react';
import { motion } from 'framer-motion';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface AssessmentProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function Assessment({ questions, onComplete }: AssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const correct = questions[currentQuestion].correctAnswer === answerIndex;
    setIsCorrect(correct);
    setShowFeedback(true);

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const score = newAnswers.reduce((acc, answer, index) => {
          return acc + (questions[index].correctAnswer === answer ? 1 : 0);
        }, 0);
        onComplete((score / questions.length) * 100);
      }
    }, 1500);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Assessment</h3>
          <span className="text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 rounded-full h-2 transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-white text-lg mb-4">
          {questions[currentQuestion].text}
        </p>
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                showFeedback
                  ? index === questions[currentQuestion].correctAnswer
                    ? 'bg-green-600'
                    : answers[currentQuestion] === index
                    ? 'bg-red-600'
                    : 'bg-gray-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => !showFeedback && handleAnswer(index)}
              disabled={showFeedback}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'
          }`}
        >
          <p className="text-white">
            {isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!'}
          </p>
        </motion.div>
      )}
    </div>
  );
} 