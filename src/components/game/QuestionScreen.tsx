import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, getDifficultyForQuestion, getTimerForDifficulty, calculatePoints, GAME_CONFIG } from '@/types/game';
import TimerRing from './TimerRing';
import QuestionLadder from './QuestionLadder';
import AnswerButton from './AnswerButton';
import useSoundEffects from '@/hooks/useSoundEffects';
import { Trophy, Sparkles, Clock } from 'lucide-react';

interface QuestionScreenProps {
  question: Question;
  questionIndex: number;
  totalPoints: number;
  answeredCorrectly: boolean[];
  onAnswer: (isCorrect: boolean, timeTaken: number, pointsEarned: number) => void;
}

const QuestionScreen = ({
  question,
  questionIndex,
  totalPoints,
  answeredCorrectly,
  onAnswer,
}: QuestionScreenProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [questionStartTime] = useState(Date.now());
  const { playCorrect, playWrong, playTick, playWarningTick, playDangerTick, playClick, playTimeUp } = useSoundEffects();

  const difficulty = getDifficultyForQuestion(questionIndex);
  const timerDuration = getTimerForDifficulty(difficulty);

  // Initialize timer
  useEffect(() => {
    setTimeRemaining(timerDuration);
    setSelectedAnswer(null);
    setIsRevealed(false);
  }, [question.id, timerDuration]);

  // Timer countdown
  useEffect(() => {
    if (timerDuration === null || timeRemaining === null || timeRemaining <= 0 || isRevealed) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          // Time's up - auto submit wrong answer
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isRevealed, timerDuration]);

  const handleTimeUp = useCallback(() => {
    if (isRevealed) return;
    setIsRevealed(true);
    playTimeUp();
    const timeTaken = timerDuration || 0;
    setTimeout(() => {
      onAnswer(false, timeTaken, 0);
    }, 2000);
  }, [isRevealed, timerDuration, onAnswer, playTimeUp]);

  const handleTimerTick = useCallback((time: number) => {
    if (isRevealed) return;
    if (time <= 5) {
      playDangerTick();
    } else if (time <= 10) {
      playWarningTick();
    } else {
      playTick();
    }
  }, [isRevealed, playTick, playWarningTick, playDangerTick]);

  const handleAnswerSelect = (index: number) => {
    if (isRevealed || selectedAnswer !== null) return;

    playClick();
    setSelectedAnswer(index);
    setIsRevealed(true);

    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect = index === question.correctAnswer;
    const pointsEarned = isCorrect ? calculatePoints(difficulty, timeTaken) : 0;

    // Play sound effect
    setTimeout(() => {
      if (isCorrect) {
        playCorrect();
      } else {
        playWrong();
      }
    }, 300);

    // Delay before moving to next question
    setTimeout(() => {
      onAnswer(isCorrect, timeTaken, pointsEarned);
    }, 2000);
  };

  const getDifficultyBadge = () => {
    const colors = {
      easy: 'bg-green-500/20 text-green-400 border-green-500/50',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      hard: 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    return colors[difficulty];
  };

  return (
    <div className="min-h-screen flex spotlight">
      {/* Question Ladder - Left Side */}
      <div className="hidden lg:block w-64 p-4">
        <QuestionLadder
          currentIndex={questionIndex}
          answeredCorrectly={answeredCorrectly}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          {/* Question Counter */}
          <div className="flex items-center gap-4">
            <div className={`
              px-4 py-2 rounded-full border font-display text-sm font-bold
              ${getDifficultyBadge()}
            `}>
              {difficulty.toUpperCase()}
            </div>
            <span className="text-muted-foreground font-medium">
              Question {questionIndex + 1} of {GAME_CONFIG.questionsPerDifficulty * 3}
            </span>
          </div>

          {/* Points */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-primary">{totalPoints}</span>
            <span className="text-muted-foreground text-sm">pts</span>
          </div>
        </motion.div>

        {/* Timer */}
        {timerDuration !== null && timeRemaining !== null && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-8"
          >
            <TimerRing
              duration={timerDuration}
              timeRemaining={timeRemaining}
              size={100}
              strokeWidth={6}
              onTick={handleTimerTick}
            />
          </motion.div>
        )}

        {/* No Timer Badge for Hard */}
        {timerDuration === null && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">No Time Limit</span>
            </div>
          </motion.div>
        )}

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {/* Question Text */}
            <div className="mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-lg">
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-foreground text-center leading-relaxed">
                {question.question}
              </h2>
            </div>

            {/* Point Value */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Worth up to <strong className="text-primary">{GAME_CONFIG.points[difficulty]}</strong> base points</span>
                {timerDuration && (
                  <span>+ time bonus</span>
                )}
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <AnswerButton
                  key={index}
                  option={option}
                  index={index}
                  isSelected={selectedAnswer === index}
                  isCorrect={selectedAnswer === question.correctAnswer}
                  isRevealed={isRevealed}
                  correctIndex={question.correctAnswer}
                  disabled={isRevealed}
                  onClick={() => handleAnswerSelect(index)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Question Progress */}
        <div className="lg:hidden mt-8 flex justify-center gap-1">
          {Array.from({ length: GAME_CONFIG.questionsPerDifficulty * 3 }, (_, i) => (
            <div
              key={i}
              className={`
                w-2 h-2 rounded-full transition-colors
                ${i < questionIndex ? 'bg-correct' : ''}
                ${i === questionIndex ? 'bg-primary' : ''}
                ${i > questionIndex ? 'bg-muted' : ''}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
