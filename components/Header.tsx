import React, { useContext } from 'react';
import { LevelContext } from '../contexts/LevelContext';
import { EDUCATIONAL_LEVELS } from '../constants';
import { Select } from './common/Select';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
  activeFeatureName: string;
}

export const Header: React.FC<HeaderProps> = ({ setSidebarOpen, activeFeatureName }) => {
  const { level, setLevel } = useContext(LevelContext);
  
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(true)} className="text-slate-500 dark:text-slate-400 mr-4 md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">{activeFeatureName}</h2>
      </div>
      <div className="flex items-center">
        <label htmlFor="level-select" className="text-sm font-medium text-slate-600 dark:text-slate-300 mr-2 hidden sm:block">Nivel:</label>
        <Select
          id="level-select"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          options={EDUCATIONAL_LEVELS.map(l => ({ value: l, label: l }))}
        />
      </div>
    </header>
  );
};