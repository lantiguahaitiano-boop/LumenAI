
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { QuizQuestion, Slide, ProjectPlan, ScientificCalculation, PlagiarismResult, InfographicTimelineResult, ReferenceItem, CountryInfo, CountryExplorerResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-3.0-generate-002';

// --- Generic AI Functions ---

async function generateText(prompt: string, systemInstruction: string): Promise<string> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating text:", error);
        return "Lo siento, encontré un error al procesar tu solicitud. Por favor, inténtalo de nuevo.";
    }
}

async function generateJson<T,>(prompt: string, systemInstruction: string, responseSchema: any): Promise<T | null> {
    let jsonText = '';
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        
        jsonText = response.text.trim();
        // Regex to find a JSON block, optionally wrapped in ```json ... ``` or ``` ... ```
        const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/s;
        const match = jsonText.match(jsonBlockRegex);
        
        // If a match is found in a markdown block, use that. Otherwise, assume the whole text is JSON.
        if (match && match[1]) {
            jsonText = match[1];
        }

        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Error generating or parsing JSON from model:", error);
        // It's helpful to log the text that failed to parse for debugging.
        if (jsonText) {
             console.error("Problematic text:", jsonText);
        }
        return null;
    }
}

interface SpacedRepetitionSuggestion {
    note: string;
    reviewDate: string; // "YYYY-MM-DD"
}

// --- Specific Feature Functions ---

export const getHomeworkHelp = async (
    problem: string,
    image: { inlineData: { data: string; mimeType: string } } | null,
    level: string
): Promise<string> => {
    const systemInstruction = `Eres un tutor experto de IA para un estudiante de ${level}. Tu objetivo es analizar el texto y/o la imagen proporcionada. Primero, si hay una imagen, digitaliza el problema. Luego, tu objetivo principal NO es dar la respuesta directamente, sino guiar al estudiante hacia ella. Proporciona explicaciones paso a paso, pistas y un razonamiento estructurado. ADECÚA LA COMPLEJIDAD de tu explicación al nivel académico del estudiante. Para niveles más bajos (Secundaria), usa un lenguaje más sencillo y ejemplos básicos. Para niveles superiores (Universidad, Postgrado), puedes ser más técnico y profundo. Formatea tu respuesta claramente usando markdown.`;

    const textPart = { text: `Mi problema es: ${problem || 'Por favor, analiza la imagen que he subido.'}. Ayúdame a entender cómo resolverlo. Si el texto está vacío, céntrate en la imagen. Si la imagen parece no tener relación con una tarea académica, indícalo amablemente.` };
    
    const contents = image 
        ? { parts: [textPart, image] } 
        : { parts: [textPart] };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: textModel,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating homework help:", error);
        return "Lo siento, encontré un error al procesar tu solicitud. Por favor, inténtalo de nuevo.";
    }
};

export const getSummary = (text: string, level: string) => {
    const systemInstruction = `Eres un experto resumidor académico. Tu tarea es leer el texto proporcionado y generar un resumen coherente y conciso. La profundidad y el vocabulario del resumen deben ser apropiados para un estudiante de ${level}. Para un estudiante de Secundaria, el resumen debe ser más simple y directo. Para un estudiante de Universidad, debe ser más detallado y capturar más matices. Resalta los conceptos clave, los argumentos principales y las conclusiones importantes.`;
    const prompt = `Por favor, resume este texto para un estudiante de ${level}: \n\n${text}`;
    return generateText(prompt, systemInstruction);
};

export const getExplanation = (concept: string, level: string) => {
    const systemInstruction = `Eres un educador experto que se destaca en hacer que los temas complejos sean simples. Explica el concepto dado, ajustando la complejidad, profundidad y ejemplos al nivel de un estudiante de ${level}.
- Para 'Secundaria' o 'Bachillerato', usa analogías claras, ejemplos cotidianos y un lenguaje muy sencillo.
- Para 'Universidad' o 'Técnico/FP', proporciona una explicación más detallada, menciona conceptos relacionados y usa terminología técnica correcta, explicándola si es necesario.
- Para 'Postgrado', ofrece una explicación profunda, contextualizada dentro del campo de estudio y mencionando debates o áreas de investigación actuales si es relevante.`;
    const prompt = `Explica el concepto de "${concept}" para un estudiante de ${level}.`;
    return generateText(prompt, systemInstruction);
};

