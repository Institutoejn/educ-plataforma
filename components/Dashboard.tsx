import React, { useState, useEffect } from 'react';
import { UserProfile, Subject } from '../types';
import { Button } from './ui/Button';
import { Feather, Calculator, Globe, Lightbulb, Trophy, Star, Map, Compass, ChevronRight, GraduationCap, FileText, Award, ClipboardList, Bell, MessageCircle, Settings, X, Sparkles, Zap } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onSelectSubject: (subject: Subject) => void;
  onOpenProfile: () => void; 
  onOpenReport: () => void;
  // New navigation props
  onOpenCertificates: () => void;
  onOpenTasks: () => void;
  onOpenNotifications: () => void;
  onOpenMessages: () => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onSelectSubject, 
  onOpenProfile, 
  onOpenReport,
  onOpenCertificates,
  onOpenTasks,
  onOpenNotifications,
  onOpenMessages,
  onOpenSettings
}) => {
  
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Check for Level Up Event
  useEffect(() => {
    const storedLevel = sessionStorage.getItem(`user_level_${user.id}`);
    
    if (storedLevel) {
      const prevLevel = parseInt(storedLevel);
      // If current level is higher than stored, trigger animation
      if (user.level > prevLevel) {
        setShowLevelUp(true);
        // Auto-hide after 5 seconds
        const timer = setTimeout(() => setShowLevelUp(false), 5000);
        return () => clearTimeout(timer);
      }
    }
    
    // Update storage
    sessionStorage.setItem(`user_level_${user.id}`, user.level.toString());
  }, [user.level, user.id]);

  // Narrative adaptation for Biome Names
  const getBiomeName = (id: Subject) => {
    switch(id) {
      case Subject.PORTUGUESE: return user.ageGroup === '6-8' ? 'Mundo das Histórias' : 'Biblioteca dos Ventos';
      case Subject.MATH: return user.ageGroup === '6-8' ? 'Parque dos Números' : 'Cidadela de Cristal';
      case Subject.GENERAL_KNOWLEDGE: return user.ageGroup === '6-8' ? 'Floresta Encantada' : 'Terravis (Ancestral)';
      case Subject.ENTREPRENEURSHIP: return user.ageGroup === '6-8' ? 'Lojinha do Teco' : 'Porto do Futuro';
      default: return id;
    }
  };

  const subjects = [
    { id: Subject.PORTUGUESE, icon: <Feather />, color: 'bg-red-500', label: getBiomeName(Subject.PORTUGUESE) },
    { id: Subject.MATH, icon: <Calculator />, color: 'bg-blue-500', label: getBiomeName(Subject.MATH) },
    { id: Subject.GENERAL_KNOWLEDGE, icon: <Globe />, color: 'bg-green-500', label: getBiomeName(Subject.GENERAL_KNOWLEDGE) },
    { id: Subject.ENTREPRENEURSHIP, icon: <Lightbulb />, color: 'bg-yellow-500', label: getBiomeName(Subject.ENTREPRENEURSHIP) },
  ];

  const getWelcomeMessage = () => {
    if (user.ageGroup === '6-8') return `Oi, ${user.name}!`;
    if (user.ageGroup === '9-11') return `Olá, ${user.name}!`;
    return `Agente ${user.name}`;
  };

  const getSubMessage = () => {
    if (user.ageGroup === '6-8') return 'Vamos colorir o mundo?';
    if (user.ageGroup === '9-11') return 'Pronto para a próxima expedição?';
    return 'Sistemas operacionais online.';
  };

  // Menu Items Config - Updated labels to plural where requested
  const menuItems = [
    { label: 'Certificados', icon: <Award size={20} />, action: onOpenCertificates, color: 'bg-amber-100 text-amber-700' },
    { label: 'XP e Medalhas', icon: <Trophy size={20} />, action: onOpenProfile, color: 'bg-purple-100 text-purple-700' },
    { label: 'Tarefas', icon: <ClipboardList size={20} />, action: onOpenTasks, color: 'bg-blue-100 text-blue-700' },
    { label: 'Notificações', icon: <Bell size={20} />, action: onOpenNotifications, color: 'bg-red-100 text-red-700' },
    { label: 'Mensagens', icon: <MessageCircle size={20} />, action: onOpenMessages, color: 'bg-green-100 text-green-700' },
    { label: 'Configurações', icon: <Settings size={20} />, action: onOpenSettings, color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 pb-24 relative">
      
      {/* LEVEL UP OVERLAY */}
      {showLevelUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowLevelUp(false)}>
           <div 
             className={`relative w-full max-w-sm p-8 rounded-3xl shadow-2xl text-center transform transition-all animate-bounce-gentle
                ${user.ageGroup === '12-14' ? 'bg-slate-900 border-2 border-cyan-400 shadow-cyan-500/50' : 'bg-white'}
                ${user.ageGroup === '6-8' ? 'border-4 border-yellow-400' : ''}
             `}
             onClick={(e) => e.stopPropagation()}
           >
              <button onClick={() => setShowLevelUp(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                 <X size={24} />
              </button>

              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg text-white text-3xl font-bold
                    ${user.ageGroup === '12-14' ? 'bg-cyan-600 ring-4 ring-cyan-900' : 'bg-yellow-400 ring-4 ring-white'}
                 `}>
                    {user.level}
                 </div>
              </div>

              <div className="mt-8 space-y-4">
                 <h2 className={`text-3xl font-extrabold uppercase tracking-wider
                    ${user.ageGroup === '12-14' ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500' : 'text-amber-500'}
                 `}>
                    Level Up!
                 </h2>
                 <p className={`font-medium ${user.ageGroup === '12-14' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {user.ageGroup === '6-8' ? 'Parabéns! Você cresceu!' : 'Sistema Atualizado! Novo nível alcançado.'}
                 </p>
                 
                 <div className={`py-3 px-6 rounded-xl flex items-center justify-center gap-3 mx-auto max-w-[200px]
                    ${user.ageGroup === '12-14' ? 'bg-slate-800' : 'bg-indigo-50'}
                 `}>
                    {user.ageGroup === '12-14' ? <Zap className="text-yellow-400" /> : <Sparkles className="text-yellow-500" />}
                    <span className={`font-bold text-lg ${user.ageGroup === '12-14' ? 'text-white' : 'text-indigo-700'}`}>
                       +XP Bonus
                    </span>
                 </div>

                 <Button onClick={() => setShowLevelUp(false)} ageGroup={user.ageGroup} className="w-full mt-4">
                    Continuar Jornada
                 </Button>
              </div>

              {/* Confetti Decoration (CSS only) */}
              <div className="absolute -top-4 -left-4 text-yellow-400 animate-spin-slow"><Star size={32} fill="currentColor" /></div>
              <div className="absolute top-1/2 -right-6 text-purple-400 animate-bounce"><Sparkles size={32} /></div>
              <div className="absolute -bottom-4 left-10 text-red-400 animate-pulse"><Zap size={32} fill="currentColor" /></div>
           </div>
        </div>
      )}

      {/* Header / HUD */}
      <div 
        className={`
          flex items-center justify-between mb-6 p-4 rounded-2xl relative overflow-hidden transition-all duration-300
          ${user.ageGroup === '12-14' ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-md'} 
        `}
      >
        
        {/* Decorative Background Element */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
           {user.ageGroup === '12-14' ? <Compass size={120} /> : <Map size={120} />}
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="relative">
             <img src={user.avatar} alt="Avatar" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 border-4 border-white shadow-sm object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`text-lg sm:text-xl font-bold leading-tight truncate ${user.ageGroup === '12-14' ? 'text-white' : 'text-gray-800'}`}>
              {getWelcomeMessage()}
            </h2>
            <p className={`text-xs sm:text-sm truncate ${user.ageGroup === '12-14' ? 'text-gray-400' : 'text-gray-500'}`}>
              {getSubMessage()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 z-10 pl-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] sm:text-xs uppercase font-bold text-gray-400">Energia (XP)</span>
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg sm:text-xl">
              <Star fill="currentColor" size={16} />
              {user.xp}
            </div>
          </div>
        </div>
      </div>

      {/* STUDENT NAVIGATION MENU (Responsive Grid) */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
           {menuItems.map((item, idx) => (
              <button
                 key={idx}
                 onClick={item.action}
                 className={`
                    flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl gap-2 transition-all active:scale-95 w-full shadow-sm border border-transparent hover:shadow-md
                    ${user.ageGroup === '12-14' 
                        ? 'bg-slate-700 text-gray-200 hover:bg-slate-600 border-slate-600' 
                        : 'bg-white text-gray-700 hover:border-gray-200'
                    }
                 `}
              >
                 <div className={`p-2.5 sm:p-2 rounded-full ${user.ageGroup === '12-14' ? 'bg-slate-900' : item.color}`}>
                    {item.icon}
                 </div>
                 <span className="text-xs sm:text-xs font-bold text-center leading-tight">{item.label}</span>
              </button>
           ))}
        </div>
      </div>

      {/* Plan of Study / Level Indicator */}
      {(user.literacyLevel || user.numeracyLevel) && (
          <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full shrink-0">
                      <GraduationCap size={20} />
                  </div>
                  <div>
                      <h4 className="font-bold text-indigo-900 text-sm uppercase">Plano de Estudos Ativo</h4>
                      <p className="text-xs text-indigo-700">
                          Nível: <span className="font-bold">{user.literacyLevel}</span>
                      </p>
                  </div>
              </div>
              <Button onClick={(e) => { e.stopPropagation(); onOpenReport(); }} variant="secondary" className="!text-xs !py-2 w-full sm:w-auto justify-center" ageGroup={user.ageGroup}>
                  <FileText size={16} className="mr-2" />
                  Ver Relatório
              </Button>
          </div>
      )}

      {/* Main Grid */}
      <div className="mb-6">
        <h3 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${user.ageGroup === '12-14' ? 'text-white' : 'text-gray-800'}`}>
          {user.ageGroup === '6-8' ? 'Escolha um Caminho:' : 'Mapa de Missões'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className={`
                relative overflow-hidden group transition-all duration-300
                ${user.ageGroup === '6-8' ? 'rounded-3xl border-b-8 border-gray-200 active:border-b-0 active:translate-y-2' : 'rounded-xl'}
                ${user.ageGroup === '12-14' ? 'bg-slate-800 border border-slate-700 hover:border-teen-accent hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white shadow-lg'}
                h-48 sm:h-56 flex flex-col items-center justify-center p-4 text-center w-full hover:scale-[1.02] sm:hover:scale-105
              `}
            >
              <div className={`
                w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 text-white
                ${sub.color} shadow-lg group-hover:scale-110 transition-transform duration-500
                ${user.ageGroup === '12-14' ? 'ring-2 ring-white/20' : ''}
              `}>
                {React.cloneElement(sub.icon as React.ReactElement<any>, { size: 32 })}
              </div>
              
              <span className={`text-base sm:text-lg font-bold leading-tight ${user.ageGroup === '12-14' ? 'text-gray-200 font-tech uppercase tracking-widest' : 'text-gray-800'}`}>
                {sub.label}
              </span>

              {/* Age specific decorative touches */}
              {user.ageGroup === '6-8' && (
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400">
                    <Star fill="currentColor" size={24} />
                 </div>
              )}
              
              {/* Decorative background element */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10 ${sub.color} group-hover:scale-150 transition-transform duration-700`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};