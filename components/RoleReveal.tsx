
import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Crown } from 'lucide-react';
import { Player } from '../types';
import { Button } from './Button';
import { playReveal } from '../services/audioService';

interface RoleRevealProps {
  player: Player;
  secretWord: string;
  onNext: () => void;
  playerIndex: number;
  totalPlayers: number;
}

export const RoleReveal: React.FC<RoleRevealProps> = ({ player, secretWord, onNext, playerIndex, totalPlayers }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    playReveal();
    setIsRevealed(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-brand-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold opacity-90">Pasa el Dispositivo</h2>
          <div className="mt-2 text-brand-100 font-medium">
            Jugador {playerIndex + 1} de {totalPlayers}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center min-h-[300px] justify-center text-center space-y-6">
          
          {!isRevealed ? (
            <>
              <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mb-4 relative">
                 <span className="text-4xl font-bold text-brand-600">{player.name[0].toUpperCase()}</span>
                 {player.isHost && (
                   <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-2 rounded-full shadow-lg">
                     <Crown className="w-5 h-5" />
                   </div>
                 )}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">Hola, {player.name}</h3>
                {player.isHost && (
                  <p className="text-yellow-600 font-bold bg-yellow-50 inline-block px-3 py-1 rounded-full text-sm mb-2 border border-yellow-200">
                    👑 Eres el Anfitrión
                  </p>
                )}
                <p className="text-slate-500 mt-2">
                  Asegúrate de que nadie más esté mirando la pantalla, luego toca abajo para ver tu rol secreto.
                </p>
              </div>
              <Button onClick={handleReveal} className="w-full text-lg">
                <Eye className="w-5 h-5" /> Revelar Rol
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1 flex flex-col items-center justify-center animate-fade-in w-full">
                {player.isImpostor ? (
                  <div className="space-y-4">
                    <div className="text-6xl mb-4">🤫</div>
                    <h2 className="text-4xl font-black text-impostor tracking-tighter uppercase">Impostor</h2>
                    <p className="text-slate-600 bg-red-50 p-4 rounded-xl border border-red-100">
                      ¡No sabes la palabra secreta! Intenta disimular y adivinar de qué están hablando los demás.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl mb-4">🕵️</div>
                    <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Palabra Secreta</h2>
                    <div className="text-4xl font-black text-brand-700 py-6 px-8 bg-brand-50 rounded-2xl border border-brand-100 shadow-inner">
                      {secretWord}
                    </div>
                    <p className="text-slate-500 text-sm">
                      Eres un Ciudadano. Describe esta palabra con cuidado sin revelársela al Impostor.
                    </p>
                  </div>
                )}
                
                {player.isHost && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800 text-sm">
                    <strong>Recordatorio de Anfitrión:</strong> Tendrás controles especiales para gestionar el tiempo de la partida.
                  </div>
                )}
              </div>

              <Button 
                variant={player.isImpostor ? 'danger' : 'primary'}
                onClick={() => {
                  setIsRevealed(false);
                  onNext();
                }} 
                className="w-full text-lg mt-6"
              >
                <EyeOff className="w-5 h-5" /> Ocultar y Pasar <ArrowRight className="w-5 h-5 ml-auto opacity-50"/>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
