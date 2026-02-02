import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeScreen from './WelcomeScreen';
import QuestionScreen from './QuestionScreen';
import ResultsScreen from './ResultsScreen';
import LoadingScreen from './LoadingScreen';
import { Question, QuestionResult, getDifficultyForQuestion, GAME_CONFIG } from '@/types/game';
import { fetchQuestions, saveQuizAttempt, isFirebaseConfigured } from '@/lib/firebase';
import useSoundEffects from '@/hooks/useSoundEffects';
import { AlertCircle } from 'lucide-react';

type GamePhase = 'welcome' | 'loading' | 'playing' | 'results';

const QuizGame = () => {
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [showFirebaseWarning, setShowFirebaseWarning] = useState(false);
  const { playGameStart } = useSoundEffects();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setShowFirebaseWarning(true);
    }
  }, []);

  const loadQuestions = useCallback(async () => {
    setPhase('loading');
    
    try {
      const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
        fetchQuestions('easy', GAME_CONFIG.questionsPerDifficulty),
        fetchQuestions('medium', GAME_CONFIG.questionsPerDifficulty),
        fetchQuestions('hard', GAME_CONFIG.questionsPerDifficulty),
      ]);

      // Combine and add difficulty info to each question
      const allQuestions: Question[] = [
        ...easyQuestions.map((q) => ({ ...q, difficulty: 'easy' as const })),
        ...mediumQuestions.map((q) => ({ ...q, difficulty: 'medium' as const })),
        ...hardQuestions.map((q) => ({ ...q, difficulty: 'hard' as const })),
      ];

      setQuestions(allQuestions);
      setPhase('playing');
      setGameStartTime(Date.now());
      playGameStart();
    } catch (error) {
      console.error('Error loading questions:', error);
      // Still proceed with demo questions
      setPhase('playing');
      setGameStartTime(Date.now());
    }
  }, []);

  const handleStart = (name: string) => {
    setPlayerName(name);
    loadQuestions();
  };

  const handleAnswer = (isCorrect: boolean, timeTaken: number, pointsEarned: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const difficulty = getDifficultyForQuestion(currentQuestionIndex);

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      difficulty,
      correct: isCorrect,
      timeTaken,
      pointsEarned,
    };

    const newResults = [...results, result];
    setResults(newResults);

    if (isCorrect) {
      setTotalPoints((prev) => prev + pointsEarned);
      
      // Check if there are more questions
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Game completed successfully
        finishGame(newResults);
      }
    } else {
      // Wrong answer - game over
      finishGame(newResults);
    }
  };

  const finishGame = async (finalResults: QuestionResult[]) => {
    const totalTime = Math.round((Date.now() - gameStartTime) / 1000);
    const correctCount = finalResults.filter((r) => r.correct).length;
    const wrongCount = finalResults.filter((r) => !r.correct).length;
    const finalPoints = finalResults.reduce((sum, r) => sum + r.pointsEarned, 0);

    // Save to Firebase
    await saveQuizAttempt({
      playerName,
      totalPoints: finalPoints,
      correct: correctCount,
      wrong: wrongCount,
      totalTime,
      createdAt: Date.now(),
      questions: finalResults,
    });

    setPhase('results');
  };

  const handlePlayAgain = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResults([]);
    setTotalPoints(0);
    setGameStartTime(0);
    setPhase('welcome');
  };

  const getTotalTime = () => {
    return Math.round((Date.now() - gameStartTime) / 1000);
  };

  return (
    <div className="min-h-screen bg-stars">
      {/* Firebase Warning Banner */}
      <AnimatePresence>
        {showFirebaseWarning && phase === 'welcome' && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-amber-500/10 border-b border-amber-500/30 px-4 py-3"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-200">
                  <strong>Demo Mode:</strong> Firebase is not configured. Using demo questions. 
                  Configure Firebase environment variables for full functionality.
                </p>
              </div>
              <button
                onClick={() => setShowFirebaseWarning(false)}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WelcomeScreen onStart={handleStart} />
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingScreen message="Preparing your quiz..." />
          </motion.div>
        )}

        {phase === 'playing' && questions.length > 0 && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuestionScreen
              question={questions[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              totalPoints={totalPoints}
              answeredCorrectly={results.map((r) => r.correct)}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}

        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultsScreen
              playerName={playerName}
              totalPoints={totalPoints}
              results={results}
              totalTime={getTotalTime()}
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizGame;
