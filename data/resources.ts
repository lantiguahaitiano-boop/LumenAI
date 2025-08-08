import React from 'react';
import { ResourceCategory } from '../types';

// --- Icon Definitions ---

const BookOpenIcon: React.FC<{className?: string}> = ({className}) => React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className,
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
}));

const BeakerIcon: React.FC<{className?: string}> = ({className}) => React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className,
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
}));

const GlobeIcon: React.FC<{className?: string}> = ({className}) => React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className,
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.053-.053a.5.5 0 01.707 0l2.122 2.122a.5.5 0 010 .707l-2.122 2.122a.5.5 0 01-.707 0l-.053-.053A4.5 4.5 0 013 11.5V11a.5.5 0 01.5-.5h2.445m7.798-.053l.053.053a.5.5 0 00.707 0l2.122-2.122a.5.5 0 000-.707l-2.122-2.122a.5.5 0 00-.707 0l-.053.053A4.5 4.5 0 0015 11.5V11a.5.5 0 00-.5-.5h-2.445"
}), React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M12 21a9 9 0 01-9-9 3.5 3.5 0 013.5-3.5h11A3.5 3.5 0 0121 12a9 9 0 01-9 9z"
}));

const CodeIcon: React.FC<{className?: string}> = ({className}) => React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className,
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
}));

const BrainIcon: React.FC<{className?: string}> = ({className}) => React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className,
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2
}, React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M4.871 14.735c-1.398-1.469-2.126-3.3-2.126-5.195 0-3.242 2.632-5.875 5.875-5.875 1.895 0 3.626.728 4.995 2.126m-4.995 8.944a5.854 5.854 0 005.625-4.375m-11.25 0a5.854 5.854 0 015.625-4.375m1.25 11.25c1.398 1.469 3.226 2.24 5.195 2.24 3.242 0 5.875-2.633 5.875-5.875 0-1.895-.728-3.626-2.126-4.995m-1.25-6.25a5.854 5.854 0 015.625 4.375"
}));

const CalculatorIcon: React.FC<{className?: string}> = ({className}) => React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className,
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2
}, React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 7h6m-6 4h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
}));

const TrendingUpIcon: React.FC<{className?: string}> = ({className}) => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
}, React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
}));

const UsersIcon: React.FC<{className?: string}> = ({className}) => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
}, React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3M16 7a4 4 0 11-8 0 4 4 0 018 0z"
}));

const PaintBrushIcon: React.FC<{className?: string}> = ({className}) => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
}, React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
}));


