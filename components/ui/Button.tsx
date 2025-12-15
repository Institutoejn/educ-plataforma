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
    // 6-8 Years: Big, Round, Bouncy
    if (ageGroup === '6-8') {
      const base = "font-comic text-xl px-8 py-4 rounded-3xl border-b-8 transition-transform active:border-b-0 active:translate-y-2 flex items-center justify-center gap-2";
      if (variant === 'primary') return `${base} bg-kids-primary border-yellow-600 text-yellow-900 hover:bg-yellow-300`;
      if (variant === 'secondary') return `${base} bg-kids-secondary border-red-700 text-white hover:bg-red-400`;
      return `${base} bg-white border-gray-300 text-gray-700`;
    }

    // 9-11 Years: Adventure style, hex/rounded, vibrant
    if (ageGroup === '9-11') {
      const base = "font-adventure text-lg px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2";
      if (variant === 'primary') return `${base} bg-tween-primary text-white font-bold`;
      if (variant === 'secondary') return `${base} bg-tween-secondary text-white`;
      return `${base} bg-white border-2 border-tween-primary text-tween-primary`;
    }

    // 12-14 Years: Modern, Tech, Sleek
    const base = "font-tech text-base px-6 py-2 rounded-md border transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider";
    if (variant === 'primary') return `${base} bg-teen-accent border-teen-accent text-teen-primary hover:bg-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]`;
    if (variant === 'secondary') return `${base} bg-transparent border-teen-accent text-teen-accent hover:bg-teen-accent/10`;
    return `${base} border-gray-600 text-gray-400`;
  };

  return (
    <button className={`${getStyle()} ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
};