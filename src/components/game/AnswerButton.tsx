import { motion } from 'framer-motion';

interface AnswerButtonProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  isRevealed: boolean;
  correctIndex: number;
  disabled: boolean;
  onClick: () => void;
}

const optionLabels = ['A', 'B', 'C', 'D'];

const AnswerButton = ({
  option,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  correctIndex,
  disabled,
  onClick,
}: AnswerButtonProps) => {
  const getButtonState = () => {
    if (!isRevealed) {
      return isSelected ? 'selected' : 'default';
    }
    if (index === correctIndex) {
      return 'correct';
    }
    if (isSelected && !isCorrect) {
      return 'wrong';
    }
    return 'revealed';
  };

  const state = getButtonState();

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        w-full hexagon-btn answer-btn ${state}
        px-6 py-4 text-left transition-all duration-300
        disabled:cursor-not-allowed
        ${state === 'correct' ? 'glow-correct animate-pulse' : ''}
        ${state === 'wrong' ? 'glow-wrong animate-shake' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Option Label */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          font-display font-bold text-sm border-2 transition-colors duration-300
          ${state === 'default' ? 'border-primary/50 text-primary bg-primary/10' : ''}
          ${state === 'selected' ? 'border-primary text-primary-foreground bg-primary' : ''}
          ${state === 'correct' ? 'border-correct text-correct-foreground bg-correct' : ''}
          ${state === 'wrong' ? 'border-destructive text-destructive-foreground bg-destructive' : ''}
          ${state === 'revealed' ? 'border-muted-foreground/30 text-muted-foreground/50 bg-transparent' : ''}
        `}>
          {optionLabels[index]}
        </div>

        {/* Option Text */}
        <span className={`
          flex-1 font-body text-base md:text-lg font-medium transition-colors duration-300
          ${state === 'default' ? 'text-foreground' : ''}
          ${state === 'selected' ? 'text-foreground' : ''}
          ${state === 'correct' ? 'text-correct-foreground' : ''}
          ${state === 'wrong' ? 'text-foreground' : ''}
          ${state === 'revealed' ? 'text-muted-foreground/50' : ''}
        `}>
          {option}
        </span>

        {/* Status Icon */}
        {isRevealed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="flex-shrink-0"
          >
            {index === correctIndex && (
              <svg className="w-6 h-6 text-correct" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {isSelected && !isCorrect && (
              <svg className="w-6 h-6 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

export default AnswerButton;
