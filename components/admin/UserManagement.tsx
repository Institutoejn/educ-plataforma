import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { getAllUsers } from '../../services/mockAdminData'; // Changed import to use getter
import { Search, Filter, MoreVertical, Eye, Ban, RefreshCw, Download, Shield } from 'lucide-react';
import { UserDetail } from './UserDetail';

export const UserManagement = () => {
  // Use getAllUsers() to fetch the singleton store data (including recent registrations)
  const [users] = useState<UserProfile[]>(getAllUsers());
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Simple filter logic
  const filteredUsers = users.filter(u => 
    filterStatus === 'all' || u.status === filterStatus
  );

  if (selectedUser) {
    return (
      <UserDetail 
        user={selectedUser} 
        onBack={() => setSelectedUser(null)} 
      />
    );
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-slate-100 text-slate-600',
      blocked: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${(styles as any)[status] || styles.inactive}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
           <h3 className="font-bold text-slate-700">Alunos Cadastrados</h3>
           <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{users.length}</span>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Nome, email ou ID..." 
                className="pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
           </div>
           
           <select 
             className="text-sm border border-slate-300 rounded-lg py-1.5 px-2 text-slate-600 focus:outline-none"
             onChange={(e) => setFilterStatus(e.target.value)}
           >
              <option value="all">Status: Todos</option>
              <option value="active">Ativos</option>
              <option value="blocked">Bloqueados</option>
           </select>

           <button className="p-2 text-slate-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-300 transition-all" title="Exportar CSV">
              <Download size={18} />
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Aluno / ID</th>
              <th className="px-6 py-4">Faixa Etária</th>
              <th className="px-6 py-4">Progresso</th>
              <th className="px-6 py-4">Responsável (LGPD)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group animate-fade-in">
                <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                      <img src={user.avatar} className="w-8 h-8 rounded-full bg-slate-100" />
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{user.id}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                      {user.ageGroup} ({user.age} anos)
                   </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      <div className="flex flex-col w-24">
                         <span className="text-xs font-bold text-indigo-600">Nv. {user.level}</span>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '45%' }}></div>
                         </div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <p className="text-slate-500 text-xs">
                     {user.parentEmail} {/* Showing full email for admin context, or mask if preferred */}
                   </p>
                   {user.parentName && (
                       <p className="text-[10px] text-slate-400 font-bold">Ref: {user.parentName}</p>
                   )}
                   <p className="text-[10px] text-green-600 flex items-center gap-1 mt-0.5">
                     <Shield size={10} /> Consentimento OK
                   </p>
                </td>
                <td className="px-6 py-4">
                   <StatusBadge status={user.status || 'active'} />
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded" 
                        title="Ver Detalhes"
                      >
                         <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-100 rounded" title="Bloquear Acesso">
                         <Ban size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
         <p>Mostrando {filteredUsers.length} resultados</p>
         <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white">Próximo</button>
         </div>
      </div>
    </div>
  );
};
