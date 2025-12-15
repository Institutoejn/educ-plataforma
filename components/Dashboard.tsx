import React from 'react';
import { UserProfile, Subject } from '../types';
import { Button } from './ui/Button';
import { Feather, Calculator, Globe, Lightbulb, Trophy, Star, Map, Compass, ChevronRight, GraduationCap, FileText, Award, ClipboardList, Bell, MessageCircle } from 'lucide-react';

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
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onSelectSubject, 
  onOpenProfile, 
  onOpenReport,
  onOpenCertificates,
  onOpenTasks,
  onOpenNotifications,
  onOpenMessages
}) => {
  
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
  ];

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
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
             <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-gray-200 border-4 border-white shadow-sm" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${user.ageGroup === '12-14' ? 'text-white' : 'text-gray-800'}`}>
              {getWelcomeMessage()}
            </h2>
            <p className={`text-sm ${user.ageGroup === '12-14' ? 'text-gray-400' : 'text-gray-500'}`}>
              {getSubMessage()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 z-10">
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase font-bold text-gray-400">Energia (XP)</span>
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-xl">
              <Star fill="currentColor" size={20} />
              {user.xp}
            </div>
          </div>
        </div>
      </div>

      {/* STUDENT NAVIGATION MENU */}
      <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5">
           {menuItems.map((item, idx) => (
              <button
                 key={idx}
                 onClick={item.action}
                 className={`
                    flex flex-col items-center justify-center p-3 rounded-xl gap-2 transition-transform hover:scale-105 active:scale-95 w-24 sm:w-auto shadow-sm border border-transparent hover:shadow-md
                    ${user.ageGroup === '12-14' 
                        ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' 
                        : 'bg-white text-gray-700 hover:border-gray-200'
                    }
                 `}
              >
                 <div className={`p-2 rounded-full ${user.ageGroup === '12-14' ? 'bg-slate-900' : item.color}`}>
                    {item.icon}
                 </div>
                 <span className="text-xs font-bold text-center leading-tight">{item.label}</span>
              </button>
           ))}
        </div>
      </div>

      {/* Plan of Study / Level Indicator */}
      {(user.literacyLevel || user.numeracyLevel) && (
          <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                      <GraduationCap size={20} />
                  </div>
                  <div>
                      <h4 className="font-bold text-indigo-900 text-sm uppercase">Plano de Estudos Ativo</h4>
                      <p className="text-xs text-indigo-700">
                          Nível: <span className="font-bold">{user.literacyLevel}</span>
                      </p>
                  </div>
              </div>
              <Button onClick={(e) => { e.stopPropagation(); onOpenReport(); }} variant="secondary" className="!text-xs !py-2" ageGroup={user.ageGroup}>
                  <FileText size={16} className="mr-2" />
                  Ver Relatório & Plano
              </Button>
          </div>
      )}

      {/* Main Grid */}
      <div className="mb-6">
        <h3 className={`text-2xl font-bold mb-6 ${user.ageGroup === '12-14' ? 'text-white' : 'text-gray-800'}`}>
          {user.ageGroup === '6-8' ? 'Escolha um Caminho:' : 'Mapa de Missões'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className={`
                relative overflow-hidden group transition-all duration-300
                ${user.ageGroup === '6-8' ? 'rounded-3xl hover:scale-105 border-b-8 border-gray-200 active:border-b-0 active:translate-y-2' : 'rounded-xl hover:-translate-y-2'}
                ${user.ageGroup === '12-14' ? 'bg-slate-800 border border-slate-700 hover:border-teen-accent hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white shadow-lg'}
                h-56 flex flex-col items-center justify-center p-4 text-center
              `}
            >
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center mb-4 text-white
                ${sub.color} shadow-lg group-hover:scale-110 transition-transform duration-500
                ${user.ageGroup === '12-14' ? 'ring-2 ring-white/20' : ''}
              `}>
                {React.cloneElement(sub.icon as React.ReactElement<any>, { size: 36 })}
              </div>
              
              <span className={`text-lg font-bold leading-tight ${user.ageGroup === '12-14' ? 'text-gray-200 font-tech uppercase tracking-widest' : 'text-gray-800'}`}>
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