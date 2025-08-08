import React from 'react';
import { FeatureId, Feature } from './types';
import { FEATURES } from './constants';
import { useAuth } from './AuthContext';

interface SidebarProps {
  activeFeature: FeatureId;
  setActiveFeature: (feature: FeatureId) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeFeature, setActiveFeature, isSidebarOpen, setSidebarOpen }) => {
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
        className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
          activeFeature === feature.id
            ? 'bg-teal-600 text-white shadow-md'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        } ${feature.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="mr-3">{feature.icon}</span>
        <span className="font-medium text-left">{feature.name}</span>
      </button>
    </li>
  );

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/30 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`absolute md:relative z-40 flex flex-col w-72 h-full bg-white dark:bg-slate-800 shadow-lg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-center p-6 border-b border-slate-200 dark:border-slate-700">
           <svg className="w-10 h-10 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-7v4h3l-4 7z"/>
          </svg>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 ml-2">Lumen AI</h1>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul>
            <li>
              <button
                onClick={() => handleNavigation('dashboard')}
                className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                  activeFeature === 'dashboard'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </span>
                <span className="font-medium">Panel Principal</span>
              </button>
            </li>
            <hr className="my-3 border-slate-200 dark:border-slate-700" />
            {FEATURES.filter(f => !f.disabled)
              .filter(feature => !feature.adminOnly || (feature.adminOnly && currentUser?.role === 'admin'))
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
              <div className="flex items-center">
                 <div className="w-10 h-10 rounded-full bg-teal-200 dark:bg-teal-900 flex items-center justify-center font-bold text-teal-700 dark:text-teal-300 flex-shrink-0">
                    {currentUser.name?.charAt(0).toUpperCase()}
                 </div>
                 <div className="ml-3 overflow-hidden">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</p>
                    <button onClick={logout} className="text-sm text-red-600 dark:text-red-500 hover:underline">
                        Cerrar Sesión
                    </button>
                 </div>
              </div>
            </div>
        )}
      </aside>
    </>
  );
};