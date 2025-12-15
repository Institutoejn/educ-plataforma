
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { getAllUsers, deleteUser, sendSystemNotification } from '../../services/mockAdminData';
import { Search, Filter, Eye, Ban, Download, Shield, Trash2, Bell, X, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { UserDetail } from './UserDetail';
import { Button } from '../ui/Button';

export const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>(getAllUsers());
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals State
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null); // holds ID of user to delete
  const [showNotifyModal, setShowNotifyModal] = useState<string | null>(null); // holds ID of user to notify
  const [notificationMsg, setNotificationMsg] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- REAL-TIME SYNC ---
  const refreshList = () => {
    const freshData = getAllUsers();
    setUsers(freshData);
  };

  useEffect(() => {
    const interval = setInterval(refreshList, 2000);
    return () => clearInterval(interval);
  }, []);

  // Filter Logic
  const filteredUsers = users.filter(u => {
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
        u.name.toLowerCase().includes(searchLower) || 
        (u.id && u.id.toLowerCase().includes(searchLower)) ||
        (u.parentEmail && u.parentEmail.toLowerCase().includes(searchLower));
    
    return matchesStatus && matchesSearch;
  });

  // --- ACTIONS ---

  const handleDelete = () => {
      if (showDeleteModal) {
          deleteUser(showDeleteModal);
          setShowDeleteModal(null);
          refreshList(); // Immediate refresh
          showToast("Aluno removido com sucesso.");
      }
  };

  const handleNotify = () => {
      if (showNotifyModal && notificationMsg.trim()) {
          sendSystemNotification(showNotifyModal, notificationMsg);
          setShowNotifyModal(null);
          setNotificationMsg('');
          showToast("Notificação enviada com sucesso.");
      }
  };

  const handleExportCSV = () => {
      if (users.length === 0) return;

      const headers = ["ID", "Nome", "Idade", "Email Responsavel", "XP", "Nivel", "Status", "Criado Em"];
      const rows = users.map(u => [
          u.id, 
          u.name, 
          u.age, 
          u.parentEmail, 
          u.xp, 
          u.level, 
          u.status, 
          u.createdAt
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `educ_alunos_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast("Download da base de dados iniciado.");
  };

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
          <div className="absolute top-4 right-4 z-50 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm font-bold">{toastMessage}</span>
          </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-bounce-gentle">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-center text-slate-800 mb-2">Excluir Aluno?</h3>
                  <p className="text-sm text-center text-slate-500 mb-6">
                      Esta ação removerá todos os dados, progresso e relatórios deste aluno permanentemente. Não é possível desfazer.
                  </p>
                  <div className="flex gap-3">
                      <button 
                        onClick={() => setShowDeleteModal(null)}
                        className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                      >
                          Cancelar
                      </button>
                      <button 
                        onClick={handleDelete}
                        className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-md"
                      >
                          Sim, Excluir
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL: SEND NOTIFICATION */}
      {showNotifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <Bell size={20} className="text-indigo-600" /> Enviar Comunicado
                      </h3>
                      <button onClick={() => setShowNotifyModal(null)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="mb-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mensagem</label>
                      <textarea 
                          value={notificationMsg}
                          onChange={(e) => setNotificationMsg(e.target.value)}
                          className="w-full h-32 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                          placeholder="Digite a mensagem para o aluno (ex: Parabéns pelo progresso!)..."
                      />
                  </div>
                  
                  <div className="flex justify-end gap-3">
                      <Button variant="primary" onClick={handleNotify} className="flex items-center gap-2 !py-2 !px-4 !text-sm" ageGroup="9-11">
                          <Send size={16} /> Enviar
                      </Button>
                  </div>
              </div>
          </div>
      )}

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, email ou ID..." 
                className="pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
           </div>
           
           <select 
             className="text-sm border border-slate-300 rounded-lg py-1.5 px-2 text-slate-600 focus:outline-none"
             onChange={(e) => setFilterStatus(e.target.value)}
           >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="blocked">Bloqueados</option>
           </select>

           <button 
                onClick={handleExportCSV}
                className="p-2 text-slate-500 hover:bg-white hover:text-indigo-600 rounded-lg border border-transparent hover:border-slate-300 transition-all flex items-center gap-2" 
                title="Baixar Dados (CSV)"
           >
              <Download size={18} />
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Aluno / ID</th>
              <th className="px-6 py-4">Faixa Etária</th>
              <th className="px-6 py-4">Progresso (XP)</th>
              <th className="px-6 py-4">Responsável (LGPD)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                        {searchTerm ? "Nenhum aluno encontrado para esta busca." : "Nenhum aluno cadastrado. Aguardando novos registros."}
                    </td>
                </tr>
            ) : filteredUsers.map((user) => (
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
                         <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-indigo-600">Nv. {user.level}</span>
                            <span className="text-amber-500">{user.xp} XP</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full mt-0.5">
                            {/* Visualização simplificada de progresso */}
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (user.xp % 100))}%` }}></div>
                         </div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <p className="text-slate-500 text-xs">
                     {user.parentEmail}
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
                        className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded border border-transparent hover:border-indigo-200" 
                        title="Ver Perfil Completo"
                      >
                         <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => setShowNotifyModal(user.id || '')}
                        className="p-1.5 text-amber-600 hover:bg-amber-100 rounded border border-transparent hover:border-amber-200" 
                        title="Enviar Notificação"
                      >
                         <Bell size={16} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteModal(user.id || '')}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded border border-transparent hover:border-red-200" 
                        title="Excluir Aluno"
                      >
                         <Trash2 size={16} />
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
