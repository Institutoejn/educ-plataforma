
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

// Inicializa vazio - SOMENTE alunos cadastrados manualmente aparecerão
let _usersStore: UserProfile[] = [];

/**
 * Returns the current list of users (Real registrations only)
 */
export const getAllUsers = (): UserProfile[] => {
  return [..._usersStore]; // Return copy
};

/**
 * Registers a new real user from the App flow into the Admin "Database"
 */
export const registerUserToAdmin = (user: UserProfile) => {
  // Add new user to the top of the list
  _usersStore.unshift({
    ...user,
    id: user.id || `usr-${Date.now().toString().slice(-6)}`, // Generate simple numeric-like ID
    createdAt: new Date().toISOString(),
    status: 'active',
    lastLogin: new Date().toISOString()
  });
};

/**
 * Validates student credentials
 */
export const authenticateStudent = (identifier: string, password: string): UserProfile | null => {
  // Allow login by exact Name OR ID
  const user = _usersStore.find(u => 
    (u.name.toLowerCase() === identifier.toLowerCase() || u.id === identifier) && 
    u.password === password
  );
  
  if (user) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      return user;
  }
  return null;
};

// Generate Alerts
export const generateAlerts = (): SystemAlert[] => [
  {
    id: 'alt-1',
    severity: 'medium',
    type: 'DROPOFF_RISK',
    message: 'Sistema aguardando novos cadastros para análise de retenção.',
    timestamp: new Date().toISOString(),
    status: 'open'
  }
];

// Generate Activity Logs for "Yesterday" and "Today"
export const generateActivityLogs = (userId: string): UserActivityLog[] => {
  const logs: UserActivityLog[] = [];
  const now = Date.now();
  
  // Generic logs for demo purposes if user is new
  logs.push({
    id: `log-${now}`, userId, activityType: 'LOGIN', timestamp: new Date().toISOString(), metadata: {}
  });

  return logs;
};

// Mock Audit Logs
export const generateAuditLogs = (): AuditLog[] => [
  {
    id: 'aud-1', actorId: 'admin-001', actorName: 'Sofia Gestora', action: 'SYSTEM_INIT', 
    targetResource: 'db_users', timestamp: new Date().toISOString(), details: 'Sistema reiniciado. Banco de dados limpo.'
  }
];
