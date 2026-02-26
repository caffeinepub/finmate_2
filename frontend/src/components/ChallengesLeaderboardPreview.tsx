import React from 'react';
import { Link } from '@tanstack/react-router';
import { Trophy, ChevronRight, Zap, Medal, CheckCircle } from 'lucide-react';
import { useChallenges } from '../hooks/useChallenges';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useCompleteChallenge } from '../hooks/useCompleteChallenge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const rankColors = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];
const rankBg = ['bg-yellow-500/10', 'bg-slate-400/10', 'bg-amber-600/10'];
const rankIcons = ['🥇', '🥈', '🥉'];

function truncateName(name: string, max = 16): string {
  return name.length > max ? name.slice(0, max) + '…' : name;
}

export default function ChallengesLeaderboardPreview() {
  const { data: challenges = [], isLoading: challengesLoading } = useChallenges();
  const { data: leaderboard = [], isLoading: lbLoading } = useLeaderboard();
  const { mutate: completeChallenge, isPending } = useCompleteChallenge();

  const activeChallenges = challenges.filter((c) => !c.completed).slice(0, 2);
  const top3 = leaderboard.slice(0, 3);

  const isLoading = challengesLoading || lbLoading;

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-5 w-32 mt-2" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      {/* Challenges section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Active Challenges</h3>
        </div>
        <Link to="/challenges" className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {activeChallenges.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-3 bg-muted/50 rounded-xl mb-4">
          🎉 All challenges completed! Check back for new ones.
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {activeChallenges.map((challenge) => (
            <div
              key={challenge.id.toString()}
              className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-xl px-3 py-2.5"
            >
              <div className="flex-1 min-w-0 mr-2">
                <p className="text-xs font-medium text-foreground leading-tight line-clamp-2">
                  {challenge.description}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Trophy className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">
                    +{challenge.rewardPoints.toString()} pts
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="default"
                className="text-xs h-7 px-3 flex-shrink-0"
                disabled={isPending}
                onClick={() => completeChallenge(challenge.id)}
              >
                {isPending ? (
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Done
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Medal className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-semibold text-foreground">Leaderboard</h3>
        </div>
        <Link to="/challenges" className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {top3.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-3 bg-muted/50 rounded-xl">
          No leaderboard data yet.
        </div>
      ) : (
        <div className="space-y-2">
          {top3.map((entry, i) => (
            <div
              key={entry.user.toString()}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl ${rankBg[i]}`}
            >
              <span className="text-base w-6 text-center flex-shrink-0">{rankIcons[i]}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${rankColors[i]} truncate`}>
                  {truncateName(entry.name || 'Anonymous')}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Trophy className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-bold text-foreground">
                  {entry.points.toString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
