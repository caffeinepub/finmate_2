import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChallenges } from '../hooks/useChallenges';
import { useCompleteChallenge } from '../hooks/useCompleteChallenge';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Coins, CheckCircle2 } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';

export default function ChallengesPage() {
  const { data: challenges = [] } = useChallenges();
  const { data: leaderboard = [] } = useLeaderboard();
  const { data: profile } = useGetCallerUserProfile();
  const { mutate: completeChallenge } = useCompleteChallenge();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Challenges & Rewards</h2>
        <p className="text-muted-foreground">Complete challenges to earn digi points</p>
      </div>

      <Card className="bg-gradient-to-br from-[oklch(0.45_0.15_280)] to-[oklch(0.35_0.12_260)] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Your Digi Points</p>
              <p className="text-4xl font-bold">{Number(profile?.digiPoints || 0)}</p>
            </div>
            <img src="/assets/generated/coin-icon.dim_80x80.png" alt="Coins" className="w-20 h-20" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Active Challenges</h3>
        {challenges.filter((c) => !c.completed).length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No active challenges. Check back soon!
            </CardContent>
          </Card>
        ) : (
          challenges
            .filter((c) => !c.completed)
            .map((challenge) => (
              <Card key={Number(challenge.id)}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{challenge.description}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Target: ₹{challenge.targetAmount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[oklch(0.55_0.18_280)]">
                        <Coins className="w-4 h-4" />
                        <span className="font-semibold">{Number(challenge.rewardPoints)}</span>
                      </div>
                    </div>
                    <Progress value={0} className="h-2" />
                    <Button
                      onClick={() => completeChallenge(challenge.id)}
                      className="w-full bg-gradient-to-r from-[oklch(0.55_0.18_280)] to-[oklch(0.45_0.15_260)] hover:from-[oklch(0.60_0.20_280)] hover:to-[oklch(0.50_0.17_260)] text-white"
                    >
                      Mark as Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[oklch(0.55_0.18_280)]" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No leaderboard data yet</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <div
                  key={entry.user.toString()}
                  className="flex items-center justify-between p-3 bg-accent/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? 'bg-yellow-500 text-white'
                          : index === 1
                          ? 'bg-gray-400 text-white'
                          : index === 2
                          ? 'bg-orange-600 text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium text-foreground">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[oklch(0.55_0.18_280)]">
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">{Number(entry.points)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
