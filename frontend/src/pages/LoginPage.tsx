import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Preload logo image
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/generated/finmate-logo.dim_256x256.png';
    img.onload = () => {
      setImageLoaded(true);
      // Trigger fade-in animation after image loads
      setTimeout(() => setIsVisible(true), 50);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.45_0.15_280)] via-[oklch(0.35_0.12_260)] to-[oklch(0.25_0.10_240)] flex items-center justify-center p-4">
      <div 
        className={`max-w-md w-full bg-card rounded-3xl shadow-2xl p-8 space-y-8 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="text-center space-y-4">
          {/* Fixed height container to prevent layout shift */}
          <div className="w-32 h-32 mx-auto flex items-center justify-center">
            {imageLoaded ? (
              <img
                src="/assets/generated/finmate-logo.dim_256x256.png"
                alt="FinMate Logo"
                className="w-32 h-32 animate-fade-in"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-foreground">FinMate</h1>
          <p className="text-muted-foreground text-lg">
            Smart budgeting for students
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[oklch(0.55_0.18_280)] to-[oklch(0.45_0.15_260)] hover:from-[oklch(0.60_0.20_280)] hover:to-[oklch(0.50_0.17_260)] text-white rounded-full shadow-lg transition-all duration-300 disabled:opacity-70"
          >
            <span className="flex items-center justify-center min-h-[1.5rem]">
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login with Internet Identity'
              )}
            </span>
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure authentication powered by Internet Computer
          </p>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[oklch(0.55_0.18_280)] flex-shrink-0" />
              <span>Track expenses automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[oklch(0.55_0.18_280)] flex-shrink-0" />
              <span>Earn rewards for saving</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[oklch(0.55_0.18_280)] flex-shrink-0" />
              <span>Compete on leaderboards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
