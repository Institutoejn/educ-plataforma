import React, { useState } from 'react';
import { UserProfile, AgeGroup } from '../types';
import { Button } from './ui/Button';
import { User, ShieldCheck, Gamepad2, Check, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void; // Added onBack for cancelling
  parentData?: { name: string; email: string }; 
}

// Collections updated to "Adventurer" style to represent Superheroes
const AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Captain",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zack",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=SuperNova",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Easton",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Liliana"
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBack, parentData }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[2]); // Default to Captain
  const [consent, setConsent] = useState(false);

  const getAgeGroup = (age: number): AgeGroup => {
    if (age <= 8) return '6-8';
    if (age <= 11) return '9-11';
    return '12-14';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age && consent) {
      const numAge = Number(age);
      const group = getAgeGroup(numAge);
      
      onComplete({
        name,
        age: numAge,
        ageGroup: group,
        avatar: selectedAvatar,
        xp: 0,
        level: 1,
        badges: [],
        consentGiven: true,
        parentEmail: parentData?.email || 'parent@example.com', // Use passed parent email
        parentName: parentData?.name || 'Responsável',
        learningStats: {},
        accessibility: {
            highContrast: false,
            dyslexiaFont: false,
            soundEnabled: true
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-indigo-50 relative">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 transform transition-all relative">
        <button 
           onClick={onBack}
           className="absolute top-6 left-6 text-gray-400 hover:text-indigo-600 transition-colors"
           title="Voltar"
        >
           <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-educ-primary text-white mb-4">
            <Gamepad2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
             {parentData ? 'Cadastro do Estudante' : 'EDUC - Iniciar'}
          </h1>
          <p className="text-gray-500">
            {parentData 
              ? `Olá, ${parentData.name}. Agora crie o perfil do seu Super-Herói.` 
              : 'Sua jornada em Omnia começa aqui!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Herói (Aluno)</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-educ-primary focus:border-educ-primary"
                placeholder="Nome ou apelido da criança"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Escolha seu Super-Herói</label>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {AVATARS.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`
                    relative rounded-full p-1 border-4 transition-all duration-200 transform hover:scale-105
                    ${selectedAvatar === url ? 'border-educ-primary scale-105 shadow-md' : 'border-transparent hover:border-gray-200'}
                  `}
                >
                  <img 
                    src={url} 
                    alt={`Hero option ${index + 1}`} 
                    className="w-full h-full rounded-full bg-indigo-50"
                  />
                  {selectedAvatar === url && (
                    <div className="absolute -bottom-1 -right-1 bg-educ-primary text-white rounded-full p-1 border-2 border-white">
                      <Check size={12} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
            <input
              type="number"
              required
              min="6"
              max="14"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-educ-primary focus:border-educ-primary"
              placeholder="Idade (6-14)"
            />
            {age !== '' && (
                <p className="text-sm mt-2 text-indigo-600 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    Nível detectado: <span className="font-bold">{getAgeGroup(Number(age))} anos</span>
                </p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 text-educ-primary focus:ring-educ-primary border-gray-300 rounded"
              />
              <label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer select-none">
                <span className="font-semibold block text-gray-800 mb-1">Termo de Consentimento</span>
                Como responsável, concordo com a coleta de dados para fins pedagógicos e de gamificação (LGPD).
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full justify-center" 
            disabled={!consent}
            ageGroup={age ? getAgeGroup(Number(age)) : '9-11'}
          >
            Finalizar Cadastro & Começar
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
          <ShieldCheck size={14} />
          <span>Ambiente Seguro & Monitorado</span>
        </div>
      </div>
    </div>
  );
};