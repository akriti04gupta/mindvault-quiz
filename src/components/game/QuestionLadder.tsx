import { motion } from 'framer-motion';
import { Check, Circle, Diamond } from 'lucide-react';
import { getDifficultyForQuestion, GAME_CONFIG } from '@/types/game';

interface QuestionLadderProps {
  currentIndex: number;
  answeredCorrectly: boolean[];
}

const QuestionLadder = ({ currentIndex, answeredCorrectly }: QuestionLadderProps) => {
  const totalQuestions = GAME_CONFIG.questionsPerDifficulty * 3;

  const getStepStatus = (index: number) => {
    if (index < currentIndex) {
      return answeredCorrectly[index] ? 'completed' : 'wrong';
    }
    if (index === currentIndex) return 'active';
    return 'upcoming';
  };

  const getDifficultyLabel = (index: number) => {
    const difficulty = getDifficultyForQuestion(index);
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const getPoints = (index: number) => {
    const difficulty = getDifficultyForQuestion(index);
    return GAME_CONFIG.points[difficulty];
  };

  const getDifficultyColor = (index: number) => {
    const difficulty = getDifficultyForQuestion(index);
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-amber-400';
      case 'hard': return 'text-red-400';
    }
  };

  return (
    <div className="hidden lg:flex flex-col-reverse gap-1 p-4 bg-card/30 rounded-xl border border-border/30 backdrop-blur-sm">
      <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider text-center mb-2 order-last">
        Question Ladder
      </h3>
      
      {Array.from({ length: totalQuestions }, (_, i) => {
        const index = totalQuestions - 1 - i;
        const status = getStepStatus(index);
        const isMilestone = index === 4 || index === 9 || index === 14;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`
              relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300
              ${status === 'active' ? 'bg-primary/20 border border-primary/50' : ''}
              ${status === 'completed' ? 'bg-correct/10' : ''}
              ${status === 'wrong' ? 'bg-destructive/10' : ''}
              ${isMilestone ? 'border-l-2 border-l-primary/50' : ''}
            `}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {status === 'completed' && (
                <Check className="w-4 h-4 text-correct" />
              )}
              {status === 'active' && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Diamond className="w-4 h-4 text-primary fill-primary" />
                </motion.div>
              )}
              {status === 'upcoming' && (
                <Circle className="w-4 h-4 text-muted-foreground/40" />
              )}
              {status === 'wrong' && (
                <Circle className="w-4 h-4 text-destructive" />
              )}
            </div>

            {/* Question Number */}
            <span className={`
              font-display text-sm font-bold min-w-[24px]
              ${status === 'active' ? 'text-primary' : ''}
              ${status === 'completed' ? 'text-correct' : ''}
              ${status === 'wrong' ? 'text-destructive' : ''}
              ${status === 'upcoming' ? 'text-muted-foreground/40' : ''}
            `}>
              Q{index + 1}
            </span>

            {/* Points */}
            <span className={`
              text-xs font-medium flex-1 text-right
              ${status === 'active' ? getDifficultyColor(index) : ''}
              ${status === 'upcoming' ? 'text-muted-foreground/30' : ''}
              ${status === 'completed' || status === 'wrong' ? 'text-muted-foreground/50' : ''}
            `}>
              {getPoints(index)} pts
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuestionLadder;
