
import React, { useState, useEffect } from 'react';
import { getAllAlerts, resolveAlert } from '../../services/mockAdminData';
import { SystemAlert } from '../../types';
import { AlertTriangle, CheckCircle, Clock, Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

export const AlertsScreen = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  useEffect(() => {
    setAlerts(getAllAlerts());
  }, []);

  const filteredAlerts = alerts.filter(a => filter === 'all' || a.status === filter);

  const handleResolve = (id: string) => {
    resolveAlert(id);
    setAlerts(getAllAlerts()); // Refresh
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
           <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <AlertTriangle className="text-red-500" /> Monitoramento de Incidentes
           </h2>
           <p className="text-sm text-slate-500">Gerenciamento de anomalias, riscos de retenção e erros sistêmicos.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setFilter('all')} 
             className={`px-3 py-1.5 text-sm font-medium rounded-lg ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
           >
             Todos
           </button>
           <button 
             onClick={() => setFilter('open')} 
             className={`px-3 py-1.5 text-sm font-medium rounded-lg ${filter === 'open' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
           >
             Abertos
           </button>
           <button 
             onClick={() => setFilter('resolved')} 
             className={`px-3 py-1.5 text-sm font-medium rounded-lg ${filter === 'resolved' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
           >
             Resolvidos
           </button>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid gap-4">
        {filteredAlerts.length === 0 ? (
           <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
             <Inbox className="mx-auto mb-2 w-12 h-12 text-slate-200" />
             <p>Nenhum alerta encontrado com este filtro.</p>
           </div>
        ) : (
          filteredAlerts.map(alert => (
            <div key={alert.id} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 transition-all hover:shadow-md
                ${alert.status === 'resolved' ? 'border-l-green-500 opacity-70' : 'border-l-red-500'}
            `}>
              <div className="flex justify-between items-start">
                 <div className="flex gap-4">
                    <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getSeverityColor(alert.severity)}`}>
                       <AlertTriangle size={20} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${getSeverityColor(alert.severity)}`}>
                             {alert.severity}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                             <Clock size={12} /> {new Date(alert.timestamp).toLocaleString()}
                          </span>
                       </div>
                       <h3 className="font-bold text-slate-800 text-lg">{alert.type.replace('_', ' ')}</h3>
                       <p className="text-slate-600 mt-1">{alert.message}</p>
                       {alert.affectedUserId && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded text-sm text-indigo-600 font-mono">
                             ID: {alert.affectedUserId}
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="flex flex-col items-end gap-2">
                    {alert.status === 'open' ? (
                       <Button 
                         onClick={() => handleResolve(alert.id)}
                         className="!bg-white !text-green-600 !border-green-600 hover:!bg-green-50 !py-2 !px-4 !text-xs"
                         variant="outline"
                         ageGroup="9-11" // Admin style override
                       >
                         <CheckCircle size={14} className="mr-2" /> Marcar Resolvido
                       </Button>
                    ) : (
                       <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">
                          <CheckCircle size={14} /> Resolvido
                       </span>
                    )}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
