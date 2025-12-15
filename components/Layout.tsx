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
      return 'bg-black text-yellow-400 font-sans'; // High Contrast Mode overrides everything
    }

    switch (ageGroup) {
      case '6-8':
        return 'bg-blue-100 text-gray-800 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]';
      case '9-11':
        return 'bg-gray-100 text-gray-900';
      case '12-14':
        return 'bg-teen-primary text-gray-200';
      default:
        return 'bg-gray-50';
    }
  };

  const getFontClass = () => {
    if (isDyslexiaFont) return 'font-sans tracking-wide leading-loose'; // Simulated logic for readability
    if (ageGroup === '6-8') return 'font-comic';
    if (ageGroup === '9-11') return 'font-adventure';
    return 'font-tech'; // 12-14 default header font
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${getThemeClass()} ${getFontClass()}`}>
      
      {/* Persistent EDUC Logo (Home) */}
      <div 
        onClick={onLogoClick}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 cursor-pointer bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 print:hidden group"
        title="Voltar para Página Inicial"
      >
         <div className="w-8 h-8 bg-educ-primary rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
           <Gamepad2 size={18} />
         </div>
         <span className="font-bold text-educ-primary text-sm tracking-tight pr-2">EDUC</span>
      </div>

      {/* Accessibility Fab */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 print:hidden">
        <button 
          onClick={() => setShowA11yMenu(!showA11yMenu)}
          className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 
            ${isHighContrast ? 'bg-yellow-400 text-black' : 'bg-white text-gray-700'}
          `}
          aria-label="Opções de Acessibilidade"
        >
          {showA11yMenu ? <X size={24} /> : <Eye size={24} />}
        </button>

        {showA11yMenu && (
          <div className={`flex flex-col gap-2 p-3 rounded-xl shadow-xl animate-fade-in
            ${isHighContrast ? 'bg-gray-900 border border-yellow-400' : 'bg-white'}
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
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-40 text-sm font-bold text-educ-primary mt-2 border-t"
               >
                  <Settings size={16} /> Área dos Pais
               </button>
             )}
          </div>
        )}
      </div>

      {children}
    </div>
  );
};
