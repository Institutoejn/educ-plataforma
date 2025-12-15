import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgeGroup, Subject, Question, Difficulty } from "../types";
import { Mission, getMission } from "../data/missionBank";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateQuestion = async (
  subject: Subject,
  ageGroup: AgeGroup,
  targetDifficulty: Difficulty // Now driven by Adaptive Service
): Promise<Question | null> => {
  
  // 1. Select a Mission from the Bank
  const mission: Mission = getMission(subject, ageGroup);

  if (!apiKey) {
    console.error("API Key missing");
    return mockQuestion(subject, ageGroup, mission, targetDifficulty);
  }

  // Define Persona based on Age Group
  const getPersona = (age: AgeGroup) => {
    switch(age) {
      case '6-8': 
        return `Você é TECO, um robô-coruja fofo. Fale com empolgação, use onomatopeias (Bip! Bop!) e trate a criança como "Amiguinho".`;
      case '9-11':
        return `Você é CAPITÃ AURA, uma exploradora. Trate o aluno como "Recruta". O tom é de aventura.`;
      case '12-14':
        return `Você é PRIME, uma IA avançada. Trate o aluno como "Agente". Tom "tech" e direto.`;
      default: return "";
    }
  };

  try {
    const persona = getPersona(ageGroup);

    const prompt = `
      CONTEXTO: ${persona}
      MISSÃO: "${mission.name}"
      MECÂNICA: ${mission.mechanicDescription}
      TÓPICO: ${mission.topic}
      
      DIFICULDADE ADAPTATIVA REQUERIDA: ${targetDifficulty.toUpperCase()}
      
      INSTRUÇÕES DE DIFICULDADE:
      - EASY: Conceito introdutório, opções óbvias, foco em reconhecimento.
      - MEDIUM: Aplicação do conceito, opções plausíveis, requer atenção.
      - HARD: Raciocínio multi-etapa, abstração ou "pegadinha" pedagógica.

      SUA TAREFA:
      Crie uma questão de múltipla escolha para um aluno de ${ageGroup} anos.
      
      IMPORTANTE - VISUAL:
      Retorne um campo "visualKeyword" com uma única palavra em inglês que represente o objeto principal ou tema da questão para ser usado como ícone. 
      Exemplos: 'apple', 'dog', 'car', 'tree', 'calculator', 'book', 'planet', 'money', 'robot', 'brain'.

      FORMATO JSON:
      {
        "text": "Enunciado narrativo",
        "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
        "correctIndex": 0,
        "explanation": "Feedback explicativo curto",
        "hint": "Uma dica curta que ajuda a pensar (scaffolding) sem dar a resposta direta.",
        "visualKeyword": "dog"
      }
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        text: { type: Type.STRING },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
        },
        correctIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING },
        hint: { type: Type.STRING },
        difficulty: { type: Type.STRING },
        visualKeyword: { type: Type.STRING, description: "One english noun representing the question context for icon generation" }
      },
      required: ["text", "options", "correctIndex", "explanation", "hint", "visualKeyword"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Lower temp for strict adherence to difficulty
      }
    });

    if (response.text) {
      const question = JSON.parse(response.text) as Question;
      question.id = crypto.randomUUID();
      question.topic = mission.topic; // Bind topic to question for tracking
      question.difficulty = targetDifficulty; // Enforce requested difficulty tag
      return question;
    }
    
    return mockQuestion(subject, ageGroup, mission, targetDifficulty);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return mockQuestion(subject, ageGroup, mission, targetDifficulty);
  }
};

const mockQuestion = (subject: Subject, ageGroup: AgeGroup, mission: Mission, difficulty: Difficulty): Question => {
  return {
    id: 'mock-1',
    text: `(Offline [${difficulty}]) ${mission.name}: Resolva o desafio de teste.`,
    options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
    correctIndex: 0,
    explanation: "Feedback padrão de modo offline.",
    hint: "Esta é uma dica de teste offline. Tente a opção 1.",
    difficulty: difficulty,
    topic: mission.topic,
    visualKeyword: 'book'
  };
};
