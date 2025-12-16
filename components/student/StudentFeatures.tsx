import React, { useState, useRef } from 'react';
import { UserProfile } from '../../types';
import { Button } from '../ui/Button';
import { ArrowLeft, Award, Printer, ClipboardList, CheckCircle, Clock, Bell, Trash2, MessageCircle, Send, User, Download, Calendar, ExternalLink, Cloud, Loader2, Star, Plus, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface FeatureScreenProps {
  user: UserProfile;
  onBack: () => void;
}

// --- 1. CERTIFICATES SCREEN ---
export const CertificatesScreen: React.FC<FeatureScreenProps> = ({ user, onBack }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    
    try {
      // Wait a moment for any images to settle
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = certificateRef.current;
      
      // Capture at high scale
      const canvas = await html2canvas(element, {
        scale: 2, // Retira retina display quality
        useCORS: true, // Critical for DiceBear avatars
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        width: element.offsetWidth, // Force exact width capture
        height: element.offsetHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificado_EDUC_${user.name.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Não foi possível gerar o PDF automaticamente. Tente a opção 'Imprimir' do navegador.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenDrive = () => {
    window.open('https://drive.google.com/drive/my-drive', '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-slate-50 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <Button variant="secondary" onClick={onBack} ageGroup={user.ageGroup}>
          <ArrowLeft size={20} className="mr-2" /> Voltar
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
           <Award className="text-amber-500" /> Sala de Troféus
        </h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center">
        
        {/* 
            CERTIFICATE PREVIEW CONTAINER 
            This container handles the responsiveness (scaling down) for the screen
        */}
        <div className="w-full overflow-hidden flex justify-center py-4 relative">
            
            {/* 
                THE ACTUAL CERTIFICATE (A4 Ratio Fixed)
                Landscape A4 is approx 297mm x 210mm. 
                In pixels at 96 DPI ~ 1123px x 794px.
                We fix this size so html2canvas captures consistent layout regardless of screen size.
                We use CSS transform to fit it on smaller screens.
            */}
            <div className="relative origin-top transform sm:scale-75 md:scale-90 lg:scale-100 scale-[0.35] xs:scale-[0.45] mb-[-450px] sm:mb-[-150px] md:mb-[-50px] lg:mb-0">
                <div 
                    ref={certificateRef}
                    className="w-[1123px] h-[794px] bg-white text-slate-900 relative shadow-2xl overflow-hidden certificate-border flex flex-col"
                >
                    {/* Ornamental Border Inner */}
                    <div className="absolute inset-4 border-4 border-double border-amber-500 pointer-events-none z-20"></div>
                    <div className="absolute inset-6 border border-amber-200 pointer-events-none z-20"></div>

                    {/* Corner Decorations */}
                    <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-amber-600 z-30"></div>
                    <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-amber-600 z-30"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-amber-600 z-30"></div>
                    <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-amber-600 z-30"></div>

                    {/* Content Layer */}
                    <div className="flex-1 flex flex-col items-center justify-center p-16 z-10 bg-white/90">
                        
                        {/* Header */}
                        <div className="flex flex-col items-center mb-6">
                             <div className="flex items-center gap-3 mb-2 opacity-70">
                                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <span className="text-indigo-900 font-bold tracking-widest uppercase">Plataforma EDUC</span>
                             </div>
                             <h1 className="font-serif text-7xl text-slate-800 font-bold tracking-tight mb-2 text-center uppercase">Certificado</h1>
                             <div className="h-1 w-32 bg-amber-500 mb-2"></div>
                             <p className="font-serif text-2xl text-amber-700 italic">de Mérito Acadêmico</p>
                        </div>

                        {/* Body */}
                        <div className="text-center w-full max-w-4xl space-y-6">
                            <p className="text-xl text-slate-500 font-serif">Certificamos com orgulho que</p>
                            
                            <div className="relative py-4">
                                <h2 className="text-5xl font-bold text-indigo-900 font-serif border-b-2 border-slate-200 inline-block px-12 pb-2">
                                    {user.name}
                                </h2>
                                {/* Avatar absolute positioning for flair */}
                                <div className="absolute -right-20 top-1/2 -translate-y-1/2">
                                    <img 
                                        src={user.avatar} 
                                        crossOrigin="anonymous" 
                                        alt="" 
                                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-indigo-50" 
                                    />
                                </div>
                            </div>

                            <p className="text-2xl text-slate-600 font-serif leading-relaxed px-12">
                                completou com dedicação a jornada do <strong>Nível {user.level}</strong>, 
                                demonstrando excelência em <span className="text-indigo-700">Lógica e Criatividade</span>, 
                                acumulando um total de <strong>{user.xp} XP</strong>.
                            </p>
                        </div>

                        {/* Signatures & Date */}
                        <div className="w-full flex justify-between items-end mt-16 px-12">
                            <div className="text-center">
                                <p className="font-serif text-lg text-slate-800 mb-1">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <div className="h-px w-48 bg-slate-400 mx-auto mb-2"></div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data de Emissão</p>
                            </div>

                            {/* Gold Seal */}
                            <div className="relative">
                                <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center text-amber-800 border-4 border-amber-600 shadow-xl relative z-10">
                                    <div className="w-28 h-28 border-2 border-dashed border-amber-700/50 rounded-full flex flex-col items-center justify-center">
                                        <Award size={48} />
                                        <span className="text-[10px] font-bold uppercase mt-1">Selo Oficial</span>
                                        <span className="text-[8px] font-mono">EDUC-{new Date().getFullYear()}</span>
                                    </div>
                                </div>
                                {/* Ribbons */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-600 rotate-45 z-0"></div>
                            </div>

                            <div className="text-center">
                                <div className="font-serif text-2xl text-slate-700 mb-1 font-italic font-handwriting" style={{fontFamily: 'cursive'}}>Equipe EDUC</div>
                                <div className="h-px w-48 bg-slate-400 mx-auto mb-2"></div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Coordenação Pedagógica</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 py-4 bg-white border-t border-slate-100 sticky bottom-0 z-50">
         <Button 
            onClick={handleDownloadPDF} 
            variant="primary" 
            ageGroup={user.ageGroup} 
            disabled={isGenerating}
            className="shadow-lg min-w-[240px] flex justify-center !text-lg !py-3"
         >
            {isGenerating ? (
               <>
                 <Loader2 size={24} className="animate-spin mr-2" />
                 Gerando Arquivo...
               </>
            ) : (
               <>
                 <Download size={24} className="mr-2" />
                 Baixar PDF (Oficial)
               </>
            )}
         </Button>
         
         <Button 
            onClick={handleOpenDrive} 
            variant="secondary" 
            ageGroup={user.ageGroup} 
            icon={<Cloud size={20} />}
            className="!bg-indigo-50 !border-indigo-100 !text-indigo-600 hover:!bg-indigo-100"
         >
            Salvar na Nuvem
         </Button>
      </div>
    </div>
  );
};

// --- 2. TASKS SCREEN ---
export const TasksScreen: React.FC<FeatureScreenProps> = ({ user, onBack }) => {
   const [tasks, setTasks] = useState([
      { id: 1, title: 'Leitura: Capítulo 3 do Livro Digital', subject: 'Português', due: 'Hoje', status: 'pending' },
      { id: 2, title: 'Resolver 5 desafios de Fração', subject: 'Matemática', due: 'Amanhã', status: 'pending' },
      { id: 3, title: 'Projeto: Desenhar um mapa do bairro', subject: 'Geografia', due: '12/11', status: 'done' },
   ]);

   const [newTask, setNewTask] = useState('');
   const [showToast, setShowToast] = useState(false);

   const handleAddTask = () => {
      if (newTask.trim()) {
         const task = {
            id: Date.now(),
            title: newTask,
            subject: 'Pessoal',
            due: 'Sem data',
            status: 'pending'
         };
         setTasks([task, ...tasks]);
         setNewTask('');
         
         // Trigger Toast
         setShowToast(true);
         setTimeout(() => setShowToast(false), 3000);
      }
   };

   return (
      <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen relative">
         {/* Toast Notification */}
         {showToast && (
            <div className="fixed top-4 right-4 sm:bottom-8 sm:top-auto sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-50 animate-fade-in">
               <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-1">
                     <CheckCircle size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-sm">Nova tarefa adicionada!</span>
               </div>
            </div>
         )}

         <div className="flex items-center justify-between mb-8">
            <Button variant="secondary" onClick={onBack} ageGroup={user.ageGroup}>
               <ArrowLeft size={20} className="mr-2" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <ClipboardList className="text-blue-600" /> Tarefas da Turma
            </h1>
            <div className="w-10" />
         </div>

         {/* Add Task Input */}
         <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Adicionar Lembrete Pessoal</label>
            <div className="flex gap-2">
               <input 
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Ex: Ler 10 páginas do livro..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
               />
               <Button onClick={handleAddTask} variant="primary" ageGroup={user.ageGroup} className="!px-4">
                  <Plus size={20} />
               </Button>
            </div>
         </div>

         <div className="space-y-4">
            {tasks.map((task) => (
               <div key={task.id} className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                  task.status === 'done' 
                     ? 'bg-slate-50 border-slate-200 opacity-60' 
                     : 'bg-white border-blue-100 shadow-sm hover:border-blue-300'
               }`}>
                  <div className="flex items-start gap-3">
                     <div className={`mt-1 p-1 rounded-full ${task.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'}`}>
                        <CheckCircle size={20} />
                     </div>
                     <div>
                        <h3 className={`font-bold text-lg ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                           {task.title}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${task.subject === 'Pessoal' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-50 text-indigo-700'}`}>
                              {task.subject}
                           </span>
                           <span className="flex items-center gap-1 text-xs"><Clock size={12}/> Para: {task.due}</span>
                        </p>
                     </div>
                  </div>
                  {task.status === 'pending' && (
                     <Button variant="primary" ageGroup={user.ageGroup} className="!text-xs !px-4 !py-2">
                        Iniciar
                     </Button>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
};

// --- 3. NOTIFICATIONS SCREEN ---
export const NotificationsScreen: React.FC<FeatureScreenProps> = ({ user, onBack }) => {
   const notifications = [
      { id: 1, type: 'teacher', msg: 'Professora Ana: Lembrem-se de trazer o material de artes amanhã!', time: '10:30' },
      { id: 2, type: 'system', msg: 'Você ganhou a medalha "Explorador Curioso"!', time: 'Ontem' },
      { id: 3, type: 'system', msg: 'Novo desafio de Matemática disponível.', time: 'Ontem' },
   ];

   return (
      <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen">
         <div className="flex items-center justify-between mb-8">
            <Button variant="secondary" onClick={onBack} ageGroup={user.ageGroup}>
               <ArrowLeft size={20} className="mr-2" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <Bell className="text-red-500" /> Notificações
            </h1>
            <div className="w-10" />
         </div>

         <div className="space-y-4">
            {notifications.map((notif) => (
               <div key={notif.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                     notif.type === 'teacher' ? 'bg-purple-100 text-purple-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                     {notif.type === 'teacher' ? <User size={20} /> : <Award size={20} />}
                  </div>
                  <div className="flex-1">
                     <p className="text-slate-800 font-medium">{notif.msg}</p>
                     <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                  </div>
                  <button className="text-slate-300 hover:text-red-400">
                     <Trash2 size={16} />
                  </button>
               </div>
            ))}
         </div>
      </div>
   );
};

// --- 4. MESSAGES SCREEN ---
export const MessagesScreen: React.FC<FeatureScreenProps> = ({ user, onBack }) => {
   const [input, setInput] = useState('');
   const [messages, setMessages] = useState([
      { id: 1, sender: 'teacher', text: 'Olá turma! Como estão indo nos desafios de hoje?', time: '09:00' },
      { id: 2, sender: 'me', text: 'Oi Pro! Estou com dúvida na missão da floresta.', time: '09:05' },
      { id: 3, sender: 'teacher', text: 'Pode falar, qual parte você não entendeu?', time: '09:06' },
   ]);

   const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim()) {
         setMessages([...messages, { id: Date.now(), sender: 'me', text: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
         setInput('');
      }
   };

   return (
      <div className="container mx-auto px-4 py-8 max-w-2xl h-screen flex flex-col">
         {/* Header */}
         <div className="flex items-center justify-between mb-4 shrink-0">
            <Button variant="secondary" onClick={onBack} ageGroup={user.ageGroup}>
               <ArrowLeft size={20} className="mr-2" /> Voltar
            </Button>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               <MessageCircle className="text-green-600" /> Fale com a Professora
            </h1>
            <div className="w-10" />
         </div>

         {/* Chat Area */}
         <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-50 p-3 border-b border-slate-100 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-purple-600 font-bold">
                  P
               </div>
               <div>
                  <p className="font-bold text-sm text-slate-700">Professora Ana</p>
                  <p className="text-xs text-green-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online agora</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
               {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-3 rounded-2xl text-sm relative ${
                        msg.sender === 'me' 
                           ? 'bg-indigo-500 text-white rounded-tr-none' 
                           : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                     }`}>
                        <p>{msg.text}</p>
                        <span className={`text-[10px] block text-right mt-1 opacity-70`}>{msg.time}</span>
                     </div>
                  </div>
               ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
               <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
               />
               <button 
                  type="submit" 
                  className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center w-10 h-10 shadow-md"
               >
                  <Send size={18} className="ml-0.5" />
               </button>
            </form>
         </div>
         <p className="text-center text-xs text-slate-400 mt-2">
            * Mensagens são monitoradas pela coordenação para sua segurança.
         </p>
      </div>
   );
};