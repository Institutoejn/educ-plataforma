import React, { useState, useEffect } from 'react';
import { UserProfile, Subject, Question, TopicMetrics } from '../types';
import { generateQuestion } from '../services/geminiService';
import { getInitialTopicMetrics, calculateProgression } from '../services/adaptiveService';
import { Button } from './ui/Button';
import { 
  ArrowLeft, CheckCircle, XCircle, Loader2, RefreshCcw, TrendingUp, Volume2, Lightbulb, Square,
  // Educational Icons for Visual Mapping
  Apple, Dog, Cat, Car, Trees, Calculator, Book, Globe, Coins, Brain, 
  Rocket, Music, Palette, PenTool, Microscope, Zap, Heart, Star, CloudRain,
  Bus, GraduationCap, Clock, Map, Utensils, Feather
} from 'lucide-react';

interface ActivityScreenProps {
  user: UserProfile;
  subject: Subject;
  onBack: () => void;
  onComplete: (xpEarned: number, updatedStats: Record<string, TopicMetrics>) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ user, subject, onBack, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentTopicMetrics, setCurrentTopicMetrics] = useState<TopicMetrics | null>(null);
  
  // Audio State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speaking when unmounting
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, []);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = async () => {
    setLoading(true);
    setShowExplanation(false);
    setShowHint(false);
    setSelectedOption(null);
    setIsCorrect(null);
    
    // Stop any previous audio
    window.speechSynthesis.cancel(); 
    setIsSpeaking(false);
    
    const lastTopicKey = Object.keys(user.learningStats || {}).find(k => k.startsWith(subject));
    const targetDifficulty = lastTopicKey ? user.learningStats[lastTopicKey].currentDifficulty : 'medium';

    const q = await generateQuestion(subject, user.ageGroup, targetDifficulty);
    
    if (q) {
        setQuestion(q);
        const statKey = `${subject}-${q.topic}`;
        const stats = user.learningStats?.[statKey] || getInitialTopicMetrics(q.topic);
        setCurrentTopicMetrics(stats);
        
        // Auto-read for 6-8 years old if enabled
        if (user.ageGroup === '6-8' && user.accessibility?.soundEnabled) {
           setTimeout(() => toggleAudio(q.text, true), 500);
        }
    }
    setLoading(false);
  };

  const toggleAudio = (text: string, forceStart = false) => {
    if (!('speechSynthesis' in window)) return;

    // If already speaking and not forcing a new start, Stop it.
    if (isSpeaking && !forceStart) {
       window.speechSynthesis.cancel();
       setIsSpeaking(false);
       return;
    }

    // Start Speaking
    window.speechSynthesis.cancel(); // Safety clear
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0; 
    
    // Event Listeners to manage state
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleAnswer = (index: number) => {
    if (showExplanation || !question || !currentTopicMetrics) return;
    
    // Stop reading question if answering
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }
    
    setSelectedOption(index);
    const correct = index === question.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    const newMetrics = calculateProgression(currentTopicMetrics, correct, question.difficulty);
    setCurrentTopicMetrics(newMetrics);

    // Calculate XP based on Difficulty and Correctness
    let xp = 0;
    if (correct) {
        switch (question.difficulty) {
            case 'hard': xp = 35; break;
            case 'medium': xp = 20; break;
            case 'easy': default: xp = 10; break;
        }
    } else {
        xp = 2; // Consolation
    }
    
    const statKey = `${subject}-${question.topic}`;
    const updatedStatsPayload = {
        ...user.learningStats,
        [statKey]: newMetrics
    };
    
    onComplete(xp, updatedStatsPayload);

    // Speak Feedback
    if (user.accessibility?.soundEnabled) {
        const feedbackText = correct ? "Correto! " + question.explanation : "Não foi dessa vez. " + question.explanation;
        toggleAudio(feedbackText, true);
    }
  };

  const getContainerStyle = () => {
    if (user.accessibility?.highContrast) return 'bg-black border-2 border-yellow-400 text-yellow-400';
    if (user.ageGroup === '12-14') return 'bg-slate-800 border border-slate-700 text-gray-200';
    return 'bg-white shadow-xl';
  };

  // --- VISUAL MAPPING HELPER ---
  const renderVisualIcon = (keyword?: string) => {
    const key = keyword?.toLowerCase().trim() || 'default';
    const props = { size: 48, strokeWidth: 1.5 }; // Reduced default size for mobile
    
    // Default subject fallbacks if keyword fails
    const getFallback = () => {
        if (subject === Subject.MATH) return <Calculator {...props} className="text-blue-500" />;
        if (subject === Subject.PORTUGUESE) return <Feather {...props} className="text-red-500" />;
        if (subject === Subject.GENERAL_KNOWLEDGE) return <Globe {...props} className="text-green-500" />;
        return <Star {...props} className="text-yellow-500" />;
    };

    const iconMap: Record<string, React.ReactNode> = {
        'apple': <Apple {...props} className="text-red-500" />,
        'dog': <Dog {...props} className="text-amber-700" />,
        'cat': <Cat {...props} className="text-orange-500" />,
        'car': <Car {...props} className="text-blue-600" />,
        'tree': <Trees {...props} className="text-green-600" />,
        'calculator': <Calculator {...props} className="text-slate-600" />,
        'book': <Book {...props} className="text-indigo-600" />,
        'planet': <Globe {...props} className="text-blue-400" />,
        'money': <Coins {...props} className="text-yellow-500" />,
        'brain': <Brain {...props} className="text-pink-500" />,
        'rocket': <Rocket {...props} className="text-red-600" />,
        'music': <Music {...props} className="text-purple-500" />,
        'art': <Palette {...props} className="text-pink-600" />,
        'pencil': <PenTool {...props} className="text-yellow-600" />,
        'science': <Microscope {...props} className="text-cyan-600" />,
        'energy': <Zap {...props} className="text-yellow-400" />,
        'heart': <Heart {...props} className="text-red-500" />,
        'cloud': <CloudRain {...props} className="text-blue-300" />,
        'bus': <Bus {...props} className="text-yellow-500" />,
        'school': <GraduationCap {...props} className="text-slate-700" />,
        'time': <Clock {...props} className="text-slate-600" />,
        'map': <Map {...props} className="text-green-700" />,
        'food': <Utensils {...props} className="text-orange-500" />
    };

    // Try to find exact match, or partial match (e.g. 'green apple' -> 'apple')
    const matchedKey = Object.keys(iconMap).find(k => key.includes(k));
    
    return matchedKey ? iconMap[matchedKey] : getFallback();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <Loader2 className={`animate-spin mb-4 ${user.ageGroup === '12-14' ? 'text-teen-accent' : 'text-educ-primary'}`} size={48} />
        <h3 className={`text-xl font-bold ${user.ageGroup === '12-14' ? 'text-white' : 'text-gray-800'}`}>
          Preparando Missão...
        </h3>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-3xl pb-24">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <Button variant="secondary" onClick={onBack} ageGroup={user.ageGroup} className="!p-2 sm:!px-4">
          <ArrowLeft size={20} className="sm:mr-2" /> <span className="hidden sm:inline">Voltar</span>
        </Button>
        <div className="flex flex-col items-center">
             <span className={`text-sm sm:text-base font-bold uppercase tracking-wider text-center max-w-[150px] truncate ${user.ageGroup === '12-14' ? 'text-teen-accent' : 'text-educ-primary'}`}>
                {subject}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                <TrendingUp size={10} /> {question.difficulty.toUpperCase()}
            </span>
        </div>
        <div className="flex gap-2">
            <Button 
                variant="secondary" 
                onClick={() => {
                    const nextState = !showHint;
                    setShowHint(nextState);
                    if (user.accessibility?.soundEnabled && nextState) {
                        toggleAudio("Dica: " + question.hint, true);
                    } else if (!nextState && isSpeaking) {
                        window.speechSynthesis.cancel();
                        setIsSpeaking(false);
                    }
                }} 
                ageGroup={user.ageGroup} 
                className={`!p-2 sm:!px-3 sm:!py-2 ${showHint ? 'bg-yellow-100 !border-yellow-400 !text-yellow-700' : ''}`}
                title="Dica"
            >
                <Lightbulb size={20} className={showHint ? "fill-yellow-500 text-yellow-600" : ""} />
            </Button>
            
            <Button 
                variant={isSpeaking ? 'primary' : 'secondary'} 
                onClick={() => toggleAudio(question.text)} 
                ageGroup={user.ageGroup} 
                className={`!p-2 sm:!px-3 sm:!py-2 transition-all ${isSpeaking ? 'animate-pulse ring-2 ring-offset-2 ring-indigo-300' : ''}`}
                title={isSpeaking ? "Parar Áudio" : "Ouvir Pergunta"}
            >
                {isSpeaking ? <Square fill="currentColor" size={20} /> : <Volume2 size={20} />}
            </Button>
        </div>
      </div>

      <div className={`${getContainerStyle()} p-4 sm:p-8 rounded-2xl relative overflow-hidden`}>
        {/* Difficulty Indicator */}
        <div className={`absolute top-0 left-0 w-1 sm:w-2 h-full 
          ${question.difficulty === 'easy' ? 'bg-green-400' : ''}
          ${question.difficulty === 'medium' ? 'bg-yellow-400' : ''}
          ${question.difficulty === 'hard' ? 'bg-red-500' : ''}
        `} />

        {/* --- VISUAL CONTEXT IMAGE/ICON --- */}
        <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in">
             <div className={`p-4 sm:p-6 rounded-full shadow-inner border-4 border-slate-50
                ${user.ageGroup === '12-14' ? 'bg-slate-700/50' : 'bg-slate-100'}
             `}>
                 {renderVisualIcon(question.visualKeyword)}
             </div>
        </div>

        <h2 className={`text-lg sm:text-2xl font-bold mb-4 leading-snug sm:leading-relaxed text-center`}>
          {question.text}
        </h2>
        
        {/* Hint Area */}
        {showHint && (
            <div className={`mb-6 p-4 rounded-xl border flex gap-3 animate-fade-in
                 ${user.accessibility?.highContrast 
                    ? 'border-yellow-400 bg-gray-900 text-yellow-200' 
                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                 }
            `}>
                <Lightbulb size={24} className="shrink-0 animate-pulse" />
                <div className="flex-1">
                    <p className="text-xs font-bold uppercase mb-1">Dica do Guia:</p>
                    <p className="italic text-sm sm:text-lg">{question.hint}</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-6 sm:mt-8">
          {question.options.map((option, index) => {
            let btnVariant: 'primary' | 'secondary' | 'outline' = 'outline';
            let customClass = '';
            
            if (showExplanation) {
              if (index === question.correctIndex) {
                  btnVariant = 'primary';
                  customClass = '!bg-green-600 !text-white !border-green-600';
              } else if (index === selectedOption && !isCorrect) {
                  btnVariant = 'secondary';
                  customClass = '!bg-red-500 !text-white !border-red-600 opacity-50';
              } else {
                  customClass = 'opacity-40';
              }
            } else if (user.accessibility?.highContrast) {
                customClass = 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black';
            }

            return (
              <Button
                key={index}
                variant={btnVariant}
                ageGroup={user.ageGroup}
                onClick={() => handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full justify-start text-left h-auto min-h-[50px] sm:min-h-[60px] whitespace-normal text-sm sm:text-base ${customClass}`}
              >
                <span className="opacity-60 mr-3 sm:mr-4 font-mono text-xs sm:text-sm">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl animate-bounce-gentle border-l-4
            ${isCorrect ? 'bg-green-50 border-green-500 text-green-900' : 'bg-orange-50 border-orange-500 text-orange-900'}
            ${user.accessibility?.highContrast ? '!bg-gray-900 !text-yellow-400 !border-white' : ''}
          `}>
            <div className="flex items-start gap-4">
              {isCorrect ? <CheckCircle className="shrink-0" size={28} /> : <XCircle className="shrink-0" size={28} />}
              <div className="flex-1">
                <h4 className="font-bold text-base sm:text-lg">{isCorrect ? 'Excelente!' : 'Não desista!'}</h4>
                <p className="mt-1 text-sm sm:text-base">{question.explanation}</p>
                <div className="mt-4">
                  <Button onClick={loadNewQuestion} ageGroup={user.ageGroup} icon={<RefreshCcw size={16} />} className="w-full sm:w-auto justify-center">
                    Próximo Desafio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};