import React from 'react';
import { Feature } from '../types';

interface ToolCardProps {
  feature: Feature;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ feature, onClick }) => {
  const isDisabled = feature.disabled || false;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full text-left bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 ease-in-out border border-slate-200 dark:border-slate-700 flex flex-col ${
        isDisabled ? 'opacity-60 grayscale cursor-not-allowed hover:transform-none hover:shadow-lg' : 'dark:hover:border-amber-500'
      }`}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 mr-4`}>
          {feature.icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{feature.name}</h3>
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow">
        {feature.description}
      </p>
       <div className={`mt-4 font-semibold text-sm flex items-center ${isDisabled ? 'text-slate-500' : 'text-amber-600 dark:text-amber-400'}`}>
        {isDisabled ? 'No disponible' : 'Abrir Herramienta'}
        {!isDisabled && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        )}
      </div>
    </button>
  );
};