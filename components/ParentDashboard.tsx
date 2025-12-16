import React, { useState } from 'react';
import { UserProfile, Subject, TopicMetrics } from '../types';
import { Button } from './ui/Button';
import { ArrowLeft, Lock, BarChart2, AlertCircle, CheckCircle, PieChart } from 'lucide-react';

interface ParentDashboardProps {
  user: UserProfile;
  onBack: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  // Simple math challenge for parent gate
  const CHALLENGE_ANSWER = "13"; 

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === CHALLENGE_ANSWER) {
      setIsAuthenticated(true);
    } else {
      setError('Resposta incorreta. Tente novamente.');
      setPinInput('');
    }
  };

  const getStatsBySubject = (subj: Subject) => {
    const stats = Object.entries(user.learningStats)
      .filter(([key]) => key.startsWith(subj))
      .map(([_, val]) => val as TopicMetrics);
    
    if (stats.length === 0) return { mastery: 0, attempts: 0 };
    
    const totalMastery = stats.reduce((acc, curr) => acc + curr.masteryLevel, 0);
    return {
      mastery: Math.round(totalMastery / stats.length),
      attempts: stats.length
    };
  };

  const subjects = [Subject.PORTUGUESE, Subject.MATH, Subject.GENERAL_KNOWLEDGE, Subject.ENTREPRENEURSHIP];

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-gray-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Área dos Pais</h2>
          <p className="text-gray-500 mb-6">Para acessar os relatórios, resolva o desafio de segurança:</p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="font-bold text-lg text-blue-900">Quanto é 8 + 5?</p>
          </div>

          <form onSubmit={handleUnlock}>
            <input 
              type="text" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center text-2xl font-bold tracking-widest p-3 border rounded-lg mb-4"
              placeholder="??"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={onBack} className="flex-1">Voltar</Button>
              <Button type="submit" variant="primary" className="flex-1">Acessar</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Button variant="secondary" onClick={onBack} className="!px-3">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart2 /> Painel de Acompanhamento
        </h1>
        <div className="w-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-educ-primary">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Nível Atual</h3>
          <p className="text-3xl font-bold text-gray-800">{user.level}</p>
          <p className="text-xs text-gray-500">XP Total: {user.xp}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Missões Concluídas</h3>
          <p className="text-3xl font-bold text-gray-800">{Object.keys(user.learningStats).length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Conquistas</h3>
          <p className="text-3xl font-bold text-gray-800">{user.badges.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-800">Desempenho por Área de Conhecimento</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {subjects.map(subject => {
            const stats = getStatsBySubject(subject);
            return (
              <div key={subject} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full 
                    ${stats.mastery > 70 ? 'bg-green-100 text-green-600' : stats.mastery > 40 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}
                  `}>
                    <PieChart size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{subject}</h4>
                    <p className="text-sm text-gray-500">{stats.attempts} atividades realizadas</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-bold 
                    ${stats.mastery > 70 ? 'text-green-600' : stats.mastery > 40 ? 'text-yellow-600' : 'text-red-600'}
                  `}>
                    {stats.mastery}%
                  </span>
                  <p className="text-xs text-gray-400">Proficiência Estimada</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex gap-4">
        <AlertCircle className="text-blue-600 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900">Dica Pedagógica</h4>
          <p className="text-blue-800 text-sm mt-1">
            Recomendamos incentivar {user.name} a explorar mais as missões de <strong>Empreendedorismo</strong>. 
            O desempenho em Matemática está ótimo, o que facilita o aprendizado financeiro!
          </p>
        </div>
      </div>

    </div>
  );
};