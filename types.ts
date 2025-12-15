
export type AgeGroup = '6-8' | '9-11' | '12-14';

export enum Subject {
  PORTUGUESE = 'Língua Portuguesa',
  MATH = 'Matemática',
  GENERAL_KNOWLEDGE = 'Conhecimentos Gerais',
  ENTREPRENEURSHIP = 'Empreendedorismo'
}

export type Difficulty = 'easy' | 'medium' | 'hard';

// --- PEDAGOGICAL DIAGNOSTIC LEVELS ---
export enum LiteracyLevel {
  PRE_SYLLABIC = 'Pré-silábico',
  SYLLABIC_NO_VALUE = 'Silábico s/ valor sonoro',
  SYLLABIC_WITH_VALUE = 'Silábico c/ valor sonoro',
  ALPHABETIC = 'Alfabético',
  FLUENT_READER = 'Leitor Fluente'
}

export enum NumeracyLevel {
  NUMBER_WRITING = 'Escrita Numérica',
  LOGICAL_REASONING = 'Raciocínio Lógico',
  PROBLEM_SOLVING = 'Resolução de Problemas'
}

export interface TopicMetrics {
  topicId: string;
  masteryLevel: number; // 0 to 100
  consecutiveCorrect: number;
  consecutiveWrong: number;
  lastAttemptAt: number; // timestamp
  currentDifficulty: Difficulty;
}

// --- NEW: ACTION PLAN & REPORT ---
export interface LessonPlan {
  week: number;
  theme: string;
  activities: string[];
  objective: string;
}

export interface AssessmentReport {
  id: string;
  generatedAt: string;
  literacyLevel: LiteracyLevel;
  numeracyLevel: NumeracyLevel;
  strengths: string[];
  areasToImprove: string[];
  actionPlan: LessonPlan[]; // The 10-week plan
}

export interface UserProfile {
  id?: string;
  name: string;
  password?: string; // New field for authentication
  age: number;
  ageGroup: AgeGroup;
  avatar: string;
  xp: number;
  level: number;
  badges: string[];
  consentGiven: boolean;
  parentEmail?: string; // Guardian's email linked to this student
  parentName?: string; // Guardian's name
  createdAt?: string;
  lastLogin?: string;
  status?: 'active' | 'inactive' | 'blocked';
  
  // Pedagogical Profile
  literacyLevel?: LiteracyLevel;
  numeracyLevel?: NumeracyLevel;
  assessmentReport?: AssessmentReport; // Stores the generated PDF data
  
  // Adaptive Learning Data
  learningStats: Record<string, TopicMetrics>;
  
  // Accessibility Preferences
  accessibility: {
    highContrast: boolean;
    dyslexiaFont: boolean;
    soundEnabled: boolean;
  }
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  difficulty: Difficulty;
  topic: string;
  visualKeyword?: string; // New field for visual cues (e.g., 'dog', 'calculator', 'tree')
}

export interface EducationalActivity {
  subject: Subject;
  topic: string;
  questions: Question[];
}

export type ViewState = 'LANDING' | 'AUTH' | 'ONBOARDING' | 'DIAGNOSTIC' | 'DASHBOARD' | 'ACTIVITY' | 'PROFILE' | 'PARENT_AREA' | 'ADMIN_LOGIN' | 'ADMIN_CONSOLE' | 'REPORT_VIEW' | 'CERTIFICATES' | 'TASKS' | 'NOTIFICATIONS' | 'MESSAGES';

// --- ADMIN & ANALYTICS TYPES ---

export type AdminRole = 'MASTER' | 'OPERATIONAL' | 'PEDAGOGICAL' | 'SUPPORT';

export interface AdminUser {
  id: string;
  name: string;
  role: AdminRole;
  email: string;
  phone?: string; // New field
  avatar?: string; // New field
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetResource: string;
  timestamp: string;
  details: string;
}

export interface SystemAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'STUCK_USER' | 'DROPOFF_RISK' | 'FRAUD_SUSPICION' | 'SYSTEM_ERROR';
  message: string;
  affectedUserId?: string;
  timestamp: string;
  status: 'open' | 'resolved';
}

export interface UserActivityLog {
  id: string;
  userId: string;
  activityType: 'LOGIN' | 'MISSION_ATTEMPT' | 'MISSION_COMPLETE' | 'LEVEL_UP' | 'BADGE_EARNED';
  timestamp: string; // ISO
  metadata: {
    subject?: Subject;
    result?: 'success' | 'failure';
    xpEarned?: number;
    durationSeconds?: number;
  };
}
