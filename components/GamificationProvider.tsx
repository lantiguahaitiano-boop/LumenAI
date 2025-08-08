import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { GamificationState } from '../types';
import { INITIAL_GAMIFICATION_STATE, LEVEL_THRESHOLDS } from '../gamificationConstants';
import { useAuth } from '../contexts/AuthContext';

export const GamificationContext = createContext<{
    gamification: GamificationState;
    addXp: (amount: number, toolId: string) => void;
}>({
    gamification: INITIAL_GAMIFICATION_STATE,
    addXp: () => {},
});

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [gamification, setGamification] = useState<GamificationState>(INITIAL_GAMIFICATION_STATE);

    useEffect(() => {
        if (currentUser?.email) {
            try {
                const gamificationKey = `lumen-gamification-${currentUser.email}`;
                const item = window.localStorage.getItem(gamificationKey);
                if (item) {
                    const parsed = JSON.parse(item);
                    // Basic validation to ensure state is not corrupted
                    if (parsed.level && parsed.xp >= 0) {
                        setGamification(parsed);
                    } else {
                        setGamification(INITIAL_GAMIFICATION_STATE);
                    }
                } else {
                    setGamification(INITIAL_GAMIFICATION_STATE);
                }
            } catch (error) {
                console.error("Failed to load gamification state from localStorage", error);
                setGamification(INITIAL_GAMIFICATION_STATE);
            }
        } else {
            setGamification(INITIAL_GAMIFICATION_STATE);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser?.email) {
            try {
                const gamificationKey = `lumen-gamification-${currentUser.email}`;
                window.localStorage.setItem(gamificationKey, JSON.stringify(gamification));
            } catch (error) {
                console.error("Failed to save gamification state to localStorage", error);
            }
        }
    }, [gamification, currentUser]);


    const checkAchievements = useCallback((currentState: GamificationState): GamificationState => {
        const newState = { ...currentState, achievements: { ...currentState.achievements } };
        let achievementUnlocked = false;

        // FIRST_STEP
        if (!newState.achievements.FIRST_STEP.unlocked && Object.keys(newState.toolUsage).length > 0) {
            newState.achievements.FIRST_STEP = { ...newState.achievements.FIRST_STEP, unlocked: true };
            achievementUnlocked = true;
        }
        // SUMMARIZER_NOVICE
        if (!newState.achievements.SUMMARIZER_NOVICE.unlocked && (newState.toolUsage['summarizer'] || 0) >= 5) {
            newState.achievements.SUMMARIZER_NOVICE = { ...newState.achievements.SUMMARIZER_NOVICE, unlocked: true };
            achievementUnlocked = true;
        }
        // QUIZ_MASTER
        if (!newState.achievements.QUIZ_MASTER.unlocked && ((newState.toolUsage['test'] || 0) + (newState.toolUsage['reviewQuiz'] || 0)) >= 3) {
            newState.achievements.QUIZ_MASTER = { ...newState.achievements.QUIZ_MASTER, unlocked: true };
            achievementUnlocked = true;
        }
        // KNOWLEDGE_SEEKER
        if (!newState.achievements.KNOWLEDGE_SEEKER.unlocked && Object.keys(newState.toolUsage).length >= 5) {
            newState.achievements.KNOWLEDGE_SEEKER = { ...newState.achievements.KNOWLEDGE_SEEKER, unlocked: true };
            achievementUnlocked = true;
        }
        // PLANNER_PRO
        if (!newState.achievements.PLANNER_PRO.unlocked && (newState.toolUsage['organizer'] || 0) >= 10) {
            newState.achievements.PLANNER_PRO = { ...newState.achievements.PLANNER_PRO, unlocked: true };
            achievementUnlocked = true;
        }
        // ACADEMIC_INTEGRITY
        if (!newState.achievements.ACADEMIC_INTEGRITY.unlocked && (newState.toolUsage['plagiarism'] || 0) >= 3) {
            newState.achievements.ACADEMIC_INTEGRITY = { ...newState.achievements.ACADEMIC_INTEGRITY, unlocked: true };
            achievementUnlocked = true;
        }
        // PDF_EXPLORER
        if (!newState.achievements.PDF_EXPLORER.unlocked && (newState.toolUsage['pdfReader'] || 0) >= 1) {
            newState.achievements.PDF_EXPLORER = { ...newState.achievements.PDF_EXPLORER, unlocked: true };
            achievementUnlocked = true;
        }
        // DOC_EXPLORER
        if (!newState.achievements.DOC_EXPLORER.unlocked && (newState.toolUsage['documentReader'] || 0) >= 1) {
            newState.achievements.DOC_EXPLORER = { ...newState.achievements.DOC_EXPLORER, unlocked: true };
            achievementUnlocked = true;
        }
        // BIBLIOPHILE
        if (!newState.achievements.BIBLIOPHILE.unlocked && (newState.toolUsage['references'] || 0) >= 3) {
            newState.achievements.BIBLIOPHILE = { ...newState.achievements.BIBLIOPHILE, unlocked: true };
            achievementUnlocked = true;
        }
        // RESOURCE_EXPLORER
        if (!newState.achievements.RESOURCE_EXPLORER.unlocked && (newState.toolUsage['resourceLibrary'] || 0) >= 3) {
            newState.achievements.RESOURCE_EXPLORER = { ...newState.achievements.RESOURCE_EXPLORER, unlocked: true };
            achievementUnlocked = true;
        }


        if (achievementUnlocked) {
             // Maybe show a notification here in the future
        }

        return newState;
    }, []);

    const addXp = useCallback((amount: number, toolId: string) => {
        setGamification(prev => {
            const newXp = prev.xp + amount;
            let newLevel = prev.level;

            // Check for level up based on total XP thresholds
            while (newLevel < LEVEL_THRESHOLDS.length && newXp >= LEVEL_THRESHOLDS[newLevel]) {
                newLevel++;
            }
            
            const newToolUsage = {
                ...prev.toolUsage,
                [toolId]: (prev.toolUsage[toolId] || 0) + 1
            };

            let newState: GamificationState = { ...prev, xp: newXp, level: newLevel, toolUsage: newToolUsage };
            
            newState = checkAchievements(newState);

            return newState;
        });
    }, [checkAchievements]);

    const value = useMemo(() => ({ gamification, addXp }), [gamification, addXp]);

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};