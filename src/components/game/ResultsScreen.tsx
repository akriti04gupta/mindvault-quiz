import { forwardRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, RotateCcw, Share2, BarChart3, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionResult, GAME_CONFIG } from '@/types/game';
import { useNavigate } from 'react-router-dom';
import useSoundEffects from '@/hooks/useSoundEffects';

interface ResultsScreenProps {
  playerName: string;
  totalPoints: number;
  results: QuestionResult[];
  totalTime: number;
  onPlayAgain: () => void;
}

const ResultsScreen = forwardRef<HTMLDivElement, ResultsScreenProps>(({
  playerName,
  totalPoints,
  results,
  totalTime,
  onPlayAgain,
}, ref) => {
  const navigate = useNavigate();
  const { playVictory, playGameOver } = useSoundEffects();
  const correctAnswers = results.filter((r) => r.correct).length;
  const wrongAnswers = results.filter((r) => !r.correct).length;
  const totalQuestions = GAME_CONFIG.questionsPerDifficulty * 3;
  const accuracy = results.length > 0 ? Math.round((correctAnswers / results.length) * 100) : 0;

  useEffect(() => {
    // Play appropriate sound on mount
    if (correctAnswers === totalQuestions) {
      playVictory();
    } else {
      playGameOver();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = () => {
    if (correctAnswers === totalQuestions) {
      return { title: 'PERFECT GAME!', subtitle: 'You are a Quiz Master!', emoji: '👑' };
    }
    if (correctAnswers >= 12) {
      return { title: 'EXCELLENT!', subtitle: 'Outstanding performance!', emoji: '🌟' };
    }
    if (correctAnswers >= 8) {
      return { title: 'GREAT JOB!', subtitle: 'Well played!', emoji: '🎉' };
    }
    if (correctAnswers >= 5) {
      return { title: 'GOOD TRY!', subtitle: 'Keep practicing!', emoji: '💪' };
    }
    return { title: 'GAME OVER', subtitle: 'Better luck next time!', emoji: '🎯' };
  };

  const performance = getPerformanceMessage();

  const stats = [
    {
      icon: Target,
      label: 'Correct',
      value: correctAnswers,
      subtext: `of ${results.length} answered`,
      color: 'text-correct',
    },
    {
      icon: Trophy,
      label: 'Total Points',
      value: totalPoints,
      subtext: 'earned',
      color: 'text-primary',
    },
    {
      icon: Clock,
      label: 'Time',
      value: formatTime(totalTime),
      subtext: 'total',
      color: 'text-muted-foreground',
    },
    {
      icon: Percent,
      label: 'Accuracy',
      value: `${accuracy}%`,
      subtext: 'correct',
      color: 'text-accent',
    },
  ];

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center p-4 spotlight">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Performance Badge */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            {performance.emoji}
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-2">
            {performance.title}
          </h1>
          <p className="text-xl text-muted-foreground">{performance.subtitle}</p>
        </motion.div>

        {/* Player Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <p className="text-muted-foreground">Player</p>
          <p className="font-display text-2xl font-bold text-foreground">{playerName}</p>
        </motion.div>

        {/* Main Score */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-4 border-primary glow-gold">
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-display text-5xl font-bold text-primary"
              >
                {totalPoints}
              </motion.p>
              <p className="text-sm text-muted-foreground font-medium">POINTS</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-4 rounded-xl bg-card/50 border border-border/50 text-center"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.subtext}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Question Breakdown */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-10 p-6 rounded-xl bg-card/30 border border-border/30"
        >
          <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Question Breakdown
          </h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  ${result.correct ? 'bg-correct/10' : 'bg-destructive/10'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${result.correct ? 'bg-correct text-correct-foreground' : 'bg-destructive text-destructive-foreground'}
                  `}>
                    {index + 1}
                  </span>
                  <span className="text-sm capitalize text-muted-foreground">
                    {result.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {result.timeTaken}s
                  </span>
                  <span className={`font-bold ${result.correct ? 'text-correct' : 'text-destructive'}`}>
                    {result.correct ? `+${result.pointsEarned}` : '0'} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onPlayAgain}
              size="lg"
              className="flex-1 h-14 text-lg font-display font-bold bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-primary-foreground glow-gold transition-all duration-300 hover:scale-[1.02]"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              PLAY AGAIN
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const text = `I scored ${totalPoints} points in Quiz Master! Can you beat my score? 🏆`;
                if (navigator.share) {
                  navigator.share({ text });
                } else {
                  navigator.clipboard.writeText(text);
                }
              }}
              className="flex-1 h-14 text-lg font-display font-bold border-primary/50 text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <Share2 className="w-5 h-5 mr-2" />
              SHARE SCORE
            </Button>
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate('/leaderboard')}
            className="w-full h-12 text-base font-display font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            VIEW LEADERBOARD
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
});

ResultsScreen.displayName = 'ResultsScreen';

export default ResultsScreen;
