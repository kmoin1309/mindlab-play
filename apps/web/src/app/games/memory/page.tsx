"use client";

import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { saveEvent, initDB } from '@/lib/db';

function MemoryGame() {
  const GRID_SIZE = 25; // 5x5 grid
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Watch the pattern...");
  const [cellFeedback, setCellFeedback] = useState<Map<number, 'correct' | 'wrong'>>(new Map());
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    initDB();
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused && !gameOver && isUserTurn) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isPaused, gameOver, isUserTurn]);

  const generateSequence = (length: number) => {
    const seq = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * GRID_SIZE));
    }
    return seq;
  };

  const highlightCell = (index: number, color: 'pattern' | 'correct' | 'wrong') => {
    const cell = document.getElementById(`cell-${index}`);
    if (!cell) return;

    if (color === 'pattern') {
      cell.classList.add('!bg-pink-300', '!scale-105');
      setTimeout(() => {
        cell.classList.remove('!bg-pink-300', '!scale-105');
      }, 400);
    }
  };

  const playSequence = async (seq: number[]) => {
    setIsUserTurn(false);
    setStatusMessage("👀 Watch the pattern...");
    setCellFeedback(new Map());
    
    for (const cell of seq) {
      await new Promise(resolve => setTimeout(resolve, 500));
      highlightCell(cell, 'pattern');
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    setIsUserTurn(true);
    setTimer(30);
    setStatusMessage("Click cells to recreate the pattern");
  };

  const startGame = () => {
    setShowInstructions(false);
    const newSeq = generateSequence(3 + level);
    setSequence(newSeq);
    setUserSequence([]);
    setIsPlaying(true);
    setCellFeedback(new Map());
    
    saveEvent({
      id: crypto.randomUUID(),
      userId: 'demo_user',
      gameId: 'memory',
      sessionId,
      timestamp: Date.now(),
      type: 'ROUND_START',
      payload: { level, lives },
      synced: false,
    });
    
    playSequence(newSeq);
  };

  const handleTimeOut = () => {
    const newLives = lives - 1;
    setLives(newLives);
    setStatusMessage("⏰ Time's up! Try again!");
    
    if (newLives <= 0) {
      setGameOver(true);
      setStatusMessage("Game Over!");
    } else {
      setTimeout(() => startGame(), 2000);
    }
  };

  const handleCellClick = (index: number) => {
    if (!isUserTurn || gameOver || isPaused) return;

    const newUserSeq = [...userSequence, index];
    setUserSequence(newUserSeq);
    
    const currentIndex = newUserSeq.length - 1;
    const isCorrect = newUserSeq[currentIndex] === sequence[currentIndex];
    
    const newFeedback = new Map(cellFeedback);
    newFeedback.set(index, isCorrect ? 'correct' : 'wrong');
    setCellFeedback(newFeedback);

    if (!isCorrect) {
      setStatusMessage("❌ Try again!");
      const newLives = lives - 1;
      setLives(newLives);
      
      setTimeout(() => {
        if (newLives <= 0) {
          setGameOver(true);
          setStatusMessage("Game Over!");
        } else {
          startGame();
        }
      }, 1500);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      const points = level === 1 ? 30 : level === 2 ? 60 : 90;
      setScore(score + points);
      setLevel(level + 1);
      setStatusMessage("✅ Perfect! Next level...");
      
      setTimeout(() => startGame(), 1500);
    }
  };

  const togglePause = () => setIsPaused(!isPaused);
  const toggleSound = () => setSoundOn(!soundOn);

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6">How to Play</h2>
          <ul className="text-gray-300 space-y-3 text-sm">
            <li>• Watch the pattern of highlighted cells carefully</li>
            <li>• After the pattern disappears, click the cells to recreate it</li>
            <li>• Correct pattern: earn points! Level 1: +30, Level 2: +60, Level 3: +90</li>
            <li>• Wrong pattern: lose 1 life and difficulty may decrease (you have 3 lives)</li>
            <li>• Get 2 consecutive wins to increase difficulty and earn more points</li>
            <li>• Lose all 3 lives and the game is over!</li>
          </ul>
          <button
            onClick={startGame}
            className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <Link href="/" className="text-gray-300 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Exit
        </Link>
        
        <button
          onClick={() => setShowInstructions(true)}
          className="text-gray-300 hover:text-white"
        >
          How to Play
        </button>
        
        <button
          onClick={toggleSound}
          className="text-gray-300 hover:text-white flex items-center gap-2"
        >
          {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          Game Sound
        </button>
      </div>

      {/* Stats Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <div className="text-gray-400">
          YOUR SCORE: <span className="text-white font-bold">{score}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`text-2xl ${i < lives ? 'text-red-500' : 'text-gray-600'}`}
              >
                ❤️
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={togglePause}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* Timer */}
      <div className="text-white text-xl font-semibold">
        ⏱️ {timer}s
      </div>

      {/* Status Message */}
      <div className="text-gray-300 text-center min-h-[24px]">
        {statusMessage}
      </div>

      {/* Game Grid - 5x5 */}
      <div className="grid grid-cols-5 gap-3 p-4">
        {Array.from({ length: GRID_SIZE }).map((_, index) => {
          const feedback = cellFeedback.get(index);
          return (
            <button
              key={index}
              id={`cell-${index}`}
              onClick={() => handleCellClick(index)}
              disabled={!isUserTurn || gameOver || isPaused}
              className={`w-20 h-20 rounded-2xl border-2 transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center text-2xl font-bold ${
                feedback === 'correct'
                  ? 'bg-gray-900 border-gray-700 text-yellow-400'
                  : feedback === 'wrong'
                  ? 'bg-red-500 border-red-600 text-white'
                  : 'bg-purple-700/30 border-purple-500/30 hover:bg-purple-600/40'
              } ${!isUserTurn || gameOver || isPaused ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {feedback === 'correct' && '✓'}
              {feedback === 'wrong' && '✗'}
            </button>
          );
        })}
      </div>

      {gameOver && (
        <div className="text-center mt-4">
          <button
            onClick={() => {
              setLevel(1);
              setScore(0);
              setLives(3);
              setGameOver(false);
              setShowInstructions(true);
            }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default function MemoryGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-violet-900 flex items-center justify-center">
      <MemoryGame />
    </div>
  );
}
