import React, { useState, useMemo, useContext } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FEATURES } from './constants';
import type { FeatureId } from './types';
import { Dashboard } from './features/Dashboard';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { GamificationProvider } from './components/GamificationProvider';
import { ReminderProvider } from './components/ReminderProvider';
import { Auth } from './features/Auth';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './features/LandingPage';
import { Footer } from './components/Footer';
import { LevelContext } from './contexts/LevelContext';


const App: React.FC = () => {
    const { currentUser, loading } = useAuth();
    const [authAction, setAuthAction] = useState<'landing' | 'login' | 'register'>('landing');

    const renderUnauthenticatedApp = () => {
        switch (authAction) {
            case 'login':
            case 'register':
                return <Auth initialMode={authAction} onBack={() => setAuthAction('landing')} />;
            case 'landing':
            default:
                return <LandingPage onNavigate={setAuthAction} />;
        }
    };

    return (
        <AccessibilityProvider>
            <ReminderProvider>
                <GamificationProvider>
                    {loading ? (
                         <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
                             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
                         </div>
                    ) : !currentUser ? (
                        renderUnauthenticatedApp()
                    ) : (
                        <MainApp />
                    )}
                </GamificationProvider>
            </ReminderProvider>
        </AccessibilityProvider>
    );
};


const MainApp: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureId>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false); // For mobile overlay
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop collapse
  const { currentUser, updateLevel } = useAuth();

  const ActiveComponent = useMemo(() => {
    if (activeFeature === 'dashboard') {
      return Dashboard;
    }
    const feature = FEATURES.find(f => f.id === activeFeature);
    return feature ? feature.component : Dashboard;
  }, [activeFeature]);

  const levelContextValue = useMemo(() => ({
      level: currentUser!.level,
      setLevel: updateLevel
  }), [currentUser, updateLevel]);

  return (
    <LevelContext.Provider value={levelContextValue}>
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
            <Sidebar 
                activeFeature={activeFeature} 
                setActiveFeature={setActiveFeature}
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
                setSidebarOpen={setSidebarOpen} 
                activeFeatureName={activeFeature === 'dashboard' ? 'Panel Principal' : FEATURES.find(f => f.id === activeFeature)?.name || 'Panel Principal'} 
            />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-stone-950">
                <div key={activeFeature} className="animate-fade-in">
                    <ActiveComponent setActiveFeature={setActiveFeature} />
                </div>
            </main>
            <Footer className="p-4 bg-slate-50 dark:bg-stone-950 border-t border-slate-200 dark:border-slate-800" />
            </div>
        </div>
    </LevelContext.Provider>
  );
};


export default App;