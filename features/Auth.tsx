import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { EDUCATIONAL_LEVELS } from '../constants';

interface AuthProps {
    initialMode: 'login' | 'register';
    onBack: () => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon: React.ReactNode }> = ({ label, id, icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">{icon}</div>
            <input
                id={id}
                {...props}
                className="block w-full rounded-md border-slate-300 dark:border-slate-600 pl-10 p-3 focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
        </div>
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; icon: React.ReactNode }> = ({ label, id, icon, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">{icon}</div>
            <select
                id={id}
                {...props}
                className="block w-full rounded-md border-slate-300 dark:border-slate-600 pl-10 p-3 focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
                {children}
            </select>
        </div>
    </div>
);

export const Auth: React.FC<AuthProps> = ({ initialMode, onBack }) => {
    const [isRegister, setIsRegister] = useState(initialMode === 'register');
    const { register, login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [level, setLevel] = useState(EDUCATIONAL_LEVELS[2]); // Default to University
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isRegister) {
                if (!name.trim()) throw new Error("El nombre es requerido.");
                if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");
                await register(name, level, email, password);
            } else {
                await login(email, password);
            }
        } catch (err: any) {
            setError(err.message || "Ocurrió un error. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center p-4 relative">
             <button 
                onClick={onBack}
                className="absolute top-6 left-6 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2 z-10"
                aria-label="Volver a la página de inicio"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Volver
            </button>

            <div className="text-center mb-8">
                 <svg className="w-16 h-16 text-amber-600 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-7v4h3l-4 7z"/>
                </svg>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mt-2">Bienvenido a Lumen AI</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{isRegister ? "Crea una cuenta para potenciar tus estudios." : "Inicia sesión para continuar."}</p>
            </div>
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {isRegister && (
                         <InputField 
                            id="name"
                            label="Nombre Completo"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            autoComplete="name"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
                        />
                    )}
                     <InputField 
                        id="email"
                        label="Correo Electrónico"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>}
                    />
                    <InputField 
                        id="password"
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete={isRegister ? "new-password" : "current-password"}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L4.257 19.743A2 2 0 111.414 16.9l8.629-8.629A6 6 0 0118 8zm-6-3a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" /></svg>}
                    />
                    {isRegister && (
                         <SelectField
                            id="level"
                            label="Nivel Educativo"
                            value={level}
                            onChange={e => setLevel(e.target.value)}
                            required
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.788 1.84L10 5.382l6.606 2.048a1 1 0 00.788-1.84l-7-3.5zM3 9.382L10 12l7-2.618v5.236a1 1 0 01-1 1H4a1 1 0 01-1-1V9.382z" /></svg>}
                         >
                            {EDUCATIONAL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                         </SelectField>
                    )}

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div>
                        <Button type="submit" isLoading={isLoading} className="w-full">
                            {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                        <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }} className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 ml-1">
                            {isRegister ? 'Inicia sesión' : 'Crea una'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};