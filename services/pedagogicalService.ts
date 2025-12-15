
import { LiteracyLevel, NumeracyLevel, AgeGroup, AssessmentReport, LessonPlan } from '../types';

/**
 * GERA O PLANO DE AÇÃO BIMESTRAL (10 AULAS)
 * Baseado na interseção dos níveis diagnosticados.
 */
export const generateAssessmentReport = (
  literacy: LiteracyLevel,
  numeracy: NumeracyLevel,
  ageGroup: AgeGroup
): AssessmentReport => {

  const plan: LessonPlan[] = [];
  const strengths: string[] = [];
  const areasToImprove: string[] = [];

  // --- 1. Determinar Pontos Fortes e a Melhorar ---
  
  if (literacy === LiteracyLevel.FLUENT_READER) {
    strengths.push("Leitura fluida e compreensão de texto.");
    areasToImprove.push("Produção textual complexa e gramática avançada.");
  } else if (literacy === LiteracyLevel.ALPHABETIC) {
    strengths.push("Reconhecimento de fonemas e escrita de palavras simples.");
    areasToImprove.push("Fluência de leitura e interpretação.");
  } else {
    strengths.push("Interesse visual e reconhecimento de símbolos.");
    areasToImprove.push("Consciência fonológica e alfabeto.");
  }

  if (numeracy === NumeracyLevel.LOGICAL_REASONING) {
    strengths.push("Raciocínio lógico e sequencial.");
  } else {
    areasToImprove.push("Resolução de problemas matemáticos básicos.");
  }

  // --- 2. Gerar Plano de 10 Semanas (Lógica Determinística para MVP) ---
  
  // Base Curriculum Switcher
  const isEarlyLiteracy = [LiteracyLevel.PRE_SYLLABIC, LiteracyLevel.SYLLABIC_NO_VALUE, LiteracyLevel.SYLLABIC_WITH_VALUE].includes(literacy);
  
  for (let i = 1; i <= 10; i++) {
    let theme = "";
    let objective = "";
    let activities: string[] = [];

    // Week 1-2: Foundations
    if (i <= 2) {
      if (isEarlyLiteracy) {
        theme = "Mundo das Letras e Sons";
        objective = "Associar sons iniciais a imagens.";
        activities = ["Jogo da memória com letras", "Caça ao tesouro de objetos que começam com 'A'"];
      } else {
        theme = "Interpretação e Contexto";
        objective = "Ler e compreender pequenos parágrafos.";
        activities = ["Quiz de interpretação de lendas", "Reconstrução de frases embaralhadas"];
      }
    } 
    // Week 3-4: Numeracy Focus
    else if (i <= 4) {
      theme = "Detetive dos Números";
      objective = numeracy === NumeracyLevel.NUMBER_WRITING 
        ? "Associar quantidade ao número escrito." 
        : "Resolver pequenos problemas de lógica.";
      activities = ["Contagem de itens na floresta", "Desafio da balança (Maior/Menor)"];
    }
    // Week 5: Consolidation (Review)
    else if (i === 5) {
      theme = "Semana do Desafio Integrado";
      objective = "Unir Português e Matemática em uma missão única.";
      activities = ["Receita Culinária (Ler ingredientes + Contar colheres)"];
    }
    // Week 6-8: Advanced Topics based on Age
    else if (i <= 8) {
      if (ageGroup === '6-8') {
        theme = "Formas e Rimas";
        objective = "Geometria básica e sons finais das palavras.";
        activities = ["Construção com formas geométricas", "Batalha de rimas do Teco"];
      } else {
        theme = "Projetos e Curiosidades";
        objective = "Pesquisa e lógica aplicada.";
        activities = ["Investigação científica (Ciências)", "Planejamento de viagem (Ed. Financeira)"];
      }
    }
    // Week 9-10: Autonomy
    else {
      theme = "Projeto Final do Bimestre";
      objective = "Aplicar todo o conhecimento para 'Salvar Omnia'.";
      activities = ["Criação de uma pequena história", "Resolução do Enigma Final"];
    }

    plan.push({
      week: i,
      theme,
      objective,
      activities
    });
  }

  return {
    id: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    literacyLevel: literacy,
    numeracyLevel: numeracy,
    strengths,
    areasToImprove,
    actionPlan: plan
  };
};
