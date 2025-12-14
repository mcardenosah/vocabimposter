
import React, { useState, useEffect } from 'react';
import { Clock, Flag, CheckCircle2, Crown, Pause, Play, Tag } from 'lucide-react';
import { Player, WordCategory } from '../types';
import { Button } from './Button';
import { playTick, playAlarm, playSoftClick } from '../services/audioService';

interface GamePlayProps {
  players: Player[];
  category: WordCategory;
  timeLimit: number; // seconds
  onVote: () => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({ players, category, timeLimit, onVote }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isPaused, setIsPaused] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0); 

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timeLeft === 0) playAlarm();
      return;
    }
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newValue = prev - 1;
        // Play tick for last 10 seconds
        if (newValue <= 10 && newValue > 0) {
          playTick();
        }
        return newValue;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextSpeaker = () => {
    playSoftClick();
    setActivePlayer((prev) => (prev + 1) % players.length);
  }

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-screen flex flex-col">
      {/* Timer & Host Control Header */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-brand-100 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className={`p-3 rounded-xl transition-colors ${timeLeft < 60 && !isPaused ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-brand-100 text-brand-600'}`}>
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-semibold uppercase">
                {isPaused ? 'En Pausa' : 'Tiempo Restante'}
              </div>
              <div className={`text-4xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Category Info Badge */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 md:mx-auto">
             <Tag className="w-5 h-5 text-brand-500" />
             <div>
               <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Categoría</div>
               <div className="font-bold text-slate-700 leading-tight">{category.name}</div>
             </div>
          </div>

          {/* Host Controls Section */}
          <div className="flex flex-col w-full md:w-auto gap-2 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
             <div className="text-xs font-bold text-yellow-700 uppercase tracking-widest flex items-center gap-1">
               <Crown className="w-3 h-3" /> Controles del Anfitrión
             </div>
             <div className="flex gap-2">
                <Button 
                  onClick={togglePause} 
                  variant="secondary" 
                  className="flex-1 py-2 text-sm border-yellow-300 hover:bg-yellow-100 text-yellow-900"
                >
                  {isPaused ? (
                    <><Play className="w-4 h-4" /> Reanudar</>
                  ) : (
                    <><Pause className="w-4 h-4" /> Pausar</>
                  )}
                </Button>
                <Button 
                  onClick={onVote} 
                  variant="danger" 
                  className="flex-1 py-2 text-sm shadow-md"
                >
                  <Flag className="w-4 h-4" /> Finalizar
                </Button>
             </div>
          </div>

        </div>
      </div>

      {/* Players List - Full Width */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-brand-100 flex flex-col overflow-hidden">
          <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-brand-900">Orden de Jugadores</h2>
              <p className="text-sm text-brand-600">Turnaros para hablar describiendo la palabra secreta.</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {players.map((p, idx) => (
              <div 
                key={p.id} 
                className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${
                  idx === activePlayer 
                    ? 'bg-brand-50 border-brand-400 shadow-md transform scale-[1.01]' 
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
                onClick={() => {
                   playSoftClick();
                   setActivePlayer(idx);
                }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold text-white relative ${idx === activePlayer ? 'bg-brand-500' : 'bg-slate-300'}`}>
                  {idx + 1}
                  {p.isHost && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-sm border border-white">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${idx === activePlayer ? 'text-brand-900' : 'text-slate-600'}`}>
                      {p.name}
                    </span>
                    {p.isHost && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-200 font-medium">
                        Anfitrión
                      </span>
                    )}
                  </div>
                  {idx === activePlayer && <span className="text-xs font-bold text-brand-500 uppercase tracking-wide">Hablando</span>}
                </div>
                {idx === activePlayer && <CheckCircle2 className="w-6 h-6 text-brand-500" />}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50">
             <Button variant="secondary" className="w-full" onClick={nextSpeaker}>Siguiente Turno</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
