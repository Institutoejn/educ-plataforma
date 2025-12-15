import { AgeGroup, Subject } from '../types';

export interface Mission {
  id: string;
  name: string;
  subject: Subject;
  ageGroup: AgeGroup;
  topic: string; // Used for Gemini prompt
  mechanicDescription: string; // Used for Gemini context
  goal: string;
}

export const MISSION_BANK: Mission[] = [
  // --- PORTUGUESE ---
  {
    id: 'pt-6-8-1',
    name: 'O Consertador de Pontes',
    subject: Subject.PORTUGUESE,
    ageGroup: '6-8',
    topic: 'Consciência Fonológica e Sílabas',
    mechanicDescription: 'O aluno deve identificar sílabas que faltam para formar uma palavra.',
    goal: 'Alfabetização'
  },
  {
    id: 'pt-6-8-2',
    name: 'Caça-Rimas da Floresta',
    subject: Subject.PORTUGUESE,
    ageGroup: '6-8',
    topic: 'Rimas e Sons',
    mechanicDescription: 'O aluno deve escolher a palavra que rima com a imagem apresentada.',
    goal: 'Consciência Fonológica'
  },
  {
    id: 'pt-9-11-1',
    name: 'Decifrando o Pergaminho',
    subject: Subject.PORTUGUESE,
    ageGroup: '9-11',
    topic: 'Interpretação de Texto e Lendas',
    mechanicDescription: 'Apresente um trecho curto de uma lenda brasileira e peça uma inferência.',
    goal: 'Interpretação'
  },
  {
    id: 'pt-12-14-1',
    name: 'Detector de Fake News',
    subject: Subject.PORTUGUESE,
    ageGroup: '12-14',
    topic: 'Leitura Crítica e Checagem de Fatos',
    mechanicDescription: 'Apresente uma manchete sensacionalista e peça para identificar o erro ou exagero.',
    goal: 'Letramento Midiático'
  },

  // --- MATH ---
  {
    id: 'mat-6-8-1',
    name: 'Contando Baterias',
    subject: Subject.MATH,
    ageGroup: '6-8',
    topic: 'Contagem e Números Cardinais',
    mechanicDescription: 'Peça para contar objetos simples em uma cena descrita.',
    goal: 'Numeracia'
  },
  {
    id: 'mat-9-11-1',
    name: 'A Pizza Fracionada',
    subject: Subject.MATH,
    ageGroup: '9-11',
    topic: 'Frações Visuais',
    mechanicDescription: 'Contexto de dividir suprimentos (pizza/comida) entre tripulantes usando frações.',
    goal: 'Números Racionais'
  },
  {
    id: 'mat-12-14-1',
    name: 'Equilibrando a Equação',
    subject: Subject.MATH,
    ageGroup: '12-14',
    topic: 'Equações de Primeiro Grau',
    mechanicDescription: 'Apresente uma balança desequilibrada onde é preciso achar o valor de X.',
    goal: 'Álgebra'
  },

  // --- GENERAL KNOWLEDGE ---
  {
    id: 'gk-6-8-1',
    name: 'Herói da Reciclagem',
    subject: Subject.GENERAL_KNOWLEDGE,
    ageGroup: '6-8',
    topic: 'Meio Ambiente e Coleta Seletiva',
    mechanicDescription: 'Identificar em qual cor de lixeira vai determinado objeto.',
    goal: 'Ciências Naturais'
  },
  {
    id: 'gk-9-11-1',
    name: 'Sistema Solar',
    subject: Subject.GENERAL_KNOWLEDGE,
    ageGroup: '9-11',
    topic: 'Astronomia e Planetas',
    mechanicDescription: 'Perguntas sobre características dos planetas do sistema solar.',
    goal: 'Ciências'
  },
  {
    id: 'gk-12-14-1',
    name: 'Crise Climática',
    subject: Subject.GENERAL_KNOWLEDGE,
    ageGroup: '12-14',
    topic: 'Aquecimento Global e Sustentabilidade',
    mechanicDescription: 'Analisar causas e efeitos de problemas ambientais modernos.',
    goal: 'Geografia/Biologia'
  },

  // --- ENTREPRENEURSHIP ---
  {
    id: 'ent-6-8-1',
    name: 'Quero ou Preciso?',
    subject: Subject.ENTREPRENEURSHIP,
    ageGroup: '6-8',
    topic: 'Educação Financeira Básica',
    mechanicDescription: 'Diferenciar itens de necessidade (comida) de desejo (brinquedo).',
    goal: 'Consumo Consciente'
  },
  {
    id: 'ent-9-11-1',
    name: 'Planejando a Viagem',
    subject: Subject.ENTREPRENEURSHIP,
    ageGroup: '9-11',
    topic: 'Orçamento Simples',
    mechanicDescription: 'Escolher itens para uma missão sem estourar o limite de moedas.',
    goal: 'Educação Financeira'
  },
  {
    id: 'ent-12-14-1',
    name: 'O Pitch Perfeito',
    subject: Subject.ENTREPRENEURSHIP,
    ageGroup: '12-14',
    topic: 'Marketing e Comunicação',
    mechanicDescription: 'Escolher a melhor frase de impacto para vender uma ideia.',
    goal: 'Empreendedorismo'
  }
];

export const getMission = (subject: Subject, ageGroup: AgeGroup): Mission => {
  const filtered = MISSION_BANK.filter(m => m.subject === subject && m.ageGroup === ageGroup);
  if (filtered.length === 0) {
    // Fallback generic mission if specific one not found
    return {
      id: 'generic',
      name: 'Desafio Rápido',
      subject,
      ageGroup,
      topic: 'Conceitos Gerais',
      mechanicDescription: 'Pergunta de múltipla escolha padrão.',
      goal: 'Revisão'
    };
  }
  return filtered[Math.floor(Math.random() * filtered.length)];
};