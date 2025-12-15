import React, { useState } from 'react';
import { Shield, Lock, ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated Auth Delay
    setTimeout(() => {
      // Mock Credential Check
      // Accepts any password for MVP demo, but validates email format
      if (email.includes('@educ.com') || email.includes('admin')) {
         setLoading(false);
         onLoginSuccess();
      } else {
         setLoading(false);
         setError('Credenciais inválidas. O email deve pertencer ao domínio corporativo (@educ.com).');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center relative">
          <button 
             onClick={onBack}
             className="absolute left-4 top-4 text-slate-400 hover:text-white transition-colors"
          >
             <ArrowLeft size={20} />
          </button>
          
          <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
             <Briefcase className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">EDUC Corporate</h1>
          <p className="text-slate-400 text-sm mt-1">Acesso Restrito Administrativo</p>
        </div>

        {/* Form */}
        <div className="p-8">
           <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Corporativo / ID</label>
                 <div className="relative">
                    <Shield className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                      placeholder="admin@educ.com"
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha</label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                      placeholder="••••••••••••"
                    />
                 </div>
              </div>

              {error && (
                 <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                    {error}
                 </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 flex justify-center items-center"
              >
                 {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                 ) : (
                    'Autenticar'
                 )}
              </button>
           </form>

           <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                 Este sistema é monitorado. Todo acesso é registrado.
              </p>
              <p className="text-[10px] text-slate-300 mt-1">
                 Esqueceu a senha? Contate o suporte de TI interno.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
