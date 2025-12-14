
import React, { useEffect } from 'react';
import { RefreshCcw, Home, Crown, Frown } from 'lucide-react';
import { GameState } from '../types';
import { Button } from './Button';
import { playWin } from '../services/audioService';

interface ResultProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const Result: React.FC<ResultProps> = ({ gameState, onPlayAgain, onHome }) => {
  const impostorName = gameState.players.find(p => p.isImpostor)?.name || 'Desconocido';
  const citizensWon = gameState.winner === 'citizens';

  useEffect(() => {
    playWin(citizensWon);
  }, [citizensWon]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-50 to-indigo-50">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white animate-scale-up">
        
        <div className={`p-8 text-center ${citizensWon ? 'bg-brand-500' : 'bg-impostor'}`}>
           {citizensWon ? (
             <Crown className="w-20 h-20 text-white mx-auto mb-4 drop-shadow-lg" />
           ) : (
             <div className="text-8xl mb-4">🤫</div>
           )}
           <h1 className="text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md">
             {citizensWon ? '¡Ganan los Ciudadanos!' : '¡Gana el Impostor!'}
           </h1>
           <p className="text-white/80 text-xl font-medium">
             {citizensWon ? 'El Impostor fue atrapado.' : 'El engaño fue exitoso.'}
           </p>
        </div>

        <div className="p-8 space-y-8">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">El Impostor</div>
                <div className="text-2xl font-black text-impostor">{impostorName}</div>
             </div>
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Palabra Secreta</div>
                <div className="text-2xl font-black text-brand-600">{gameState.secretWord}</div>
             </div>
          </div>

          <div className="space-y-3">
             <h3 className="text-center font-bold text-gray-400 text-sm uppercase tracking-wider">¿Jugar de nuevo?</h3>
             <div className="flex flex-col sm:flex-row gap-4">
               <Button onClick={onPlayAgain} className="flex-1 py-4 text-lg">
                 <RefreshCcw className="w-5 h-5" /> Misma Configuración
               </Button>
               <Button onClick={onHome} variant="secondary" className="flex-1 py-4 text-lg">
                 <Home className="w-5 h-5" /> Nuevo Juego
               </Button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
