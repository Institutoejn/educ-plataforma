
import React from 'react';
import { getAllAuditLogs } from '../../services/mockAdminData';
import { Activity, Shield, User, Database, Eye, Inbox } from 'lucide-react';

export const AuditScreen = () => {
  const logs = getAllAuditLogs();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
       <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center">
             <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <Shield className="text-slate-500" /> Trilha de Auditoria (Audit Trail)
                </h2>
                <p className="text-sm text-slate-500 mt-1">Registro imutável de ações administrativas para conformidade e segurança.</p>
             </div>
             <div className="bg-white px-3 py-1 rounded border border-slate-200 text-xs font-mono text-slate-500">
                LOG_LEVEL: INFO
             </div>
          </div>
       </div>

       <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
             <thead className="bg-slate-100 text-xs uppercase font-semibold text-slate-500">
                <tr>
                   <th className="px-6 py-4">Data/Hora</th>
                   <th className="px-6 py-4">Agente</th>
                   <th className="px-6 py-4">Ação</th>
                   <th className="px-6 py-4">Recurso Afetado</th>
                   <th className="px-6 py-4">Detalhes</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            <div className="flex flex-col items-center gap-2">
                                <Inbox size={24} />
                                <p>Nenhum log de auditoria registrado nesta sessão.</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors font-mono text-xs">
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <User size={12} className="text-slate-400" />
                                <span className="font-bold text-slate-700">{log.actorName}</span>
                                <span className="text-slate-400">({log.actorId})</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded border ${
                                log.action.includes('DELETE') ? 'bg-red-50 text-red-700 border-red-100' :
                                log.action.includes('CREATE') ? 'bg-green-50 text-green-700 border-green-100' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                                {log.action}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                            {log.targetResource}
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={log.details}>
                            {log.details}
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
