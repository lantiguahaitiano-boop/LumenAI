import React, { useState, useContext, useMemo } from 'react';
import { generateInfographicTimeline } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { InfographicTimelineResult, InfographicIcon, TimelineEvent, InfographicSection } from '../types';
import { GamificationContext } from '../components/GamificationProvider';

// --- Icon Components for Infographics ---
const BrainIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.871 14.735c-1.398-1.469-2.126-3.3-2.126-5.195 0-3.242 2.632-5.875 5.875-5.875 1.895 0 3.626.728 4.995 2.126m-4.995 8.944a5.854 5.854 0 005.625-4.375m-11.25 0a5.854 5.854 0 015.625-4.375m1.25 11.25c1.398 1.469 3.226 2.24 5.195 2.24 3.242 0 5.875-2.633 5.875-5.875 0-1.895-.728-3.626-2.126-4.995m-1.25-6.25a5.854 5.854 0 015.625 4.375" /></svg>;
const BookIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const FlaskIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const FlagIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0l5-2 4 1 5-2m-9 1v4m0 0h10a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PersonIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const GearIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.608 3.292 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LightbulbIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const CalendarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const AtomIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20.5c0 .276.224.5.5.5s.5-.224.5-.5-.224-.5-.5-.5-.5.224-.5.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5c0 .276.224.5.5.5s.5-.224.5-.5-.224-.5-.5-.5-.5.224-.5.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.5c0 .276.224.5.5.5s.5-.224.5-.5-.224-.5-.5-.5-.5.224-.5.5zM12 12a9 9 0 100-9 9 9 0 000 9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.469 9.409a9 9 0 0113.122-6.93" /><path strokeLinecap="round" strokeLinejoin="round" d="M21.531 14.591a9 9 0 01-13.122 6.93" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.53 4.53a9 9 0 0114.94 0" /></svg>;
const CodeIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;

const ICONS: Record<InfographicIcon, React.ReactNode> = {
    brain: <BrainIcon className="w-8 h-8"/>,
    book: <BookIcon className="w-8 h-8"/>,
    flask: <FlaskIcon className="w-8 h-8"/>,
    flag: <FlagIcon className="w-8 h-8"/>,
    person: <PersonIcon className="w-8 h-8"/>,
    gear: <GearIcon className="w-8 h-8"/>,
    lightbulb: <LightbulbIcon className="w-8 h-8"/>,
    calendar: <CalendarIcon className="w-8 h-8"/>,
    atom: <AtomIcon className="w-8 h-8"/>,
    code: <CodeIcon className="w-8 h-8"/>,
};

// --- Rendering Components ---
const Timeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => (
    <div className="relative pl-4">
        <div className="absolute top-0 left-4 w-0.5 h-full bg-slate-300 dark:bg-slate-600" aria-hidden="true"></div>
        {events.map((event, index) => (
            <div key={index} className="relative mb-8 pl-8">
                <div className="absolute -left-1.5 top-1 w-4 h-4 bg-amber-500 rounded-full border-4 border-white dark:border-slate-800" aria-hidden="true"></div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-amber-600 dark:text-amber-400">{event.date}</p>
                    <h5 className="font-semibold text-slate-800 dark:text-slate-100 mt-1">{event.title}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{event.description}</p>
                </div>
            </div>
        ))}
    </div>
);

const Infographic: React.FC<{ sections: InfographicSection[] }> = ({ sections }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                    {ICONS[section.icon] || <LightbulbIcon className="w-8 h-8" />}
                </div>
                <h5 className="font-bold text-lg text-slate-800 dark:text-slate-100">{section.title}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{section.content}</p>
            </div>
        ))}
    </div>
);


export const InfographicsBuilder: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [visualType, setVisualType] = useState<'timeline' | 'infographic'>('timeline');
    const [result, setResult] = useState<InfographicTimelineResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { level } = useContext(LevelContext);
    const { addXp } = useContext(GamificationContext);

    const handleSubmit = async () => {
        if (!topic.trim()) {
            setError('Por favor, introduce un tema.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const apiResult = await generateInfographicTimeline(topic, visualType, level);
            if (apiResult && (apiResult.timelineEvents || apiResult.infographicSections)) {
                setResult(apiResult);
                addXp(20, 'infographics');
            } else {
                setError('No se pudo generar el visual. El tema puede ser demasiado ambiguo. Por favor, sé más específico.');
            }
        } catch (err) {
            setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Constructor de Infografías y Líneas de Tiempo</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Visualiza procesos, historia o biografías. Introduce un tema y elige un formato.</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tema</label>
                        <input
                            id="topic-input"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ej: 'El Renacimiento', 'Ciclo del Agua', 'Biografía de Albert Einstein'"
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Visual</label>
                        <div className="flex gap-2 rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
                            <button onClick={() => setVisualType('timeline')} className={`w-full p-2 rounded-md font-semibold text-sm transition-colors ${visualType === 'timeline' ? 'bg-white dark:bg-slate-800 text-amber-600 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>Línea de Tiempo</button>
                            <button onClick={() => setVisualType('infographic')} className={`w-full p-2 rounded-md font-semibold text-sm transition-colors ${visualType === 'infographic' ? 'bg-white dark:bg-slate-800 text-amber-600 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>Infografía</button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSubmit} isLoading={isLoading}>
                        {isLoading ? 'Generando Visual...' : 'Generar Visual'}
                    </Button>
                </div>
            </div>

            {error && <p className="mt-6 text-red-500 text-center">{error}</p>}

            {isLoading && (
                <div className="mt-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Creando tu visualización...</p>
                </div>
            )}

            {result && (
                <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                    <h4 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-8">{result.title}</h4>
                    {result.timelineEvents && <Timeline events={result.timelineEvents} />}
                    {result.infographicSections && <Infographic sections={result.infographicSections} />}
                </div>
            )}
        </div>
    );
};