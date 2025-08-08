import React, { useState, useContext } from 'react';
import { getScientificCalculation } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { GamificationContext } from '../components/GamificationProvider';
import { ScientificCalculation } from '../types';

export const ScientificCalculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [calculation, setCalculation] = useState<ScientificCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);

  const handleSubmit = async () => {
    if (!expression.trim()) {
      setError('Por favor, introduce una operación matemática.');
      return;
    }
    setIsLoading(true);
    setError('');
    setCalculation(null);
    try {
      const result = await getScientificCalculation(expression, level);
      if (result) {
        setCalculation(result);
        addXp(10, 'calculator');
      } else {
        setError('No se pudo resolver la operación. Intenta ser más específico o reformular la pregunta.');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Calculadora Científica Explicada</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Resuelve operaciones y explica por qué da ese resultado (álgebra, trigonometría, matrices...).</p>
        
        <div className="flex gap-4">
            <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Ej: 'resolver 2x + 5 = 15', 'sin(90 grados)', 'integral de x^2 dx'"
                className="flex-grow p-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
            />
            <Button onClick={handleSubmit} isLoading={isLoading}>
                Calcular y Explicar
            </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      
      {isLoading && (
        <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Calculando...</p>
        </div>
      )}

      {calculation && (
        <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
           <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Resultado</h4>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg mb-6">
                <p className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400 text-center">{calculation.result}</p>
            </div>
           <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Explicación Paso a Paso</h4>
           <MarkdownRenderer content={calculation.explanation} />
        </div>
      )}
    </div>
  );
};