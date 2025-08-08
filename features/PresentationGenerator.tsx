import React, { useState, useContext } from 'react';
import { generatePresentationSlides } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { Slide } from '../types';
import { GamificationContext } from '../components/GamificationProvider';

const SlideContentCard: React.FC<{ slide: Slide, index: number }> = ({ slide, index }) => {
    const [copied, setCopied] = useState(false);
    const textToCopy = `Diapositiva ${index + 1}: ${slide.title}\n\nContenido:\n${slide.content}\n\nSugerencia Visual:\n${slide.visualSuggestion}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in" style={{ animationDelay: `${index * 100}ms`}}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-3 py-1 rounded-full">
                        Diapositiva {index + 1}
                    </span>
                    {slide.presenter > 0 && (
                         <span className="ml-2 text-sm font-semibold bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
                            Expositor {slide.presenter}
                        </span>
                    )}
                </div>
                <button onClick={handleCopy} className="text-sm font-medium text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                    {copied ? (
                        <>
                        Copiado
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </>
                    ) : (
                        <>
                        Copiar
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </>
                    )}
                </button>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{slide.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap mb-4">{slide.content}</p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Sugerencia Visual:</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">{slide.visualSuggestion}</p>
            </div>
        </div>
    );
};

export const PresentationGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [paragraphSize, setParagraphSize] = useState<'Corto' | 'Medio' | 'Largo'>('Medio');
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError('Por favor, introduce un tema para tu exposición.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSlides(null);
    try {
      const result = await generatePresentationSlides(topic, level, numPeople, paragraphSize);
      if (result) {
        setSlides(result);
        addXp(20, 'presentation');
      } else {
        setError('No se pudo generar el contenido. El tema podría ser demasiado ambiguo. Por favor, inténtalo de nuevo con un tema más específico.');
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
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Creador de Exposiciones</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Genera el contenido de texto para diapositivas, dividiendo un tema entre varios expositores.</p>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tema de la Exposición</label>
                <input
                    id="topic-input"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ej: 'El Impacto de la Arquitectura Romana', 'Explicación de la Fotosíntesis'"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="people-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Número de Expositores</label>
                    <input
                        id="people-input"
                        type="number"
                        value={numPeople}
                        onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value, 10)))}
                        min="1"
                        max="10"
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
                    />
                </div>
                 <div>
                    <label htmlFor="size-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tamaño de los Párrafos</label>
                    <select
                        id="size-select"
                        value={paragraphSize}
                        onChange={(e) => setParagraphSize(e.target.value as 'Corto' | 'Medio' | 'Largo')}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
                    >
                        <option value="Corto">Corto</option>
                        <option value="Medio">Medio</option>
                        <option value="Largo">Largo</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button onClick={handleSubmit} isLoading={isLoading}>
                    {isLoading ? 'Generando...' : 'Generar Contenido'}
                </Button>
            </div>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      
      {isLoading && (
        <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Construyendo el contenido de tu exposición...
            </p>
        </div>
      )}

      {slides && !isLoading && (
        <div className="mt-8">
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Contenido Generado para tu Exposición</h4>
            <div className="space-y-6">
              {slides.map((slide, index) => (
                  <SlideContentCard key={index} slide={slide} index={index} />
              ))}
            </div>
        </div>
      )}
    </div>
  );
};