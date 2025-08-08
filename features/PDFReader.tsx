import React, { useState, useRef, useEffect, useContext } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { getAnswerFromPDF } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { GamificationContext } from '../components/GamificationProvider';

// Set up the worker for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.5.136/build/pdf.worker.mjs`;

// Icons
const UploadIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ChevronLeftIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

const PDFViewer: React.FC<{ file: File; onTextExtracted: (text: string) => void; onSetNumPages: (num: number) => void }> = ({ file, onTextExtracted, onSetNumPages }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isRendering, setIsRendering] = useState(false);
    
    useEffect(() => {
        const loadPdf = async () => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
                const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
                setPdf(pdfDoc);
                setTotalPages(pdfDoc.numPages);
                onSetNumPages(pdfDoc.numPages);

                // Extract text from all pages
                let fullText = '';
                for (let i = 1; i <= pdfDoc.numPages; i++) {
                    const page = await pdfDoc.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map(item => 'str' in item ? item.str : '').join(' ') + '\n';
                }
                onTextExtracted(fullText);
            };
            reader.readAsArrayBuffer(file);
        };
        loadPdf();
    }, [file, onTextExtracted, onSetNumPages]);

    useEffect(() => {
        if (!pdf) return;

        let renderTask: pdfjsLib.RenderTask | null = null;

        const renderPage = async () => {
            setIsRendering(true);
            try {
                const page = await pdf.getPage(currentPage);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = canvasRef.current;
                if (!canvas) return;

                const context = canvas.getContext('2d');
                if (!context) return;
                
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                renderTask = page.render(renderContext as any);
                await renderTask.promise;

            } catch (error: any) {
                // Ignore cancellation errors, log others
                if (error?.name !== 'RenderingCancelledException') {
                    console.error('Error rendering PDF page:', error);
                }
            } finally {
                setIsRendering(false);
            }
        };

        renderPage();

        return () => {
            if (renderTask) {
                renderTask.cancel();
            }
        };
    }, [pdf, currentPage]);

    return (
         <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 rounded-lg">
            <div className="flex-grow overflow-auto p-4 flex justify-center items-start">
                <canvas ref={canvasRef} className={`shadow-lg ${isRendering ? 'opacity-50' : 'opacity-100'}`}></canvas>
            </div>
            {totalPages > 0 && (
                <div className="flex-shrink-0 flex items-center justify-center p-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1 || isRendering}><ChevronLeftIcon /></Button>
                    <span className="mx-4 text-sm font-medium text-slate-700 dark:text-slate-200">Página {currentPage} de {totalPages}</span>
                    <Button variant="secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages || isRendering}><ChevronRightIcon /></Button>
                </div>
            )}
        </div>
    )
};

const ChatPanel: React.FC<{ pdfText: string }> = ({ pdfText }) => {
    const [history, setHistory] = useState<ChatMessage[]>([{role: 'model', text: '¡Hola! He leído el documento. ¿Qué te gustaría saber?'}]);
    const [input, setInput] = useState('');
    const [isAnswering, setIsAnswering] = useState(false);
    const { level } = useContext(LevelContext);
    const { addXp, gamification } = useContext(GamificationContext);
    const messagesEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleSend = async () => {
        if (!input.trim() || isAnswering) return;

        const currentInput = input;
        const userMessage: ChatMessage = { role: 'user', text: currentInput };

        setHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsAnswering(true);

        try {
            if((gamification.toolUsage['pdfReader'] || 0) < 1) {
                addXp(25, 'pdfReader');
            } else {
                addXp(5, 'pdfReader');
            }

            const result = await getAnswerFromPDF(pdfText, currentInput, level);
            const modelMessage: ChatMessage = { role: 'model', text: result };
            setHistory(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Lo siento, tengo problemas para conectarme. Por favor, inténtalo de nuevo." };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsAnswering(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex-grow p-4 md:p-6 overflow-y-auto">
                <div className="space-y-6">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && (
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0">L</div>
                    )}
                    <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-amber-500 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
                    </div>
                    </div>
                ))}
                {isAnswering && (
                    <div className="flex items-end gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0">L</div>
                        <div className="max-w-lg p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Pregúntale algo al documento..."
                    className="flex-grow p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-shadow duration-200"
                    disabled={isAnswering}
                />
                <Button onClick={handleSend} isLoading={isAnswering} disabled={!input.trim()}>
                    Enviar
                </Button>
                </div>
            </div>
        </div>
    )
}

export const PDFReader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pdfText, setPdfText] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingError, setProcessingError] = useState('');
    const [numPages, setNumPages] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setProcessingError('Por favor, sube un archivo PDF.');
                return;
            }
            setProcessingError('');
            setIsProcessing(true);
            setPdfText('');
            setFile(selectedFile);
        }
    };

    const handleTextExtracted = (text: string) => {
        setPdfText(text);
        setIsProcessing(false);
    };

    const handleSetNumPages = (num: number) => {
        setNumPages(num);
    }
    
    if (!file) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Lector de PDF Interactivo</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Sube un documento PDF para verlo y chatear con él. Hazle preguntas, pide resúmenes y más.</p>
                    <div className="mt-2 flex justify-center px-6 pt-10 pb-10 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                                    <span>Selecciona un archivo PDF</span>
                                    <input id="file-upload" ref={fileInputRef} name="file-upload" type="file" onChange={handleFileChange} accept="application/pdf" className="sr-only" />
                                </label>
                                <p className="pl-1">o arrástralo aquí</p>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-500">Archivos PDF</p>
                        </div>
                    </div>
                     {processingError && <p className="mt-4 text-red-500 text-center font-medium">{processingError}</p>}
                </div>
            </div>
        )
    }

    return (
        <div className="h-full max-h-[calc(100vh-160px)] grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isProcessing && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 z-10 flex flex-col items-center justify-center animate-fade-in">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Procesando PDF ({numPages > 0 ? `${numPages} páginas` : '...'})...</p>
                </div>
            )}
            <PDFViewer file={file} onTextExtracted={handleTextExtracted} onSetNumPages={handleSetNumPages} />
            <div className={`transition-opacity duration-500 ${isProcessing ? 'opacity-20' : 'opacity-100'}`}>
                {pdfText && !isProcessing ? <ChatPanel pdfText={pdfText} /> : <div className="flex items-center justify-center h-full bg-white dark:bg-slate-800 rounded-lg p-4 text-slate-500">El chat estará disponible cuando se procese el PDF.</div> }
            </div>
        </div>
    )
};