export const getCorrectedEssay = (essay: string, level: string) => {
    const systemInstruction = `Eres un asistente de redacción y corrector de estilo para un estudiante de ${level}. Tu tarea es revisar el texto proporcionado. Corrige errores de gramática, ortografía y puntuación. Además, sugiere mejoras de estilo, claridad y fluidez. Las sugerencias deben ser adecuadas para el nivel académico del estudiante; para un universitario, las sugerencias pueden ser más sofisticadas que para alguien de secundaria. NO cambies el significado o la voz original del estudiante. Estructura tu respuesta con (1) la versión corregida del texto y (2) una lista con viñetas de las sugerencias clave y por qué se hicieron.`;
    const prompt = `Por favor, corrige y mejora este ensayo para un estudiante de ${level}:\n\n${essay}`;
    return generateText(prompt, systemInstruction);
};

export const getTranslation = (text: string, fromLang: string, toLang: string, level: string) => {
    const systemInstruction = `Eres un traductor experto especializado en textos académicos. Tu tarea es traducir texto de ${fromLang} a ${toLang}. Es crucial mantener el contexto académico y los matices del original. Adapta la terminología y el estilo para que sean apropiados para un estudiante de ${level}. Por ejemplo, una traducción para un nivel de 'Universidad' puede usar términos más técnicos que una para 'Secundaria'.`;
    const prompt = `Traduce el siguiente texto, considerando que el lector es un estudiante de ${level}:\n\n${text}`;
    return generateText(prompt, systemInstruction);
};


export const generatePresentationSlides = async (topic: string, level: string, numPeople: number, paragraphSize: 'Corto' | 'Medio' | 'Largo'): Promise<Slide[] | null> => {
    const systemInstruction = `Eres un coordinador de proyectos académicos. Tu tarea es diseñar el contenido para una presentación para un grupo de estudiantes de ${level}. Divide el tema proporcionado de manera lógica y equitativa entre ${numPeople} expositores. La profundidad y complejidad del contenido deben ser adecuadas para el nivel académico especificado. Para cada diapositiva, asigna un expositor, crea un título claro, un párrafo de contenido con una longitud '${paragraphSize}', y una sugerencia visual concreta y descriptiva. NO generes imágenes, solo la estructura de texto.`;
    const prompt = `Genera el contenido de una presentación sobre '${topic}' para ${numPeople} expositores de nivel ${level}. El tamaño de los párrafos debe ser '${paragraphSize}'. Asegúrate de que cada expositor tenga una cantidad equilibrada de diapositivas y el contenido sea coherente y apropiado para el nivel.`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "El título de la diapositiva." },
                content: { type: Type.STRING, description: `El contenido principal de la diapositiva, con una longitud ${paragraphSize} y complejidad adecuada para el nivel ${level}.` },
                presenter: { type: Type.INTEGER, description: `El número del expositor asignado (de 1 a ${numPeople}).` },
                visualSuggestion: { type: Type.STRING, description: "Una sugerencia de imagen que el estudiante puede usar para buscar o crear su propio visual." }
            },
            required: ["title", "content", "presenter", "visualSuggestion"]
        }
    };

    const slidesData = await generateJson<Slide[]>(prompt, systemInstruction, schema);
    
    return slidesData;
};


export const generateQuiz = (topic: string, level: string, numQuestions: number): Promise<QuizQuestion[] | null> => {
    const systemInstruction = `Eres un experto creador de cuestionarios. Tu tarea es generar un cuestionario de opción múltiple. La dificultad de las preguntas, el vocabulario utilizado y la sutileza de los distractores (opciones incorrectas) deben estar calibrados para un estudiante de ${level}.`;
    const prompt = `Genera un cuestionario de ${numQuestions} preguntas de opción múltiple sobre: "${topic}". El nivel de dificultad debe ser para un estudiante de ${level}. Asegúrate de que las preguntas sean relevantes y las opciones, plausibles pero con una sola correcta.`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING },
                options: {
                    type: Type.OBJECT,
                    properties: {
                        A: { type: Type.STRING },
                        B: { type: Type.STRING },
                        C: { type: Type.STRING },
                        D: { type: Type.STRING },
                    },
                    required: ["A", "B", "C", "D"]
                },
                correctAnswer: { type: Type.STRING, enum: ["A", "B", "C", "D"] }
            },
            required: ["question", "options", "correctAnswer"]
        }
    };
    return generateJson<QuizQuestion[]>(prompt, systemInstruction, schema);
};

