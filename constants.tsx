
import React from 'react';
import { Feature } from './types';
import { HomeworkAssistant } from './features/HomeworkAssistant';
import { Summarizer } from './features/Summarizer';
import { StudyOrganizer } from './features/StudyOrganizer';
import { ConceptExplainer } from './features/ConceptExplainer';
import { EssayCorrector } from './features/EssayCorrector';
import { PresentationGenerator } from './features/PresentationGenerator';
import { PrivateChat } from './features/PrivateChat';
import { TestSimulator } from './features/TestSimulator';
import { Translator } from './features/Translator';
import { ProjectPlanner } from './features/ProjectPlanner';
import { Settings } from './features/AccessibilitySettings';
import { Gamification } from './features/Gamification';
import { ScientificCalculator } from './features/ScientificCalculator';
import { SmartReminders } from './features/SmartReminders';
import { PlagiarismDetector } from './features/PlagiarismDetector';
import { InfographicsBuilder } from './features/InfographicsBuilder';
import { ReviewQuizGenerator } from './features/ReviewQuizGenerator';
import { DiagramGenerator } from './features/DiagramGenerator';
import { PDFReader } from './features/PDFReader';
import { DocumentReader } from './features/DocumentReader';
import { ReferenceRecommender } from './features/ReferenceRecommender';
import { ResourceLibrary } from './features/ResourceLibrary';
import { AdminPanel } from './features/AdminPanel';
import { MapCreator } from './features/MapCreator';
import { CountryExplorer } from './features/CountryExplorer';


// Icons
const BookOpenIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const DocumentTextIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CalendarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const LightBulbIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const PencilAltIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const PresentationChartBarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ChatAlt2Icon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h1m6-3l2 2m-2-2l-2 2m2-2l2-2m-2 2l-2-2" /></svg>;
const ClipboardListIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const TranslateIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4.25 16h-6.5A2.25 2.25 0 015 18.75V10.5A2.25 2.25 0 017.25 8.25h6.5A2.25 2.25 0 0116 10.5v8.25A2.25 2.25 0 0113.75 21z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8.25V5.75a2.25 2.25 0 00-2.25-2.25h-1.5A2.25 2.25 0 0010 5.75v.25m3.75 0v.25m-3.75 0h.01M19.5 12h.01M16.5 12h.01M13.5 12h.01M10.5 12h.01" /></svg>;
const BeakerIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const ClipboardCheckIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const BellIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ShieldCheckIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9-3.75 9 3.75z" /></svg>;
const PhotographIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const DocumentAddIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CogIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.608 3.292 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const StarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6.343 17.657l-2.828 2.828m15.556-15.556l-2.828 2.828M21 12h-4m-4 9v-4M9 3v4M3 9h4m11.657 8.657l-2.828-2.828M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
const ShareIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367 2.684z" /></svg>;
const ChatFileIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v2a2 2 0 002 2h4a2 2 0 002-2v-2m-6-4h.01M12 11h.01M15 11h.01M9 12h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V15" /></svg>;
const BookmarkAltIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const LibraryIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const ServerIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
const MapIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7m0 0L9 4" /></svg>;
const GlobeAltIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m0 0a9 9 0 019-9m-9 9a9 9 0 009 9" /></svg>;

export const EDUCATIONAL_LEVELS = [
    'Secundaria',
    'Bachillerato',
    'Universidad (Grado)',
    'Universidad (Postgrado)',
    'Técnico/FP',
    'Otro'
];

