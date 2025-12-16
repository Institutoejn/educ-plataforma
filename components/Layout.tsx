import React from 'react';
import { AgeGroup, UserProfile } from '../types';
import { Button } from './ui/Button';
import { Settings, Eye, Type, Volume2, X, Gamepad2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  ageGroup: AgeGroup;
  user?: UserProfile | null;
  onToggleHighContrast?: () => void;
  onToggleDyslexiaFont?: () => void;
  onOpenParentArea?: () => void;
  onLogoClick?: () => void; // New prop
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  ageGroup, 
  user, 
  onToggleHighContrast, 
  onToggleDyslexiaFont,
  onOpenParentArea,
  onLogoClick
}) => {
  
  const [showA11yMenu, setShowA11yMenu] = React.useState(false);

  const isHighContrast = user?.accessibility?.highContrast;
  const isDyslexiaFont = user?.accessibility?.dyslexiaFont;

  const getThemeClass = () => {
    if (isHighContrast) {
      return 'bg-black text-brand-yellow font-sans'; // High Contrast Mode override
    }

    // ALWAYS WHITE BACKGROUND for the brand requirement
    // We differentiate via borders or subtle accents if needed, but main bg is white.
    return 'bg-white text-gray-900';
  };

  const getFontClass = () => {
    if (isDyslexiaFont) return 'font-sans tracking-wide leading-loose'; 
    return 'font-sans'; 
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 overflow-x-hidden ${getThemeClass()} ${getFontClass()}`}>
      
      {/* Persistent EDUC Logo (Home) */}
      <div 
        onClick={onLogoClick}
        className="fixed top-3 left-3 z-[60] flex items-center gap-2 cursor-pointer bg-white/95 backdrop-blur-sm p-1.5 sm:p-2 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 print:hidden group select-none"
        title="Voltar para Página Inicial"
      >
         <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
           <Gamepad2 size={18} />
         </div>
         <span className="font-bold text-brand-red text-sm tracking-tight pr-2 hidden sm:inline font-poppins">EDUC</span>
      </div>

      {/* Accessibility Fab */}
      <div className="fixed top-3 right-3 z-[60] flex flex-col items-end gap-2 print:hidden">
        <button 
          onClick={() => setShowA11yMenu(!showA11yMenu)}
          className={`p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 border border-slate-100
            ${isHighContrast ? 'bg-brand-yellow text-black' : 'bg-white text-brand-blue'}
          `}
          aria-label="Opções de Acessibilidade"
        >
          {showA11yMenu ? <X size={20} /> : <Eye size={20} />}
        </button>

        {showA11yMenu && (
          <div className={`flex flex-col gap-2 p-3 rounded-xl shadow-xl animate-fade-in origin-top-right
            ${isHighContrast ? 'bg-gray-900 border border-brand-yellow' : 'bg-white border border-slate-100'}
          `}>
             <button 
                onClick={onToggleHighContrast}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-40 text-sm font-bold"
             >
                <Eye size={16} /> Alto Contraste
             </button>
             <button 
                onClick={onToggleDyslexiaFont}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-40 text-sm font-bold"
             >
                <Type size={16} /> Fonte Legível
             </button>
             {user && onOpenParentArea && (
               <button 
                  onClick={onOpenParentArea}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-40 text-sm font-bold text-brand-red mt-2 border-t"
               >
                  <Settings size={16} /> Área dos Pais
               </button>
             )}
          </div>
        )}
      </div>

      <div className="pt-16 sm:pt-4"> 
        {children}
      </div>
    </div>
  );
};