export const generateProjectPlan = (topic: string, level: string): Promise<ProjectPlan | null> => {
    const systemInstruction = `Eres un asesor de investigación para un estudiante de ${level}. Tu tarea es ayudar a estructurar un proyecto de investigación. La complejidad del plan (objetivos, justificación, esquema) debe corresponder al nivel académico. Un plan para 'Universidad (Postgrado)' debe ser mucho más detallado y riguroso que uno para 'Bachillerato'.`;
    const prompt = `Crea un plan de proyecto detallado para un tema de investigación sobre: "${topic}". El plan debe ser apropiado para un estudiante de ${level}.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "Un título académico adecuado para el proyecto." },
            mainObjective: { type: Type.STRING, description: "El único objetivo principal de la investigación." },
            specificObjectives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Una lista de 3-4 objetivos específicos y medibles." },
            hypothesis: { type: Type.STRING, description: "Una hipótesis clara y comprobable o pregunta de investigación, formulada para el nivel apropiado." },
            justification: { type: Type.STRING, description: "Un párrafo explicando la importancia y relevancia de esta investigación, con una profundidad acorde al nivel." },
            chapterOutline: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        chapter: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING, description: `Descripción del contenido del capítulo, con detalle apropiado para ${level}.` }
                    },
                    required: ["chapter", "title", "description"]
                },
                description: "Un esquema lógico de capítulos o secciones."
            },
            methodology: { type: Type.STRING, description: `Una breve sugerencia para la metodología de investigación (p. ej., revisión de literatura, encuesta, experimento), apropiada para el alcance de un proyecto de nivel ${level}.` }
        },
        required: ["title", "mainObjective", "specificObjectives", "hypothesis", "justification", "chapterOutline", "methodology"]
    };
    return generateJson<ProjectPlan>(prompt, systemInstruction, schema);
};

export const getScientificCalculation = (expression: string, level: string): Promise<ScientificCalculation | null> => {
    const systemInstruction = `Eres un tutor de matemáticas y ciencias experto. Tu tarea es resolver la operación matemática o científica proporcionada y, lo más importante, explicar el proceso paso a paso. La explicación debe ser sumamente clara y adaptada para un estudiante de ${level}. Para niveles más bajos, desglosa cada paso. Para niveles universitarios, puedes asumir conocimientos previos de conceptos básicos, pero aun así debes mostrar el trabajo y explicar los pasos crucialiales. Formatea tu explicación usando markdown para mayor claridad.`;
    const prompt = `Resuelve y explica la siguiente operación para un estudiante de ${level}: "${expression}"`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            result: { type: Type.STRING, description: "El resultado numérico o simbólico final de la operación." },
            explanation: { type: Type.STRING, description: "Una explicación detallada y paso a paso de cómo se llegó al resultado, con la complejidad y profundidad adecuadas para el nivel del estudiante. Usa markdown para formatear." }
        },
        required: ["result", "explanation"]
    };
    return generateJson<ScientificCalculation>(prompt, systemInstruction, schema);
};

export const getSpacedRepetitionSchedule = (topic: string, level: string): Promise<SpacedRepetitionSuggestion[] | null> => {
    const today = new Date().toISOString().split('T')[0];
    const systemInstruction = `Eres un experto en ciencias del aprendizaje. Basado en el tema proporcionado, genera un calendario de 3 recordatorios de revisión para maximizar la retención (por ejemplo, a 1 día, 7 días, 30 días desde hoy). Las fechas deben calcularse a partir de hoy, ${today}. La nota de cada recordatorio debe ser una pregunta o tarea breve que motive al estudiante a repasar activamente. Adapta el lenguaje de la nota para un estudiante de ${level}.`;
    const prompt = `El estudiante de ${level} acaba de estudiar: "${topic}". Crea un calendario de revisión espaciada.`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                note: { type: Type.STRING, description: "La nota de recordatorio, formulada como una pregunta o tarea de repaso rápido." },
                reviewDate: { type: Type.STRING, description: `La fecha de revisión calculada en formato AAAA-MM-DD. Hoy es ${today}.` }
            },
            required: ["note", "reviewDate"]
        }
    };
    return generateJson<SpacedRepetitionSuggestion[]>(prompt, systemInstruction, schema);
};

export const checkPlagiarismAndSuggestImprovements = (text: string, level: string): Promise<PlagiarismResult | null> => {
    const systemInstruction = `Eres una herramienta avanzada de integridad académica. Tu tarea tiene dos partes para un texto escrito por un estudiante de ${level}:
1.  **Análisis de Originalidad**: Analiza el texto y estima un "porcentaje de originalidad" de 0 a 100. Sé estricto, considerando frases y estructuras comunes. No busques en la web, basa tu análisis en patrones de escritura.
2.  **Asistente de Redacción**: Proporciona sugerencias constructivas para mejorar el texto. La sofisticación de tus sugerencias debe ser apropiada para el ${level} del estudiante. Concéntrate en la claridad, estilo, estructura y fuerza argumentativa. Para cada sugerencia, identifica el texto original, propón una mejora y explica por qué es mejor.

Proporciona la respuesta en el formato JSON estructurado.`;

    const prompt = `Analiza el siguiente texto de un estudiante de ${level} para verificar su originalidad y proporciona sugerencias de redacción:\n\n---\n\n${text}`;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            originalityScore: { type: Type.INTEGER, description: "Un puntaje de 0 a 100 que representa el porcentaje de originalidad estimado del texto." },
            summary: { type: Type.STRING, description: "Un breve resumen general de los hallazgos, destacando puntos fuertes y áreas de mejora." },
            suggestions: {
                type: Type.ARRAY,
                description: "Una lista de sugerencias de mejora específicas.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        originalText: { type: Type.STRING, description: "El fragmento de texto original que se sugiere cambiar." },
                        suggestion: { type: Type.STRING, description: "La versión reescrita o mejorada del fragmento." },
                        explanation: { type: Type.STRING, description: "Una explicación concisa de por qué la sugerencia mejora el texto (p.ej., 'Mejora la claridad', 'Usa una voz más activa')." }
                    },
                    required: ["originalText", "suggestion", "explanation"]
                }
            }
        },
        required: ["originalityScore", "summary", "suggestions"]
    };

    return generateJson<PlagiarismResult>(prompt, systemInstruction, schema);
};

export const getReferenceRecommendations = (topic: string, level: string): Promise<ReferenceItem[] | null> => {
    const systemInstruction = `Eres un bibliotecario académico experto. Tu tarea es encontrar y recomendar fuentes académicas relevantes (libros, artículos revisados por pares, etc.) para el tema de investigación de un estudiante de ${level}. Para cada fuente, proporciona el título, autor(es), año de publicación, fuente (revista o editorial), un breve resumen de su relevancia y una URL válida si es posible. Prioriza fuentes accesibles y fundamentales para el nivel del estudiante.`;
    
    const prompt = `Encuentra entre 5 y 7 referencias académicas clave sobre el tema: "${topic}" para un estudiante de ${level}.`;
    
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING, description: "Autor o autores principales." },
                year: { type: Type.INTEGER },
                source: { type: Type.STRING, description: "Nombre de la revista, editorial o conferencia." },
                summary: { type: Type.STRING, description: "Un resumen conciso de por qué esta fuente es relevante para el tema." },
                url: { type: Type.STRING, description: "Un enlace directo al artículo o a una página donde se pueda encontrar (opcional)." }
            },
            required: ["title", "author", "year", "source", "summary"]
        }
    };

    return generateJson<ReferenceItem[]>(prompt, systemInstruction, schema);
};

export const generateInfographicTimeline = (topic: string, type: 'infographic' | 'timeline', level: string): Promise<InfographicTimelineResult | null> => {
    const systemInstruction = `Eres un diseñador de información visual. Tu objetivo es crear la estructura de datos para un visual educativo. La cantidad de detalles, la selección de eventos/secciones y el lenguaje utilizado deben ser apropiados para un estudiante de ${level}.
- Para 'línea de tiempo', completa 'timelineEvents' con eventos cronológicos clave.
- Para 'infografía', completa 'infographicSections' con secciones temáticas lógicas y un ícono relevante.
- Siempre proporciona un título global. Completa solo el array relevante para el tipo de visual solicitado.`;

    const prompt = `Tema: "${topic}". Tipo de visual: ${type}. Nivel del estudiante: ${level}.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "Un título global adecuado para el visual." },
            timelineEvents: {
                type: Type.ARRAY,
                description: "Un array de eventos de la línea de tiempo. Usar solo si se solicita una 'línea de tiempo'.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        date: { type: Type.STRING, description: "La fecha o período del evento (ej. '1945', 'c. 300 a.C.')." },
                        title: { type: Type.STRING, description: "El título del evento." },
                        description: { type: Type.STRING, description: "Una breve descripción del evento, con un lenguaje apropiado para el nivel." }
                    },
                    required: ["date", "title", "description"]
                }
            },
            infographicSections: {
                type: Type.ARRAY,
                description: "Un array de secciones de la infografía. Usar solo si se solicita una 'infografía'.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        icon: { type: Type.STRING, enum: ["brain", "book", "flask", "flag", "person", "gear", "lightbulb", "calendar", "atom", "code"], description: "Un nombre de ícono de la lista." },
                        title: { type: Type.STRING, description: "El título de la sección." },
                        content: { type: Type.STRING, description: "El contenido de la sección, con lenguaje y profundidad apropiados para el nivel." }
                    },
                    required: ["icon", "title", "content"]
                }
            }
        },
        required: ["title"]
    };

    return generateJson<InfographicTimelineResult>(prompt, systemInstruction, schema);
};

