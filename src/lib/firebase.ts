import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, get, push, set, Database } from 'firebase/database';

// Firebase configuration - Replace with your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL);
};

// Lazy initialization to avoid errors when Firebase is not configured
let app: FirebaseApp | null = null;
let database: Database | null = null;

const getFirebaseApp = () => {
  if (!app && isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};

const getFirebaseDatabase = () => {
  if (!database) {
    const firebaseApp = getFirebaseApp();
    if (firebaseApp) {
      database = getDatabase(firebaseApp);
    }
  }
  return database;
};

export { ref, get, push, set };

// Types
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  attemptCount?: number;
}

export interface QuestionAttempt {
  questionId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correct: boolean;
  timeTaken: number;
  pointsEarned: number;
}

export interface QuizAttempt {
  playerName: string;
  totalPoints: number;
  correct: number;
  wrong: number;
  totalTime: number;
  createdAt: number;
  questions: QuestionAttempt[];
}

// Demo questions for when Firebase is not configured
const demoQuestions: Record<string, Question[]> = {
  easy: [
    { id: 'e1', question: 'What is the capital of France?', options: ['Berlin', 'Paris', 'London', 'Madrid'], correctAnswer: 1, attemptCount: 0 },
    { id: 'e2', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correctAnswer: 2, attemptCount: 0 },
    { id: 'e3', question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: 1, attemptCount: 0 },
    { id: 'e4', question: 'What color is the sky on a clear day?', options: ['Green', 'Red', 'Blue', 'Yellow'], correctAnswer: 2, attemptCount: 0 },
    { id: 'e5', question: 'How many days are in a week?', options: ['5', '6', '7', '8'], correctAnswer: 2, attemptCount: 0 },
    { id: 'e6', question: 'What animal says "Meow"?', options: ['Dog', 'Cat', 'Cow', 'Bird'], correctAnswer: 1, attemptCount: 0 },
    { id: 'e7', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 3, attemptCount: 0 },
    { id: 'e8', question: 'How many continents are there?', options: ['5', '6', '7', '8'], correctAnswer: 2, attemptCount: 0 },
    { id: 'e9', question: 'What is H2O commonly known as?', options: ['Salt', 'Water', 'Sugar', 'Oil'], correctAnswer: 1, attemptCount: 0 },
    { id: 'e10', question: 'Which fruit is yellow and curved?', options: ['Apple', 'Orange', 'Banana', 'Grape'], correctAnswer: 2, attemptCount: 0 },
  ],
  medium: [
    { id: 'm1', question: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo'], correctAnswer: 2, attemptCount: 0 },
    { id: 'm2', question: 'What is the chemical symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswer: 2, attemptCount: 0 },
    { id: 'm3', question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, attemptCount: 0 },
    { id: 'm4', question: 'What is the square root of 144?', options: ['10', '11', '12', '13'], correctAnswer: 2, attemptCount: 0 },
    { id: 'm5', question: 'Which country invented pizza?', options: ['France', 'Italy', 'Greece', 'Spain'], correctAnswer: 1, attemptCount: 0 },
    { id: 'm6', question: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], correctAnswer: 2, attemptCount: 0 },
    { id: 'm7', question: 'How many bones are in the adult human body?', options: ['186', '196', '206', '216'], correctAnswer: 2, attemptCount: 0 },
    { id: 'm8', question: 'What gas do plants absorb from the air?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 2, attemptCount: 0 },
    { id: 'm9', question: 'Which Shakespeare play features the character Hamlet?', options: ['Macbeth', 'Hamlet', 'Othello', 'King Lear'], correctAnswer: 1, attemptCount: 0 },
    { id: 'm10', question: 'What is the speed of light in km/s (approximately)?', options: ['100,000', '200,000', '300,000', '400,000'], correctAnswer: 2, attemptCount: 0 },
  ],
  hard: [
    { id: 'h1', question: 'What is the capital of Mongolia?', options: ['Ulaanbaatar', 'Astana', 'Bishkek', 'Dushanbe'], correctAnswer: 0, attemptCount: 0 },
    { id: 'h2', question: 'Who discovered Penicillin?', options: ['Marie Curie', 'Louis Pasteur', 'Alexander Fleming', 'Robert Koch'], correctAnswer: 2, attemptCount: 0 },
    { id: 'h3', question: 'What is the smallest prime number greater than 50?', options: ['51', '53', '57', '59'], correctAnswer: 1, attemptCount: 0 },
    { id: 'h4', question: 'In what year was the first iPhone released?', options: ['2005', '2006', '2007', '2008'], correctAnswer: 2, attemptCount: 0 },
    { id: 'h5', question: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], correctAnswer: 1, attemptCount: 0 },
    { id: 'h6', question: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correctAnswer: 1, attemptCount: 0 },
    { id: 'h7', question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctAnswer: 1, attemptCount: 0 },
    { id: 'h8', question: 'Who wrote "The Great Gatsby"?', options: ['Hemingway', 'Fitzgerald', 'Faulkner', 'Steinbeck'], correctAnswer: 1, attemptCount: 0 },
    { id: 'h9', question: 'What is the half-life of Carbon-14 in years?', options: ['3,730', '4,730', '5,730', '6,730'], correctAnswer: 2, attemptCount: 0 },
    { id: 'h10', question: 'In which city was the first modern Olympic Games held?', options: ['Paris', 'London', 'Athens', 'Rome'], correctAnswer: 2, attemptCount: 0 },
  ],
};

// Fetch questions from Firebase with weighted selection
export const fetchQuestions = async (
  difficulty: 'easy' | 'medium' | 'hard',
  count: number
): Promise<Question[]> => {
  if (!isFirebaseConfigured()) {
    // Use demo questions
    const questions = demoQuestions[difficulty];
    return selectWeightedRandom(questions, count);
  }

  const db = getFirebaseDatabase();
  if (!db) {
    return selectWeightedRandom(demoQuestions[difficulty], count);
  }

  try {
    const questionsRef = ref(db, `questions/${difficulty}`);
    const snapshot = await get(questionsRef);
    
    if (!snapshot.exists()) {
      console.warn(`No questions found for ${difficulty}, using demo questions`);
      return selectWeightedRandom(demoQuestions[difficulty], count);
    }

    const data = snapshot.val();
    const questions: Question[] = Object.entries(data).map(([id, q]: [string, any]) => ({
      id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      attemptCount: q.attemptCount || 0,
    }));

    return selectWeightedRandom(questions, count);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return selectWeightedRandom(demoQuestions[difficulty], count);
  }
};

// Weighted random selection: 70% least attempted, 30% random
const selectWeightedRandom = (questions: Question[], count: number): Question[] => {
  if (questions.length <= count) return [...questions];

  const sorted = [...questions].sort((a, b) => (a.attemptCount || 0) - (b.attemptCount || 0));
  const selected: Question[] = [];
  const usedIds = new Set<string>();

  // 70% from least attempted
  const weightedCount = Math.floor(count * 0.7);
  const leastAttempted = sorted.slice(0, Math.ceil(questions.length * 0.5));
  
  while (selected.length < weightedCount && leastAttempted.length > 0) {
    const randomIndex = Math.floor(Math.random() * leastAttempted.length);
    const question = leastAttempted[randomIndex];
    if (!usedIds.has(question.id)) {
      selected.push(question);
      usedIds.add(question.id);
    }
    leastAttempted.splice(randomIndex, 1);
  }

  // 30% fully random
  const remaining = questions.filter(q => !usedIds.has(q.id));
  while (selected.length < count && remaining.length > 0) {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const question = remaining[randomIndex];
    selected.push(question);
    usedIds.add(question.id);
    remaining.splice(randomIndex, 1);
  }

  // Shuffle the selected questions
  return selected.sort(() => Math.random() - 0.5);
};

// Leaderboard entry type
export interface LeaderboardEntry {
  id: string;
  playerName: string;
  totalPoints: number;
  correct: number;
  wrong: number;
  totalTime: number;
  createdAt: number;
}

// Fetch leaderboard from Firebase
export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  if (!isFirebaseConfigured()) {
    // Return demo leaderboard data
    return [
      { id: '1', playerName: 'QuizMaster Pro', totalPoints: 285, correct: 15, wrong: 0, totalTime: 180, createdAt: Date.now() - 86400000 },
      { id: '2', playerName: 'BrainStorm', totalPoints: 260, correct: 14, wrong: 1, totalTime: 195, createdAt: Date.now() - 172800000 },
      { id: '3', playerName: 'KnowledgeKing', totalPoints: 245, correct: 13, wrong: 2, totalTime: 210, createdAt: Date.now() - 259200000 },
      { id: '4', playerName: 'TriviaChamp', totalPoints: 220, correct: 12, wrong: 3, totalTime: 225, createdAt: Date.now() - 345600000 },
      { id: '5', playerName: 'QuickThinker', totalPoints: 195, correct: 11, wrong: 4, totalTime: 240, createdAt: Date.now() - 432000000 },
    ];
  }

  const db = getFirebaseDatabase();
  if (!db) return [];

  try {
    const attemptsRef = ref(db, 'quizAttempts');
    const snapshot = await get(attemptsRef);
    
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const entries: LeaderboardEntry[] = Object.entries(data).map(([id, attempt]: [string, any]) => ({
      id,
      playerName: attempt.playerName,
      totalPoints: attempt.totalPoints,
      correct: attempt.correct,
      wrong: attempt.wrong,
      totalTime: attempt.totalTime,
      createdAt: attempt.createdAt,
    }));

    // Sort by points (descending), then by time (ascending)
    return entries.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return a.totalTime - b.totalTime;
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Save quiz attempt to Firebase
export const saveQuizAttempt = async (attempt: QuizAttempt): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.log('Demo mode: Quiz attempt would be saved:', attempt);
    return;
  }

  const db = getFirebaseDatabase();
  if (!db) return;

  try {
    const attemptsRef = ref(db, 'quizAttempts');
    await push(attemptsRef, attempt);

    // Update attempt counts for questions
    for (const q of attempt.questions) {
      const questionRef = ref(db, `questions/${q.difficulty}/${q.questionId}/attemptCount`);
      const snapshot = await get(questionRef);
      const currentCount = snapshot.exists() ? snapshot.val() : 0;
      await set(questionRef, currentCount + 1);
    }
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
  }
};

// Initialize demo questions in Firebase (for admin setup)
export const initializeDemoQuestions = async (): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured. Cannot initialize questions.');
    return;
  }

  const db = getFirebaseDatabase();
  if (!db) return;

  try {
    const questionsRef = ref(db, 'questions');
    const formattedQuestions: Record<string, Record<string, Omit<Question, 'id'>>> = {
      easy: {},
      medium: {},
      hard: {},
    };

    for (const [difficulty, questions] of Object.entries(demoQuestions)) {
      for (const q of questions) {
        formattedQuestions[difficulty][q.id] = {
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          attemptCount: 0,
        };
      }
    }

    await set(questionsRef, formattedQuestions);
    console.log('Demo questions initialized in Firebase!');
  } catch (error) {
    console.error('Error initializing questions:', error);
  }
};
