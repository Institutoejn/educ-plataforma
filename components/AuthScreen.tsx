import React, { useState } from 'react';
import { Button } from './ui/Button';
import { ArrowLeft, User, Mail, Lock, GraduationCap, Users, Key } from 'lucide-react';

interface AuthScreenProps {
  onBack: () => void;
  onParentSuccess: (parentName: string, parentEmail: string) => void;
  onStudentLogin: (identifier: string, password: string) => void;
}

type AuthTab = 'PARENT' | 'STUDENT';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBack, onParentSuccess, onStudentLogin }) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('PARENT');
  
  // Parent Form State
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentName && parentEmail && parentPassword) {
      onParentSuccess(parentName, parentEmail);
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName && studentPassword) {
      onStudentLogin(studentName, studentPassword);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Illustration / Brand */}
        <div className={`hidden md:flex md:w-1/2 p-12 text-white flex-col justify-between transition-colors duration-500
            ${activeTab === 'PARENT' ? 'bg-indigo-600' : 'bg-educ-secondary'}
        `}>
           <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white self-start">
              <ArrowLeft size={20} /> Voltar
           </button>
           
           <div>
              <h2 className="text-4xl font-bold mb-4">
                {activeTab === 'PARENT' ? 'Área da Família' : 'Portal do Aluno'}
              </h2>
              <p className="text-white/90 text-lg leading-relaxed">
                {activeTab === 'PARENT' 
                  ? 'Cadastre novos alunos, gerencie o aprendizado e configure a segurança da conta.' 
                  : 'Pronto para mais uma missão? Digite seu Nome de Herói e sua Senha secreta para entrar.'}
              </p>
           </div>

           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white opacity-100"></div>
              <div className="w-3 h-3 rounded-full bg-white opacity-50"></div>
              <div className="w-3 h-3 rounded-full bg-white opacity-50"></div>
           </div>
        </div>

        {/* Right Side: Forms */}
        <div className="w-full md:w-1/2 p-8 md:p-12 relative">
          <button onClick={onBack} className="md:hidden absolute top-4 left-4 text-slate-400">
             <ArrowLeft size={24} />
          </button>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
            <button 
              onClick={() => setActiveTab('PARENT')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all
                ${activeTab === 'PARENT' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              <Users size={18} /> Responsável
            </button>
            <button 
              onClick={() => setActiveTab('STUDENT')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all
                ${activeTab === 'STUDENT' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              <GraduationCap size={18} /> Aluno
            </button>
          </div>

          {activeTab === 'PARENT' ? (
             <form onSubmit={handleParentSubmit} className="space-y-4 animate-fade-in">
                <div className="text-center mb-6">
                   <h3 className="text-2xl font-bold text-slate-800">Criar conta ou Entrar</h3>
                   <p className="text-slate-500 text-sm">Acesso exclusivo para pais e tutores.</p>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Responsável</label>
                   <div className="relative">
                      <User className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Seu nome completo"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        required
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="exemplo@email.com"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha (Pai)</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        required
                        value={parentPassword}
                        onChange={(e) => setParentPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                      />
                   </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full justify-center !text-base" ageGroup="9-11">
                    Continuar para Cadastro do Aluno
                  </Button>
                </div>
                
                <p className="text-xs text-center text-slate-400 mt-4">
                  Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade (LGPD).
                </p>
             </form>
          ) : (
             <form onSubmit={handleStudentSubmit} className="space-y-6 animate-fade-in py-8">
                <div className="text-center mb-6">
                   <h3 className="text-2xl font-bold text-slate-800">Bem-vindo de volta!</h3>
                   <p className="text-slate-500 text-sm">Use a senha criada pelo seu responsável.</p>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome de Herói (ou ID)</label>
                   <div className="relative">
                      <User className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nome do Aluno"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha Secreta</label>
                   <div className="relative">
                      <Key className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Sua senha"
                      />
                   </div>
                </div>

                <Button type="submit" variant="secondary" className="w-full justify-center !text-base !bg-green-600 !text-white !border-green-700 hover:!bg-green-500" ageGroup="9-11">
                  Acessar Plataforma
                </Button>
             </form>
          )}

        </div>
      </div>
    </div>
  );
};
