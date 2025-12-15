import React, { useRef, useState } from 'react';
import { AssessmentReport, UserProfile } from '../types';
import { Button } from './ui/Button';
import { Download, ArrowLeft, CheckCircle, Target, Calendar, Printer, Cloud, Loader2, ExternalLink } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface AssessmentReportViewProps {
  user: UserProfile;
  report: AssessmentReport;
  onBack: () => void;
  onHomeClick?: () => void;
}

export const AssessmentReportView: React.FC<AssessmentReportViewProps> = ({ user, report, onBack, onHomeClick }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setIsGenerating(true);
    
    try {
      // 1. Capture the DOM element
      // We perform a slight scroll reset to ensure capture integrity
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for render

      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // High resolution
        useCORS: true, // Allow external images (avatars)
        allowTaint: true,
        backgroundColor: '#ffffff', // Ensure white background
        logging: false
      });

      // 2. Prepare PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // A4 Portrait: 210mm x 297mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page or fit-to-page logic
      // For this MVP report, we fit width and let height scale. 
      // If it's too long, we might just add it to one long page or scale to fit.
      // Here we scale to fit width.
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
      
      const dateStr = new Date().toLocaleDateString().replace(/\//g, '-');
      pdf.save(`Relatorio_Pedagogico_${user.name.replace(/\s+/g, '_')}_${dateStr}.pdf`);

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao gerar o relatório. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDrive = () => {
    // Opens Google Drive in a new tab for the user to upload manually
    window.open('https://drive.google.com/drive/my-drive', '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 print:p-0 print:bg-white flex flex-col items-center">
      
      {/* Control Bar */}
      <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <Button variant="secondary" onClick={onBack} ageGroup={user.ageGroup}>
          <ArrowLeft size={18} className="mr-2" /> Voltar
        </Button>
        
        <div className="flex gap-3">
            <Button 
                variant="secondary" 
                onClick={handleSaveToDrive} 
                ageGroup={user.ageGroup}
                className="!bg-white !border-slate-300 !text-slate-600 hover:!bg-slate-50"
            >
                <Cloud size={18} className="mr-2" /> 
                <span className="hidden sm:inline">Salvar no</span> Drive <ExternalLink size={12} className="ml-1 opacity-50" />
            </Button>

            <Button 
                variant="primary" 
                onClick={handleDownloadPDF} 
                disabled={isGenerating}
                ageGroup={user.ageGroup}
                className="min-w-[180px]"
            >
                {isGenerating ? (
                    <>
                        <Loader2 size={18} className="mr-2 animate-spin" /> Gerando PDF...
                    </>
                ) : (
                    <>
                        <Download size={18} className="mr-2" /> Baixar Relatório
                    </>
                )}
            </Button>
        </div>
      </div>

      {/* The Report Container (Ref Target) */}
      <div className="w-full flex justify-center overflow-hidden">
          <div 
            ref={reportRef}
            className="w-full max-w-[210mm] bg-white shadow-2xl print:shadow-none p-8 sm:p-12 min-h-[297mm] text-slate-800"
          >
            
            {/* Header */}
            <header className="border-b-4 border-educ-primary pb-6 mb-8 flex justify-between items-start">
              <div>
                 <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 uppercase tracking-wider">Relatório Pedagógico</h1>
                 <p className="text-slate-500 font-medium">Plano de Ação Bimestral Personalizado</p>
              </div>
              <div className="text-right">
                 <div 
                   className="text-2xl font-bold text-educ-primary"
                   title="EDUC"
                 >
                   EDUC
                 </div>
                 <p className="text-xs sm:text-sm text-slate-400">Espaço Pedagógico Gamificado</p>
                 <p className="text-[10px] sm:text-xs text-slate-400 mt-1">Gerado em: {new Date(report.generatedAt).toLocaleDateString()}</p>
              </div>
            </header>

            {/* Student Info */}
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex gap-6 items-center">
               <div className="relative">
                   <img 
                    src={user.avatar} 
                    crossOrigin="anonymous" 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full border-2 border-white shadow-sm bg-indigo-50" 
                   />
               </div>
               <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Estudante</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{user.name}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
                     <span>Idade: <strong>{user.age} anos</strong></span>
                     <span>Grupo: <strong>{user.ageGroup}</strong></span>
                     <span>Nível Atual: <strong>{user.level}</strong></span>
                  </div>
               </div>
            </section>

            {/* Diagnosis Results */}
            <section className="mb-10">
               <h3 className="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 uppercase">
                 1. Resultado da Sondagem
               </h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 border border-slate-200 rounded-lg">
                     <p className="text-sm text-slate-500 mb-1">Hipótese de Escrita (Português)</p>
                     <p className="text-lg sm:text-xl font-bold text-indigo-700">{report.literacyLevel}</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                     <p className="text-sm text-slate-500 mb-1">Nível Matemático</p>
                     <p className="text-lg sm:text-xl font-bold text-blue-700">{report.numeracyLevel}</p>
                  </div>
               </div>

               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <p className="font-bold text-green-700 flex items-center gap-2 mb-2">
                        <CheckCircle size={16} /> Pontos Fortes Identificados
                     </p>
                     <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 bg-green-50 p-3 rounded-lg">
                        {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
                     </ul>
                  </div>
                  <div>
                     <p className="font-bold text-orange-700 flex items-center gap-2 mb-2">
                        <Target size={16} /> Foco de Desenvolvimento
                     </p>
                     <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 bg-orange-50 p-3 rounded-lg">
                        {report.areasToImprove.map((s, i) => <li key={i}>{s}</li>)}
                     </ul>
                  </div>
               </div>
            </section>

            {/* Action Plan */}
            <section>
               <h3 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 mb-6 uppercase flex items-center justify-between">
                 <span>2. Plano de Ação (10 Aulas)</span>
                 <span className="text-xs font-normal bg-emerald-100 text-emerald-800 px-2 py-1 rounded normal-case">Bimestre 1</span>
               </h3>

               <div className="space-y-0 border-l-2 border-slate-200 ml-3">
                  {report.actionPlan.map((lesson) => (
                     <div key={lesson.week} className="relative pl-8 pb-8 last:pb-0 break-inside-avoid">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-slate-300"></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                           <h4 className="font-bold text-slate-800 text-lg">Semana {lesson.week}: {lesson.theme}</h4>
                        </div>
                        
                        <p className="text-sm text-slate-500 italic mb-2 flex items-center gap-1">
                           <Target size={12} /> Objetivo: {lesson.objective}
                        </p>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Atividades Sugeridas:</p>
                           <ul className="space-y-1">
                              {lesson.activities.map((act, idx) => (
                                 <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 shrink-0"></span>
                                    {act}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  ))}
               </div>
            </section>

            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
               <p>Este documento é um direcionamento pedagógico baseado em algoritmos de sondagem da plataforma EDUC.</p>
               <p>EDUC © {new Date().getFullYear()} - Espaço Pedagógico Integrado à BNCC.</p>
            </footer>

          </div>
      </div>
    </div>
  );
};