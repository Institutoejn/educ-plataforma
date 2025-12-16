import React from 'react';
import { AgeGroup } from '../../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  ageGroup?: AgeGroup;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  ageGroup = '9-11', 
  className = '', 
  icon,
  ...props 
}) => {
  
  const getStyle = () => {
    // 6-8 Years: Big, Round, Bouncy (Uses Brand Yellow & Red)
    if (ageGroup === '6-8') {
      const base = "font-comic text-xl px-8 py-4 rounded-3xl border-b-8 transition-transform active:border-b-0 active:translate-y-2 flex items-center justify-center gap-2";
      if (variant === 'primary') return `${base} bg-brand-yellow border-amber-500 text-amber-900 hover:bg-yellow-300`;
      if (variant === 'secondary') return `${base} bg-brand-red border-red-800 text-white hover:bg-red-500`;
      return `${base} bg-white border-gray-300 text-gray-700`;
    }

    // 9-11 Years: Adventure style (Uses Brand Blue & Red)
    if (ageGroup === '9-11') {
      const base = "font-adventure text-lg px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2";
      if (variant === 'primary') return `${base} bg-brand-blue text-white font-bold hover:bg-sky-700`;
      if (variant === 'secondary') return `${base} bg-brand-red text-white hover:bg-red-600`;
      return `${base} bg-white border-2 border-brand-blue text-brand-blue`;
    }

    // 12-14 Years: Modern/Tech (Uses Brand Red & Blue, Clean lines)
    // Removed dark mode styles, kept clean white/colored aesthetics
    const base = "font-tech text-base px-6 py-2 rounded-md border transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider";
    if (variant === 'primary') return `${base} bg-brand-red border-brand-red text-white hover:bg-red-600 hover:shadow-lg`;
    if (variant === 'secondary') return `${base} bg-white border-brand-blue text-brand-blue hover:bg-blue-50`;
    return `${base} border-gray-300 text-gray-500 hover:text-gray-700`;
  };

  return (
    <button className={`${getStyle()} ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
};