
import { Difficulty, TopicMetrics, AgeGroup } from '../types';

/**
 * ADAPTIVE LEARNING ENGINE
 * Rules defined by Pedagogical Team
 */

const MASTERY_CAP = 100;
const MIN_MASTERY = 0;

// Points gained per difficulty
const MASTERY_GAINS = {
  easy: 5,
  medium: 10,
  hard: 15
};

// Points lost on error (gentle penalty)
const MASTERY_PENALTY = 5;

// Progression Thresholds
const THRESHOLD_TO_PROMOTE = 3; // 3 correct in a row
const THRESHOLD_TO_DEMOTE = 2;  // 2 wrong in a row

export const getInitialTopicMetrics = (topicId: string): TopicMetrics => ({
  topicId,
  masteryLevel: 0,
  consecutiveCorrect: 0,
  consecutiveWrong: 0,
  lastAttemptAt: Date.now(),
  currentDifficulty: 'medium' // Default start point for diagnosis
});

/**
 * Calculates the next state of the user based on their answer.
 */
export const calculateProgression = (
  currentMetrics: TopicMetrics,
  isCorrect: boolean,
  currentDifficulty: Difficulty
): TopicMetrics => {
  const newMetrics = { ...currentMetrics, lastAttemptAt: Date.now() };

  if (isCorrect) {
    // Update Streaks
    newMetrics.consecutiveCorrect += 1;
    newMetrics.consecutiveWrong = 0;

    // Update Mastery
    newMetrics.masteryLevel = Math.min(
      MASTERY_CAP,
      newMetrics.masteryLevel + (MASTERY_GAINS[currentDifficulty] || 5)
    );

    // Check for Promotion
    if (newMetrics.consecutiveCorrect >= THRESHOLD_TO_PROMOTE) {
      if (newMetrics.currentDifficulty === 'easy') newMetrics.currentDifficulty = 'medium';
      else if (newMetrics.currentDifficulty === 'medium') newMetrics.currentDifficulty = 'hard';
      
      // Reset streak after promotion to prove consistency at new level
      newMetrics.consecutiveCorrect = 0; 
    }

  } else {
    // Update Streaks
    newMetrics.consecutiveCorrect = 0;
    newMetrics.consecutiveWrong += 1;

    // Update Mastery (Gentle fall)
    newMetrics.masteryLevel = Math.max(
      MIN_MASTERY,
      newMetrics.masteryLevel - MASTERY_PENALTY
    );

    // Check for Demotion (Reinforcement)
    if (newMetrics.consecutiveWrong >= THRESHOLD_TO_DEMOTE) {
      if (newMetrics.currentDifficulty === 'hard') newMetrics.currentDifficulty = 'medium';
      else if (newMetrics.currentDifficulty === 'medium') newMetrics.currentDifficulty = 'easy';
      
      newMetrics.consecutiveWrong = 0;
    }
  }

  return newMetrics;
};

/**
 * Generates feedback text prompt for the AI based on performance.
 */
export const getAdaptiveFeedbackPrompt = (
  isCorrect: boolean, 
  difficulty: Difficulty, 
  metrics: TopicMetrics,
  ageGroup: AgeGroup
): string => {
  if (isCorrect) {
    if (metrics.consecutiveCorrect >= THRESHOLD_TO_PROMOTE && difficulty !== 'hard') {
      return "O aluno acertou várias seguidas! Elogie o progresso e diga que o desafio vai aumentar.";
    }
    return "Elogie o acerto de forma motivadora.";
  } else {
    if (metrics.consecutiveWrong >= THRESHOLD_TO_DEMOTE && difficulty !== 'easy') {
      return "O aluno errou. Diga que está tudo bem e que vamos tentar algo um pouco mais simples para praticar.";
    }
    if (difficulty === 'easy') {
      // Stuck Detection
      return "O aluno está com dificuldade no nível básico. Dê uma dica muito clara, use uma analogia do dia-a-dia e explique passo a passo.";
    }
    return "Explique onde foi o erro de forma gentil e encoraje a tentar novamente.";
  }
};
