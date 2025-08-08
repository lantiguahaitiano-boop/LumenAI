import React, { createContext, useState, useEffect, useMemo } from 'react';
import { AccessibilityState } from '../types';

const defaultState: AccessibilityState = {
    isDarkMode: false,
    isDyslexicFont: false,
};

export const AccessibilityContext = createContext<{
    settings: AccessibilityState;
    toggleDarkMode: () => void;
    toggleDyslexicFont: () => void;
}>({
    settings: defaultState,
    toggleDarkMode: () => {},
    toggleDyslexicFont: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AccessibilityState>(() => {
        try {
            const item = window.localStorage.getItem('lumen-accessibility');
            if (item) {
                const parsed = JSON.parse(item);
                // Ensure isDarkMode is a boolean
                return {
                    isDarkMode: !!parsed.isDarkMode,
                    isDyslexicFont: !!parsed.isDyslexicFont,
                };
            }
        } catch (error) {
            console.error("Failed to parse accessibility settings from localStorage", error);
        }
        return defaultState;
    });

    useEffect(() => {
        try {
            // Apply classes to root element
            const root = window.document.documentElement;
            if (settings.isDarkMode) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }

            if (settings.isDyslexicFont) {
                root.classList.add('font-dyslexic');
            } else {
                root.classList.remove('font-dyslexic');
            }
            
            // Save to localStorage
            window.localStorage.setItem('lumen-accessibility', JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to update accessibility settings", error);
        }
    }, [settings]);

    const toggleDarkMode = () => {
        setSettings(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
    };

    const toggleDyslexicFont = () => {
        setSettings(prev => ({ ...prev, isDyslexicFont: !prev.isDyslexicFont }));
    };

    const value = useMemo(() => ({ settings, toggleDarkMode, toggleDyslexicFont }), [settings]);

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};
