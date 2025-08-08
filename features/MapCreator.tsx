import React, { useState, useContext } from 'react';
import { generateMapImage } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/TextArea';
import { Select } from '../components/common/Select';
import { GamificationContext } from '../components/GamificationProvider';

const DownloadIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

export const MapCreator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [mapStyle, setMapStyle] = useState('Político');
    const [colorPalette, setColorPalette] = useState('Vibrante');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { addXp } = useContext(GamificationContext);

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            setError('Por favor, describe el mapa que quieres crear.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedImage(null);
        try {
            const result = await generateMapImage(prompt, mapStyle, colorPalette);
            if (result) {
                setGeneratedImage(result);
                addXp(25, 'mapCreator');
            } else {
                setError('No se pudo generar el mapa. La IA no pudo interpretar la solicitud. Intenta ser más específico.');
            }
        } catch (err) {
            setError('Ocurrió un error al generar el mapa. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Creador de Mapas</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Describe cualquier mapa que imagines y la IA lo creará para ti. Ideal para geografía, historia o proyectos creativos.</p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Descripción del Mapa</label>
                        <TextArea
                            id="prompt-input"
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ej: 'Un mapa de la antigua ruta de la seda que conecta China con el Mediterráneo', 'Mapa físico de sudamérica con sus principales ríos y cordilleras'"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="style-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Estilo del Mapa</label>
                            <Select 
                                id="style-select" 
                                value={mapStyle} 
                                onChange={(e) => setMapStyle(e.target.value)}
                                options={[
                                    { value: 'Político', label: 'Político' },
                                    { value: 'Físico', label: 'Físico' },
                                    { value: 'Satelital', label: 'Satelital' },
                                    { value: 'Minimalista', label: 'Minimalista' },
                                    { value: 'Antiguo / Vintage', label: 'Antiguo / Vintage' },
                                    { value: 'Infográfico', label: 'Infográfico' },
                                ]} 
                            />
                        </div>
                        <div>
                            <label htmlFor="palette-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Paleta de Colores</label>
                            <Select 
                                id="palette-select" 
                                value={colorPalette} 
                                onChange={(e) => setColorPalette(e.target.value)}
                                options={[
                                    { value: 'Vibrante', label: 'Vibrante' },
                                    { value: 'Tonos Pastel', label: 'Tonos Pastel' },
                                    { value: 'Tonos de Tierra', label: 'Tonos de Tierra' },
                                    { value: 'Azules Oceánicos', label: 'Azules Oceánicos' },
                                    { value: 'Blanco y Negro', label: 'Blanco y Negro' },
                                    { value: 'Sepia', label: 'Sepia' },
                                ]} 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button onClick={handleSubmit} isLoading={isLoading}>
                            {isLoading ? 'Generando...' : 'Generar Mapa'}
                        </Button>
                    </div>
                </div>
            </div>

            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      
            {isLoading && (
                <div className="mt-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">La IA está dibujando tu mapa. Esto puede tomar un momento...</p>
                </div>
            )}

            {generatedImage && !isLoading && (
                <div className="mt-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Mapa Generado</h4>
                         <a
                            href={`data:image/jpeg;base64,${generatedImage}`}
                            download="mapa-lumen-ai.jpeg"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                            <DownloadIcon className="h-5 w-5 mr-2" />
                            Descargar Mapa
                        </a>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <img 
                            src={`data:image/jpeg;base64,${generatedImage}`} 
                            alt="Mapa generado por IA"
                            className="rounded-lg w-full h-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
