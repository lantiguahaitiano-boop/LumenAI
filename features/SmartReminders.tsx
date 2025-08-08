import React, { useState, useContext } from 'react';
import { getSpacedRepetitionSchedule } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { GamificationContext } from '../components/GamificationProvider';
import { useReminders } from '../components/ReminderProvider';

interface SuggestedReminder {
    topic: string;
    note: string;
    reviewDate: string;
}

export const SmartReminders: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestedReminders, setSuggestedReminders] = useState<SuggestedReminder[]>([]);
    
    const { level } = useContext(LevelContext);
    const { addXp } = useContext(GamificationContext);
    const { reminders, addReminders, deleteReminder, notificationPermission, requestNotificationPermission } = useReminders();

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Por favor, introduce un tema para planificar repasos.');
            return;
        }
        setIsLoading(true);
        setError('');
        setSuggestedReminders([]);
        try {
            const result = await getSpacedRepetitionSchedule(topic, level);
            if (result) {
                setSuggestedReminders(result.map(r => ({ ...r, topic })));
            } else {
                setError('No se pudo generar un plan de repaso. Intenta ser más específico.');
            }
        } catch (err) {
            setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmSuggestions = () => {
        const remindersToAdd = suggestedReminders.map(s => ({
            topic: s.topic,
            note: s.note,
            dueDate: s.reviewDate
        }));
        addReminders(remindersToAdd);
        addXp(15, 'reminders');
        setSuggestedReminders([]);
        setTopic('');
    };

    const NotificationBellIcon: React.FC<{status: NotificationPermission, className?: string}> = ({ status, className }) => {
        if (status === 'granted') return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
        if (status === 'denied') return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
        return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
    }
    
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Recordatorios Inteligentes</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Introduce un tema que acabas de estudiar y la IA creará un plan de repaso optimizado con notificaciones.</p>
                
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Ej: 'Ciclo de Krebs', 'Leyes de Newton'"
                        className="flex-grow p-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
                    />
                    <Button onClick={handleGenerate} isLoading={isLoading}>
                        Generar Plan
                    </Button>
                </div>
                 {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>

            {isLoading && (
                 <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Creando tu plan de estudio...</p>
                </div>
            )}

            {suggestedReminders.length > 0 && (
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Plan de Repaso Sugerido para "{topic}"</h4>
                    <div className="space-y-3 mb-6">
                        {suggestedReminders.map((s, i) => (
                             <div key={i} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md border border-slate-200 dark:border-slate-600">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{s.note}</p>
                                <p className="text-sm text-amber-600 dark:text-amber-400">Fecha de repaso: {new Date(s.reviewDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                             </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button onClick={() => setSuggestedReminders([])} variant="secondary">Cancelar</Button>
                        <Button onClick={handleConfirmSuggestions}>Confirmar y Añadir</Button>
                    </div>
                </div>
            )}

            <div>
                 <div className="flex justify-between items-center mb-4">
                     <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Mis Recordatorios</h4>
                     <button onClick={requestNotificationPermission} disabled={notificationPermission !== 'default'} className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        <NotificationBellIcon status={notificationPermission} className="w-5 h-5" />
                        {notificationPermission === 'granted' && 'Notificaciones activadas'}
                        {notificationPermission === 'denied' && 'Notificaciones bloqueadas'}
                        {notificationPermission === 'default' && 'Activar notificaciones'}
                     </button>
                 </div>
                 {reminders.length === 0 ? (
                    <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400">No tienes recordatorios activos.</p>
                    </div>
                 ) : (
                    <div className="space-y-3">
                        {reminders.map((item, index) => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{item.topic}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.note}</p>
                                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mt-1">{new Date(item.dueDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <button onClick={() => deleteReminder(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                 )}
            </div>
        </div>
    );
};