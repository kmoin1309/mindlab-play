import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const GAMES = ['memory', 'math', 'train', 'word'];

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  
  if (!GAMES.includes(gameId)) {
    notFound();
  }
  
  const gameName = gameId.charAt(0).toUpperCase() + gameId.slice(1);
  
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-300 hover:text-white mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Games
        </Link>
        
        <div className="bg-slate-800 rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-white mb-4">{gameName} Fiesta</h1>
          <p className="text-slate-400 text-lg mb-6">Game module will be loaded here</p>
          
          <div className="bg-slate-700 rounded-xl p-6 text-center">
            <p className="text-white">Coming soon! This game is under development.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
