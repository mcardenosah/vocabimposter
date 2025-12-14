
import React, { useState } from 'react';
import { GamePhase, GameState, Player, WordCategory, GameConfig } from './types';
import { DEFAULT_CATEGORIES } from './constants';
import { GameSetup } from './components/GameSetup';
import { RoleReveal } from './components/RoleReveal';
import { GamePlay } from './components/GamePlay';
import { Result } from './components/Result';
import { playAlarm } from './services/audioService';

function App() {
  const [categories, setCategories] = useState<WordCategory[]>(DEFAULT_CATEGORIES);
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SETUP,
    players: [],
    currentCategory: null,
    secretWord: '',
    currentPlayerIndex: 0,
    config: { impostorCount: 1, timeLimitSeconds: 300 },
    winner: null
  });

  // --- Actions ---

  const handleAddCategory = (newCat: WordCategory) => {
    setCategories([...categories, newCat]);
  };

  const startGame = (playerNames: string[], categoryId: string, config: GameConfig) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    // Pick Secret Word
    const secretWord = category.words[Math.floor(Math.random() * category.words.length)];

    // Setup Players
    const players: Player[] = playerNames.map((name, i) => ({
      id: `p-${i}`,
      name,
      isImpostor: false,
      isHost: i === 0, // The first player is the Host
      voteCount: 0
    }));

    // Assign Impostor(s)
    let impostorsAssigned = 0;
    while (impostorsAssigned < config.impostorCount) {
      const idx = Math.floor(Math.random() * players.length);
      if (!players[idx].isImpostor) {
        players[idx].isImpostor = true;
        impostorsAssigned++;
      }
    }

    setGameState({
      phase: GamePhase.REVEAL,
      players,
      currentCategory: category,
      secretWord,
      currentPlayerIndex: 0,
      config,
      winner: null
    });
  };

  const handleNextReveal = () => {
    if (gameState.currentPlayerIndex < gameState.players.length - 1) {
      setGameState(prev => ({ ...prev, currentPlayerIndex: prev.currentPlayerIndex + 1 }));
    } else {
      setGameState(prev => ({ ...prev, phase: GamePhase.DISCUSS }));
    }
  };

  const handleVotePhase = () => {
     playAlarm(); // Sound to indicate time is up or host stopped game
     setGameState(prev => ({...prev, phase: GamePhase.VOTE}));
  };

  const handleGameEnd = (winner: 'impostor' | 'citizens') => {
    setGameState(prev => ({ ...prev, winner, phase: GamePhase.RESULT }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      phase: GamePhase.SETUP,
      players: [],
      winner: null
    }));
  };

  const restartSameSettings = () => {
    if(!gameState.currentCategory) return;
    // Keep names, but re-init game to shuffle roles and word
    const playerNames = gameState.players.map(p => p.name);
    startGame(playerNames, gameState.currentCategory.id, gameState.config);
  };

  // --- Renders ---

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-200">
      
      {gameState.phase === GamePhase.SETUP && (
        <GameSetup 
          categories={categories}
          onAddCategory={handleAddCategory}
          onStartGame={startGame}
        />
      )}

      {gameState.phase === GamePhase.REVEAL && gameState.players.length > 0 && (
        <RoleReveal 
          player={gameState.players[gameState.currentPlayerIndex]}
          secretWord={gameState.players[gameState.currentPlayerIndex].isImpostor ? "" : gameState.secretWord}
          onNext={handleNextReveal}
          playerIndex={gameState.currentPlayerIndex}
          totalPlayers={gameState.players.length}
        />
      )}

      {gameState.phase === GamePhase.DISCUSS && gameState.currentCategory && (
        <GamePlay 
          players={gameState.players}
          category={gameState.currentCategory}
          timeLimit={gameState.config.timeLimitSeconds}
          onVote={handleVotePhase}
        />
      )}

      {gameState.phase === GamePhase.VOTE && (
        // Simple Voting Interstitial
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-900 text-white text-center">
            <h1 className="text-4xl font-bold mb-8">¡Tiempo Agotado!</h1>
            <p className="text-xl mb-12 max-w-md">
                El Anfitrión ha detenido la ronda. <br/>
                Discutid y señalad a quién creéis que es el Impostor.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <button 
                    onClick={() => handleGameEnd('citizens')}
                    className="p-6 bg-brand-500 rounded-2xl font-bold hover:bg-brand-400 transition-colors"
                >
                    Ganaron Ciudadanos
                </button>
                <button 
                    onClick={() => handleGameEnd('impostor')}
                    className="p-6 bg-impostor rounded-2xl font-bold hover:bg-rose-500 transition-colors"
                >
                    Ganó el Impostor
                </button>
            </div>
        </div>
      )}

      {gameState.phase === GamePhase.RESULT && (
        <Result 
          gameState={gameState}
          onPlayAgain={restartSameSettings}
          onHome={resetGame}
        />
      )}
    </div>
  );
}

export default App;
