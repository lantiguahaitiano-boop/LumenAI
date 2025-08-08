import React, { useState, useContext } from 'react';
import { getReferenceRecommendations } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { ReferenceItem } from '../types';
import { GamificationContext } from '../components/GamificationProvider';

const ReferenceCard: React.FC<{ reference: ReferenceItem }> = ({ reference }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 animate-slide-in-up-fade">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{reference.title}</h4>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">{reference.author} ({reference.year})</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1">{reference.source}</p>
            <p className="text-slate-600 dark:text-slate-400 my-3">{reference.summary}</p>
            {reference.url && (
                <a 
                    href={reference.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                    Visitar Fuente 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
            )}
        </div>
    );
};

export const ReferenceRecommender: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [references, setReferences] = useState<ReferenceItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { level } = useContext(LevelContext);
    const { addXp } = useContext(GamificationContext);

    const handleSubmit = async () => {
        if (!topic.trim()) {
            setError('Por favor, introduce un tema de investigación.');
            return;
        }
        setIsLoading(true);
        setError('');
        setReferences(null);
        try {
            const result = await getReferenceRecommendations(topic, level);
            if (result && result.length > 0) {
                setReferences(result);
                addXp(15, 'references');
            } else {
                setError('No se pudieron encontrar referencias. El tema puede ser demasiado específico o inusual. Intenta reformularlo.');
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
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Recomendador de Lecturas y Referencias</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Encuentra artículos, libros y fuentes académicas relevantes para tu tema de investigación.</p>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder="Ej: 'La influencia del estoicismo en la psicología moderna'"
                        className="flex-grow p-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
                    />
                    <Button onClick={handleSubmit} isLoading={isLoading}>
                        Buscar Fuentes
                    </Button>
                </div>
            </div>

            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            
            {isLoading && (
                <div className="mt-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Buscando en la biblioteca digital...</p>
                </div>
            )}

            {references && (
                <div className="mt-8">
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Fuentes Recomendadas</h4>
                    <div className="space-y-6">
                        {references.map((ref, i) => (
                            <ReferenceCard key={i} reference={ref} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};