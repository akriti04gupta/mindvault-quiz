import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, ArrowLeft, Users, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard, LeaderboardEntry } from '@/lib/firebase';

const TOTAL_QUESTIONS = 15;

const Leaderboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setEntries(data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-bold">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-transparent border-l-4 border-yellow-400';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 via-gray-300/10 to-transparent border-l-4 border-gray-400';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-transparent border-l-4 border-amber-600';
      default:
        return '';
    }
  };

  const top10 = entries.slice(0, 10);
  const restOfPlayers = entries.slice(10);

  return (
    <div className="min-h-screen bg-stars p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Game
          </Button>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary mb-6 glow-gold">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-3">
            LEADERBOARD
          </h1>
          <p className="text-muted-foreground text-lg">
            Top performers and all-time rankings
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {/* Top 10 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-primary" />
                <h2 className="font-display text-2xl font-bold">Top 10 Champions</h2>
              </div>

              <div className="rounded-2xl bg-card/50 border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-center">Points</TableHead>
                      <TableHead className="text-center hidden md:table-cell">
                        Correct
                      </TableHead>
                      <TableHead className="text-center hidden md:table-cell">
                        Time
                      </TableHead>
                      <TableHead className="text-right hidden sm:table-cell">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {top10.map((entry, index) => (
                      <TableRow
                        key={entry.id}
                        className={getRankBackground(index + 1)}
                      >
                        <TableCell className="text-center">
                          {getRankIcon(index + 1)}
                        </TableCell>
                        <TableCell className="font-display font-bold">
                          {entry.playerName}
                        </TableCell>
                        <TableCell className="text-center font-bold text-primary">
                          {entry.totalPoints}
                        </TableCell>
                        <TableCell className="text-center hidden md:table-cell text-correct font-medium">
                          {entry.correct}/{TOTAL_QUESTIONS}
                        </TableCell>
                        <TableCell className="text-center hidden md:table-cell">
                          {formatTime(entry.totalTime)}
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          {formatDate(entry.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* All Participants */}
            {restOfPlayers.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-accent" />
                  <h2 className="font-display text-2xl font-bold">
                    All Participants
                  </h2>
                </div>

                <div className="rounded-2xl bg-card/30 border border-border/30 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-center">Points</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">
                          Accuracy
                        </TableHead>
                        <TableHead className="text-center hidden md:table-cell">
                          Time
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {restOfPlayers.map((entry, index) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-center">
                            #{index + 11}
                          </TableCell>
                          <TableCell>{entry.playerName}</TableCell>
                          <TableCell className="text-center font-bold text-primary">
                            {entry.totalPoints}
                          </TableCell>
                          <TableCell className="text-center hidden sm:table-cell">
                            {Math.round(
                              (entry.correct / TOTAL_QUESTIONS) * 100
                            )}
                            %
                          </TableCell>
                          <TableCell className="text-center hidden md:table-cell">
                            {formatTime(entry.totalTime)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
