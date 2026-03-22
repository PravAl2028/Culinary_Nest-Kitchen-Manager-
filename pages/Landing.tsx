import React, { useEffect, useRef } from 'react';
import { ChefHat, Users, Sparkles, ShoppingCart, Calendar, Heart, BookOpen, Refrigerator, ArrowRight, ThumbsUp } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const features = [
  {
    icon: Users,
    title: 'Family Rooms',
    desc: 'Private rooms for your household. Each member has their own profile and role.',
    color: 'from-orange-400 to-amber-500',
    glow: 'hover:shadow-orange-400/30',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400',
  },
  {
    icon: Sparkles,
    title: 'AI Chef',
    desc: 'Gemini-powered chef that suggests recipes, generates weekly plans, and chats cooking tips.',
    color: 'from-purple-400 to-indigo-500',
    glow: 'hover:shadow-purple-400/30',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400',
  },
  {
    icon: Calendar,
    title: 'Daily Planning',
    desc: 'Propose meals for the day. The family votes — most-loved dish wins.',
    color: 'from-blue-400 to-cyan-500',
    glow: 'hover:shadow-blue-400/30',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
  },
  {
    icon: ShoppingCart,
    title: 'Smart Shopping',
    desc: 'Shared list with item assignment. Tick off as you go — nothing gets missed.',
    color: 'from-green-400 to-emerald-500',
    glow: 'hover:shadow-green-400/30',
    bg: 'bg-green-50 dark:bg-green-900/20',
    iconBg: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
  },
  {
    icon: BookOpen,
    title: 'Cookbook',
    desc: 'Your family recipe library. Get AI-generated instructions and YouTube links instantly.',
    color: 'from-amber-400 to-orange-500',
    glow: 'hover:shadow-amber-400/30',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
  },
  {
    icon: Heart,
    title: 'Wish Lists',
    desc: "Request your favourite dishes. Mom sees every craving — no request goes unheard.",
    color: 'from-pink-400 to-rose-500',
    glow: 'hover:shadow-pink-400/30',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    iconBg: 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400',
  },
];

