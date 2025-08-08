
import React, { useState, useContext, useRef } from 'react';
import { generateCountryReport } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { LevelContext } from '../contexts/LevelContext';
import { GamificationContext } from '../components/GamificationProvider';
import { CountryExplorerResult, CountryInfo } from '../types';
import { COUNTRIES } from '../data/countries';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Icons
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const TxtIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

type TabId = 'summary' | 'history' | 'geography' | 'culture' | 'economy' | 'politics';

const DataPill: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{value}</p>
    </div>
);

export const CountryExplorer: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState<string>(COUNTRIES[0]);
    const [result, setResult] = useState<CountryExplorerResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<TabId>('summary');

    const { level } = useContext(LevelContext);
    const { addXp } = useContext(GamificationContext);
    const reportRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async () => {
        if (!selectedCountry) {
            setError('Por favor, selecciona un país.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const report = await generateCountryReport(selectedCountry, level);
            if (report) {
                setResult(report);
                addXp(30, 'countryExplorer');
            } else {
                setError('No se pudo generar el informe para este país. Inténtalo de nuevo.');
            }
        } catch (err) {
            setError('Ocurrió un error al generar el informe. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleExport = async (format: 'pdf' | 'txt') => {
        if (!result) return;
        setIsExporting(true);

        if (format === 'txt') {
            let textContent = `INFORME SOBRE ${selectedCountry.toUpperCase()}\n\n`;
            textContent += `== RESUMEN ==\n${result.info.summary}\n\n`;
            textContent += `Capital: ${result.info.capital}\n`;
            textContent += `Población: ${result.info.population}\n`;
            textContent += `Continente: ${result.info.continent}\n\n`;
            textContent += `== HISTORIA ==\n${result.info.history}\n\n`;
            textContent += `== GEOGRAFÍA ==\nUbicación: ${result.info.geography.location}\nClima: ${result.info.geography.climate}\nCaracterísticas Principales: ${result.info.geography.mainFeatures.join(', ')}\n\n`;
            textContent += `== CULTURA ==\nIdiomas: ${result.info.culture.languages.join(', ')}\nGastronomía: ${result.info.culture.cuisine}\nTradiciones: ${result.info.culture.traditions}\n\n`;
            textContent += `== ECONOMÍA ==\nPIB: ${result.info.economy.gdp}\nIndustrias Principales: ${result.info.economy.mainIndustries.join(', ')}\nMoneda: ${result.info.economy.currency}\n\n`;
            textContent += `== POLÍTICA ==\nTipo de Gobierno: ${result.info.politics.governmentType}\nJefe de Estado/Gobierno: ${result.info.politics.headOfState}\n`;
            
            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `informe-${selectedCountry.toLowerCase().replace(/ /g, '-')}.txt`;
            link.click();
            URL.revokeObjectURL(url);
            
        } else if (format === 'pdf') {
            const reportElement = reportRef.current;
            if (reportElement) {
                const canvas = await html2canvas(reportElement, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = imgWidth / imgHeight;
                const height = pdfWidth / ratio;
                let position = 0;
                let remainingHeight = imgHeight * (pdfWidth / imgWidth);

                while (remainingHeight > 0) {
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, height);
                    remainingHeight -= pdfHeight;
                    position -= pdfHeight;
                    if (remainingHeight > 0) {
                        pdf.addPage();
                    }
                }
                pdf.save(`informe-${selectedCountry.toLowerCase().replace(/ /g, '-')}.pdf`);
            }
        }
        setIsExporting(false);
    };


    const renderTabContent = () => {
        if (!result) return null;
        const { info } = result;

        switch (activeTab) {
            case 'history': return <p>{info.history}</p>;
            case 'geography': return (
                <div className="space-y-4">
                    <DataPill label="Ubicación" value={info.geography.location} />
                    <DataPill label="Clima" value={info.geography.climate} />
                    <DataPill label="Características Principales" value={info.geography.mainFeatures.join(', ')} />
                </div>
            );
            case 'culture': return (
                <div className="space-y-4">
                    <DataPill label="Idiomas" value={info.culture.languages.join(', ')} />
                    <DataPill label="Gastronomía" value={info.culture.cuisine} />
                    <DataPill label="Tradiciones" value={info.culture.traditions} />
                </div>
            );
            case 'economy': return (
                <div className="space-y-4">
                    <DataPill label="PIB (Nominal)" value={info.economy.gdp} />
                    <DataPill label="Industrias Principales" value={info.economy.mainIndustries.join(', ')} />
                    <DataPill label="Moneda" value={info.economy.currency} />
                </div>
            );
            case 'politics': return (
                <div className="space-y-4">
                    <DataPill label="Tipo de Gobierno" value={info.politics.governmentType} />
                    <DataPill label="Jefe de Estado/Gobierno" value={info.politics.headOfState} />
                </div>
            );
            case 'summary':
            default:
                return (
                    <div>
                        <p className="mb-6 text-lg">{info.summary}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <DataPill label="Capital" value={info.capital} />
                            <DataPill label="Población" value={info.population} />
                            <DataPill label="Continente" value={info.continent} />
                            <DataPill label="Moneda" value={info.economy.currency} />
                        </div>
                    </div>
                );
        }
    };
    
    const TabButton: React.FC<{tabId: TabId, label: string}> = ({ tabId, label }) => (
        <button
           onClick={() => setActiveTab(tabId)}
           className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
               activeTab === tabId 
               ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' 
               : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
           }`}
       >
           {label}
       </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {!result && (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Explorador de Países</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Elige un país para generar un informe completo con datos, mapas e imágenes.</p>
                    <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                        <Select 
                            className="w-full"
                            value={selectedCountry}
                            onChange={e => setSelectedCountry(e.target.value)}
                            options={COUNTRIES.map(c => ({ value: c, label: c }))}
                        />
                        <Button onClick={handleSubmit} isLoading={isLoading} className="w-full sm:w-auto">Explorar</Button>
                    </div>
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </div>
            )}
            
            {isLoading && (
                 <div className="mt-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">Investigando {selectedCountry}...</p>
                    <p className="text-sm text-slate-500">Esto puede tomar un momento mientras la IA genera el informe y las imágenes.</p>
                </div>
            )}

            {result && !isLoading && (
                <div className="animate-fade-in space-y-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                            <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-4">
                               <span className="text-5xl">{result.info.flagEmoji}</span>
                               {selectedCountry}
                            </h2>
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={() => handleExport('txt')} variant="secondary" isLoading={isExporting} disabled={isExporting}>
                                <TxtIcon className="h-5 w-5 mr-2" /> TXT
                            </Button>
                             <Button onClick={() => handleExport('pdf')} variant="secondary" isLoading={isExporting} disabled={isExporting}>
                                <DownloadIcon className="h-5 w-5 mr-2" /> PDF
                            </Button>
                            <Button onClick={() => setResult(null)}>Elegir otro</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-8">
                             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <img src={`data:image/jpeg;base64,${result.representativeImage}`} alt={`Imagen de ${selectedCountry}`} className="rounded-lg w-full h-auto object-cover aspect-video" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <img src={`data:image/jpeg;base64,${result.mapImage}`} alt={`Mapa de ${selectedCountry}`} className="rounded-lg w-full h-auto object-contain" />
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <div className="border-b border-slate-200 dark:border-slate-700 mb-4 pb-2">
                                <div className="flex flex-wrap gap-2">
                                    <TabButton tabId="summary" label="Resumen" />
                                    <TabButton tabId="history" label="Historia" />
                                    <TabButton tabId="geography" label="Geografía" />
                                    <TabButton tabId="culture" label="Cultura" />
                                    <TabButton tabId="economy" label="Economía" />
                                    <TabButton tabId="politics" label="Política" />
                                </div>
                            </div>
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
             {/* Hidden div for PDF export */}
            {result && (
                <div ref={reportRef} className="absolute -left-full top-0 w-[800px] bg-white p-8 font-sans text-black" style={{ zIndex: -100, opacity: 0}}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Informe sobre {selectedCountry}</h1>
                    <img src={`data:image/jpeg;base64,${result.representativeImage}`} alt="Imagen representativa" style={{ width: '100%', height: 'auto', marginBottom: '20px', borderRadius: '8px' }}/>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>Resumen</h2>
                    <p style={{ marginBottom: '20px' }}>{result.info.summary}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                        <div><strong>Capital:</strong> {result.info.capital}</div>
                        <div><strong>Población:</strong> {result.info.population}</div>
                        <div><strong>Continente:</strong> {result.info.continent}</div>
                        <div><strong>Moneda:</strong> {result.info.economy.currency}</div>
                    </div>
                     <img src={`data:image/jpeg;base64,${result.mapImage}`} alt="Mapa" style={{ width: '100%', height: 'auto', marginBottom: '20px', borderRadius: '8px', border: '1px solid #eee' }}/>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>Historia</h2>
                    <p style={{ marginBottom: '20px' }}>{result.info.history}</p>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>Geografía</h2>
                    <p><strong>Ubicación:</strong> {result.info.geography.location}</p>
                    <p><strong>Clima:</strong> {result.info.geography.climate}</p>
                    <p style={{ marginBottom: '20px' }}><strong>Características Principales:</strong> {result.info.geography.mainFeatures.join(', ')}</p>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>Cultura</h2>
                    <p><strong>Idiomas:</strong> {result.info.culture.languages.join(', ')}</p>
                    <p><strong>Gastronomía:</strong> {result.info.culture.cuisine}</p>
                    <p style={{ marginBottom: '20px' }}><strong>Tradiciones:</strong> {result.info.culture.traditions}</p>
                     <h2 style={{ fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>Economía</h2>
                    <p><strong>PIB:</strong> {result.info.economy.gdp}</p>
                    <p><strong>Industrias Principales:</strong> {result.info.economy.mainIndustries.join(', ')}</p>
                    <p style={{ marginBottom: '20px' }}><strong>Moneda:</strong> {result.info.economy.currency}</p>
                     <h2 style={{ fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>Política</h2>
                    <p><strong>Tipo de Gobierno:</strong> {result.info.politics.governmentType}</p>
                    <p><strong>Jefe de Estado/Gobierno:</strong> {result.info.politics.headOfState}</p>
                </div>
            )}
        </div>
    );
};
