import React from 'react';
import { UserProfile } from '../types';
import { Button } from './ui/Button';
import { ArrowLeft, Volume2, VolumeX, Eye, Type, Shield, LogOut } from 'lucide-react';

interface SettingsScreenProps {
  user: UserProfile;
  onBack: () => void;
  onToggleSound: () => void;
  onToggleHighContrast: () => void;
  onToggleDyslexiaFont: () => void;
  onOpenParentArea: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  onBack,
  onToggleSound,
  onToggleHighContrast,
  onToggleDyslexiaFont,
  onOpenParentArea,
  onLogout
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <Button variant="secondary" onClick={onBack} ageGroup={user.ageGroup}>
          <ArrowLeft size={20} className="mr-2" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <div className="w-10" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
        <div className="p-6 space-y-6">
          
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${user.accessibility?.soundEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                {user.accessibility?.soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-700 text-lg">Efeitos Sonoros</h3>
                <p className="text-sm text-slate-500">Sons de feedback e leitura de voz</p>
              </div>
            </div>
            <div 
               onClick={onToggleSound}
               className={`relative w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer ${user.accessibility?.soundEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
            >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${user.accessibility?.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${user.accessibility?.highContrast ? 'bg-yellow-400 text-black' : 'bg-yellow-100 text-yellow-600'}`}>
                <Eye size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-700 text-lg">Alto Contraste</h3>
                <p className="text-sm text-slate-500">Melhorar visibilidade das cores</p>
              </div>
            </div>
            <div 
               onClick={onToggleHighContrast}
               className={`relative w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer ${user.accessibility?.highContrast ? 'bg-yellow-400' : 'bg-slate-300'}`}
            >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${user.accessibility?.highContrast ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </div>

          {/* Dyslexia Font Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${user.accessibility?.dyslexiaFont ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                <Type size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-700 text-lg">Fonte Legível</h3>
                <p className="text-sm text-slate-500">Fonte otimizada para dislexia</p>
              </div>
            </div>
            <div 
               onClick={onToggleDyslexiaFont}
               className={`relative w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer ${user.accessibility?.dyslexiaFont ? 'bg-purple-600' : 'bg-slate-300'}`}
            >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${user.accessibility?.dyslexiaFont ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-3">
            <Button 
                variant="outline" 
                onClick={onOpenParentArea} 
                className="w-full justify-start py-4 border-slate-200 text-slate-600 hover:bg-slate-50" 
                ageGroup={user.ageGroup}
            >
                <Shield className="mr-3" size={20} /> Área dos Pais / Responsável
            </Button>
            
            <Button 
                variant="secondary" 
                onClick={onLogout} 
                className="w-full justify-start py-4 !text-red-600 !border-red-100 hover:!bg-red-50" 
                ageGroup={user.ageGroup}
            >
                <LogOut className="mr-3" size={20} /> Sair da Conta
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};