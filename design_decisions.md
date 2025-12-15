# Decisões Tomadas + Assunções

## 1. Gamificação Não-Predatória
**Decisão:** Utilizamos um sistema de XP e Níveis linear, sem "energia" (vidas) limitante ou cronômetros de pressão excessiva.
**Motivo:** Evitar ansiedade em crianças e garantir que o foco seja o aprendizado, permitindo tentativas ilimitadas.
**Assunção:** A motivação intrínseca será mantida pela variação de conteúdo gerada pela IA e pela progressão visual do avatar/badge (mockado para este MVP).

## 2. Acessibilidade Cognitiva (UX por Idade)
**Decisão:** Criamos 3 temas visuais distintos (Fontes, Cores, Espaçamento) controlados pela prop `ageGroup` no `Layout` e `Button`.
- **6-8:** Fonte 'Fredoka' (arredondada), contraste alto, menos texto.
- **9-11:** Fonte 'Nunito', visual de cards tipo 'jogo de tabuleiro'.
- **12-14:** Fonte 'Orbitron' (headers) e modo escuro, estética Cyber/Tech.
**Motivo:** Um jovem de 13 anos rejeita imediatamente interfaces que pareçam "de criança". A adaptação é crucial para retenção.

## 3. Integração com Gemini (Pedagogia)
**Decisão:** O prompt do Gemini (`geminiService.ts`) injeta explicitamente o contexto da BNCC.
**Assunção:** A IA tem conhecimento suficiente da Base Nacional Comum Curricular para calibrar a dificuldade e o vocabulário (ex: "lúdico" para 6 anos vs "desafio lógico" para 13).
**Segurança:** Usamos `responseSchema` para forçar JSON estrito, evitando alucinações de formato que quebrariam o app.

## 4. Segurança de Dados (LGPD)
**Decisão:** O input de nome é local (estado React). A única info enviada para a API do Gemini é a idade (número) e o tema.
**Motivo:** Privacidade por design (Privacy by Design). Não enviamos PII (Personal Identifiable Information) para a cloud.

## 5. Estrutura Técnica
**Decisão:** SPA (Single Page Application) sem roteamento complexo de URL para este MVP.
**Motivo:** Facilita a implantação e demonstração fluida das transições de estado sem recarregar recursos.