
import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, BookOpen, Clock, Inbox } from 'lucide-react';
import { getAllUsers, getAllAlerts } from '../../services/mockAdminData';

export const AdminDashboard = () => {
  // Force re-render on mount to get latest data
  const [users, setUsers] = useState(getAllUsers());
  const [alerts, setAlerts] = useState(getAllAlerts());

  useEffect(() => {
    // Simple interval to refresh dashboard if new data comes in while open
    const interval = setInterval(() => {
        setUsers(getAllUsers());
        setAlerts(getAllAlerts());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // CALCULATE REAL METRICS
  const activeStudents = users.length;
  
  const completedMissions = users.reduce((acc, user) => {
    // Count how many topics exist in learningStats
    return acc + Object.keys(user.learningStats || {}).length;
  }, 0);

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;

  // Average Session Time (Mocked calculation since we don't track session duration fully yet)
  const avgSession = activeStudents > 0 ? "12m" : "0m";

  const KPICard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`${color.replace('bg-', 'text-')}`} size={24} />
        </div>
        {/* Dynamic Trend Indicator - Hidden if 0 */}
        {parseInt(value) > 0 && (
           <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Ativo</span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-sm text-slate-500 mt-1">{title}</p>
      <p className="text-xs text-slate-400 mt-2">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard 
          title="Alunos Ativos" 
          value={activeStudents} 
          sub={activeStudents === 0 ? "Aguardando cadastros" : "Total registrado"}
          icon={Users} 
          color="bg-blue-600" 
        />
        <KPICard 
          title="Missões Realizadas" 
          value={completedMissions} 
          sub="Total global" 
          icon={BookOpen} 
          color="bg-indigo-600" 
        />
        <KPICard 
          title="Tempo Médio" 
          value={avgSession} 
          sub="Estimado por sessão" 
          icon={Clock} 
          color="bg-emerald-600" 
        />
        <KPICard 
          title="Alertas Críticos" 
          value={criticalAlerts} 
          sub="Incidentes abertos" 
          icon={AlertTriangle} 
          color="bg-red-600" 
        />
      </div>

      {/* Split Layout: Evolution Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth Chart (Dynamic Placeholder) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Fluxo de Cadastros (Tempo Real)</h3>
            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Hoje</div>
          </div>
          
          <div className="flex-1 flex items-end justify-center min-h-[200px] border-b border-l border-slate-100 p-4 relative bg-slate-50/30 rounded-lg">
             {activeStudents === 0 ? (
                 <div className="text-center text-slate-400">
                    <Inbox className="mx-auto mb-2 opacity-50" size={32} />
                    <p className="text-sm">Nenhum dado para exibir no gráfico.</p>
                 </div>
             ) : (
                 // Simple Bar Representation of current user count
                 <div className="w-24 bg-indigo-500 rounded-t-lg relative group transition-all animate-[height_1s_ease-out]" style={{ height: `${Math.min(100, activeStudents * 10)}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded font-bold">
                        {activeStudents}
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 text-xs">Total</div>
                 </div>
             )}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-400">
             <span>00:00</span>
             <span>12:00</span>
             <span>Agora</span>
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-slate-800 mb-4">Alertas Recentes</h3>
           <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {alerts.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-lg">
                      <p className="text-sm">Sistema operando normalmente.</p>
                      <p className="text-xs opacity-70">Sem incidentes.</p>
                  </div>
              ) : (
                  alerts.slice(0, 5).map(alert => (
                    <div key={alert.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 
                        ${alert.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}
                    `}></div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700">{alert.type}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-snug">{alert.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                    </div>
                    </div>
                  ))
              )}
           </div>
           {alerts.length > 0 && (
                <button className="w-full mt-4 text-sm text-indigo-600 font-medium hover:underline">
                    Ver todos os alertas
                </button>
           )}
        </div>

      </div>
    </div>
  );
};
