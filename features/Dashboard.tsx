import React, { useContext } from 'react';
import { FEATURES } from '../constants';
import { FeatureId } from '../types';
import { ToolCard } from '../components/ToolCard';
import { LevelContext } from '../contexts/LevelContext';

interface DashboardProps {
  setActiveFeature: (featureId: FeatureId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveFeature }) => {
    const { level } = useContext(LevelContext);
  return (
    <div>
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Bienvenido a Lumen AI</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Tu socio académico inteligente. Selecciona una herramienta para comenzar. Tu nivel actual es <span className="font-semibold text-amber-600 dark:text-amber-400">{level}</span>.</p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {FEATURES.map((feature, index) => (
          <div key={feature.id} className="animate-slide-in-up-fade" style={{ animationDelay: `${index * 50}ms`}}>
            <ToolCard
              feature={feature}
              onClick={() => !feature.disabled && setActiveFeature(feature.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};