const steps = [
  { n: '1', title: 'Create a Room', desc: 'Set up a private family room with a name and password in seconds.' },
  { n: '2', title: 'Invite Your Family', desc: 'Add profiles for each member. Homemakers manage, members participate.' },
  { n: '3', title: 'Start Cooking Smarter', desc: 'Plan meals, vote, shop together — with AI always at your side.' },
];

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-active');
          } else {
            entry.target.classList.remove('scroll-active');
          }
        });
      },
      { threshold: 0.6 }
    );

    const cards = document.querySelectorAll('.card-glow');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center" ref={scrollRef}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .anim-fade-up   { animation: fadeUp 0.7s ease both; }
        .anim-scale-in  { animation: scaleIn 0.6s ease both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .shimmer-text {
          background: linear-gradient(90deg, #ea580c, #f97316, #fbbf24, #f97316, #ea580c);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .card-glow {
          position: relative;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          cursor: pointer;
        }
        /* Desktop: Hover on cursor move only */
        @media (min-width: 769px) {
          .card-glow:hover {
            transform: scale(1.15) !important;
            z-index: 100 !important;
          }
        }

        /* Mobile Scale Customization */
        @media (max-width: 768px) {
          .card-glow {
            touch-action: manipulation;
          }
          /* Hover, Tap, or Scroll triggers scale on mobile */
          .card-glow:hover, .card-glow:active, .card-glow.scroll-active {
            transform: scale(1.1) !important;
            z-index: 100 !important;
          }
        }
      `}</style>


      {/* ── Hero ── */}
      <section className="w-full text-center py-16 md:py-28 space-y-8 px-4">
        <div className="anim-scale-in inline-block p-5 bg-orange-100 dark:bg-orange-900/40 rounded-full text-orange-600 dark:text-orange-400 shadow-lg shadow-orange-300/30 dark:shadow-orange-900/30">
          <ChefHat size={56} />
        </div>

        <div className="space-y-4 anim-fade-up delay-100">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-stone-900 dark:text-white">
            Harmony in the
          </h1>
          <h1 className="text-5xl md:text-7xl font-black shimmer-text">
            Kitchen
          </h1>
        </div>

        <p className="anim-fade-up delay-200 text-base md:text-xl text-stone-500 dark:text-stone-400 max-w-xl mx-auto leading-relaxed">
          The all-in-one family kitchen manager. Plan meals, vote on dishes, manage shopping, and let AI cook up the ideas.
        </p>

        <div className="anim-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onStart}
            className="card-glow group px-10 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-lg font-bold rounded-full shadow-xl shadow-orange-400/30 flex items-center gap-3"
          >
            Get Started Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">No account needed · Free forever</span>
        </div>

        {/* Stats bar */}
        <div className="anim-fade-up delay-400 flex flex-wrap justify-center gap-8 pt-4">
          {[
            { val: '7-Day', label: 'AI Meal Plans' },
            { val: '∞', label: 'Family Recipes' },
            { val: '1-Click', label: 'Shopping List' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-black text-orange-600 dark:text-orange-400">{val}</p>
              <p className="text-xs text-stone-400 dark:text-stone-500 font-medium uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="w-full max-w-5xl px-4 mb-24">
        <h2 className="anim-fade-up text-3xl md:text-4xl font-black text-center text-stone-900 dark:text-white mb-14">
          How It Works
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {steps.map(({ n, title, desc }, i) => (
            <div key={n} className={`anim-fade-up delay-${(i + 1) * 100} relative`}>
              <div className="card-glow p-6 md:p-8 rounded-3xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 text-center shadow-sm h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white font-black text-xl md:text-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  {n}
                </div>
                <h3 className="text-base md:text-lg font-bold text-stone-900 dark:text-white mb-2">{title}</h3>
                <p className="text-[11px] md:text-sm text-stone-500 dark:text-stone-400 leading-tight md:leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="w-full max-w-6xl px-4 mb-24">
        <h2 className="anim-fade-up text-3xl md:text-4xl font-black text-center text-stone-900 dark:text-white mb-14">
          Built for Every Role
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {features.map(({ icon: Icon, title, desc, glow, iconBg }, i) => (
            <div key={title} className={`anim-fade-up delay-${(i + 1) * 100} relative`}>
              <div className={`card-glow group p-6 md:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm ${glow} h-full`}>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${iconBg} flex items-center justify-center mb-4 md:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon size={24} className="md:size-[26px]" />
                </div>
                <h3 className="text-base md:text-xl font-bold text-stone-900 dark:text-white mb-2 md:mb-3">{title}</h3>
                <p className="text-[11px] md:text-sm text-stone-500 dark:text-stone-400 leading-tight md:leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Highlight Panels ── */}
      <section className="w-full max-w-6xl px-4 mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Pantry */}
        <div className="anim-fade-up delay-100 relative">
          <div className="card-glow p-8 md:p-10 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-10"><Refrigerator size={140} /></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Refrigerator size={24} />
              </div>
              <h3 className="text-2xl font-black mb-3">Kitchen Inventory</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Log what's in your pantry. The AI scans your ingredients and recommends dishes you can cook right now — no grocery run required.
              </p>
            </div>
          </div>
        </div>

        {/* Democracy */}
        <div className="anim-fade-up delay-200 relative">
          <div className="card-glow p-8 md:p-10 rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-10"><ThumbsUp size={140} /></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <ThumbsUp size={24} />
              </div>
              <h3 className="text-2xl font-black mb-3">Meal Democracy</h3>
              <p className="text-rose-100 text-sm leading-relaxed">
                Every family member votes on proposed dishes. The AI builds weekly plans from everyone's preferences — so dinner is always a crowd-pleaser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full max-w-3xl px-4 mb-24">
        <div className="anim-scale-in relative">
          <div className="card-glow group relative rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-950 dark:to-stone-900 shadow-2xl overflow-hidden">
            {/* Glow blobs */}
            <div className="absolute top-0 left-1/4 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                <ChefHat size={32} className="text-orange-400" />
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white">Ready to get cooking?</h2>
              <p className="text-stone-400 max-w-md mx-auto text-sm leading-relaxed">
                Create your family room in under a minute. No email, no subscription — just your family.
              </p>
              <button
                onClick={onStart}
                className="card-glow group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold px-10 py-4 rounded-full shadow-xl shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Start Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
