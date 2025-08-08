import React from 'react';
import { FeatureId, Feature } from '../types';
import { FEATURES } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeFeature: FeatureId;
  setActiveFeature: (feature: FeatureId) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeFeature, setActiveFeature, isSidebarOpen, setSidebarOpen, isSidebarCollapsed, setSidebarCollapsed }) => {
  const { currentUser, logout } = useAuth();

  const handleNavigation = (id: FeatureId) => {
    setActiveFeature(id);
    if(window.innerWidth < 768) { // md breakpoint
      setSidebarOpen(false);
    }
  };

  const NavItem: React.FC<{ feature: Feature }> = ({ feature }) => (
    <li>
      <button
        onClick={() => handleNavigation(feature.id)}
        disabled={feature.disabled}
        className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 group ${
          activeFeature === feature.id
            ? 'bg-amber-600 text-white shadow-md'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        } ${feature.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isSidebarCollapsed ? 'justify-center' : ''}`}
        title={feature.name}
      >
        <span className="shrink-0 transition-transform group-hover:scale-110">{feature.icon}</span>
        <span className={`font-medium text-left whitespace-nowrap overflow-hidden transition-all duration-200 ${isSidebarCollapsed ? 'w-0 ml-0' : 'w-auto ml-3'}`}>{feature.name}</span>
      </button>
    </li>
  );

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/30 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`absolute md:relative z-40 flex flex-col h-full bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${isSidebarCollapsed ? 'md:w-20' : 'md:w-72'}`}>
        <div className="flex items-center justify-center p-6 border-b border-slate-200 dark:border-slate-700">
           <svg className="w-10 h-10 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-7v4h3l-4 7z"/>
          </svg>
          <h1 className={`text-2xl font-bold text-slate-800 dark:text-slate-100 ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${isSidebarCollapsed ? 'md:w-0' : 'w-auto'}`}>Lumen AI</h1>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul>
            <li>
              <button
                onClick={() => handleNavigation('dashboard')}
                className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 group ${
                  activeFeature === 'dashboard'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                 title="Panel Principal"
              >
                <span className="shrink-0 transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </span>
                <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ${isSidebarCollapsed ? 'w-0 ml-0' : 'w-auto ml-3'}`}>Panel Principal</span>
              </button>
            </li>
            <hr className="my-3 border-slate-200 dark:border-slate-700" />
            {FEATURES.filter(f => !f.disabled)
              .filter(f => !f.adminOnly || (f.adminOnly && currentUser?.role === 'admin'))
              .map(feature => (
              <NavItem key={feature.id} feature={feature} />
            ))}
            <hr className="my-3 border-slate-200 dark:border-slate-700" />
            {FEATURES.filter(f => f.disabled).map(feature => (
                <NavItem key={feature.id} feature={feature} />
            ))}
          </ul>
        </nav>
         {currentUser && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                 <div className="w-10 h-10 rounded-full bg-amber-200 dark:bg-amber-900 flex items-center justify-center font-bold text-amber-700 dark:text-amber-300 shrink-0">
                    {currentUser.name?.charAt(0).toUpperCase()}
                 </div>
                 <div className={`overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 ml-0' : 'w-auto ml-3'}`}>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate whitespace-nowrap">{currentUser.name}</p>
                    <button onClick={logout} className="text-sm text-red-600 dark:text-red-500 hover:underline whitespace-nowrap">
                        Cerrar Sesión
                    </button>
                 </div>
              </div>
            </div>
        )}
         <div className="p-3 mt-auto border-t border-slate-200 dark:border-slate-700 hidden md:block">
            <button
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                className={`w-full flex items-center p-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title={isSidebarCollapsed ? 'Expandir panel' : 'Contraer panel'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 shrink-0 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                <span className={`font-medium text-left whitespace-nowrap overflow-hidden transition-all duration-200 ${isSidebarCollapsed ? 'w-0 ml-0' : 'w-auto ml-3'}`}>Contraer</span>
            </button>
        </div>
      </aside>
    </>
  );
};