export const generateDiagramCode = async (request: string, level: string, diagramType: string, nodeStyle: string): Promise<string | null> => {
    const nodeShapeMap: Record<string, { start: string; end: string }> = {
        rect: { start: '[', end: ']' },
        round: { start: '(', end: ')' },
        circle: { start: '((', end: '))' },
        rhombus: { start: '{', end: '}' },
    };
    const shape = nodeShapeMap[nodeStyle] || nodeShapeMap.rect;

    let systemInstruction = '';
    
    if (diagramType === 'mindmap') {
        systemInstruction = `You are an expert in creating diagrams using Mermaid.js syntax. Your goal is to generate a JSON object containing the raw Mermaid.js code for a mind map.

**Core Instructions:**
1.  **Diagram Type**: Create a 'mindmap' diagram. The code MUST start with \`mindmap\`.
2.  **Node Definition**:
    -   You MUST define every node with a unique ID followed by its shape and text. The format is \`id${shape.start}Node Text${shape.end}\`.
    -   The ID must be a single word (e.g., \`root\`, \`item1\`, \`subItemA\`).
    -   The user has selected the '${nodeStyle}' style, so the shape is \`${shape.start} ... ${shape.end}\`.
3.  **Structure**:
    -   Use only indentation (spaces) to define the hierarchy. The root node has zero indentation. Child nodes are indented relative to their parent.
    -   Each node definition MUST be on its own new line.
4.  **Content**:
    -   The text inside nodes can be detailed. For line breaks inside a node's text, you MUST use the \`<br/>\` HTML tag.
    -   Adjust content complexity for a student of level: ${level}.
5.  **Valid Output**:
    -   The 'diagramCode' field in the JSON MUST contain valid, renderable Mermaid.js \`mindmap\` code.
    -   Do not include any text, explanations, or markdown fences.

**Example of Valid Code for '${nodeStyle}' style:**
\`\`\`
mindmap
  root${shape.start}Países más grandes${shape.end}
    russia${shape.start}Rusia<br/>Superficie: 17.1M km²${shape.end}
      russia_fact${shape.start}Dato: Abarca 11 zonas horarias${shape.end}
    canada${shape.start}Canadá<br/>Superficie: 9.98M km²${shape.end}
    china${shape.start}China<br/>Superficie: 9.6M km²${shape.end}
\`\`\`
`;
    } else { // For 'graph TD' and 'graph LR' (flowcharts)
        systemInstruction = `You are an expert in creating diagrams using Mermaid.js syntax. Your goal is to generate a JSON object containing the raw Mermaid.js code for a flowchart.

**Core Instructions:**
1.  **Diagram Type**: Create a '${diagramType}' diagram. The code MUST start with \`${diagramType}\`.
2.  **Node Definition**:
    -   Define nodes using the format: \`id${shape.start}"Node Text"${shape.end}\`.
    -   The \`id\` must be a unique, simple alphanumeric identifier (e.g., \`node1\`, \`dataInput\`).
    -   **Crucial**: The node text MUST be enclosed in double quotes. Example: \`A["Text here"]\`.
    -   **Crucial**: Each node definition MUST be on its own new line and end with a semicolon.
3.  **Linking**:
    -   Connect nodes on separate lines using \`-->\`. Example: \`A --> B;\`.
    -   Link definitions should also end with a semicolon.
    -   You can add text to links: \`A --"link text"--> B;\`.
4.  **Content**:
    -   For line breaks inside a node's text, you MUST use the \`<br/>\` HTML tag *inside the quotes*.
    -   Adjust content complexity for a student of level: ${level}.
5.  **Valid Output**:
    -   The 'diagramCode' field MUST contain valid, renderable Mermaid.js flowchart code.
    -   Do not include any text, explanations, or markdown fences.

**Example of Valid Code for '${diagramType}' and '${nodeStyle}' style:**
\`\`\`
${diagramType}
    A${shape.start}"Start Node<br/>Contains details."${shape.end};
    B${nodeShapeMap.rhombus.start}"Decision Point"${nodeShapeMap.rhombus.end};
    C${shape.start}"End Node"${shape.end};
    A --> B;
    B --"Yes"--> C;
    B --"No"--> A;
\`\`\`
`;
    }
    
    const prompt = `User request: "${request}"`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            diagramCode: {
                type: Type.STRING,
                description: `The complete, valid, raw Mermaid.js code based on the strict rules provided. It must start with '${diagramType}' and contain no markdown fences or comments. Use <br/> for line breaks inside nodes.`
            }
        },
        required: ["diagramCode"]
    };
    
    const result = await generateJson<{ diagramCode: string }>(prompt, systemInstruction, schema);
    return result ? result.diagramCode : null;
};

