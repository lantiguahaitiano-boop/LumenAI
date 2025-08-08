import React, { useContext } from 'react';
import { GamificationContext } from '../components/GamificationProvider';
import { LEVEL_THRESHOLDS } from '../gamificationConstants';

export const Gamification: React.FC = () => {
    const { gamification } = useContext(GamificationContext);
    const { level, xp, achievements } = gamification;

    const currentLevelXpStart = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextLevelXpStart = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    
    const xpForLevel = nextLevelXpStart - currentLevelXpStart;
    const xpIntoLevel = xp - currentLevelXpStart;
    
    const progressPercentage = xpForLevel > 0 ? Math.min((xpIntoLevel / xpForLevel) * 100, 100) : 100;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Tu Progreso</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">¡Sigue aprendiendo para subir de nivel y desbloquear todos los logros!</p>

                {/* Level and XP Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400">Nivel {level}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{level >= LEVEL_THRESHOLDS.length ? 'Nivel Máximo' : `${Math.floor(xpIntoLevel)} / ${xpForLevel} XP`}</p>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                        <div 
                            className="bg-amber-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%`}}
                        />
                    </div>
                </div>

                {/* Achievements */}
                <div>
                     <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Logros</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.values(achievements).map(ach => (
                            <div key={ach.id} className={`p-4 rounded-lg border flex items-start gap-4 transition-all duration-500 ease-out ${ach.unlocked ? 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-800 opacity-100 scale-100' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 scale-95'}`}>
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${ach.unlocked ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                    {ach.unlocked ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800 dark:text-slate-200">{ach.name}</h5>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{ach.description}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};