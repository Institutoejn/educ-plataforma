import React, { useState } from 'react';
import { UserProfile, LiteracyLevel, NumeracyLevel, AgeGroup, AssessmentReport } from '../types';
import { generateAssessmentReport } from '../services/pedagogicalService'; // Import Service
import { Button } from './ui/Button';
import { Brain, ArrowRight, Check, Sparkles, BookOpen, Calculator, Image as ImageIcon, ArrowLeft, LogOut } from 'lucide-react';

interface DiagnosticAssessmentProps {
  user: UserProfile;
  onComplete: (report: AssessmentReport) => void;
  onBack: () => void; // Added onBack for safe exit
}

interface DiagnosticQuestion {
  id: string;
  type: 'LITERACY' | 'NUMERACY';
  text: string;
  visual?: React.ReactNode; 
  options: string[];
  correctIndex: number;
  associatedLevel: LiteracyLevel | NumeracyLevel;
}

export const DiagnosticAssessment: React.FC<DiagnosticAssessmentProps> = ({ user, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isIntro, setIsIntro] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // --- QUESTION BANK ---
  const getQuestions = (age: AgeGroup): DiagnosticQuestion[] => {
    
    // --- FAIXA 6-8 ANOS (Foco Visual/Concreto) ---
    if (age === '6-8') {
      return [
        // LITERACY (6 Questions)
        { 
          id: 'l1', type: 'LITERACY', 
          visual: <span className="text-6xl">🦁</span>,
          text: 'Qual é a primeira letra do nome deste animal (LEÃO)?', 
          options: ['B', 'L', 'M', 'A'], 
          correctIndex: 1, associatedLevel: LiteracyLevel.PRE_SYLLABIC 
        },
        { 
          id: 'l2', type: 'LITERACY', 
          visual: <span className="text-6xl">🦶</span>,
          text: 'Quantos pedacinhos (sílabas) tem a palavra PÉ?', 
          options: ['1', '2', '3', '4'], 
          correctIndex: 0, associatedLevel: LiteracyLevel.SYLLABIC_NO_VALUE 
        },
        { 
          id: 'l3', type: 'LITERACY', 
          visual: <span className="text-6xl">🦆</span>,
          text: 'Qual palavra rima com PATO?', 
          options: ['Bola', 'Cama', 'Gato', 'Mesa'], 
          correctIndex: 2, associatedLevel: LiteracyLevel.SYLLABIC_WITH_VALUE 
        },
        { 
          id: 'l4', type: 'LITERACY', 
          visual: null, // Pure Text
          text: 'Qual destas palavras é uma FRUTA?', 
          options: ['Cadeira', 'Banana', 'Sapato', 'Pedra'], 
          correctIndex: 1, associatedLevel: LiteracyLevel.ALPHABETIC 
        },
        { 
          id: 'l5', type: 'LITERACY', 
          visual: <span className="text-6xl">🚲</span>,
          text: 'Complete a palavra: BI - CI - CLE - ...', 
          options: ['TA', 'PA', 'LA', 'RA'], 
          correctIndex: 0, associatedLevel: LiteracyLevel.ALPHABETIC 
        },
        { 
          id: 'l6', type: 'LITERACY', 
          visual: null,
          text: 'Leia a frase: "O CACHORRO LATIU". Quem latiu?', 
          options: ['O Gato', 'O Menino', 'O Pássaro', 'O Cachorro'], 
          correctIndex: 3, associatedLevel: LiteracyLevel.FLUENT_READER 
        },

        // NUMERACY (6 Questions)
        { 
          id: 'n1', type: 'NUMERACY', 
          visual: <div className="flex gap-2 text-4xl">🍎 🍎 🍎</div>,
          text: 'Quantas maçãs você vê na imagem?', 
          options: ['2', '3', '4', '5'], 
          correctIndex: 1, associatedLevel: NumeracyLevel.NUMBER_WRITING 
        },
        { 
          id: 'n2', type: 'NUMERACY', 
          visual: <span className="text-6xl text-blue-500">🔺</span>,
          text: 'Qual é o nome desta forma geométrica?', 
          options: ['Quadrado', 'Círculo', 'Triângulo', 'Retângulo'], 
          correctIndex: 2, associatedLevel: NumeracyLevel.LOGICAL_REASONING 
        },
        { 
          id: 'n3', type: 'NUMERACY', 
          visual: null,
          text: 'Qual número vem depois do 9?', 
          options: ['8', '11', '10', '12'], 
          correctIndex: 2, associatedLevel: NumeracyLevel.NUMBER_WRITING 
        },
        { 
          id: 'n4', type: 'NUMERACY', 
          visual: <div className="flex gap-4 text-4xl border-2 p-2 rounded-lg border-dashed border-gray-300">🐱 🐱 ➕ 🐱</div>,
          text: 'Quanto é 2 gatinhos mais 1 gatinho?', 
          options: ['2', '3', '4', '1'], 
          correctIndex: 1, associatedLevel: NumeracyLevel.PROBLEM_SOLVING 
        },
        { 
          id: 'n5', type: 'NUMERACY', 
          visual: null,
          text: 'João tem 5 balas e comeu 2. Com quantas ficou?', 
          options: ['2', '3', '5', '7'], 
          correctIndex: 1, associatedLevel: NumeracyLevel.PROBLEM_SOLVING 
        },
        { 
          id: 'n6', type: 'NUMERACY', 
          visual: <span className="text-6xl">🕗</span>,
          text: 'O relógio marca o tempo. Para que serve a régua?', 
          options: ['Ver horas', 'Medir tamanho', 'Pesar', 'Esquentar'], 
          correctIndex: 1, associatedLevel: NumeracyLevel.LOGICAL_REASONING 
        },
      ];
    } else {
      
      // --- FAIXA 9-14 ANOS (Mais abstrato/conceitual) ---
      return [
        // LITERACY
        { 
          id: 'l1', type: 'LITERACY', 
          visual: <span className="text-6xl">🛑</span>,
          text: 'O que esta placa indica que o motorista deve fazer?', 
          options: ['Acelerar', 'Parar', 'Virar', 'Estacionar'], 
          correctIndex: 1, associatedLevel: LiteracyLevel.PRE_SYLLABIC 
        },
        { 
          id: 'l2', type: 'LITERACY', 
          visual: null,
          text: 'Qual destas palavras está escrita corretamente?', 
          options: ['Caza', 'Kasa', 'Casa', 'Cilada'], 
          correctIndex: 2, associatedLevel: LiteracyLevel.SYLLABIC_WITH_VALUE 
        },
        { 
          id: 'l3', type: 'LITERACY', 
          visual: <span className="text-6xl">😂</span>,
          text: 'A expressão "Chorar de rir" é uma:', 
          options: ['Mentira', 'Metáfora (Exagero)', 'Pergunta', 'Notícia'], 
          correctIndex: 1, associatedLevel: LiteracyLevel.ALPHABETIC 
        },
        { 
          id: 'l4', type: 'LITERACY', 
          visual: null,
          text: 'Complete: "Ontem nós ______ ao parque."', 
          options: ['fomos', 'iremos', 'vai', 'foi'], 
          correctIndex: 0, associatedLevel: LiteracyLevel.ALPHABETIC 
        },
        { 
          id: 'l5', type: 'LITERACY', 
          visual: <span className="text-6xl">🐜</span>,
          text: 'Qual o diminutivo de FORMIGA?', 
          options: ['Formigão', 'Formiguinha', 'Formigueiro', 'Formiga'], 
          correctIndex: 1, associatedLevel: LiteracyLevel.FLUENT_READER 
        },
        { 
          id: 'l6', type: 'LITERACY', 
          visual: null,
          text: 'Qual é a ideia principal do texto? "A água é essencial para a vida, devemos economizar."', 
          options: ['Falar sobre peixes', 'Importância da água', 'Cores do mar', 'Tipos de chuva'], 
          correctIndex: 1, associatedLevel: LiteracyLevel.FLUENT_READER 
        },

        // NUMERACY
        { 
          id: 'n1', type: 'NUMERACY', 
          visual: <span className="text-6xl">🍕</span>,
          text: 'Se comermos metade (1/2) de uma pizza de 8 fatias, quantas fatias comemos?', 
          options: ['2', '4', '6', '8'], 
          correctIndex: 1, associatedLevel: NumeracyLevel.NUMBER_WRITING 
        },
        { 
          id: 'n2', type: 'NUMERACY', 
          visual: null,
          text: 'Qual o resultado de 8 x 5?', 
          options: ['40', '35', '45', '13'], 
          correctIndex: 0, associatedLevel: NumeracyLevel.NUMBER_WRITING 
        },
        { 
          id: 'n3', type: 'NUMERACY', 
          visual: <div className="text-4xl font-mono tracking-widest">2, 4, 8, 16, ?</div>,
          text: 'Qual é o próximo número da sequência?', 
          options: ['20', '24', '32', '18'], 
          correctIndex: 2, associatedLevel: NumeracyLevel.LOGICAL_REASONING 
        },
        { 
          id: 'n4', type: 'NUMERACY', 
          visual: <span className="text-6xl text-green-600">💵</span>,
          text: 'Se você comprar um doce de R$ 2,00 e pagar com uma nota de R$ 5,00, qual é o troco?', 
          options: ['R$ 1,00', 'R$ 2,00', 'R$ 3,00', 'R$ 4,00'], 
          correctIndex: 2, associatedLevel: NumeracyLevel.PROBLEM_SOLVING 
        },
        { 
          id: 'n5', type: 'NUMERACY', 
          visual: null,
          text: 'Um ônibus sai às 10h e a viagem dura 30 minutos. Que horas ele chega?', 
          options: ['10:00', '10:15', '10:30', '11:00'], 
          correctIndex: 2, associatedLevel: NumeracyLevel.PROBLEM_SOLVING 
        },
        { 
          id: 'n6', type: 'NUMERACY', 
          visual: <span className="text-6xl">⚖️</span>,
          text: 'O que pesa mais: 1kg de algodão ou 1kg de chumbo?', 
          options: ['Algodão', 'Chumbo', 'Pessam igual', 'Não sei'], 
          correctIndex: 2, associatedLevel: NumeracyLevel.LOGICAL_REASONING 
        },
      ];
    }
  };

  const questions = getQuestions(user.ageGroup);

  const handleAnswer = (index: number) => {
    const isCorrect = index === questions[currentStep].correctIndex;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: boolean[]) => {
    // 1. Literacy Calculation
    const literacyQs = questions.filter(q => q.type === 'LITERACY');
    const literacyAnswers = finalAnswers.slice(0, literacyQs.length);
    const litScore = literacyAnswers.filter(a => a).length;
    
    let finalLiteracy = LiteracyLevel.PRE_SYLLABIC;
    const litRatio = litScore / literacyQs.length;
    
    if (litRatio > 0.8) finalLiteracy = LiteracyLevel.FLUENT_READER;
    else if (litRatio > 0.6) finalLiteracy = LiteracyLevel.ALPHABETIC;
    else if (litRatio > 0.4) finalLiteracy = LiteracyLevel.SYLLABIC_WITH_VALUE;
    else if (litRatio > 0.2) finalLiteracy = LiteracyLevel.SYLLABIC_NO_VALUE;

    // 2. Numeracy Calculation
    const numeracyQs = questions.filter(q => q.type === 'NUMERACY');
    const numAnswers = finalAnswers.slice(literacyQs.length);
    const numScore = numAnswers.filter(a => a).length;

    let finalNumeracy = NumeracyLevel.NUMBER_WRITING;
    const numRatio = numScore / numeracyQs.length;
    
    if (numRatio > 0.7) finalNumeracy = NumeracyLevel.LOGICAL_REASONING;
    else if (numRatio > 0.4) finalNumeracy = NumeracyLevel.PROBLEM_SOLVING;

    setIsFinished(true);
    
    // --- GENERATE FULL REPORT ---
    const report = generateAssessmentReport(finalLiteracy, finalNumeracy, user.ageGroup);

    setTimeout(() => {
        onComplete(report);
    }, 4000);
  };

  if (isIntro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fade-in relative">
        <button 
            onClick={onBack}
            className="absolute top-6 left-6 text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-bold"
        >
            <LogOut size={16} /> Sair
        </button>
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Brain size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
             {user.ageGroup === '6-8' ? 'Hora do Jogo!' : 'Calibragem de Sistema'}
          </h1>
          <p className="text-gray-600 mb-8">
            {user.ageGroup === '6-8' 
              ? `Oi ${user.name}! Vamos brincar de perguntas e respostas? Tem figuras e desafios legais!`
              : `Agente ${user.name}, precisamos mapear seu conhecimento atual. Responda com atenção.`
            }
          </p>
          <Button onClick={() => setIsIntro(false)} ageGroup={user.ageGroup} className="w-full">
            Começar Desafio <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
             Diagnóstico Completo!
          </h1>
          <p className="text-gray-500 mb-6">Criando seu Plano de Ação Personalizado (10 Semanas)...</p>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-green-500 animate-[width_2s_ease-out_forwards] w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-slate-50 relative">
      <button 
         onClick={onBack}
         className="absolute top-6 left-6 text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-bold bg-white p-2 rounded-lg shadow-sm"
      >
         <LogOut size={16} /> Sair
      </button>

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
           <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sondagem ({currentStep + 1}/{questions.length})</span>
           <span className="text-sm font-bold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border-b-8 border-slate-200">
            
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${question.type === 'LITERACY' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {question.type === 'LITERACY' ? <BookOpen size={24} /> : <Calculator size={24} />}
                </div>
                <span className="text-xs font-bold uppercase text-slate-400">
                    {question.type === 'LITERACY' ? 'Português' : 'Matemática'}
                </span>
            </div>

            {/* Visual Content Area (Flashcard Style) */}
            {question.visual && (
               <div className="flex justify-center items-center h-40 mb-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-fade-in">
                  {question.visual}
               </div>
            )}

            <h2 className={`font-bold text-gray-800 mb-8 leading-tight ${question.visual ? 'text-xl sm:text-2xl text-center' : 'text-2xl sm:text-3xl'}`}>
                {question.text}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="p-4 text-center sm:text-left border-2 border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-bold text-lg text-slate-700 active:scale-95 shadow-sm"
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};