export const generateMapImage = async (
    userPrompt: string, 
    mapStyle: string, 
    colorPalette: string
): Promise<string | null> => {
    
    const detailedPrompt = `Genera un mapa basado en la siguiente descripción: "${userPrompt}".
    
    Características visuales requeridas:
    - Estilo del mapa: ${mapStyle}.
    - Paleta de colores: ${colorPalette}.
    
    Asegúrate de que el mapa sea claro, preciso, legible y estéticamente agradable. Incluye elementos como leyendas, capitales, fronteras o etiquetas si son relevantes para la solicitud. El resultado debe ser una imagen de alta calidad, como si fuera de un atlas moderno o una infografía.`;
    
    try {
        const response = await ai.models.generateImages({
            model: imageModel,
            prompt: detailedPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        return null;
    } catch (error) {
        console.error("Error generating map image:", error);
        return null;
    }
};

export const generateCountryReport = async (countryName: string, level: string): Promise<CountryExplorerResult | null> => {

    const systemInstruction = `Eres un geógrafo, historiador y analista cultural experto. Tu tarea es proporcionar información detallada, precisa y concisa sobre un país para un estudiante de nivel '${level}'. La información debe ser objetiva y estar bien estructurada. La complejidad del lenguaje y la profundidad de los datos deben ser apropiadas para el nivel académico del estudiante.`;
    
    const textPrompt = `Genera un informe detallado sobre ${countryName}.`;
    
    const textSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "Un resumen conciso y atractivo de 2-3 frases sobre el país." },
            flagEmoji: { type: Type.STRING, description: "El emoji de la bandera del país (por ejemplo, '🇪🇸')." },
            capital: { type: Type.STRING },
            population: { type: Type.STRING, description: "Población aproximada con la fuente del año (ej. '47.5 millones (est. 2023)')." },
            continent: { type: Type.STRING },
            history: { type: Type.STRING, description: "Un resumen de la historia del país, destacando 3-4 eventos clave. Entre 100 y 150 palabras." },
            geography: {
                type: Type.OBJECT,
                properties: {
                    location: { type: Type.STRING, description: "Descripción de su ubicación y países vecinos." },
                    climate: { type: Type.STRING, description: "Descripción general del clima." },
                    mainFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 3-4 características geográficas notables (ríos, montañas, etc.)." }
                },
                 required: ["location", "climate", "mainFeatures"]
            },
            culture: {
                type: Type.OBJECT,
                properties: {
                    languages: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Idiomas oficiales y principales." },
                    cuisine: { type: Type.STRING, description: "Descripción breve de la gastronomía típica, mencionando 1-2 platos." },
                    traditions: { type: Type.STRING, description: "Menciona una tradición o festival cultural importante." }
                },
                required: ["languages", "cuisine", "traditions"]
            },
            economy: {
                type: Type.OBJECT,
                properties: {
                    gdp: { type: Type.STRING, description: "PIB Nominal aproximado con el año (ej. '$1.4 billones (est. 2023)')." },
                    mainIndustries: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 3-4 industrias principales." },
                    currency: { type: Type.STRING, description: "Nombre de la moneda y su código (ej. 'Euro (EUR)')." }
                },
                required: ["gdp", "mainIndustries", "currency"]
            },
            politics: {
                type: Type.OBJECT,
                properties: {
                    governmentType: { type: Type.STRING, description: "Tipo de gobierno (ej. 'Monarquía parlamentaria')." },
                    headOfState: { type: Type.STRING, description: "Nombre y cargo del jefe de estado o de gobierno actual." }
                },
                required: ["governmentType", "headOfState"]
            }
        },
        required: ["summary", "flagEmoji", "capital", "population", "continent", "history", "geography", "culture", "economy", "politics"]
    };

    const mapPrompt = `Mapa político claro y moderno de ${countryName}, destacando sus fronteras, capital y principales ciudades. Estilo atlas. Sin texto adicional fuera del mapa.`;
    const representativeImagePrompt = `Fotografía hermosa y representativa de la cultura o paisaje de ${countryName}. Estilo National Geographic, alta calidad, icónica.`;

    try {
        const [textResponse, mapResponse, representativeImageResponse] = await Promise.all([
            generateJson<CountryInfo>(textPrompt, systemInstruction, textSchema),
            ai.models.generateImages({
                model: imageModel,
                prompt: mapPrompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '4:3' }
            }),
            ai.models.generateImages({
                model: imageModel,
                prompt: representativeImagePrompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '16:9' }
            })
        ]);

        if (!textResponse || !mapResponse.generatedImages?.[0] || !representativeImageResponse.generatedImages?.[0]) {
            console.error("Failed to get all required data from API", { textResponse, mapResponse, representativeImageResponse });
            return null;
        }

        const result: CountryExplorerResult = {
            info: textResponse,
            mapImage: mapResponse.generatedImages[0].image.imageBytes,
            representativeImage: representativeImageResponse.generatedImages[0].image.imageBytes,
        };
        
        return result;

    } catch (error) {
        console.error("Error generating country report:", error);
        return null;
    }
}

