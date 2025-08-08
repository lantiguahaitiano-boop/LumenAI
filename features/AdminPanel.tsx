import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { EDUCATIONAL_LEVELS } from '../constants';

interface UserProfile {
    name: string;
    email: string;
    level: string;
    role: 'admin' | 'user';
}

const ADMIN_ACCESS_CODE = 'LumenAdmin!@2024#Secure';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const AccessGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code === ADMIN_ACCESS_CODE) {
            onUnlock();
        } else {
            setError('Código de acceso incorrecto.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 text-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">Acceso Seguro</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Esta área está restringida. Por favor, introduce el código de acceso de administrador.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        placeholder="Código de acceso"
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full">Desbloquear</Button>
                </form>
            </div>
        </div>
    );
};


const AdminDashboard: React.FC = () => {
    const { getAllUsers } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userList = await getAllUsers();
                setUsers(userList);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [getAllUsers]);

    const stats = {
        totalUsers: users.length,
        byLevel: users.reduce((acc, user) => {
            acc[user.level] = (acc[user.level] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
    };

    if (loading) {
        return <div className="text-center p-10">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Cargando datos de administrador...</p>
        </div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Estadísticas de la Plataforma</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Usuarios Totales" value={stats.totalUsers} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.28-1.259-.757-1.674M7 16H5m2 0v-2c0-.653.28-1.259.757-1.674M5 16H3m2 0v-2a3 3 0 015.356-1.857M12 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                    {EDUCATIONAL_LEVELS.map(level => (
                        <StatCard key={level} title={level} value={stats.byLevel[level] || 0} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                    ))}
                </div>
            </div>
            
            <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Lista de Usuarios</h4>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nombre</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Nivel Educativo</th>
                                    <th scope="col" className="px-6 py-3">Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.email} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{user.name}</th>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.level}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>{user.role}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const AdminPanel: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    return (
        <div className="max-w-7xl mx-auto">
             <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Panel de Administrador</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Bienvenido al centro de control de Lumen AI.</p>
            </div>
            {!isAuthenticated ? <AccessGate onUnlock={() => setIsAuthenticated(true)} /> : <AdminDashboard />}
        </div>
    );
};