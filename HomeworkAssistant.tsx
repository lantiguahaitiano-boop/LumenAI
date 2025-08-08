import React, { useState, useContext, useRef } from 'react';
import { getHomeworkHelp } from './geminiService';
import { Button } from './Button';
import { TextArea } from './TextArea';
import { LevelContext } from './contexts/LevelContext';
import { MarkdownRenderer } from './MarkdownRenderer';
import { GamificationContext } from './GamificationProvider';

const UploadIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const CameraIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


export const HomeworkAssistant: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [image, setImage] = useState<{file: File, base64: string, mimeType: string} | null>(null);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini API
          setError("El archivo de imagen es demasiado grande. El máximo es 4MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage({
          file: file,
          base64: base64String,
          mimeType: file.type
        });
        setError('');
      };
      reader.onerror = () => {
          setError("Error al leer el archivo de imagen.");
      }
      reader.readAsDataURL(file);
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleSubmit = async () => {
    if (!problem.trim() && !image) {
      setError('Por favor, introduce un problema o sube una imagen.');
      return;
    }
    setIsLoading(true);
    setError('');
    setExplanation('');
    try {
      const imagePayload = image ? { inlineData: { data: image.base64, mimeType: image.mimeType } } : null;
      const result = await getHomeworkHelp(problem, imagePayload, level);
      setExplanation(result);
      addXp(image ? 15 : 10, 'assistant');
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
      <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleImageChange} className="hidden" />

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Asistente de Tareas</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Introduce un problema, o sube una foto de él, y obtén una guía paso a paso sobre cómo resolverlo.</p>
        
        <TextArea
          rows={5}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Escribe tu problema aquí o añade contexto a tu imagen... Ej: '¿Qué es el teorema de Pitágoras y cómo lo uso?'"
        />

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-full">
                <UploadIcon /> Subir Foto
            </Button>
            <Button variant="secondary" onClick={() => cameraInputRef.current?.click()} disabled={isLoading} className="w-full">
                <CameraIcon /> Tomar Foto
            </Button>
        </div>

        {image && (
            <div className="mt-6 relative group w-fit mx-auto">
                <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Vista previa del problema" className="rounded-lg max-h-60 shadow-md" />
                <button 
                  onClick={() => setImage(null)} 
                  className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Eliminar imagen"
                >
                    <CloseIcon />
                </button>
            </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit} isLoading={isLoading} disabled={!problem.trim() && !image}>
            Obtener Ayuda
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 text-center font-medium">{error}</p>}

      {isLoading && (
        <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Lumen está pensando...</p>
        </div>
      )}

      {explanation && (
        <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
           <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Explicación</h4>
           <MarkdownRenderer content={explanation} />
        </div>
      )}
    </div>
  );
};