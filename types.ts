
import React from 'react';

export type FeatureId =
  | 'dashboard'
  | 'assistant'
  | 'summarizer'
  | 'organizer'
  | 'explainer'
  | 'corrector'
  | 'presentation'
  | 'chat'
  | 'test'
  | 'translator'
  | 'planner'
  | 'calculator'
  | 'reminders'
  | 'plagiarism'
  | 'references'
  | 'infographics'
  | 'diagram'
  | 'mapCreator'
  | 'countryExplorer'
  | 'reviewQuiz'
  | 'pdfReader'
  | 'documentReader'
  | 'resourceLibrary'
  | 'gamification'
  | 'settings'
  | 'admin';

export interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.FC<{ setActiveFeature?: (featureId: FeatureId) => void }>;
  disabled?: boolean;
  adminOnly?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Slide {
  title: string;
  content: string;
  presenter: number;
  visualSuggestion: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface ScheduleItem {
  id: string;
  subject: string;
  task: string;
  date: string;
}

export interface ProjectPlan {
  title: string;
  mainObjective: string;
  specificObjectives: string[];
  hypothesis: string;
  justification: string;
  chapterOutline: { chapter: number; title: string; description: string }[];
  methodology: string;
}

export interface ScientificCalculation {
  result: string;
  explanation: string;
}

export interface SmartReminder {
  id: string;
  topic: string;
  note: string;
  dueDate: string; // YYYY-MM-DD
}

export interface WritingSuggestion {
  originalText: string;
  suggestion: string;
  explanation: string;
}

export interface PlagiarismResult {
  originalityScore: number;
  summary: string;
  suggestions: WritingSuggestion[];
}

export interface ReferenceItem {
  title: string;
  author: string;
  year: number;
  source: string;
  summary: string;
  url?: string;
}

export interface TimelineEvent {
    date: string;
    title: string;
    description: string;
}

export type InfographicIcon = "brain" | "book" | "flask" | "flag" | "person" | "gear" | "lightbulb" | "calendar" | "atom" | "code";

export interface InfographicSection {
    icon: InfographicIcon;
    title: string;
    content: string;
}

export interface InfographicTimelineResult {
    title: string;
    timelineEvents?: TimelineEvent[];
    infographicSections?: InfographicSection[];
}

export interface ResourceItem {
    title: string;
    author: string;
    description: string;
    imageUrl: string;
    url: string;
}

export interface ResourceCategory {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    resources: ResourceItem[];
}


export type AchievementId = 'FIRST_STEP' | 'SUMMARIZER_NOVICE' | 'QUIZ_MASTER' | 'KNOWLEDGE_SEEKER' | 'PLANNER_PRO' | 'ACADEMIC_INTEGRITY' | 'PDF_EXPLORER' | 'BIBLIOPHILE' | 'DOC_EXPLORER' | 'RESOURCE_EXPLORER';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface GamificationState {
  level: number;
  xp: number;
  achievements: Record<AchievementId, Achievement>;
  toolUsage: Record<string, number>;
}

export interface AccessibilityState {
    isDarkMode: boolean;
    isDyslexicFont: boolean;
}

export interface CountryInfo {
    summary: string;
    flagEmoji: string;
    capital: string;
    population: string;
    continent: string;
    history: string;
    geography: {
        location: string;
        climate: string;
        mainFeatures: string[];
    };
    culture: {
        languages: string[];
        cuisine: string;
        traditions: string;
    };
    economy: {
        gdp: string;
        mainIndustries: string[];
        currency: string;
    };
    politics: {
        governmentType: string;
        headOfState: string;
    };
}

export interface CountryExplorerResult {
    info: CountryInfo;
    mapImage: string; // base64
    representativeImage: string; // base64
}
