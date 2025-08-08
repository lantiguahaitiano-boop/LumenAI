import React, { useState, useContext } from 'react';
import { ResourceCategory } from '../types';
import { RESOURCE_CATEGORIES } from '../data/resources';
import { GamificationContext } from '../components/GamificationProvider';
import { Button } from '../components/common/Button';

export const ResourceLibrary: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
    const { addXp } = useContext(GamificationContext);

    const handleResourceClick = () => {
        addXp(5, 'resourceLibrary');
    };

    if (selectedCategory) {
        return (
            <div className="animate-fade-in">
                <div className="flex items-center mb-6">
                    <Button variant="secondary" onClick={() => setSelectedCategory(null)} className="mr-4">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                         <span className="ml-2">Volver</span>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{selectedCategory.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400">{selectedCategory.description}</p>
                    </div>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {selectedCategory.resources.map((resource, index) => (
                        <a 
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleResourceClick}
                            className="group bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl dark:hover:shadow-black/20 overflow-hidden flex flex-col transition-all duration-300 ease-in-out transform hover:-translate-y-1 border dark:border-slate-700"
                        >
                            <img src={resource.imageUrl} alt={`Portada de ${resource.title}`} className="h-56 w-full object-cover" />
                            <div className="p-4 flex flex-col flex-grow">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{resource.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{resource.author}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 flex-grow">{resource.description}</p>
                            </div>
                        </a>
                    ))}
                 </div>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in">
            <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Biblioteca de Recursos</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Explora una colección curada de libros, guías y materiales de estudio de dominio público y fuentes confiables. Selecciona una categoría para comenzar.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RESOURCE_CATEGORIES.map((category, index) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category)}
                        className="text-left bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 ease-in-out border border-slate-200 dark:border-slate-700 flex flex-col animate-slide-in-up-fade"
                        style={{ animationDelay: `${index * 50}ms`}}
                    >
                         <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 mr-4">
                                {category.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{category.name}</h3>
                        </div>
                         <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow">
                            {category.description}
                        </p>
                        <div className="mt-4 font-semibold text-sm flex items-center text-amber-600 dark:text-amber-400">
                           Explorar Categoría
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
