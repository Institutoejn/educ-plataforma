import React from 'react';
import { Download, FileText, PieChart, BarChart2, TrendingUp, Users } from 'lucide-react';
import { Subject } from '../../types';

export const ReportsScreen = () => {
  // Mock aggregated data for visualization
  const masteryByAge = [
    { age: '6-8', score: 85, color: 'bg-kids-secondary' },
    { age: '9-11', score: 72, color: 'bg-tween-secondary' },
    { age: '12-14', score: 64, color: 'bg-teen-accent' },
  ];

  const subjectPerformance = [
    { subject: 'Português', val: 78 },
    { subject: 'Matemática', val: 65 },
    { subject: 'C. Gerais', val: 82 },
    { subject: 'Empreend.', val: 55 },
  ];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
             <h2 className="text-xl font-bold text-slate-800">Relatórios Pedagógicos</h2>
             <p className="text-sm text-slate-500">Insights agregados sobre a performance da plataforma.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
             <Download size={18} /> Exportar CSV Completo
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart 1: Mastery by Age Group */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                <Users size={20} className="text-slate-400" /> Índice de Proficiência por Faixa Etária
             </h3>
             <div className="space-y-6">
                {masteryByAge.map((item) => (
                   <div key={item.age}>
                      <div className="flex justify-between mb-2 text-sm font-medium">
                         <span className="text-slate-600">{item.age} Anos</span>
                         <span className="text-slate-800">{item.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                         <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                      </div>
                   </div>
                ))}
             </div>
             <p className="mt-6 text-xs text-slate-400 leading-relaxed">
                * Dados baseados na média de acertos das últimas 5.000 missões. Nota-se uma queda de performance na transição para o segmento 12-14 (complexidade).
             </p>
          </div>

          {/* Chart 2: Performance by Subject */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                <BarChart2 size={20} className="text-slate-400" /> Desempenho por Matéria (Global)
             </h3>
             <div className="flex items-end justify-around h-48 border-b border-slate-100 pb-2">
                {subjectPerformance.map((sub) => (
                   <div key={sub.subject} className="flex flex-col items-center gap-2 group w-full">
                      <div className="relative w-full px-4 flex justify-center h-full items-end">
                         <div 
                           className="w-full max-w-[40px] bg-indigo-500 rounded-t-lg transition-all group-hover:bg-indigo-600 relative"
                           style={{ height: `${sub.val}%` }}
                         >
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                               {sub.val}%
                            </span>
                         </div>
                      </div>
                      <span className="text-xs text-slate-500 font-medium truncate max-w-[80px]">{sub.subject}</span>
                   </div>
                ))}
             </div>
          </div>
       </div>

       {/* Reports List */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm uppercase">
             Relatórios Disponíveis para Download
          </div>
          <div className="divide-y divide-slate-100">
             {[
                { name: 'Relatório de Adesão Semanal (W4 Nov)', size: '2.4 MB', date: 'Hoje' },
                { name: 'Análise de Dificuldade de Questões (Outubro)', size: '15 MB', date: '01 Nov' },
                { name: 'Relatório de Logins e Sessões (LGPD Audit)', size: '4.1 MB', date: '28 Out' },
                { name: 'Performance Consolidada por Escola Parceira', size: '1.2 MB', date: '25 Out' },
             ].map((file, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                         <FileText size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-800">{file.name}</p>
                         <p className="text-xs text-slate-400">{file.date} • PDF/CSV</p>
                      </div>
                   </div>
                   <button className="text-slate-400 hover:text-indigo-600 px-3">
                      <Download size={20} />
                   </button>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};