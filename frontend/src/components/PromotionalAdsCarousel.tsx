import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, CreditCard, PiggyBank, Star, GraduationCap } from 'lucide-react';

interface AdCard {
  id: number;
  title: string;
  description: string;
  cta: string;
  image: string;
  gradient: string;
  icon: React.ReactNode;
  badge: string;
}

const ads: AdCard[] = [
  {
    id: 1,
    title: 'Smart Budgeting',
    description: 'Take control of your finances with AI-powered budgeting tools. Track every rupee effortlessly.',
    cta: 'Start Budgeting',
    image: '/assets/generated/ad-budgeting.dim_600x200.png',
    gradient: 'from-primary/90 to-secondary/80',
    icon: <PiggyBank className="w-6 h-6" />,
    badge: 'FREE',
  },
  {
    id: 2,
    title: 'Instant Personal Loans',
    description: 'Get up to ₹5 Lakhs in minutes. Low interest rates starting at 10.5% p.a. No collateral needed.',
    cta: 'Apply Now',
    image: '/assets/generated/ad-loans.dim_600x200.png',
    gradient: 'from-[oklch(0.45_0.20_260)] to-[oklch(0.38_0.18_230)]',
    icon: <CreditCard className="w-6 h-6" />,
    badge: '10.5% p.a.',
  },
  {
    id: 3,
    title: 'Grow Your Wealth',
    description: 'Invest in mutual funds, SIPs & stocks. Start with just ₹100/month and watch your money grow.',
    cta: 'Invest Now',
    image: '/assets/generated/ad-investments.dim_600x200.png',
    gradient: 'from-[oklch(0.42_0.22_300)] to-[oklch(0.38_0.18_270)]',
    icon: <TrendingUp className="w-6 h-6" />,
    badge: 'HIGH RETURNS',
  },
  {
    id: 4,
    title: 'Boost Your Credit Score',
    description: 'Improve your CIBIL score with personalized tips. A better score means better loan offers.',
    cta: 'Check Score',
    image: '/assets/generated/ad-credit-score.dim_600x200.png',
    gradient: 'from-[oklch(0.40_0.20_250)] to-[oklch(0.35_0.15_220)]',
    icon: <Star className="w-6 h-6" />,
    badge: 'FREE CHECK',
  },
  {
    id: 5,
    title: 'Student Savings Plan',
    description: 'Exclusive savings plans for students. Zero fees, high interest, and special cashback rewards.',
    cta: 'Explore Plans',
    image: '/assets/generated/ad-student-savings.dim_600x200.png',
    gradient: 'from-[oklch(0.48_0.22_285)] to-[oklch(0.40_0.20_255)]',
    icon: <GraduationCap className="w-6 h-6" />,
    badge: 'STUDENT OFFER',
  },
];

export default function PromotionalAdsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((index + ads.length) % ads.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % ads.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % ads.length);
    }, 4000);
  };

  const handleNav = (fn: () => void) => {
    fn();
    resetTimer();
  };

  const ad = ads[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      {/* Card */}
      <div
        className={`relative bg-gradient-to-br ${ad.gradient} text-white transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        style={{ minHeight: '160px' }}
      >
        {/* Background image overlay */}
        <div
          className="absolute inset-0 rounded-2xl bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${ad.image})` }}
        />

        {/* Content */}
        <div className="relative z-10 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-xl">
                {ad.icon}
              </div>
              <span className="text-xs font-bold bg-white/25 px-2 py-0.5 rounded-full tracking-wide">
                {ad.badge}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleNav(prev)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNav(next)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-1 leading-tight">{ad.title}</h3>
          <p className="text-sm opacity-85 mb-4 leading-relaxed line-clamp-2">{ad.description}</p>

          <button className="bg-white/25 hover:bg-white/35 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-white/30">
            {ad.cta} →
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-2 pb-1">
        {ads.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetTimer(); }}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-2 bg-primary'
                : 'w-2 h-2 bg-muted-foreground/30'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
