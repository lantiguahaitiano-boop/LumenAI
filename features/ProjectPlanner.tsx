import React, { useState, useContext } from 'react';
import { generateProjectPlan } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { ProjectPlan } from '../types';
import { GamificationContext } from '../components/GamificationProvider';

export const ProjectPlanner: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError('Por favor, introduce un tema de proyecto.');
      return;
    }
    setIsLoading(true);
    setError('');
    setPlan(null);
    try {
      const result = await generateProjectPlan(topic, level);
      if (result) {
        setPlan(result);
        addXp(15, 'planner');
      } else {
        setError('No se pudo generar un plan. El tema puede ser demasiado amplio. Por favor, sé más específico.');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const PlanSection: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="mb-6">
        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b dark:border-slate-600 pb-2 mb-3">{title}</h4>
        {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Planificador de Proyectos</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Obtén ayuda para estructurar tu monografía, tesis o proyecto de investigación de principio a fin.</p>
        
        <div className="flex gap-4">
            <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: 'El papel de la IA en la educación', 'Biología marina de los arrecifes de coral'"
                className="flex-grow p-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
            />
            <Button onClick={handleSubmit} isLoading={isLoading}>
                Crear Plan
            </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      
      {isLoading && (
        <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Estructurando tu proyecto...</p>
        </div>
      )}

      {plan && (
        <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
           <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">{plan.title}</h3>
           <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">Plan de Proyecto Generado</p>

           <PlanSection title="Justificación"><p className="text-slate-600 dark:text-slate-400">{plan.justification}</p></PlanSection>
           <PlanSection title="Hipótesis / Pregunta de Investigación"><p className="italic text-slate-600 dark:text-slate-400">"{plan.hypothesis}"</p></PlanSection>
           <PlanSection title="Objetivos">
               <p className="font-semibold text-slate-800 dark:text-slate-200">Objetivo Principal:</p>
               <p className="text-slate-600 dark:text-slate-400 mb-2">{plan.mainObjective}</p>
               <p className="font-semibold text-slate-800 dark:text-slate-200">Objetivos Específicos:</p>
               <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                   {plan.specificObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
               </ul>
           </PlanSection>
           <PlanSection title="Esquema de Capítulos Sugerido">
                <div className="space-y-3">
                {plan.chapterOutline.map(ch => (
                    <div key={ch.chapter} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md border border-slate-200 dark:border-slate-600">
                        <p className="font-bold text-slate-800 dark:text-slate-200">Capítulo {ch.chapter}: {ch.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{ch.description}</p>
                    </div>
                ))}
                </div>
           </PlanSection>
           <PlanSection title="Metodología Sugerida"><p className="text-slate-600 dark:text-slate-400">{plan.methodology}</p></PlanSection>
        </div>
      )}
    </div>
  );
};