export const getAnswerFromPDF = async (pdfText: string, question: string, level: string): Promise<string> => {
    const systemInstruction = `Eres un asistente experto en analizar documentos. Tu tarea es responder preguntas basadas EXCLUSIVAMENTE en el contenido del documento de texto proporcionado. Si la respuesta no se encuentra en el texto, indica claramente que la información no está disponible en el documento. No inventes información. Adapta la claridad y simplicidad de tu respuesta al nivel académico del estudiante: ${level}.`;
    
    const prompt = `--- INICIO DEL DOCUMENTO ---\n\n${pdfText}\n\n--- FIN DEL DOCUMENTO ---\n\nBasado en el documento anterior, responde a la siguiente pregunta: "${question}"`;
    return generateText(prompt, systemInstruction);
};


// --- Chat Service ---
let chatInstance: Chat | null = null;

export const getChatInstance = (level: string, history: { role: 'user' | 'model'; parts: { text: string; }[] }[]) => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: textModel,
            config: {
                systemInstruction: `Eres un asistente de IA amigable y servicial llamado Lumen. Estás conversando con un estudiante de ${level}. Adapta la complejidad de tus respuestas a su nivel académico. Sé conciso y claro.`,
            },
            history: history,
        });
    }
    return chatInstance;
};

export const resetChat = () => {
    chatInstance = null;
};