// --- Resource Data ---

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
    {
        id: 'literature',
        name: 'Literatura Universal',
        description: 'Explora las obras maestras de la literatura clásica y universal, disponibles en dominio público.',
        icon: React.createElement(BookOpenIcon, { className: 'h-6 w-6' }),
        resources: [
            {
                title: 'Don Quijote de la Mancha',
                author: 'Miguel de Cervantes',
                description: 'La obra cumbre de la literatura española, una novela de aventuras y caballería.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/5946/pg5946.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/5946'
            },
            {
                title: 'Frankenstein',
                author: 'Mary Shelley',
                description: 'La icónica novela gótica que explora la ambición, la creación y la monstruosidad.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/84'
            },
            {
                title: 'Orgullo y Prejuicio',
                author: 'Jane Austen',
                description: 'Una ingeniosa novela de costumbres sobre el amor, la reputación y las diferencias de clase.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/1342'
            },
            {
                title: 'La Metamorfosis',
                author: 'Franz Kafka',
                description: 'Un relato sobre un hombre que amanece convertido en un monstruoso insecto.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/5200/pg5200.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/5200'
            },
            {
                title: 'Moby Dick',
                author: 'Herman Melville',
                description: 'La gran novela americana sobre la obsesiva búsqueda de una ballena blanca.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/2701'
            },
            {
                title: 'Las Aventuras de Sherlock Holmes',
                author: 'Arthur Conan Doyle',
                description: 'Una colección de doce historias cortas del famoso detective y su compañero, el Dr. Watson.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/1661'
            }
        ]
    },
    {
        id: 'science',
        name: 'Ciencias',
        description: 'Libros de texto y guías de referencia para biología, química y física de fuentes abiertas.',
        icon: React.createElement(BeakerIcon, { className: 'h-6 w-6' }),
        resources: [
            {
                title: 'Biology 2e (OpenStax)',
                author: 'OpenStax',
                description: 'Un libro de texto universitario completo que cubre todos los conceptos de la biología.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/Biology2e-WEB.png',
                url: 'https://openstax.org/details/books/biology-2e'
            },
            {
                title: 'Chemistry 2e (OpenStax)',
                author: 'OpenStax',
                description: 'Diseñado para un curso de química general de dos semestres, con ejemplos y problemas.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/Chemistry2e-WEB_1.png',
                url: 'https://openstax.org/details/books/chemistry-2e'
            },
            {
                title: 'University Physics Vol. 1',
                author: 'OpenStax',
                description: 'Cubre mecánica, sonido, oscilaciones y ondas. Ideal para cursos de física basados en cálculo.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/UniversityPhysics-V1-WEB.png',
                url: 'https://openstax.org/details/books/university-physics-volume-1'
            },
            {
                title: 'Astronomy (OpenStax)',
                author: 'OpenStax',
                description: 'Un libro de introducción a la astronomía que cubre el sistema solar, estrellas y cosmología.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/Astronomy-WEB.png',
                url: 'https://openstax.org/details/books/astronomy'
            }
        ]
    },
    {
        id: 'mathematics',
        name: 'Matemáticas',
        description: 'Libros de texto abiertos para cálculo, álgebra, trigonometría y estadística.',
        icon: React.createElement(CalculatorIcon, { className: 'h-6 w-6' }),
        resources: [
            {
                title: 'Calculus Volume 1 (OpenStax)',
                author: 'OpenStax',
                description: 'Cubre funciones, límites, derivadas e integración. Para cursos universitarios.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/Calculus-V1-WEB_h7Ogl03.png',
                url: 'https://openstax.org/details/books/calculus-volume-1'
            },
            {
                title: 'Algebra and Trigonometry 2e',
                author: 'OpenStax',
                description: 'Un enfoque modular para el álgebra y la trigonometría, adecuado para diversos cursos.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/Algebra-and-Trigonometry-2e-WEB.png',
                url: 'https://openstax.org/details/books/algebra-and-trigonometry-2e'
            },
            {
                title: 'Introductory Statistics (OpenStax)',
                author: 'OpenStax',
                description: 'Un libro completo sobre los fundamentos de la estadística, probabilidad y pruebas de hipótesis.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/IntroductoryStatistics-WEB.png',
                url: 'https://openstax.org/details/books/introductory-statistics'
            }
        ]
    },
    {
        id: 'history',
        name: 'Historia',
        description: 'Sumérgete en el pasado con textos históricos que narran eventos y épocas cruciales.',
        icon: React.createElement(GlobeIcon, { className: 'h-6 w-6' }),
        resources: [
            {
                title: 'La decadencia y caída del Imperio Romano',
                author: 'Edward Gibbon',
                description: 'Una obra monumental que detalla la historia de Roma desde su apogeo hasta la caída.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/25717/pg25717.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/25717'
            },
            {
                title: 'U.S. History (OpenStax)',
                author: 'OpenStax',
                description: 'Un libro de texto que cubre la historia de Estados Unidos desde sus orígenes hasta el presente.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/USHistory-WEB.png',
                url: 'https://openstax.org/details/books/us-history'
            },
            {
                title: 'World History Volume 2 (OpenStax)',
                author: 'OpenStax',
                description: 'Cubre la historia mundial desde el año 1500, enfocándose en temas globales y comparativos.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/WorldHistory2-WEB.png',
                url: 'https://openstax.org/details/books/world-history-volume-2'
            }
        ]
    },
    {
        id: 'programming',
        name: 'Programación',
        description: 'Guías, tutoriales y documentación para aprender a programar en diferentes lenguajes.',
        icon: React.createElement(CodeIcon, { className: 'h-6 w-6' }),
        resources: [
            {
                title: 'Eloquent JavaScript',
                author: 'Marijn Haverbeke',
                description: 'Un libro moderno sobre JavaScript, programación y las maravillas de lo digital. Incluye ejercicios.',
                imageUrl: 'https://eloquentjavascript.net/img/cover.jpg',
                url: 'https://eloquentjavascript.net/'
            },
            {
                title: 'The Python Tutorial',
                author: 'Python Software Foundation',
                description: 'El tutorial oficial para aprender el lenguaje de programación Python, directo de sus creadores.',
                imageUrl: 'https://www.python.org/static/opengraph-icon-200x200.png',
                url: 'https://docs.python.org/3/tutorial/'
            },
            {
                title: 'Automate the Boring Stuff with Python',
                author: 'Al Sweigart',
                description: 'Un libro práctico para principiantes que enseña a usar Python para automatizar tareas diarias.',
                imageUrl: 'https://automatetheboringstuff.com/images/cover_automatetheboringstuff_2e_med.png',
                url: 'https://automatetheboringstuff.com/'
            },
            {
                title: 'MDN Web Docs',
                author: 'Mozilla',
                description: 'La principal fuente de documentación para tecnologías web como HTML, CSS y JavaScript.',
                imageUrl: 'https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png',
                url: 'https://developer.mozilla.org/'
            }
        ]
    },
    {
        id: 'philosophy',
        name: 'Filosofía',
        description: 'Textos fundamentales que han moldeado el pensamiento occidental y oriental.',
        icon: React.createElement(BrainIcon, { className: 'h-6 w-6' }),
        resources: [
            {
                title: 'La República',
                author: 'Platón',
                description: 'Un diálogo socrático sobre la justicia, el orden y el carácter del hombre justo y la ciudad-estado.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/1497/pg1497.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/1497'
            },
            {
                title: 'Meditaciones',
                author: 'Marco Aurelio',
                description: 'Una serie de escritos personales del emperador romano, exponiendo sus reflexiones estoicas.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/2680/pg2680.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/2680'
            },
            {
                title: 'Así habló Zaratustra',
                author: 'Friedrich Nietzsche',
                description: 'Una novela filosófica que introduce conceptos como el superhombre y la voluntad de poder.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/1998/pg1998.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/1998'
            },
            {
                title: 'Ética a Nicómaco',
                author: 'Aristóteles',
                description: 'La obra de Aristóteles sobre la virtud y el carácter moral, una piedra angular de la ética occidental.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/8438/pg8438.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/8438'
            }
        ]
    },
    {
        id: 'economics',
        name: 'Economía y Finanzas',
        description: 'Libros sobre los principios de la economía, microeconomía, macroeconomía y obras clásicas.',
        icon: React.createElement(TrendingUpIcon, { className: 'h-6 w-6' }),
        resources: [
            {
                title: 'Principles of Economics 2e',
                author: 'OpenStax',
                description: 'Un libro de texto introductorio que cubre conceptos de micro y macroeconomía.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/PrinciplesEconomics2e-WEB_hQf33D3.png',
                url: 'https://openstax.org/details/books/principles-economics-2e'
            },
            {
                title: 'The Wealth of Nations',
                author: 'Adam Smith',
                description: 'La obra fundamental de la economía clásica, que introduce la idea de la "mano invisible".',
                imageUrl: 'https://www.gutenberg.org/cache/epub/3300/pg3300.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/3300'
            },
            {
                title: 'Principles of Microeconomics 2e',
                author: 'OpenStax',
                description: 'Se enfoca en las decisiones de individuos y empresas y cómo interactúan en los mercados.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/Microeconomics2e-WEB_hKnQ1pY.png',
                url: 'https://openstax.org/details/books/principles-microeconomics-2e'
            }
        ]
    },
    {
        id: 'social-sciences',
        name: 'Ciencias Sociales',
        description: 'Recursos para el estudio de la psicología, sociología y ciencias políticas.',
        icon: React.createElement(UsersIcon, { className: 'h-6 w-6' }),
        resources: [
            {
                title: 'Psychology 2e (OpenStax)',
                author: 'OpenStax',
                description: 'Una introducción completa al alcance y la diversidad de la psicología moderna.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/Psychology2e-WEB.png',
                url: 'https://openstax.org/details/books/psychology-2e'
            },
            {
                title: 'Introduction to Sociology 3e',
                author: 'OpenStax',
                description: 'Cubre los conceptos fundamentales, las teorías y las perspectivas empíricas de la sociología.',
                imageUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/IntroductionSociology3e-WEB.png',
                url: 'https://openstax.org/details/books/introduction-sociology-3e'
            },
            {
                title: 'El Príncipe',
                author: 'Nicolás Maquiavelo',
                description: 'Un tratado de política del siglo XVI que explora la obtención y el mantenimiento del poder.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/1232'
            }
        ]
    },
    {
        id: 'art-history',
        name: 'Historia del Arte',
        description: 'Explora la historia del arte, desde las civilizaciones antiguas hasta los movimientos modernos.',
        icon: React.createElement(PaintBrushIcon, { className: 'h-6 w-6' }),
        resources: [
            {
                title: 'A History of Art for Beginners',
                author: 'Clara Erskine Clement Waters',
                description: 'Una guía accesible a la historia del arte, cubriendo arquitectura, escultura y pintura.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/17726/pg17726.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/17726'
            },
            {
                title: 'Smarthistory',
                author: 'Dr. Beth Harris & Dr. Steven Zucker',
                description: 'El centro de historia del arte más visitado, con ensayos y videos sobre el arte de todas las épocas.',
                imageUrl: 'https://smarthistory.org/wp-content/uploads/2021/07/smarthistory-logo.png',
                url: 'https://smarthistory.org/'
            },
            {
                title: 'The Story of Mankind',
                author: 'Hendrik Willem van Loon',
                description: 'Un clásico que narra la historia de la civilización occidental y su arte de una manera atractiva.',
                imageUrl: 'https://www.gutenberg.org/cache/epub/67256/pg67256.cover.medium.jpg',
                url: 'https://www.gutenberg.org/ebooks/67256'
            }
        ]
    }
];
