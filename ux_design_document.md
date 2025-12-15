# Especificação de UX e Design System - EDUC

## 1. Fluxos de Usuário (User Flows)

### A. Fluxo do Aluno (The Hero's Journey)
Este fluxo adapta-se visualmente e textualmente à idade, mas a espinha dorsal é a mesma.

1.  **Onboarding (O Chamado):**
    *   Entrada no app -> Escolha de Avatar -> Definição de Nome/Idade -> *Hook* Narrativo (Vídeo ou Texto do Guia).
2.  **Dashboard (O Mapa Mundi):**
    *   Visão geral dos "Biomas" (Matérias) -> Seleção de Bioma.
3.  **Seleção de Missão (O Desafio):**
    *   Lista de missões desbloqueadas -> Escolha da missão -> Briefing do Personagem.
4.  **Atividade (A Batalha):**
    *   Apresentação do Problema -> Tentativa -> Feedback Imediato (Erro/Acerto) -> Adaptação (se errar muito).
5.  **Recompensa (O Tesouro):**
    *   Tela de Vitória -> Ganho de XP -> Feedback de "Level Up" (se houver) -> Drop de Badge (se houver).
6.  **Retorno:**
    *   Volta ao Mapa com progresso visual atualizado.

### B. Fluxo do Responsável (The Guardian)
Focado em transparência, controle e insights rápidos.

1.  **Acesso:**
    *   Botão discreto "Área dos Pais" -> Pin de Segurança (simples, ex: conta matemática).
2.  **Dashboard Parental:**
    *   Visão geral de tempo de uso, matérias favoritas e pontos de dificuldade.
3.  **Gestão:**
    *   Edição de perfil da criança, consentimento LGPD, exclusão de conta.

---

## 2. Lista de Telas (Sitemap)

Abaixo, a arquitetura de informação detalhada em telas.

### Grupo 1: Acesso & Onboarding
1.  **Splash Screen:** Logo animado, carregamento de assets.
2.  **Welcome Screen:** "Quem é você?" (Aluno ou Responsável).
3.  **Parent Consent (LGPD):** Texto jurídico simplificado + Checkbox obrigatório.
4.  **Avatar Creator:** Seleção de personagem + Cor de fundo.
5.  **Name & Age Input:** Formulário gamificado.
6.  **Intro Narrative:** Tela de história apresentando o guia (Teco/Aura/Prime).

### Grupo 2: Navegação Principal (Aluno)
7.  **Main Dashboard (Home):** O Hub central com os 4 biomas e barra de XP.
8.  **Subject Map (Trilha):** Visão detalhada de uma matéria (ex: Mapa da Floresta) com nós de missões.
9.  **Mission Briefing:** Modal pop-up explicando o objetivo antes de começar.
10. **Profile/Passport:** Status, Badges coletadas, Personalização.
11. **Shop (Opcional/Futuro):** Troca de moedas virtuais por skins (sem dinheiro real).

### Grupo 3: Atividade (Core Loop)
12. **Activity Stage (Question):** A pergunta em si, opções, botão de áudio (TTS).
13. **Hint Modal:** Tela de ajuda/dica quando o sistema detecta travamento.
14. **Success Feedback:** Tela "Mandou Bem!", animação de confete, XP somando.
15. **Correction Feedback:** Tela "Quase lá", explicação do erro, botão de tentar de novo.
16. **Level Up:** Tela especial full-screen quando o nível sobe.

### Grupo 4: Área dos Pais
17. **Gatekeeper (Security):** "Para entrar, responda: quanto é 8 + 5?".
18. **Parent Dashboard:** Gráficos de proficiência por matéria.
19. **Detailed Report:** Lista das últimas atividades e erros frequentes.
20. **Settings:** Controle de som, acessibilidade padrão, reset de dados.

---

## 3. Acessibilidade & Inclusão (A11y)

### Ferramentas Integradas
*   **TTS (Text-to-Speech):** Botão de "Ouvir Pergunta" em todas as telas de atividade. Essencial para não-alfabetizados e disléxicos.
*   **Modo Dislexia:** Troca a fonte global para uma fonte com pesos na base (simulada via OpenDyslexic ou similar sans-serif robusta).
*   **Alto Contraste:** Modo que força fundo preto/branco e bordas grossas para baixa visão.

### Cores e Contraste
*   Evitar verde/vermelho puro para erro/acerto. Usar ícones (Check/X) junto com a cor.
*   Textos sempre com taxa de contraste AA ou AAA (WCAG).

---

## 4. Padrões de UI (Design System)

### Botões
*   **Primary:** Ação principal (Confirmar, Próximo). Cor sólida, sombra dura (3D feeling).
*   **Secondary:** Ações alternativas (Editar, Voltar). Borda colorida, fundo transparente.
*   **Ghost:** Links discretos ou ações destrutivas.

### Feedback Loop
*   **Positivo:** Som agudo e ascendente. Cor Verde/Azul. Palavras: "Incrível", "Uau", "Correto".
*   **Neutro/Corretivo:** Som grave e suave (não buzina de erro). Cor Laranja/Amarelo. Palavras: "Quase", "Vamos ver de novo", "Tente outra vez".

### Microcopy
*   **Erro de Sistema:** "O Teco tropeçou nos fios!" (Jamais: "Erro 500").
*   **Carregando:** "Viajando para a Cidadela..." (Jamais: "Loading").
