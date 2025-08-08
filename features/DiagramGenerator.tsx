import React, { useState, useContext, useEffect, useRef } from 'react';
import { generateDiagramCode } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/TextArea';
import { LevelContext } from '../contexts/LevelContext';
import { GamificationContext } from '../components/GamificationProvider';
import { Select } from '../components/common/Select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Tell TypeScript that mermaid exists on the global window object
declare var mermaid: any;

// Icons for zoom controls
const ZoomInIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" /></svg>;
const ZoomOutIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>;
const RefreshCwIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-5.22 9 9 0 01-2.08 12.3m-6.7-2.08A9 9 0 004 9" /></svg>;
const BombIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.93,18.5a1.2,1.2,0,0,0,1.2,1.2,1.2,1.2,0,0,0,1.2-1.2,1.2,1.2,0,0,0-1.2-1.2A1.2,1.2,0,0,0,11.93,18.5Zm8.57-4.14a7.5,7.5,0,1,0-10.6,0A7.47,7.47,0,0,0,4.5,19.71a1,1,0,0,0,1,1H18.5a1,1,0,0,0,1-1A7.47,7.47,0,0,0,20.5,14.36ZM13.84,7.5,12.5,2.57a.5.5,0,0,0-1,0L10.16,7.5l-5,1.34a.5.5,0,0,0-.3.89l3.59,3.5-1,5a.5.5,0,0,0,.76.55l4.47-2.35,4.47,2.35a.5.5,0,0,0,.76-.55l-1-5,3.59-3.5a.5.5,0,0,0-.3-.89Z"/></svg>;
const DocumentDownloadIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CodeFileIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;

const THEMES: Record<string, any> = {
    lumen: {
        background: '#FFFFFF',
        primaryColor: '#fffbeb',      
        primaryTextColor: '#1e293b', 
        primaryBorderColor: '#fcd34d',
        lineColor: '#64748b',         
        textColor: '#1e293b',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#e2e8f0',
    },
    ocean: {
        background: '#FFFFFF',
        primaryColor: '#eff6ff',
        primaryTextColor: '#1e3a8a',
        primaryBorderColor: '#93c5fd',
        lineColor: '#60a5fa',
        textColor: '#1e40af',
        secondaryColor: '#dbeafe',
        tertiaryColor: '#bfdbfe',
    },
    forest: {
        background: '#FFFFFF',
        primaryColor: '#f0fdf4',
        primaryTextColor: '#14532d',
        primaryBorderColor: '#86efac',
        lineColor: '#4ade80',
        textColor: '#166534',
        secondaryColor: '#dcfce7',
        tertiaryColor: '#bbf7d0',
    },
    dusk: {
        background: '#FFFFFF',
        primaryColor: '#fdf2f8',
        primaryTextColor: '#831843',
        primaryBorderColor: '#f9a8d4',
        lineColor: '#ec4899',
        textColor: '#9d174d',
        secondaryColor: '#fce7f3',
        tertiaryColor: '#fbcfe8',
    },
    monochrome: {
        background: '#FFFFFF',
        primaryColor: '#f1f5f9',
        primaryTextColor: '#020617',
        primaryBorderColor: '#94a3b8',
        lineColor: '#64748b',
        textColor: '#1e293b',
        secondaryColor: '#e2e8f0',
        tertiaryColor: '#cbd5e1',
    },
};

