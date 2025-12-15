import Link from 'next/link';
import { Brain, Calculator, Train, BookOpen } from 'lucide-react';

const games = [
  { id: 'memory', name: 'Memory Fiesta', icon: Brain, color: 'bg-purple-500', category: 'MEMORY' },
  { id: 'math', name: 'Math Fiesta', icon: Calculator, color: 'bg-blue-500', category: 'MATH' },
  { id: 'train', name: 'Train Fiesta', icon: Train, color: 'bg-green-500', category: 'ATTENTION' },
  { id: 'word', name: 'Word Fiesta', icon: BookOpen, color: 'bg-violet-500', category: 'VOCABULARY' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Train Your Brain</h1>
          <p className="text-slate-300">Sharpen your mind with quick, fun challenges every day</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className={`${game.color} rounded-2xl p-8 hover:scale-105 transition-transform cursor-pointer shadow-xl`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{game.name}</h2>
                    <span className="text-sm text-white/80 uppercase tracking-wide">{game.category}</span>
                  </div>
                  <Icon className="w-16 h-16 text-white/90" />
                </div>
                <button className="mt-4 bg-white text-purple-900 px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors">
                  Play
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