export const FEATURES: Feature[] = [
  {
    id: 'assistant',
    name: 'Asistente de Tareas',
    description: 'Obtén ayuda con problemas y preguntas. Sube una foto o escribe tu duda para recibir una guía paso a paso.',
    icon: <BookOpenIcon className="h-6 w-6" />,
    component: HomeworkAssistant,
  },
  {
    id: 'summarizer',
    name: 'Resumidor de Textos',
    description: 'Pega cualquier texto, artículo o documento para obtener un resumen conciso y claro al instante.',
    icon: <DocumentTextIcon className="h-6 w-6" />,
    component: Summarizer,
  },
   {
    id: 'explainer',
    name: 'Explicador de Conceptos',
    description: '¿No entiendes un tema? Obtén una explicación sencilla con ejemplos y analogías adaptadas a tu nivel.',
    icon: <LightBulbIcon className="h-6 w-6" />,
    component: ConceptExplainer,
  },
  {
    id: 'corrector',
    name: 'Corrector de Ensayos',
    description: 'Revisa la gramática y ortografía de tus textos, y recibe sugerencias para mejorar tu estilo y claridad.',
    icon: <PencilAltIcon className="h-6 w-6" />,
    component: EssayCorrector,
  },
  {
    id: 'presentation',
    name: 'Creador de Exposiciones',
    description: 'Genera el contenido de texto para tus diapositivas, dividiendo un tema entre varios expositores.',
    icon: <PresentationChartBarIcon className="h-6 w-6" />,
    component: PresentationGenerator,
  },
   {
    id: 'chat',
    name: 'Chat Privado con IA',
    description: 'Chatea directamente con un tutor de IA para resolver dudas rápidas o explorar ideas de forma conversacional.',
    icon: <ChatAlt2Icon className="h-6 w-6" />,
    component: PrivateChat,
  },
  {
    id: 'test',
    name: 'Simulador de Exámenes',
    description: 'Crea un examen personalizado sobre cualquier tema para poner a prueba y afianzar tus conocimientos.',
    icon: <ClipboardListIcon className="h-6 w-6" />,
    component: TestSimulator,
  },
  {
    id: 'reviewQuiz',
    name: 'Cuestionarios de Repaso',
    description: 'Sube tus apuntes en .txt y la IA creará un examen para ayudarte a estudiar y prepararte eficientemente.',
    icon: <DocumentAddIcon className="h-6 w-6" />,
    component: ReviewQuizGenerator,
  },
  {
    id: 'pdfReader',
    name: 'Lector de PDF Interactivo',
    description: 'Chatea con tus documentos PDF. Sube un archivo, haz preguntas, y obtén resúmenes o explicaciones.',
    icon: <ChatFileIcon className="h-6 w-6" />,
    component: PDFReader,
  },
  {
    id: 'documentReader',
    name: 'Lector de Documentos (.docx, .txt)',
    description: 'Chatea con tus documentos de Word y texto. Sube un archivo y haz preguntas para obtener resúmenes.',
    icon: <DocumentTextIcon className="h-6 w-6" />,
    component: DocumentReader,
  },
  {
    id: 'resourceLibrary',
    name: 'Biblioteca de Recursos',
    description: 'Encuentra libros, guías y materiales de estudio de fuentes confiables y de dominio público.',
    icon: <LibraryIcon className="h-6 w-6" />,
    component: ResourceLibrary,
  },
  {
    id: 'translator',
    name: 'Traductor Académico',
    description: 'Traduce textos académicos conservando el contexto y el significado técnico entre múltiples idiomas.',
    icon: <TranslateIcon className="h-6 w-6" />,
    component: Translator,
  },
  {
    id: 'planner',
    name: 'Planificador de Proyectos',
    description: 'Estructura tu monografía, tesis o proyecto de investigación con objetivos, justificación y un esquema.',
    icon: <ClipboardCheckIcon className="h-6 w-6" />,
    component: ProjectPlanner,
  },
  {
    id: 'calculator',
    name: 'Calculadora Científica',
    description: 'Resuelve operaciones (álgebra, cálculo) y obtén una explicación detallada de cada paso del proceso.',
    icon: <BeakerIcon className="h-6 w-6" />,
    component: ScientificCalculator,
  },
  {
    id: 'reminders',
    name: 'Recordatorios Inteligentes',
    description: 'Crea un plan de estudio con repasos espaciados basado en la ciencia para maximizar la retención.',
    icon: <BellIcon className="h-6 w-6" />,
    component: SmartReminders,
  },
  {
    id: 'plagiarism',
    name: 'Detector de Plagio',
    description: 'Verifica la originalidad de tus trabajos y recibe sugerencias para mejorar la redacción y evitar el plagio.',
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    component: PlagiarismDetector,
  },
  {
    id: 'references',
    name: 'Recomendador de Lecturas',
    description: 'Sugiere artículos, libros o fuentes relevantes para un tema de investigación, con resúmenes y enlaces.',
    icon: <BookmarkAltIcon className="h-6 w-6" />,
    component: ReferenceRecommender,
  },
  {
    id: 'infographics',
    name: 'Infografías y Líneas de Tiempo',
    description: 'Genera infografías y líneas de tiempo visuales para resumir información compleja de forma atractiva.',
    icon: <PhotographIcon className="h-6 w-6" />,
    component: InfographicsBuilder,
  },
   {
    id: 'diagram',
    name: 'Generador de Diagramas',
    description: 'Crea diagramas de flujo y mapas conceptuales a partir de texto. Personaliza estilos, colores y exporta el resultado.',
    icon: <ShareIcon className="h-6 w-6" />,
    component: DiagramGenerator,
  },
  {
    id: 'mapCreator',
    name: 'Creador de Mapas',
    description: 'Genera mapas personalizados a partir de descripciones. Visualiza datos geográficos con diferentes estilos y colores.',
    icon: <MapIcon className="h-6 w-6" />,
    component: MapCreator,
  },
  {
    id: 'countryExplorer',
    name: 'Explorador de Países',
    description: 'Genera un informe interactivo sobre cualquier país del mundo, con datos, mapas e imágenes.',
    icon: <GlobeAltIcon className="h-6 w-6" />,
    component: CountryExplorer,
  },
  {
    id: 'organizer',
    name: 'Organizador de Estudio',
    description: 'Planifica tus sesiones de estudio, tareas y exámenes. Tu horario se guarda localmente en tu navegador.',
    icon: <CalendarIcon className="h-6 w-6" />,
    component: StudyOrganizer,
  },
  {
    id: 'gamification',
    name: 'Mi Progreso',
    description: 'Revisa tu nivel, experiencia y los logros que has desbloqueado utilizando las herramientas de Lumen.',
    icon: <StarIcon className="h-6 w-6" />,
    component: Gamification,
  },
  {
    id: 'settings',
    name: 'Configuración',
    description: 'Personaliza tu experiencia, ajusta tu perfil y modifica las opciones de accesibilidad de la aplicación.',
    icon: <CogIcon className="h-6 w-6" />,
    component: Settings,
  },
  {
    id: 'admin',
    name: 'Panel de Admin',
    description: 'Gestiona usuarios y revisa las estadísticas de uso de la plataforma.',
    icon: <ServerIcon className="h-6 w-6" />,
    component: AdminPanel,
    adminOnly: true,
  }
];
