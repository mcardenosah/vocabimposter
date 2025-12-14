import React, { useState } from 'react';
import { Plus, Trash2, Wand2, Users, Play, BookOpen, Crown } from 'lucide-react';
import { WordCategory, GameConfig } from '../types';
import { generateVocabularyList } from '../services/geminiService';
import { Button } from './Button';

interface GameSetupProps {
  categories: WordCategory[];
  onAddCategory: (cat: WordCategory) => void;
  onStartGame: (players: string[], categoryId: string, config: GameConfig) => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ categories, onAddCategory, onStartGame }) => {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');
  const [config, setConfig] = useState<GameConfig>({ impostorCount: 1, timeLimitSeconds: 300 });
  
  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genLang, setGenLang] = useState('Spanish'); // Default to Spanish per user request

  const handleAddPlayer = () => setPlayerNames([...playerNames, '']);
  const handleRemovePlayer = (idx: number) => setPlayerNames(playerNames.filter((_, i) => i !== idx));
  const handlePlayerNameChange = (idx: number, val: string) => {
    const newNames = [...playerNames];
    newNames[idx] = val;
    setPlayerNames(newNames);
  };

  const handleGenerateCategory = async () => {
    if (!genTopic.trim()) return;
    setIsGenerating(true);
    const newCat = await generateVocabularyList(genTopic, genLang);
    setIsGenerating(false);
    if (newCat) {
      onAddCategory(newCat);
      setSelectedCategory(newCat.id);
      setGenTopic('');
    }
  };

  const handleStart = () => {
    const validPlayers = playerNames.filter(n => n.trim().length > 0);
    if (validPlayers.length < 3) {
      alert("¡Necesitas al menos 3 jugadores!");
      return;
    }
    if (!selectedCategory) {
      alert("Por favor selecciona una categoría.");
      return;
    }
    onStartGame(validPlayers, selectedCategory, config);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      <header className="text-center space-y-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-900 tracking-tight">
          Vocab<span className="text-impostor">Impostor</span>
        </h1>
        <p className="text-slate-600 text-lg">El juego de aula de engaño y vocabulario.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Column: Players */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-brand-100">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-brand-600" />
            <h2 className="text-xl font-bold text-gray-800">Jugadores</h2>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {playerNames.map((name, idx) => (
              <div key={idx} className="relative flex items-center gap-2">
                {idx === 0 && (
                   <div className="absolute -left-2 -top-2 bg-yellow-400 text-white rounded-full p-1 shadow-sm z-10" title="Anfitrión">
                      <Crown className="w-3 h-3" />
                   </div>
                )}
                <input
                  type="text"
                  placeholder={idx === 0 ? "Nombre del Anfitrión" : `Jugador ${idx + 1}`}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${idx === 0 ? 'border-yellow-400 focus:border-yellow-500 focus:ring-yellow-200 bg-yellow-50/50' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-200'}`}
                />
                {playerNames.length > 3 && idx !== 0 && (
                  <button 
                    onClick={() => handleRemovePlayer(idx)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleAddPlayer}
            className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-brand-600 font-semibold border-2 border-dashed border-brand-200 rounded-lg hover:bg-brand-50 hover:border-brand-300 transition-all"
          >
            <Plus className="w-4 h-4" /> Añadir Jugador
          </button>
        </div>

        {/* Right Column: Game Settings & Category */}
        <div className="space-y-6">
          
          {/* Categories */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-brand-100">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-brand-600" />
              <h2 className="text-xl font-bold text-gray-800">Categoría de Vocabulario</h2>
            </div>

            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white mb-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            >
              <option value="" disabled>Selecciona una categoría...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.words.length} palabras)
                </option>
              ))}
            </select>

            {/* AI Generator */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <Wand2 className="w-4 h-4" />
                <span>Generador con IA</span>
              </div>
              <div className="flex gap-2 mb-2">
                 <input
                  type="text"
                  placeholder="Tema (ej. 'Aeropuerto', 'Verbos')"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-brand-500 outline-none"
                />
                <select 
                  value={genLang}
                  onChange={(e) => setGenLang(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                >
                  <option value="Spanish">Español</option>
                  <option value="English">Inglés</option>
                  <option value="French">Francés</option>
                  <option value="German">Alemán</option>
                </select>
              </div>
              <Button 
                variant="secondary" 
                className="w-full text-sm"
                onClick={handleGenerateCategory}
                isLoading={isGenerating}
                disabled={!genTopic}
              >
                Generar Nueva Lista
              </Button>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-brand-100">
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporizador (Minutos)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={config.timeLimitSeconds / 60}
                  onChange={(e) => setConfig({...config, timeLimitSeconds: parseInt(e.target.value) * 60})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="text-right text-sm text-gray-500 mt-1">{config.timeLimitSeconds / 60} min</div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Button 
          onClick={handleStart} 
          className="w-full md:w-auto md:min-w-[300px] text-xl py-4 shadow-brand-500/40 hover:shadow-brand-500/60"
        >
          Comenzar Juego <Play className="w-5 h-5 fill-current" />
        </Button>
      </div>
    </div>
  );
};