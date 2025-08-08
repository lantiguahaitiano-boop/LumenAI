import React, { useContext, useState } from 'react';
import { AccessibilityContext } from '../components/AccessibilityProvider';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { EDUCATIONAL_LEVELS } from '../constants';
import { Select } from '../components/common/Select';


const Toggle: React.FC<{ isEnabled: boolean; onToggle: () => void; label: string; description: string }> = ({ isEnabled, onToggle, label, description }) => (
    <div 
      onClick={onToggle}
      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-600"
      role="switch"
      aria-checked={isEnabled}
    >
      <div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{label}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${isEnabled ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
);


const ProfileSettings: React.FC = () => {
    const { currentUser, updateName, updateLevel } = useAuth();
    const [name, setName] = useState(currentUser?.name || '');
    const [level, setLevel] = useState(currentUser?.level || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            if (name !== currentUser?.name) {
                await updateName(name);
            }
            if (level !== currentUser?.level) {
                await updateLevel(level);
            }
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentUser) return null;

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                <input
                    id="email"
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed p-3"
                />
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre Completo</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 p-3"
                />
            </div>
            
            <div>
                 <label htmlFor="level" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nivel Educativo</label>
                 <Select
                    id="level-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    options={EDUCATIONAL_LEVELS.map(l => ({ value: l, label: l }))}
                    className="mt-1 !w-full"
                />
            </div>

            <div className="flex items-center justify-end gap-4">
                {saveSuccess && <p className="text-sm text-green-600 dark:text-green-400">¡Cambios guardados!</p>}
                <Button type="submit" isLoading={isSaving}>Guardar Cambios</Button>
            </div>
        </form>
    );
}

const AppearanceSettings: React.FC = () => {
    const { settings, toggleDarkMode, toggleDyslexicFont } = useContext(AccessibilityContext);
    return (
         <div className="space-y-4">
            <Toggle 
                isEnabled={settings.isDarkMode}
                onToggle={toggleDarkMode}
                label="Modo Oscuro"
                description="Reduce el brillo de la pantalla para una visualización más cómoda por la noche."
            />
            <Toggle 
                isEnabled={settings.isDyslexicFont}
                onToggle={toggleDyslexicFont}
                label="Fuente para Dislexia"
                description="Activa la fuente Lexend, diseñada para mejorar la legibilidad."
            />
        </div>
    );
};


export const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'appearance'>('profile');

    const TabButton: React.FC<{tabId: 'profile' | 'appearance', label: string}> = ({ tabId, label }) => (
         <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-amber-500 ${
                activeTab === tabId 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Configuración</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Gestiona tu perfil y las preferencias de la aplicación.</p>
                
                <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex space-x-2">
                       <TabButton tabId="profile" label="Perfil" />
                       <TabButton tabId="appearance" label="Apariencia" />
                    </div>
                </div>

                <div>
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'appearance' && <AppearanceSettings />}
                </div>
            </div>
        </div>
    );
};