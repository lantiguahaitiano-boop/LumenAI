import React, { useState, useContext } from 'react';
import { getCorrectedEssay } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/TextArea';
import { LevelContext } from '../contexts/LevelContext';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { GamificationContext } from '../components/GamificationProvider';

export const EssayCorrector: React.FC = () => {
  const [essay, setEssay] = useState('');
  const [corrected, setCorrected] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);

  const handleSubmit = async () => {
    if (!essay.trim()) {
      setError('Por favor, pega tu ensayo o texto para corregir.');
      return;
    }
    setIsLoading(true);
    setError('');
    setCorrected('');
    try {
      const result = await getCorrectedEssay(essay, level);
      setCorrected(result);
      addXp(15, 'corrector');
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Corrector de Ensayos</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Pega tu texto para revisar la gramática, ortografía y obtener sugerencias para mejorar el estilo y la claridad.</p>
        
        <TextArea
          rows={12}
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Pega tu ensayo, informe o cualquier trabajo escrito aquí..."
        />

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Corregir y Mejorar
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      
      {isLoading && (
        <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Revisando tu texto...</p>
        </div>
      )}

      {corrected && (
        <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
           <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Comentarios y Sugerencias</h4>
           <MarkdownRenderer content={corrected} />
        </div>
      )}
    </div>
  );
};