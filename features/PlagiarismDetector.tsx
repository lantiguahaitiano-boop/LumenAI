import React, { useState, useContext } from 'react';
import { checkPlagiarismAndSuggestImprovements } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/TextArea';
import { LevelContext } from '../contexts/LevelContext';
import { PlagiarismResult, WritingSuggestion } from '../types';
import { GamificationContext } from '../components/GamificationProvider';

// A component for the circular progress bar
const OriginalityScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 52; // 2 * pi * radius
    const offset = circumference - (score / 100) * circumference;
    const color = score > 85 ? 'text-green-500' : score > 60 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                />
                <circle
                    className={`${color} transition-all duration-1000 ease-in-out`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${color}`}>{score}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">% Original</span>
            </div>
        </div>
    );
};

const SuggestionCard: React.FC<{ suggestion: WritingSuggestion }> = ({ suggestion }) => (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Original:</p>
        <blockquote className="border-l-4 border-red-400 pl-3 text-red-800/80 dark:text-red-300/80 bg-red-50 dark:bg-red-900/20 p-2 rounded-r-md">
            {suggestion.originalText}
        </blockquote>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 mb-2">Sugerencia:</p>
        <blockquote className="border-l-4 border-green-400 pl-3 text-green-800/90 dark:text-green-300/90 bg-green-50 dark:bg-green-900/20 p-2 rounded-r-md">
            {suggestion.suggestion}
        </blockquote>
         <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
            <strong>Razón:</strong> {suggestion.explanation}
        </div>
    </div>
);


export const PlagiarismDetector: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Por favor, pega el texto que quieres verificar.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const apiResult = await checkPlagiarismAndSuggestImprovements(text, level);
      if (apiResult) {
        setResult(apiResult);
        addXp(20, 'plagiarism');
      } else {
        setError('No se pudo analizar el texto. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Detector de Plagio y Redacción Avanzada</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Verifica la originalidad de tus trabajos y recibe sugerencias para mejorar tu redacción académica.</p>
        
        <TextArea
          rows={15}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pega tu ensayo, artículo o cualquier texto aquí para analizarlo..."
        />

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Verificar Texto
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {isLoading && (
        <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Analizando... Esto puede tardar un momento.</p>
        </div>
      )}

      {result && (
        <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
           <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Resultados del Análisis</h4>
           
           <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="flex-shrink-0">
                    <OriginalityScoreCircle score={result.originalityScore} />
                </div>
                <div>
                    <h5 className="font-bold text-lg text-slate-800 dark:text-slate-200">Resumen del Análisis</h5>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{result.summary}</p>
                </div>
           </div>
           
           <h5 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 border-t border-slate-200 dark:border-slate-700 pt-6">Sugerencias de Mejora</h5>
           {result.suggestions.length > 0 ? (
                <div className="space-y-4">
                    {result.suggestions.map((s, index) => <SuggestionCard key={index} suggestion={s} />)}
                </div>
           ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">¡Excelente trabajo! No se encontraron sugerencias de mejora específicas.</p>
           )}
        </div>
      )}
    </div>
  );
};