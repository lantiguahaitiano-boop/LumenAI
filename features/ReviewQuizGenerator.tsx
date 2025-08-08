import React, { useState, useContext, useRef } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { QuizQuestion } from '../types';
import { GamificationContext } from '../components/GamificationProvider';

export const ReviewQuizGenerator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const resetQuizState = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setScore(0);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.type !== 'text/plain') {
            setError('Por favor, sube un archivo de texto (.txt).');
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setError('');
    }
  };

  const extractTextFromFile = async (fileToProcess: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("Error al leer el archivo de texto."));
        reader.readAsText(fileToProcess);
    });
  };

  const handleGenerateQuiz = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo para generar el examen.');
      return;
    }
    setIsLoading(true);
    setError('');
    setQuestions(null);
    resetQuizState();

    try {
      setLoadingMessage('Extrayendo texto del documento...');
      const extractedText = await extractTextFromFile(file);

      if(!extractedText.trim()){
          throw new Error("El documento parece estar vacío o no contiene texto legible.");
      }

      setLoadingMessage('Creando tu examen personalizado...');
      const result = await generateQuiz(extractedText, level, numQuestions);

      if (result && result.length > 0) {
        setQuestions(result);
        addXp(25, 'reviewQuiz');
      } else {
        setError('No se pudo generar un examen desde este documento. Prueba con otro archivo.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  }

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    setIsAnswered(true);
    if (selectedAnswer === questions![currentQuestionIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(i => i + 1);
  };
  
  const restartQuiz = () => {
      setQuestions(null);
      setFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!questions ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Generador de Cuestionarios de Repaso</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Sube tus apuntes en un archivo de texto (.txt) y la IA creará un examen para ayudarte a estudiar.</p>
          
          <div className="space-y-6">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">1. Sube tu documento</label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <div className="flex text-sm text-slate-600 dark:text-slate-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                                <span>Selecciona un archivo</span>
                                <input id="file-upload" name="file-upload" type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt" className="sr-only" />
                            </label>
                            <p className="pl-1">o arrástralo aquí</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Solo archivos .txt, hasta 10MB</p>
                    </div>
                </div>
                {file && <p className="text-center mt-2 text-sm text-slate-500 dark:text-slate-400">Archivo seleccionado: <span className="font-semibold">{file.name}</span></p>}
             </div>
             <div>
                <label htmlFor="num-questions-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">2. Elige el número de preguntas</label>
                <input
                    id="num-questions-input"
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    min="1"
                    max="20"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20"
                />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleGenerateQuiz} isLoading={isLoading} disabled={!file}>
              Generar Examen
            </Button>
          </div>
          {error && <p className="mt-4 text-red-500 text-center font-medium">{error}</p>}
          {isLoading && (
            <div className="mt-8 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{loadingMessage}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
            {currentQuestionIndex < questions.length ? (
                <div key={currentQuestionIndex} className="animate-fade-in">
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
                    <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 my-4">{questions[currentQuestionIndex].question}</h4>
                    <div className="space-y-3">
                        {Object.entries(questions[currentQuestionIndex].options).map(([key, value]) => (
                            <button key={key} onClick={() => handleAnswerSelect(key)} disabled={isAnswered} className={`w-full text-left p-4 border rounded-lg transition-all duration-200 text-slate-800 dark:text-slate-200
                                ${isAnswered ? 
                                    (questions[currentQuestionIndex].correctAnswer === key ? 'bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200' : (selectedAnswer === key ? 'bg-red-100 dark:bg-red-900/50 border-red-400 dark:border-red-600 text-red-800 dark:text-red-200' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'))
                                    : (selectedAnswer === key ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 dark:border-amber-500 ring-2 ring-amber-300 dark:ring-amber-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600')
                                }`}
                            >
                                <span className="font-bold mr-3">{key}.</span>{value}
                            </button>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                        {!isAnswered ? (
                            <Button onClick={handleCheckAnswer} disabled={!selectedAnswer}>Comprobar Respuesta</Button>
                        ) : (
                            <Button onClick={handleNextQuestion}>Siguiente Pregunta</Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center animate-fade-in">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">¡Examen Completo!</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">Tu puntuación:</p>
                    <p className="text-5xl font-bold text-amber-600 dark:text-amber-400 my-4">{score} / {questions.length}</p>
                    <Button onClick={restartQuiz}>Hacer Otro Examen</Button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};