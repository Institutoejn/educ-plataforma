
import React, { useState } from 'react';
import { Download, FileText, PieChart, BarChart2, TrendingUp, Users, Inbox, Eye, Printer } from 'lucide-react';
import { getAllUsers } from '../../services/mockAdminData';
import { Subject, UserProfile } from '../../types';
import { AssessmentReportView } from '../AssessmentReportView';

export const ReportsScreen = () => {
  const users = getAllUsers();
  const hasData = users.length > 0;
  const [selectedReportUser, setSelectedReportUser] = useState<UserProfile | null>(null);

  // --- ACTIONS ---
  const handleExportStats = () => {
      if (!hasData) return;
      const headers = ["Aluno", "Idade", "Nivel", "XP", "Materias Exploradas", "Media Geral"];
      const rows = users.map(u => {
          const explored = Object.keys(u.learningStats || {}).length;
          const totalMastery = Object.values(u.learningStats || {}).reduce((acc, curr) => acc + curr.masteryLevel, 0);
          const avg = explored > 0 ? Math.round(totalMastery / explored) : 0;
          return [u.name, u.age, u.level, u.xp, explored, avg];
      });

      const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `educ_stats_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

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

  // Filter users who have reports
  const usersWithReports = users.filter(u => u.assessmentReport);

  // --- RENDER MODAL FOR REPORT ---
  if (selectedReportUser && selectedReportUser.assessmentReport) {
      return (
          <div className="fixed inset-0 z-50 bg-slate-100 overflow-y-auto">
              <AssessmentReportView 
                user={selectedReportUser} 
                report={selectedReportUser.assessmentReport} 
                onBack={() => setSelectedReportUser(null)}
              />
          </div>
      );
  }

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
          <button 
            onClick={handleExportStats}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
          >
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

       {/* Reports List Section */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <FileText size={20} className="text-slate-500" /> Relatórios Individuais de Sondagem
              </h3>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
             <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                 <tr>
                     <th className="px-6 py-4">Aluno</th>
                     <th className="px-6 py-4">Data da Sondagem</th>
                     <th className="px-6 py-4">Hipótese (Port.)</th>
                     <th className="px-6 py-4">Nível (Mat.)</th>
                     <th className="px-6 py-4 text-right">Ações</th>
                 </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                 {usersWithReports.length === 0 ? (
                     <tr>
                         <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                             Nenhum relatório de sondagem gerado até o momento.
                         </td>
                     </tr>
                 ) : (
                    usersWithReports.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-700">{u.name}</td>
                            <td className="px-6 py-4">
                                {u.assessmentReport ? new Date(u.assessmentReport.generatedAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold">
                                    {u.literacyLevel}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                                    {u.numeracyLevel}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => setSelectedReportUser(u)}
                                    className="px-3 py-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold flex items-center gap-2 ml-auto"
                                >
                                    <Eye size={14} /> Visualizar / Baixar
                                </button>
                            </td>
                        </tr>
                    ))
                 )}
             </tbody>
          </table>
       </div>
    </div>
  );
};
