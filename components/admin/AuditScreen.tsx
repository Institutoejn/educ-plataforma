import React from 'react';
import { generateAuditLogs } from '../../services/mockAdminData';
import { Activity, Shield, User, Database, Eye } from 'lucide-react';

export const AuditScreen = () => {
  const logs = generateAuditLogs();

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
                   <th className="px-6 py-4">Agente (Admin)</th>
                   <th className="px-6 py-4">Ação</th>
                   <th className="px-6 py-4">Recurso Afetado</th>
                   <th className="px-6 py-4">Detalhes</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
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
                            log.action.includes('UPDATE') ? 'bg-blue-50 text-blue-700 border-blue-100' :
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
                ))}
                {/* Mock Filler Rows for demo */}
                <tr className="hover:bg-slate-50 transition-colors font-mono text-xs opacity-60">
                   <td className="px-6 py-4 whitespace-nowrap">20/11/2023 10:45:22</td>
                   <td className="px-6 py-4 flex items-center gap-2"><User size={12}/> SYSTEM</td>
                   <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded">AUTO_BACKUP</span></td>
                   <td className="px-6 py-4">db_users_daily</td>
                   <td className="px-6 py-4">Backup rotineiro concluído com sucesso.</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
};