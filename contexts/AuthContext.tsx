import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Interfaces
interface UserProfile {
    name: string;
    email: string;
    level: string;
    role: 'admin' | 'user';
}

interface StoredUser extends UserProfile {
    password_plaintext: string; // Storing plaintext for this exercise. NOT FOR PRODUCTION.
}

interface AuthContextType {
    currentUser: UserProfile | null;
    loading: boolean;
    register: (name: string, level: string, email: string, pass: string) => Promise<void>;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    updateLevel: (newLevel: string) => Promise<void>;
    updateName: (newName: string) => Promise<void>;
    getAllUsers: () => Promise<Omit<StoredUser, 'password_plaintext'>[]>;
}

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage Keys
const USERS_STORAGE_KEY = 'lumen-users';
const CURRENT_USER_STORAGE_KEY = 'lumen-currentUserEmail';

// Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUserEmail = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
            if (storedUserEmail) {
                const users: StoredUser[] = JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) || '[]');
                const user = users.find(u => u.email === storedUserEmail);
                if (user) {
                    const { password_plaintext, ...profile } = user;
                    setCurrentUser(profile);
                }
            }
        } catch (e) {
            console.error("Error reading from localStorage", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const register = async (name: string, level: string, email: string, pass: string): Promise<void> => {
        const users: StoredUser[] = JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        if (users.some(u => u.email === email.toLowerCase())) {
            throw new Error("Este correo electrónico ya está en uso.");
        }

        const newUser: StoredUser = { 
            name, 
            level, 
            email: email.toLowerCase(), 
            password_plaintext: pass,
            role: email.toLowerCase() === 'admin@lumen.ai' ? 'admin' : 'user' 
        };
        users.push(newUser);
        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        
        await login(email, pass);
    };

    const login = async (email: string, pass: string): Promise<void> => {
        const users: StoredUser[] = JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const user = users.find(u => u.email === email.toLowerCase());

        if (user && user.password_plaintext === pass) {
            const { password_plaintext, ...profile } = user;
            setCurrentUser(profile);
            window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, email.toLowerCase());
        } else {
            throw new Error("Correo electrónico o contraseña incorrectos.");
        }
    };

    const logout = () => {
        setCurrentUser(null);
        window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
        // Also remove user-specific gamification data
        if(currentUser) {
            window.localStorage.removeItem(`lumen-gamification-${currentUser.email}`);
        }
    };

    const updateLevel = async (newLevel: string): Promise<void> => {
        if (!currentUser) return;

        const users: StoredUser[] = JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex > -1) {
            users[userIndex].level = newLevel;
            window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
            setCurrentUser(prev => prev ? { ...prev, level: newLevel } : null);
        }
    };

    const updateName = async (newName: string): Promise<void> => {
        if (!currentUser || !newName.trim()) return;

        const users: StoredUser[] = JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex > -1) {
            users[userIndex].name = newName.trim();
            window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
            setCurrentUser(prev => prev ? { ...prev, name: newName.trim() } : null);
        }
    };

    const getAllUsers = async (): Promise<Omit<StoredUser, 'password_plaintext'>[]> => {
        const users: StoredUser[] = JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        return users.map(u => {
            const { password_plaintext, ...profile } = u;
            if (!profile.role) {
                profile.role = 'user';
            }
            return profile;
        });
    };

    const value = { currentUser, loading, register, login, logout, updateLevel, updateName, getAllUsers };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};