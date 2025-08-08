import React, { useState, useContext } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { QuizQuestion } from '../types';
import { TextArea } from '../components/common/TextArea';
import { GamificationContext } from '../components/GamificationProvider';

export const TestSimulator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError('Por favor, introduce un tema para el examen.');
      return;
    }
    setIsLoading(true);
    setError('');
    setQuestions(null);
    resetQuizState();
    try {
      const result = await generateQuiz(topic, level, numQuestions);
      if (result && result.length > 0) {
        setQuestions(result);
        addXp(20, 'test');
      } else {
        setError('No se pudo generar un examen. Por favor, prueba con un tema diferente.');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
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
  
  const resetQuizState = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setScore(0);
  }

  const restartQuiz = () => {
      setQuestions(null);
      setTopic('');
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!questions ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Creador de Exámenes</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Genera un examen personalizado sobre cualquier tema para poner a prueba tus conocimientos.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="md:col-span-2">
              <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tema o material de estudio</label>
              <TextArea
                id="topic-input"
                rows={5}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Introduce un tema o pega material de estudio aquí... Ej: 'La Guerra Civil Americana', 'Respiración Celular', 'Conceptos clave de mis apuntes de historia...'"
              />
            </div>
            <div>
              <label htmlFor="num-questions-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Número de preguntas</label>
              <input
                id="num-questions-input"
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                max="20"
                className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:shadow-lg focus:shadow-amber-500/20 h-full"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleGenerateQuiz} isLoading={isLoading}>
              Generar Examen
            </Button>
          </div>
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          {isLoading && (
            <div className="mt-8 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Creando tu examen...</p>
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