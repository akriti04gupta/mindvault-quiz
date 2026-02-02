export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
}

export interface QuestionResult {
  questionId: string;
  difficulty: Difficulty;
  correct: boolean;
  timeTaken: number;
  pointsEarned: number;
}

export interface GameState {
  playerName: string;
  currentQuestionIndex: number;
  questions: Question[];
  results: QuestionResult[];
  totalPoints: number;
  gameStatus: 'idle' | 'playing' | 'finished' | 'gameover';
  startTime: number;
  questionStartTime: number;
}

export interface GameConfig {
  questionsPerDifficulty: number;
  timers: {
    easy: number;
    medium: number;
    hard: number | null;
  };
  points: {
    easy: number;
    medium: number;
    hard: number;
  };
  bonusMultiplier: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export const GAME_CONFIG: GameConfig = {
  questionsPerDifficulty: 5,
  timers: {
    easy: 45,
    medium: 60,
    hard: null, // No timer for hard questions
  },
  points: {
    easy: 10,
    medium: 20,
    hard: 40,
  },
  bonusMultiplier: {
    easy: 0.2,
    medium: 0.15,
    hard: 0,
  },
};

export const getDifficultyForQuestion = (index: number): Difficulty => {
  if (index < 5) return 'easy';
  if (index < 10) return 'medium';
  return 'hard';
};

export const getTimerForDifficulty = (difficulty: Difficulty): number | null => {
  return GAME_CONFIG.timers[difficulty];
};

export const calculatePoints = (
  difficulty: Difficulty,
  timeTaken: number
): number => {
  const basePoints = GAME_CONFIG.points[difficulty];
  const maxTime = GAME_CONFIG.timers[difficulty];
  const bonusMultiplier = GAME_CONFIG.bonusMultiplier[difficulty];

  if (maxTime === null || bonusMultiplier === 0) {
    return basePoints;
  }

  const timeBonus = Math.max(0, (maxTime - timeTaken) * bonusMultiplier);
  return Math.round(basePoints + timeBonus);
};
