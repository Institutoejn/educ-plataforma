import React, { useState } from 'react';
import { LayoutDashboard, Users, AlertTriangle, FileText, Settings, LogOut, Search, Bell, Shield, Activity, UserCog, Save, User, Phone, Lock, Camera, Trash2, Mail, Sliders, Layers, GraduationCap, ToggleLeft, ToggleRight } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { UserManagement } from './UserManagement';
import { AlertsScreen } from './AlertsScreen';
import { ReportsScreen } from './ReportsScreen';
import { AuditScreen } from './AuditScreen';
import { CURRENT_ADMIN } from '../../services/mockAdminData';
import { Button } from '../ui/Button';
import { AdminUser } from '../../types';

interface AdminPortalProps {
  onExit: () => void;
}

type AdminView = 'OVERVIEW' | 'USERS' | 'REPORTS' | 'ALERTS' | 'AUDIT' | 'SETTINGS' | 'PLATFORM_CONFIG';

// Admin Avatar Options (Simulated Gallery)
const ADMIN_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin3",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Boss",
  "https://api.dicebear.com/7.x/initials/svg?seed=SG", // Initials fallback style
];

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?seed=User";

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExit }) => {
  const [currentView, setCurrentView] = useState<AdminView>('OVERVIEW');
  const [currentUser, setCurrentUser] = useState<AdminUser>(CURRENT_ADMIN);

  // --- PLATFORM CONFIG SUB-COMPONENT ---
  const PlatformConfigScreen = () => {
    return (
      <div className="space-y-6 animate-fade-in">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
               <Sliders className="text-indigo-600" /> Parâmetros da Plataforma
            </h2>
            <p className="text-sm text-slate-500 mb-6">Configurações globais de comportamento, gamificação e aparência.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Sessão de Gamificação */}
               <div>
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 border-b border-slate-100 pb-2">Gamificação & Engajamento</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-bold text-slate-700">Multiplicador de XP Global</p>
                           <p className="text-xs text-slate-500">Aumenta ganho de XP em eventos.</p>
                        </div>
                        <select className="text-sm border-slate-300 rounded p-1 bg-slate-50">
                           <option>1.0x (Padrão)</option>
                           <option>1.5x (Evento)</option>
                           <option>2.0x (Feriado)</option>
                        </select>
                     </div>
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-bold text-slate-700">Drop de Badges Raros</p>
                           <p className="text-xs text-slate-500">Probabilidade de conquistas especiais.</p>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-2 py-1 rounded">
                           <ToggleRight size={20} /> Ativo
                        </div>
                     </div>
                  </div>
               </div>

               {/* Sessão de Interface */}
               <div>
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 border-b border-slate-100 pb-2">Interface & Temas</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-bold text-slate-700">Tema Sazonal</p>
                           <p className="text-xs text-slate-500">Altera o visual do Dashboard dos alunos.</p>
                        </div>
                        <select className="text-sm border-slate-300 rounded p-1 bg-slate-50">
                           <option>Padrão (Omnia)</option>
                           <option>Festa Junina</option>
                           <option>Halloween</option>
                           <option>Natal</option>
                        </select>
                     </div>
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-bold text-slate-700">Modo Manutenção</p>
                           <p className="text-xs text-slate-500">Bloqueia acesso de alunos.</p>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-slate-100 px-2 py-1 rounded">
                           <ToggleLeft size={20} /> Inativo
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
               <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                  Salvar Parâmetros
               </button>
            </div>
         </div>
      </div>
    );
  };

  // --- SETTINGS SUB-COMPONENT ---
  const SettingsScreen = () => {
     const [editName, setEditName] = useState(currentUser.name);
     const [editPhone, setEditPhone] = useState(currentUser.phone || '');
     const [tempAvatar, setTempAvatar] = useState(currentUser.avatar || DEFAULT_AVATAR);
     const [showAvatarPicker, setShowAvatarPicker] = useState(false);
     const [successMsg, setSuccessMsg] = useState('');

     const handleSave = () => {
        setCurrentUser({ 
           ...currentUser, 
           name: editName, 
           phone: editPhone,
           avatar: tempAvatar
           // Email is deliberately not updated here as it's read-only
        });
        setSuccessMsg('Perfil atualizado com sucesso.');
        setShowAvatarPicker(false);
        setTimeout(() => setSuccessMsg(''), 3000);
     };

     const handleRemoveAvatar = () => {
        setTempAvatar(DEFAULT_AVATAR);
     };

     return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <UserCog /> Editar Perfil Corporativo
           </h2>
           
           <div className="flex flex-col md:flex-row gap-8">
              
              {/* Left Column: Avatar Management */}
              <div className="flex flex-col items-center space-y-4">
                 <div className="relative group">
                    <img 
                      src={tempAvatar} 
                      alt="Admin Avatar" 
                      className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-md object-cover bg-slate-50"
                    />
                    {/* Overlay for "Change" */}
                    <button 
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs"
                    >
                       <Camera size={24} />
                    </button>
                 </div>

                 <div className="flex gap-2">
                    <button 
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 flex items-center gap-1"
                    >
                       <Camera size={14} /> Alterar
                    </button>
                    <button 
                      onClick={handleRemoveAvatar}
                      className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 flex items-center gap-1"
                    >
                       <Trash2 size={14} /> Remover
                    </button>
                 </div>
              </div>

              {/* Right Column: Form Fields */}
              <div className="flex-1 space-y-5">
                 
                 {/* ID & Role (Read Only info) */}
                 <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100 mb-2">
                    <div className="text-xs text-slate-500">
                       <p className="font-bold uppercase">Função (Role)</p>
                       <span className="font-mono bg-indigo-100 text-indigo-700 px-1 rounded">{currentUser.role}</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div className="text-xs text-slate-500">
                       <p className="font-bold uppercase">ID do Sistema</p>
                       <span className="font-mono">{currentUser.id}</span>
                    </div>
                 </div>

                 {/* Editable Name */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                    <div className="relative">
                       <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                       <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                 </div>

                 {/* Editable Phone */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Telefone / Celular</label>
                    <div className="relative">
                       <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                       <input 
                          type="text" 
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="(00) 00000-0000"
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                 </div>

                 {/* Read-Only Email */}
                 <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
                       Email Corporativo <Lock size={12} className="text-slate-400" />
                    </label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                       <input 
                          type="email" 
                          value={currentUser.email}
                          readOnly
                          disabled
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-100 text-slate-500 rounded-lg cursor-not-allowed select-none"
                          title="O email corporativo não pode ser alterado. Contate o TI."
                       />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 ml-1">
                       * Para alterar o email, abra um ticket no suporte de TI.
                    </p>
                 </div>

                 {successMsg && (
                    <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 flex items-center gap-2">
                       <Shield size={16} /> {successMsg}
                    </div>
                 )}

                 <div className="pt-4 flex justify-end border-t border-slate-100 mt-6">
                    <button 
                       onClick={handleSave}
                       className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm active:scale-95"
                    >
                       <Save size={18} /> Salvar Alterações
                    </button>
                 </div>
              </div>
           </div>

           {/* Avatar Picker Modal/Grid (Conditional) */}
           {showAvatarPicker && (
              <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
                 <h4 className="font-bold text-slate-700 mb-4 text-sm">Selecione uma nova foto de perfil:</h4>
                 <div className="flex flex-wrap gap-4">
                    {ADMIN_AVATARS.map((url, i) => (
                       <button 
                         key={i}
                         onClick={() => { setTempAvatar(url); setShowAvatarPicker(false); }}
                         className={`w-16 h-16 rounded-full border-2 p-1 transition-all hover:scale-110 hover:border-indigo-500 ${tempAvatar === url ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent bg-white'}`}
                       >
                          <img src={url} className="w-full h-full rounded-full" />
                       </button>
                    ))}
                 </div>
                 <button 
                   onClick={() => setShowAvatarPicker(false)}
                   className="mt-4 text-xs text-slate-500 hover:text-slate-800 underline"
                 >
                    Cancelar
                 </button>
              </div>
           )}
        </div>
     );
  };

  const MenuLink = ({ view, icon: Icon, label }: { view: AdminView, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
        ${currentView === view 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
      `}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const MenuHeader = ({ title }: { title: string }) => (
     <div className="px-4 mt-6 mb-2">
        <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{title}</h3>
     </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <div 
             onClick={onExit}
             className="flex items-center gap-2 text-indigo-700 cursor-pointer hover:opacity-80"
             title="Sair para Home"
          >
            <Shield size={24} />
            <h1 className="font-bold text-lg tracking-tight">EDUC Console</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 ml-8">v1.3.0 • Admin</p>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          
          <MenuHeader title="Dashboard" />
          <MenuLink view="OVERVIEW" icon={LayoutDashboard} label="Visão Geral" />
          
          <MenuHeader title="Gestão Acadêmica" />
          <MenuLink view="USERS" icon={Users} label="Usuários & Turmas" />
          {/* Placeholder for future specific Groups view, grouped under 'Users' logic for now */}
          
          <MenuHeader title="Monitoramento & Risco" />
          <MenuLink view="ALERTS" icon={AlertTriangle} label="Alertas de Sistema" />
          <MenuLink view="REPORTS" icon={FileText} label="Relatórios Pedag." />
          <MenuLink view="AUDIT" icon={Activity} label="Logs de Auditoria" />

          <MenuHeader title="Configurações da Plataforma" />
          <MenuLink view="PLATFORM_CONFIG" icon={Sliders} label="Parâmetros Gerais" />
          <MenuLink view="SETTINGS" icon={UserCog} label="Meu Perfil Corp." />

        </nav>

        <div className="p-4 border-t border-slate-100">
           {/* Dynamic User Profile in Sidebar */}
           <div className="flex items-center gap-3 mb-4 px-2 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors" onClick={() => setCurrentView('SETTINGS')}>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs overflow-hidden border border-indigo-200">
                 {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="admin" className="w-full h-full object-cover" />
                 ) : (
                    currentUser.name.substring(0,2).toUpperCase()
                 )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{currentUser.role}</p>
              </div>
           </div>
           <button 
             onClick={onExit}
             className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
           >
             <LogOut size={16} /> Sair do Console
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {currentView === 'OVERVIEW' && 'Painel de Controle'}
              {currentView === 'USERS' && 'Gestão de Usuários e Turmas'}
              {currentView === 'ALERTS' && 'Monitoramento Operacional'}
              {currentView === 'REPORTS' && 'Relatórios de Aprendizagem'}
              {currentView === 'AUDIT' && 'Trilha de Auditoria'}
              {currentView === 'SETTINGS' && 'Minha Conta Corporativa'}
              {currentView === 'PLATFORM_CONFIG' && 'Configurações da Plataforma'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Última atualização: {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Busca global..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
             </div>
             <button className="p-2 relative text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-100"></span>
             </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="animate-fade-in">
          {currentView === 'OVERVIEW' && <AdminDashboard />}
          {currentView === 'USERS' && <UserManagement />}
          {currentView === 'ALERTS' && <AlertsScreen />}
          {currentView === 'REPORTS' && <ReportsScreen />}
          {currentView === 'AUDIT' && <AuditScreen />}
          {currentView === 'SETTINGS' && <SettingsScreen />}
          {currentView === 'PLATFORM_CONFIG' && <PlatformConfigScreen />}
        </div>
      </main>
    </div>
  );
};
