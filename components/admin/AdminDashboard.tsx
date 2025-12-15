import React from 'react';
import { Users, TrendingUp, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { generateAlerts } from '../../services/mockAdminData';

export const AdminDashboard = () => {
  const alerts = generateAlerts();

  const KPICard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`${color.replace('bg-', 'text-')}`} size={24} />
        </div>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
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
          value="12,450" 
          sub="Últimos 30 dias" 
          icon={Users} 
          color="bg-blue-600" 
        />
        <KPICard 
          title="Missões Concluídas" 
          value="85.2k" 
          sub="Média de 6.8 por aluno" 
          icon={BookOpen} 
          color="bg-indigo-600" 
        />
        <KPICard 
          title="Tempo Médio Sessão" 
          value="18m 42s" 
          sub="+2m vs mês anterior" 
          icon={Clock} 
          color="bg-emerald-600" 
        />
        <KPICard 
          title="Alertas Críticos" 
          value="3" 
          sub="Requer atenção imediata" 
          icon={AlertTriangle} 
          color="bg-red-600" 
        />
      </div>

      {/* Split Layout: Evolution Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth Chart (Simulated) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Evolução de Cadastros</h3>
            <select className="text-sm border-slate-200 rounded-md text-slate-500">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
             {[30, 45, 32, 50, 65, 55, 70, 80, 85, 75, 90, 100].map((h, i) => (
                <div key={i} className="w-full bg-indigo-50 hover:bg-indigo-100 rounded-t-md relative group transition-all">
                  <div 
                    className="bg-indigo-600 w-full rounded-t-md absolute bottom-0 transition-all duration-500" 
                    style={{ height: `${h}%` }}
                  ></div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded">
                    {h * 10} users
                  </div>
                </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-400">
             <span>01 Nov</span>
             <span>15 Nov</span>
             <span>30 Nov</span>
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-slate-800 mb-4">Alertas Recentes</h3>
           <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div className={`mt-1 w-2 h-2 rounded-full shrink-0 
                      ${alert.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}
                   `}></div>
                   <div>
                      <p className="text-sm font-semibold text-slate-700">{alert.type.replace('_', ' ')}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">{alert.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-4 text-sm text-indigo-600 font-medium hover:underline">
             Ver todos os alertas
           </button>
        </div>

      </div>
    </div>
  );
};
