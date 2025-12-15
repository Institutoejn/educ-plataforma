
import React from 'react';
import { Download, FileText, PieChart, BarChart2, TrendingUp, Users, Inbox } from 'lucide-react';
import { getAllUsers } from '../../services/mockAdminData';
import { Subject } from '../../types';

export const ReportsScreen = () => {
  const users = getAllUsers();
  const hasData = users.length > 0;

  // --- DYNAMIC CALCULATIONS ---

  // 1. Mastery by Age (Simplified)
  const ageGroups = { '6-8': { count: 0, totalXp: 0 }, '9-11': { count: 0, totalXp: 0 }, '12-14': { count: 0, totalXp: 0 } };
  
  users.forEach(u => {
     if (ageGroups[u.ageGroup]) {
        ageGroups[u.ageGroup].count += 1;
        ageGroups[u.ageGroup].totalXp += u.xp;
     }
  });

  const masteryByAge = Object.entries(ageGroups).map(([age, data]) => ({
     age,
     // Arbitrary score calculation based on XP for demo visualization
     score: data.count > 0 ? Math.min(100, Math.round((data.totalXp / data.count) / 10)) : 0, 
     color: age === '6-8' ? 'bg-kids-secondary' : age === '9-11' ? 'bg-tween-secondary' : 'bg-teen-accent'
  }));

  // 2. Performance by Subject
  const subjectStats: Record<string, { total: number, count: number }> = {
      [Subject.PORTUGUESE]: { total: 0, count: 0 },
      [Subject.MATH]: { total: 0, count: 0 },
      [Subject.GENERAL_KNOWLEDGE]: { total: 0, count: 0 },
      [Subject.ENTREPRENEURSHIP]: { total: 0, count: 0 },
  };

  users.forEach(u => {
      Object.entries(u.learningStats).forEach(([key, metric]) => {
          // Key format: "Subject Name-Topic"
          const subject = Object.keys(subjectStats).find(s => key.startsWith(s));
          if (subject) {
              subjectStats[subject].total += metric.masteryLevel;
              subjectStats[subject].count += 1;
          }
      });
  });

  const subjectPerformance = Object.entries(subjectStats).map(([subj, data]) => ({
      subject: subj.split(' ')[0], // Shorten name
      val: data.count > 0 ? Math.round(data.total / data.count) : 0
  }));


  if (!hasData) {
      return (
          <div className="space-y-6">
             <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                     <Inbox size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">Sem dados suficientes</h2>
                 <p className="text-slate-500 mt-2 max-w-md mx-auto">
                     Os relatórios serão gerados automaticamente assim que os primeiros alunos se cadastrarem e realizarem atividades.
                 </p>
             </div>
          </div>
      );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
             <h2 className="text-xl font-bold text-slate-800">Relatórios Pedagógicos</h2>
             <p className="text-sm text-slate-500">Insights baseados em {users.length} aluno(s) ativos.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
             <Download size={18} /> Exportar CSV
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart 1: Mastery by Age Group */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                <Users size={20} className="text-slate-400" /> Índice de Engajamento (XP Médio)
             </h3>
             <div className="space-y-6">
                {masteryByAge.map((item) => (
                   <div key={item.age}>
                      <div className="flex justify-between mb-2 text-sm font-medium">
                         <span className="text-slate-600">{item.age} Anos</span>
                         <span className="text-slate-800">{item.score > 0 ? item.score : '-'}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                         <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Chart 2: Performance by Subject */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                <BarChart2 size={20} className="text-slate-400" /> Proficiência Média por Matéria
             </h3>
             <div className="flex items-end justify-around h-48 border-b border-slate-100 pb-2">
                {subjectPerformance.map((sub) => (
                   <div key={sub.subject} className="flex flex-col items-center gap-2 group w-full">
                      <div className="relative w-full px-4 flex justify-center h-full items-end">
                         <div 
                           className="w-full max-w-[40px] bg-indigo-500 rounded-t-lg transition-all group-hover:bg-indigo-600 relative"
                           style={{ height: `${Math.max(5, sub.val)}%` }} // Min height for visibility
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
             {subjectPerformance.every(s => s.val === 0) && (
                 <p className="text-center text-xs text-slate-400 mt-4">Aguardando atividades...</p>
             )}
          </div>
       </div>
    </div>
  );
};
