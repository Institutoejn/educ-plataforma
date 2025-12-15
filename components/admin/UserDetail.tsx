
import React, { useState, useEffect } from 'react';
import { UserProfile, UserActivityLog, Subject } from '../../types';
import { getUserActivityLogs, getAllUsers, CURRENT_ADMIN, deleteUser } from '../../services/mockAdminData';
import { AssessmentReportView } from '../AssessmentReportView';
import { ArrowLeft, Clock, Award, TrendingUp, AlertCircle, ShieldCheck, Mail, Calendar, Activity, Lock, RefreshCw, Trash2, FileText, Printer, Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

interface UserDetailProps {
  user: UserProfile;
  onBack: () => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({ user: initialUser, onBack }) => {
  const [showReport, setShowReport] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUser);
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- REAL TIME SYNC ---
  useEffect(() => {
     // Initial Load
     setActivityLogs(getUserActivityLogs(initialUser.id || ''));

     // Polling Loop to check for new activities (XP gain, logins, etc)
     const interval = setInterval(() => {
         // 1. Refresh User Stats (XP, Level)
         const allUsers = getAllUsers();
         const updatedUser = allUsers.find(u => u.id === initialUser.id);
         if (updatedUser) {
             setCurrentUser(updatedUser);
         } else {
             // User might have been deleted externally
             onBack(); 
         }

         // 2. Refresh Logs
         const freshLogs = getUserActivityLogs(initialUser.id || '');
         setActivityLogs(freshLogs);
     }, 2000);

     return () => clearInterval(interval);
  }, [initialUser.id]);
  
  const handleDeleteUser = () => {
      if (currentUser.id) {
          deleteUser(currentUser.id);
          onBack();
      }
  };

  if (showReport && currentUser.assessmentReport) {
    return (
        <AssessmentReportView 
            user={currentUser} 
            report={currentUser.assessmentReport} 
            onBack={() => setShowReport(false)} 
        />
    );
  }

  // Helper for timeline formatting
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const isToday = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
  };

  // Group logs
  const todayLogs = activityLogs.filter(l => isToday(l.timestamp));
  const yesterdayLogs = activityLogs.filter(l => !isToday(l.timestamp));

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-bounce-gentle">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-center text-slate-800 mb-2">Confirmar Exclusão</h3>
                  <p className="text-sm text-center text-slate-500 mb-6">
                      Tem certeza que deseja apagar o perfil de <strong>{currentUser.name}</strong>? Esta ação é irreversível.
                  </p>
                  <div className="flex gap-3">
                      <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                      >
                          Cancelar
                      </button>
                      <button 
                        onClick={handleDeleteUser}
                        className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-md"
                      >
                          Excluir
                      </button>
                  </div>
              </div>
          </div>
      )}

      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4"
      >
        <ArrowLeft size={16} /> Voltar para Lista
      </button>

      {/* Header Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Activity size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
           <img src={currentUser.avatar} className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-md bg-slate-50" />
           
           <div className="flex-1">
              <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-2xl font-bold text-slate-800">{currentUser.name}</h1>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                       <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-500" /> ID: {currentUser.id}</span>
                       <span className="flex items-center gap-1"><Mail size={14} /> {currentUser.parentEmail}</span>
                       <span className="flex items-center gap-1"><Calendar size={14} /> Desde: {new Date(currentUser.createdAt || '').toLocaleDateString()}</span>
                    </div>
                 </div>
                 
                 <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 flex items-center gap-2">
                       <RefreshCw size={14} /> Resetar Senha
                    </button>
                    {CURRENT_ADMIN.role === 'MASTER' && (
                       <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Excluir Conta
                       </button>
                    )}
                 </div>
              </div>

              {/* Quick Stats Strip (REAL TIME VALUES) */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Nível</p>
                    <p className="text-xl font-bold text-indigo-600 animate-[pulse_1s_ease-in-out]">{currentUser.level}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">XP Total</p>
                    <p className="text-xl font-bold text-amber-500">{currentUser.xp}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Badges</p>
                    <p className="text-xl font-bold text-purple-500">{currentUser.badges.length}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
                    <p className={`text-xl font-bold ${currentUser.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                       {currentUser.status?.toUpperCase()}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Column: Timeline */}
         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <Clock size={20} className="text-slate-400" /> Linha do Tempo (Ao Vivo)
            </h3>

            <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
               {/* Today Section */}
               <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 border-b border-slate-100 pb-2">Hoje</h4>
                  <div className="space-y-4 pl-2 border-l-2 border-slate-100 ml-1">
                     {todayLogs.length > 0 ? todayLogs.map(log => (
                        <ActivityItem key={log.id} log={log} time={formatDate(log.timestamp)} />
                     )) : <p className="text-sm text-slate-400 italic pl-4 flex items-center gap-2"><Inbox size={14}/> Aguardando atividade do aluno...</p>}
                  </div>
               </div>

               {/* Yesterday Section */}
               {yesterdayLogs.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 border-b border-slate-100 pb-2">Anterior</h4>
                    <div className="space-y-4 pl-2 border-l-2 border-slate-100 ml-1">
                        {yesterdayLogs.map(log => (
                            <ActivityItem key={log.id} log={log} time={formatDate(log.timestamp)} />
                        ))}
                    </div>
                </div>
               )}
            </div>
         </div>

         {/* Right Column: Pedagogical Insights */}
         <div className="space-y-6">
            
            {/* Subject Mastery */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-slate-400" /> Proficiência Estimada
               </h3>
               <div className="space-y-4">
                  {[Subject.MATH, Subject.PORTUGUESE, Subject.GENERAL_KNOWLEDGE].map(sub => {
                     // Calculate dynamic mastery
                     const topics = Object.entries(currentUser.learningStats).filter(([k]) => k.startsWith(sub));
                     const avg = topics.length > 0 
                        ? Math.round(topics.reduce((acc, [, v]) => acc + v.masteryLevel, 0) / topics.length)
                        : 0;

                     return (
                        <div key={sub}>
                            <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600 font-medium">{sub}</span>
                            <span className="text-slate-400">{avg}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${avg}%` }}></div>
                            </div>
                        </div>
                     );
                  })}
               </div>
            </div>

             {/* Report Card Action */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-slate-400" /> Relatório de Sondagem
               </h3>
               {currentUser.assessmentReport ? (
                   <div className="space-y-3">
                       <p className="text-sm text-slate-500">
                           Gerado em: {new Date(currentUser.assessmentReport.generatedAt).toLocaleDateString()}
                       </p>
                       <Button onClick={() => setShowReport(true)} className="w-full !text-sm" icon={<Printer size={16} />}>
                           Visualizar Relatório
                       </Button>
                   </div>
               ) : (
                   <div className="p-4 bg-slate-50 text-center rounded-lg border border-slate-100 text-slate-400 text-sm italic">
                       Sondagem pendente.
                   </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ log, time }: { log: UserActivityLog, time: string }) => {
   const getIcon = () => {
      if (log.activityType === 'LOGIN') return <Lock size={14} />;
      if (log.activityType === 'LEVEL_UP') return <TrendingUp size={14} />;
      if (log.activityType === 'MISSION_COMPLETE') return <Award size={14} />;
      return <Activity size={14} />;
   };

   const getColor = () => {
      if (log.activityType === 'LOGIN') return 'bg-slate-200 text-slate-600';
      if (log.activityType === 'LEVEL_UP') return 'bg-purple-100 text-purple-600';
      if (log.activityType === 'MISSION_COMPLETE') return 'bg-green-100 text-green-600';
      return 'bg-blue-100 text-blue-600';
   };

   return (
      <div className="flex gap-3 items-center relative -left-[19px] animate-fade-in">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm shrink-0 ${getColor()}`}>
            {getIcon()}
         </div>
         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 w-full flex justify-between items-center hover:bg-slate-100 transition-colors">
            <div>
               <p className="text-sm font-bold text-slate-700">
                  {log.activityType.replace('_', ' ')}
               </p>
               {log.metadata.subject && (
                  <p className="text-xs text-slate-500">
                     {log.metadata.subject} • {log.metadata.durationSeconds || 45}s
                  </p>
               )}
               {log.metadata.xpEarned && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1 rounded ml-2">+{log.metadata.xpEarned} XP</span>
               )}
            </div>
            <span className="text-xs text-slate-400 font-mono">{time}</span>
         </div>
      </div>
   );
};
