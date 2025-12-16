import React from 'react';
import { Button } from './ui/Button';
import { Gamepad2, BookOpen, ShieldCheck, TrendingUp, Users, CheckCircle, Lock } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onAdminClick: () => void;
  onLogoClick?: () => void; // New prop
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onAdminClick, onLogoClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div 
            onClick={onLogoClick} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            title="Recarregar Home"
          >
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white shadow-lg">
              <Gamepad2 size={24} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">EDUC</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#metodologia" className="hover:text-brand-red transition-colors">Metodologia</a>
            <a 
              href="http://basenacionalcomum.mec.gov.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-brand-red transition-colors flex items-center gap-1"
            >
              BNCC
            </a>
            <a href="#pais" className="hover:text-brand-red transition-colors">Para Pais</a>
          </div>

          <Button onClick={onLoginClick} className="!py-2 !px-6 !text-sm !rounded-lg shadow-md hover:shadow-lg transition-all" ageGroup="9-11">
            Entrar / Cadastrar
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-yellow/20 text-amber-700 text-xs font-bold uppercase tracking-wider border border-brand-yellow/30">
              Nova Era da Educação
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Aprender nunca foi tão <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-blue">épico.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              A plataforma 100% gamificada que transforma a BNCC em missões incríveis para crianças e adolescentes de 6 a 14 anos.
            </p>
            <div className="flex gap-4 pt-4">
              <Button onClick={onLoginClick} className="!py-4 !px-8 !text-lg !rounded-xl shadow-xl hover:-translate-y-1 transition-transform" ageGroup="9-11">
                Começar Aventura Grátis
              </Button>
            </div>
            <div className="flex gap-6 pt-4 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Sem Ads</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> 100% Seguro</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> LGPD Compliant</span>
            </div>
          </div>
          
          {/* Hero Image / Illustration */}
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-yellow/20 to-brand-red/10 rounded-full blur-3xl opacity-60"></div>
             {/* Updated Image: Reliable URL */}
             <img 
               src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop" 
               alt="Criança aprendendo com tecnologia de forma divertida" 
               className="relative z-10 rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500 object-cover aspect-[4/3]"
             />
             
             {/* Floating Cards */}
             <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100 animate-bounce-gentle z-20">
                <div className="flex items-center gap-3">
                   <div className="bg-brand-yellow p-2 rounded-full text-amber-900"><TrendingUp size={20} /></div>
                   <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Progresso</p>
                      <p className="font-bold text-slate-800">+150 XP hoje</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Features Section - ID Metodologia */}
      <section id="metodologia" className="py-24 bg-white border-t border-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Por que escolher a EDUC?</h2>
            <p className="text-slate-600">Unimos pedagogia rigorosa com a diversão dos videogames para garantir engajamento real e aprendizado profundo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
               icon={<BookOpen className="text-white" size={24} />}
               color="bg-brand-blue"
               title="Alinhado à BNCC"
               desc="Conteúdo curricular de Português, Matemática e Ciências transformado em trilhas de aventura."
            />
            <FeatureCard 
               icon={<Gamepad2 className="text-white" size={24} />}
               color="bg-brand-red"
               title="Gamificação Real"
               desc="Nada de testes chatos. Aqui o aluno ganha XP, sobe de nível e desbloqueia conquistas."
            />
            <FeatureCard 
               icon={<ShieldCheck className="text-white" size={24} />}
               color="bg-brand-yellow"
               title="Segurança Total"
               desc="Ambiente fechado, sem chat aberto, sem anúncios e com total controle dos pais."
               textColor="text-amber-900"
            />
          </div>
        </div>
      </section>

      {/* For Parents Section - ID Pais */}
      <section id="pais" className="py-24 bg-white border-t border-slate-100">
         <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
               <div className="absolute inset-0 bg-brand-blue/10 rounded-full blur-2xl"></div>
               <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                  <div className="flex items-center gap-4 mb-6 border-b border-slate-50 pb-4">
                     <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                     <div>
                        <div className="w-32 h-4 bg-gray-100 rounded mb-2"></div>
                        <div className="w-20 h-3 bg-gray-50 rounded"></div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-green-500"></div>
                     </div>
                     <div className="flex justify-between text-xs text-slate-400">
                        <span>Matemática</span>
                        <span>75% Proficiência</span>
                     </div>
                  </div>
               </div>
            </div>
            <div className="order-1 md:order-2">
               <span className="text-brand-red font-bold tracking-wider uppercase text-sm">Controle Parental</span>
               <h2 className="text-3xl font-bold text-slate-800 mt-2 mb-6">Acompanhe cada passo da jornada.</h2>
               <p className="text-slate-600 mb-6">
                  Nosso painel para pais oferece relatórios detalhados sobre as fortalezas e dificuldades do seu filho.
                  Receba insights pedagógicos e saiba exatamente onde ele precisa de apoio.
               </p>
               <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-700">
                     <CheckCircle size={18} className="text-green-500" /> Relatórios de Proficiência
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                     <CheckCircle size={18} className="text-green-500" /> Alertas de Dificuldade
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                     <CheckCircle size={18} className="text-green-500" /> Plano de Estudo Personalizado
                  </li>
               </ul>
               <Button onClick={onLoginClick} variant="secondary" ageGroup="9-11">Cadastrar como Responsável</Button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div onClick={onLogoClick} className="flex items-center gap-2 text-white mb-4 cursor-pointer hover:opacity-80">
                <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center">
                    <Gamepad2 size={18} />
                </div>
                <span className="text-xl font-bold">EDUC</span>
              </div>
              <p className="max-w-xs text-sm">
                Transformando a educação através da tecnologia e do lúdico.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Para Escolas</a></li>
                <li><a href="#" className="hover:text-white">Para Pais</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidade (LGPD)</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>© 2024 EDUC - Todos os direitos reservados.</p>
            
            {/* Restricted Admin Access Link */}
            <button 
              onClick={onAdminClick}
              className="flex items-center gap-2 mt-4 md:mt-0 opacity-50 hover:opacity-100 hover:text-white transition-opacity"
            >
              <Lock size={12} /> Acesso Corporativo (Admin)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, color, title, desc, textColor }: any) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
    <div className={`w-12 h-12 ${color} ${textColor || 'text-white'} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
  </div>
);