export const DiagramGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [diagramCode, setDiagramCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { level } = useContext(LevelContext);
    const { addXp } = useContext(GamificationContext);
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [renderKey, setRenderKey] = useState(0);

    // Customization State
    const [diagramType, setDiagramType] = useState('mindmap');
    const [colorTheme, setColorTheme] = useState('lumen');
    
    // Zoom and Pan state
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef({ x: 0, y: 0 });
    const diagramContainerRef = useRef<HTMLDivElement>(null);

    // Export Menu State
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
                setIsExportMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const initializeMermaid = (themeName: string) => {
        const themeVariables = THEMES[themeName] || THEMES['lumen'];
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            securityLevel: 'loose',
            fontFamily: 'inherit',
            themeVariables,
            mindmap: { padding: 20, useMaxWidth: false }, // Allow content to determine width
            flowchart: { nodeSpacing: 50, rankSpacing: 50 },
        });
    };
    
    useEffect(() => {
        initializeMermaid(colorTheme);
        if (diagramCode) {
            setRenderKey(prev => prev + 1); // Re-render with new theme
        }
    }, [colorTheme, diagramCode]);

    const resetView = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            setError('Por favor, describe el diagrama que quieres crear.');
            return;
        }
        setIsLoading(true);
        setError('');
        setDiagramCode('');
        resetView();

        try {
            const result = await generateDiagramCode(prompt, level, diagramType, 'round');
            if (!result || !result.trim()) {
                setError('La IA no pudo generar un diagrama para esta solicitud. Intenta ser más específico.');
                setDiagramCode('');
            } else {
                setDiagramCode(result);
                addXp(20, 'diagram');
            }
        } catch (err) {
            setError('Ocurrió un error al generar el diagrama. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const renderDiagram = async () => {
            if (diagramCode && mermaidRef.current) {
                setError(''); // Clear previous rendering errors
                try {
                    await mermaid.parse(diagramCode);
                    mermaidRef.current.removeAttribute('data-processed');
                    mermaidRef.current.innerHTML = diagramCode;
                    await mermaid.run({ nodes: [mermaidRef.current] });
                } catch (e) {
                    console.error("Mermaid rendering error:", e);
                    if (mermaidRef.current) mermaidRef.current.innerHTML = '';
                    const userFriendlyError = "Error de sintaxis: No se pudo dibujar el diagrama.\nEsto puede ocurrir si la IA genera un formato inesperado o la solicitud es muy compleja.\n\nIntenta simplificar tu petición.";
                    setError(userFriendlyError);
                }
            }
        };

        renderDiagram();
    }, [diagramCode, renderKey]);
    
    const handleZoomIn = () => setZoom(z => Math.min(z + 0.15, 3));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.15, 0.2));

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0 || !diagramCode || isLoading || error) return;
        e.preventDefault();
        panStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        setIsPanning(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPanning) return;
        e.preventDefault();
        setPosition({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
    };

    const handleMouseUp = () => setIsPanning(false);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (!diagramCode || isLoading || error) return;
        e.preventDefault();
        if (e.deltaY < 0) handleZoomIn(); else handleZoomOut();
    };

    const handleExportSVG = () => {
        if (mermaidRef.current?.querySelector('svg')) {
            setIsExportMenuOpen(false);
            const svgElement = mermaidRef.current.querySelector('svg');
            const svgData = new XMLSerializer().serializeToString(svgElement!);
            const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'diagrama-lumen-ai.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const handleExportPDF = async () => {
        if (!mermaidRef.current?.querySelector('svg')) return;
        setIsExportMenuOpen(false);
        
        try {
            const canvas = await html2canvas(mermaidRef.current, {
                backgroundColor: THEMES[colorTheme]?.background || '#FFFFFF',
                scale: 2, 
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save("diagrama-lumen-ai.pdf");

        } catch (exportError) {
            console.error("Failed to export PDF:", exportError);
            setError("No se pudo exportar el PDF. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Controls Column */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-6">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Generador de Diagramas Interactivo</h3>
                    <p className="text-slate-500 dark:text-slate-400">Describe un proceso o esquema, personaliza el estilo y observa cómo la IA lo dibuja.</p>
                </div>

                <TextArea
                    rows={8}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ejemplo: 'Un mapa mental sobre los planetas del sistema solar, con el sol en el centro y un dato curioso para cada planeta.'"
                />
                
                <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Personalización</h4>
                    <div>
                        <label htmlFor="diagram-type-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Diagrama</label>
                        <Select id="diagram-type-select" value={diagramType} onChange={e => setDiagramType(e.target.value)} options={[
                            { value: 'mindmap', label: 'Mapa Mental' },
                            { value: 'graph TD', label: 'Diagrama de Flujo (Vertical)' },
                            { value: 'graph LR', label: 'Diagrama de Flujo (Horizontal)' },
                        ]} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tema de Color</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(THEMES).map(themeKey => (
                                <button key={themeKey} onClick={() => setColorTheme(themeKey)} className={`capitalize px-3 py-1.5 text-sm font-medium rounded-md border-2 transition-all ${colorTheme === themeKey ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-transparent'}`}
                                style={{backgroundColor: THEMES[themeKey].primaryColor, color: THEMES[themeKey].textColor}}
                                >
                                    {themeKey}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex justify-end">
                    <Button onClick={handleSubmit} isLoading={isLoading}>
                        Generar Diagrama
                    </Button>
                </div>
            </div>

            {/* Preview Column */}
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                     <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Vista Previa</h4>
                     <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={handleZoomIn} title="Acercar" disabled={!diagramCode || isLoading || !!error}><ZoomInIcon className="h-5 w-5"/></Button>
                        <Button variant="secondary" onClick={handleZoomOut} title="Alejar" disabled={!diagramCode || isLoading || !!error}><ZoomOutIcon className="h-5 w-5"/></Button>
                        <Button variant="secondary" onClick={resetView} title="Restablecer vista" disabled={!diagramCode || isLoading || !!error}><RefreshCwIcon className="h-5 w-5"/></Button>
                        <div ref={exportMenuRef} className="relative">
                            <Button variant="secondary" onClick={() => setIsExportMenuOpen(p => !p)} disabled={!diagramCode || isLoading || !!error} aria-haspopup="true" aria-expanded={isExportMenuOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Exportar
                            </Button>
                            {isExportMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 animate-fade-in" style={{animationDuration: '150ms'}}>
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <button onClick={handleExportSVG} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-3" role="menuitem">
                                            <CodeFileIcon className="h-5 w-5" /> Exportar como SVG
                                        </button>
                                        <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-3" role="menuitem">
                                            <DocumentDownloadIcon className="h-5 w-5" /> Exportar como PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                     </div>
                </div>
                <div 
                    ref={diagramContainerRef}
                    className={`flex-grow w-full h-full bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden flex justify-center items-center relative 
                                ${isPanning ? 'cursor-grabbing' : (diagramCode && !isLoading && !error ? 'cursor-grab' : 'cursor-default')}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    {isLoading ? (
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">La IA está dibujando...</p>
                        </div>
                    ) : error ? (
                         <div className="text-center text-red-500 dark:text-red-400 font-medium p-4 flex flex-col items-center justify-center">
                            <BombIcon className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
                            <p className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2">¡Ups! Error al generar.</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap">{error}</p>
                         </div>
                    ) : !diagramCode ? (
                        <div className="text-center text-slate-500">
                             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M7 21a4 4 0 014-4h4a4 4 0 014 4M7 21v-4a4 4 0 014-4h4a4 4 0 014 4v4" /></svg>
                            <p className="mt-2 font-semibold">El diagrama aparecerá aquí</p>
                            <p className="text-sm">Introduce una descripción y haz clic en "Generar Diagrama".</p>
                        </div>
                    ) : (
                         <div
                            style={{ 
                                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                                transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                            }}
                        >
                            <div ref={mermaidRef} key={renderKey} className="mermaid">
                                {/* Mermaid will render here */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};