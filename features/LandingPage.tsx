import React from 'react';
import { Button } from '../components/common/Button';
import { Footer } from '../components/Footer';

interface LandingPageProps {
  onNavigate: (action: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="relative mb-8 animate-slide-in-up-fade">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative">
                <svg className="w-24 h-24 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-7v4h3l-4 7z"/>
                </svg>
            </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 leading-tight animate-slide-in-up-fade animation-delay-200">
          Potencia Tu Aprendizaje con <span className="text-amber-500">Inteligencia Artificial</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400 animate-slide-in-up-fade animation-delay-400">
          Lumen AI es tu asistente académico personal. Desde resolver tareas complejas hasta organizar tu estudio, estamos aquí para ayudarte a brillar.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-in-up-fade animation-delay-600">
          <Button 
            onClick={() => onNavigate('register')} 
            className="px-10 py-4 text-lg transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
          >
            Crear Cuenta Gratis
          </Button>
          <Button 
            onClick={() => onNavigate('login')} 
            variant="secondary" 
            className="px-10 py-4 text-lg transform hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-500/20 dark:hover:shadow-black/20 transition-all duration-300"
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
      <Footer className="p-6 bg-transparent animate-slide-in-up-fade animation-delay-800" />
    </div>
  );
};