import React, { useEffect, useState } from 'react';
import { LogOut, Home, ArrowLeft, Moon, Sun } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  roomName?: string;
  onLogout: () => void;
  onBack?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentUser, roomName, onLogout, onBack }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cn_theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('cn_theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('cn_theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden font-inter bg-stone-50 dark:bg-stone-950 transition-colors duration-500">
      
      {/* Liquid Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-400/30 dark:bg-orange-600/20 rounded-full blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-rose-400/30 dark:bg-rose-600/20 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-amber-300/30 dark:bg-amber-600/20 rounded-full blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <header className="sticky top-0 z-50 bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border-b border-white/20 dark:border-stone-800/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                {onBack && (
                    <button onClick={onBack} className="p-2 hover:bg-stone-100/50 dark:hover:bg-stone-800/50 rounded-full transition text-stone-600 dark:text-stone-300">
                        <ArrowLeft size={24} />
                    </button>
                )}
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold flex items-center gap-2 text-stone-900 dark:text-white tracking-tight">
                        <Home className="text-orange-500" size={24} />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600 dark:from-orange-400 dark:to-rose-400">
                            {roomName ? `${roomName}'s Kitchen` : 'CulinaryNest'}
                        </span>
                    </h1>
                    {currentUser && (
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                        {currentUser.name} • <span className="uppercase tracking-wide text-[10px]">{currentUser.role}</span>
                    </span>
                    )}
                </div>
            </div>

          <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 bg-stone-100/50 dark:bg-stone-800/50 hover:bg-orange-100 dark:hover:bg-stone-700 rounded-full transition text-stone-600 dark:text-stone-300 backdrop-blur-sm"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {currentUser && (
                <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-stone-800 to-stone-900 dark:from-stone-700 dark:to-stone-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition transform hover:-translate-y-0.5"
                title="Switch User"
                >
                <LogOut size={16} />
                <span className="hidden sm:inline">Log Out</span>
                </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 mb-24 text-stone-900 dark:text-stone-100 relative z-10"> 
        {children}
      </main>

      {!currentUser && (
        <footer className="relative z-10 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md text-stone-500 dark:text-stone-400 text-center py-6 text-sm border-t border-white/20 dark:border-stone-800">
            <p>&copy; {new Date().getFullYear()} CulinaryNest. Crafted with <span className="text-rose-500">♥</span> for families.</p>
        </footer>
      )}

      {/* Global CSS for blobs */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};