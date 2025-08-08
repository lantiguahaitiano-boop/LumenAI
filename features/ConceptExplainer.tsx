import React, { useState, useContext } from 'react';
import { getExplanation } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { GamificationContext } from '../components/GamificationProvider';

export const ConceptExplainer: React.FC = () => {
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);

  const handleSubmit = async () => {
    if (!concept.trim()) {
      setError('Por favor, introduce un concepto para explicar.');
      return;
    }
    setIsLoading(true);
    setError('');
    setExplanation('');
    try {
      const result = await getExplanation(concept, level);
      setExplanation(result);
      addXp(10, 'explainer');
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Explicador de Conceptos</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">¿No entiendes un tema? Introdúcelo aquí y obtén una explicación sencilla con ejemplos y analogías.</p>
        
        <div className="flex gap-4">
            <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ej: 'Entrelazamiento Cuántico', 'Oferta y Demanda', 'Mitocondria'"
                className="flex-grow p-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
            />
            <Button onClick={handleSubmit} isLoading={isLoading}>
                Explicar
            </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      
      {isLoading && (
        <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Simplificando el concepto...</p>
        </div>
      )}

      {explanation && (
        <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
           <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Explicación de "{concept}"</h4>
           <MarkdownRenderer content={explanation} />
        </div>
      )}
    </div>
  );
};