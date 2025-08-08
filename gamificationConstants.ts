import { GamificationState, Achievement, AchievementId } from './types';

export const ACHIEVEMENTS_LIST: Record<AchievementId, Omit<Achievement, 'unlocked'>> = {
  FIRST_STEP: { id: 'FIRST_STEP', name: 'Primer Paso', description: 'Usa tu primera herramienta de IA.' },
  SUMMARIZER_NOVICE: { id: 'SUMMARIZER_NOVICE', name: 'Aprendiz del Resumen', description: 'Usa el resumidor 5 veces.' },
  QUIZ_MASTER: { id: 'QUIZ_MASTER', name: 'Maestro de Pruebas', description: 'Crea 3 exámenes.' },
  KNOWLEDGE_SEEKER: { id: 'KNOWLEDGE_SEEKER', name: 'Buscador de Conocimiento', description: 'Usa 5 herramientas diferentes.' },
  PLANNER_PRO: { id: 'PLANNER_PRO', name: 'Profesional de la Planificación', description: 'Organiza 10 tareas de estudio.' },
  ACADEMIC_INTEGRITY: { id: 'ACADEMIC_INTEGRITY', name: 'Integridad Académica', description: 'Verifica 3 documentos en el detector de plagio.' },
  PDF_EXPLORER: { id: 'PDF_EXPLORER', name: 'Explorador de PDF', description: 'Chatea con tu primer documento PDF.' },
  DOC_EXPLORER: { id: 'DOC_EXPLORER', name: 'Explorador de Documentos', description: 'Chatea con tu primer documento .docx o .txt.' },
  BIBLIOPHILE: { id: 'BIBLIOPHILE', name: 'Bibliófilo', description: 'Encuentra referencias para 3 temas de investigación.' },
  RESOURCE_EXPLORER: { id: 'RESOURCE_EXPLORER', name: 'Explorador de la Biblioteca', description: 'Accede a 3 recursos diferentes de la biblioteca.'}
};

export const INITIAL_GAMIFICATION_STATE: GamificationState = {
  level: 1,
  xp: 0,
  achievements: {
    FIRST_STEP: { ...ACHIEVEMENTS_LIST.FIRST_STEP, unlocked: false },
    SUMMARIZER_NOVICE: { ...ACHIEVEMENTS_LIST.SUMMARIZER_NOVICE, unlocked: false },
    QUIZ_MASTER: { ...ACHIEVEMENTS_LIST.QUIZ_MASTER, unlocked: false },
    KNOWLEDGE_SEEKER: { ...ACHIEVEMENTS_LIST.KNOWLEDGE_SEEKER, unlocked: false },
    PLANNER_PRO: { ...ACHIEVEMENTS_LIST.PLANNER_PRO, unlocked: false },
    ACADEMIC_INTEGRITY: { ...ACHIEVEMENTS_LIST.ACADEMIC_INTEGRITY, unlocked: false },
    PDF_EXPLORER: { ...ACHIEVEMENTS_LIST.PDF_EXPLORER, unlocked: false },
    DOC_EXPLORER: { ...ACHIEVEMENTS_LIST.DOC_EXPLORER, unlocked: false },
    BIBLIOPHILE: { ...ACHIEVEMENTS_LIST.BIBLIOPHILE, unlocked: false },
    RESOURCE_EXPLORER: { ...ACHIEVEMENTS_LIST.RESOURCE_EXPLORER, unlocked: false },
  },
  toolUsage: {},
};

// Total XP required to reach a given level. Level 1 starts at 0.
export const LEVEL_THRESHOLDS: number[] = [
    0,      // Nivel 1
    100,    // Nivel 2
    250,    // Nivel 3
    500,    // Nivel 4
    800,    // Nivel 5
    1200,   // Nivel 6
    1700,   // Nivel 7
    2300,   // Nivel 8
    3000,   // Nivel 9
    4000,   // Nivel 10
];