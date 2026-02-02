import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, User, Trophy, Brain, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface WelcomeScreenProps {
  onStart: (playerName: string) => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setError('Please enter your name to continue');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (trimmedName.length > 30) {
      setError('Name must be less than 30 characters');
      return;
    }
    onStart(trimmedName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 spotlight">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              style={{ width: '120px', height: '120px', margin: 'auto', left: 0, right: 0 }}
            />
            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/50 flex items-center justify-center glow-gold">
              <Trophy className="w-14 h-14 text-primary" />
            </div>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-3">
            QUIZ MASTER
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Test your knowledge & earn points
          </p>
        </motion.div>

        {/* Game Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: Brain, label: '15 Questions', color: 'text-primary' },
            { icon: Trophy, label: 'Earn Points', color: 'text-correct' },
            { icon: Play, label: '3 Levels', color: 'text-accent' },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-xl bg-card/50 border border-border/50"
            >
              <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Name Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              className="h-14 pl-12 pr-4 text-lg bg-card border-border/50 focus:border-primary focus:ring-primary/30 placeholder:text-muted-foreground/50"
              maxLength={30}
            />
          </div>
          
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            onClick={handleStart}
            size="lg"
            className="w-full h-14 text-lg font-display font-bold bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-primary-foreground glow-gold transition-all duration-300 hover:scale-[1.02]"
          >
            <Play className="w-5 h-5 mr-2" />
            START GAME
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/leaderboard')}
            size="lg"
            className="w-full h-14 text-lg font-display font-bold border-primary/50 text-primary hover:bg-primary/10 transition-all duration-300"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            VIEW LEADERBOARD
          </Button>
        </motion.div>

        {/* Rules */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10 p-6 rounded-xl bg-card/30 border border-border/30"
        >
          <h3 className="font-display text-sm font-bold text-primary mb-4 uppercase tracking-wider">
            How to Play
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Answer 15 questions across 3 difficulty levels
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Easy (45s) → Medium (60s) → Hard (no timer)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Faster answers = More bonus points
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-1">•</span>
              One wrong answer ends the game!
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
