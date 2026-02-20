import React from 'react';
import { ChefHat, Users, List, Sparkles } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full text-center py-16 md:py-24 space-y-6">
        <div className="inline-block p-4 bg-orange-100 dark:bg-orange-900/40 rounded-full text-orange-600 dark:text-orange-400 mb-4 shadow-sm">
            <ChefHat size={48} />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight drop-shadow-sm">
          Harmony in the <span className="text-orange-600 dark:text-orange-500">Kitchen</span>
        </h1>
        <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed font-light">
          Stop asking "What's for dinner?". CulinaryNest helps homemakers and families coordinate meals, manage shopping lists, and discover new recipes with AI.
        </p>
        <button
          onClick={onStart}
          className="mt-8 px-8 py-4 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 transition-all duration-200"
        >
          Setup / Login to Family Room
        </button>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-12 mb-16 px-4">
        <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-md border border-stone-100 dark:border-stone-800 hover:border-orange-200 dark:hover:border-orange-500/50 transition-colors duration-300">
          <div className="text-orange-500 dark:text-orange-400 mb-4"><Users size={32} /></div>
          <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-white">Family Sync</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            Create a private room for your family. Homemakers propose meals, and members vote or request their favorites.
          </p>
        </div>
        <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-md border border-stone-100 dark:border-stone-800 hover:border-orange-200 dark:hover:border-orange-500/50 transition-colors duration-300">
          <div className="text-orange-500 dark:text-orange-400 mb-4"><Sparkles size={32} /></div>
          <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-white">AI Chef Assistant</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            Stuck with ingredients? Our Gemini-powered AI suggests recipes based on what you have and what your family loves.
          </p>
        </div>
        <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-md border border-stone-100 dark:border-stone-800 hover:border-orange-200 dark:hover:border-orange-500/50 transition-colors duration-300">
          <div className="text-orange-500 dark:text-orange-400 mb-4"><List size={32} /></div>
          <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-white">Smart Shopping</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            Maintain a shared shopping list. Assign items to specific family members so nothing gets forgotten.
          </p>
        </div>
      </section>
    </div>
  );
};
