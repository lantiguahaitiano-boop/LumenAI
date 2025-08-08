import React, { useState, useContext, useEffect } from 'react';
import { ScheduleItem } from '../types';
import { Button } from '../components/common/Button';
import { GamificationContext } from '../components/GamificationProvider';

// Custom hook for localStorage (Corrected Implementation)
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
        console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};


export const StudyOrganizer: React.FC = () => {
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>('studySchedule', []);
  const [subject, setSubject] = useState('');
  const [task, setTask] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { addXp } = useContext(GamificationContext);


  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !task.trim() || !date) return;
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      subject,
      task,
      date,
    };
    setSchedule(prevSchedule => [...prevSchedule, newItem].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setSubject('');
    setTask('');
    addXp(5, 'organizer');
  };

  const deleteItem = (id: string) => {
    setSchedule(prevSchedule => prevSchedule.filter(item => item.id !== id));
  };
  
  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Organizador de Estudio</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Planifica tus sesiones de estudio, tareas y exámenes. Tu horario se guarda en tu navegador.</p>

            <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Asignatura</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Ej: Física" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-300 focus:shadow-lg focus:shadow-amber-500/20" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tarea / Examen</label>
                    <input type="text" value={task} onChange={e => setTask(e.target.value)} placeholder="Ej: Problemas del cap. 5" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-300 focus:shadow-lg focus:shadow-amber-500/20" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Fecha Límite</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-300 focus:shadow-lg focus:shadow-amber-500/20" />
                </div>
                <div className="md:col-span-3 flex justify-end mt-2">
                    <Button type="submit">Añadir al Horario</Button>
                </div>
            </form>
        </div>

        <div className="mt-8">
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Tu Horario</h4>
            {schedule.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">Tu horario está vacío. ¡Añade una tarea para empezar!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {schedule.map((item, index) => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between animate-fade-in" style={{ animationDelay: `${index * 50}ms`}}>
                            <div className="flex items-center">
                                <div className="text-center mr-4 w-16">
                                    <p className="font-bold text-amber-600 dark:text-amber-400">{new Date(item.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric' })}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(item.date + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short' })}</p>

                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{item.task}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.subject}</p>
                                </div>
                            </div>
                            <button onClick={() => deleteItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
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