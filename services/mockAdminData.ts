
import { UserProfile, AdminUser, AuditLog, SystemAlert, UserActivityLog, Subject } from '../types';

// Mock Admin User
export const CURRENT_ADMIN: AdminUser = {
  id: 'admin-001',
  name: 'Sofia Gestora',
  role: 'MASTER', // Try changing to SUPPORT to see restricted view
  email: 'sofia@educ.com',
  phone: '(11) 99876-5432',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia'
};

// --- IN-MEMORY DATABASE SIMULATION ---

// Store generated users here so they persist during the session
let _usersStore: UserProfile[] = [];

// Helper to initialize if empty
const initStore = () => {
  if (_usersStore.length === 0) {
    _usersStore = Array.from({ length: 15 }).map((_, i) => ({
      id: `usr-${1000 + i}`,
      name: `Aluno Teste ${i + 1}`,
      age: 7 + (i % 8),
      ageGroup: i % 3 === 0 ? '6-8' : i % 3 === 1 ? '9-11' : '12-14',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      xp: Math.floor(Math.random() * 5000),
      level: Math.floor(Math.random() * 20) + 1,
      badges: Array(Math.floor(Math.random() * 5)).fill('badge'),
      consentGiven: true,
      parentEmail: `responsavel${i}@email.com`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString(),
      status: i % 10 === 0 ? 'blocked' : i % 5 === 0 ? 'inactive' : 'active',
      learningStats: {},
      accessibility: { highContrast: false, dyslexiaFont: false, soundEnabled: true }
    }));
  }
};

/**
 * Returns the current list of users (Mock + Real registrations)
 */
export const getAllUsers = (): UserProfile[] => {
  initStore();
  return [..._usersStore]; // Return copy
};

/**
 * Registers a new real user from the App flow into the Admin "Database"
 */
export const registerUserToAdmin = (user: UserProfile) => {
  initStore();
  // Add new user to the top of the list
  _usersStore.unshift({
    ...user,
    id: user.id || `usr-real-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'active',
    lastLogin: new Date().toISOString()
  });
};

// Generate Alerts
export const generateAlerts = (): SystemAlert[] => [
  {
    id: 'alt-1',
    severity: 'high',
    type: 'STUCK_USER',
    message: 'Aluno "João Silva" errou 5x seguidas em Matemática (Fração).',
    affectedUserId: 'usr-1005',
    timestamp: new Date().toISOString(),
    status: 'open'
  },
  {
    id: 'alt-2',
    severity: 'medium',
    type: 'DROPOFF_RISK',
    message: 'Queda de frequência de 15% na faixa etária 12-14 anos.',
    timestamp: new Date().toISOString(),
    status: 'open'
  },
  {
    id: 'alt-3',
    severity: 'critical',
    type: 'FRAUD_SUSPICION',
    message: 'Múltiplos logins simultâneos na conta usr-1022.',
    affectedUserId: 'usr-1022',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'resolved'
  }
];

// Generate Activity Logs for "Yesterday" and "Today"
export const generateActivityLogs = (userId: string): UserActivityLog[] => {
  const logs: UserActivityLog[] = [];
  const now = Date.now();
  
  // Today's activities
  logs.push({
    id: 'log-1', userId, activityType: 'LOGIN', timestamp: new Date(now - 3600000).toISOString(), metadata: {}
  });
  logs.push({
    id: 'log-2', userId, activityType: 'MISSION_COMPLETE', timestamp: new Date(now - 3000000).toISOString(), 
    metadata: { subject: Subject.MATH, result: 'success', xpEarned: 15, durationSeconds: 45 }
  });
  logs.push({
    id: 'log-3', userId, activityType: 'MISSION_ATTEMPT', timestamp: new Date(now - 1000000).toISOString(), 
    metadata: { subject: Subject.PORTUGUESE, result: 'failure', durationSeconds: 120 }
  });

  // Yesterday's activities
  logs.push({
    id: 'log-4', userId, activityType: 'LOGIN', timestamp: new Date(now - 86400000 - 3600000).toISOString(), metadata: {}
  });
  logs.push({
    id: 'log-5', userId, activityType: 'LEVEL_UP', timestamp: new Date(now - 86400000 - 2000000).toISOString(), 
    metadata: { xpEarned: 0 }
  });

  return logs;
};

// Mock Audit Logs
export const generateAuditLogs = (): AuditLog[] => [
  {
    id: 'aud-1', actorId: 'admin-001', actorName: 'Sofia Gestora', action: 'RESET_PASSWORD', 
    targetResource: 'usr-1005', timestamp: new Date().toISOString(), details: 'Solicitado via suporte ticket #999'
  },
  {
    id: 'aud-2', actorId: 'admin-002', actorName: 'Carlos Pedagogico', action: 'UPDATE_CONTENT', 
    targetResource: 'mission-math-05', timestamp: new Date(Date.now() - 5000000).toISOString(), details: 'Correção de erro ortográfico'
  }
];
