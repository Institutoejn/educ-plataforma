
import { UserProfile, AdminUser, AuditLog, SystemAlert, UserActivityLog, Subject } from '../types';

// Mock Admin User (The logged in admin)
export const CURRENT_ADMIN: AdminUser = {
  id: 'admin-001',
  name: 'Sofia Gestora',
  role: 'MASTER',
  email: 'sofia@educ.com',
  phone: '(11) 99876-5432',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia'
};

// --- REAL-TIME IN-MEMORY DATABASE ---

let _usersStore: UserProfile[] = [];
let _alertsStore: SystemAlert[] = [];
let _auditStore: AuditLog[] = [];
let _activityLogStore: UserActivityLog[] = [];

// --- GETTERS ---

export const getAllUsers = (): UserProfile[] => [..._usersStore];
export const getAllAlerts = (): SystemAlert[] => [..._alertsStore];
export const getAllAuditLogs = (): AuditLog[] => [..._auditStore];
export const getUserActivityLogs = (userId: string): UserActivityLog[] => 
  _activityLogStore.filter(log => log.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// --- ACTIONS / SETTERS ---

/**
 * Registers a new real user and logs the event
 */
export const registerUserToAdmin = (user: UserProfile) => {
  const newUser = {
    ...user,
    id: user.id || `usr-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: 'active' as const,
    lastLogin: new Date().toISOString()
  };
  
  _usersStore.unshift(newUser);

  // Auto-Log Audit
  logAuditAction({
    actorId: 'system',
    actorName: 'Sistema de Cadastro',
    action: 'CREATE_USER',
    targetResource: newUser.name,
    details: `Novo aluno cadastrado via Onboarding: ${newUser.name} (${newUser.ageGroup})`
  });

  // Check for Alert Trigger (Example: User created outside business hours? No, simple welcome alert)
  // For now, no alert on creation to keep dashboard clean, only issues trigger alerts.
};

/**
 * Validates student credentials
 */
export const authenticateStudent = (identifier: string, password: string): UserProfile | null => {
  const user = _usersStore.find(u => 
    (u.name.toLowerCase() === identifier.toLowerCase() || u.id === identifier) && 
    u.password === password
  );
  
  if (user) {
      user.lastLogin = new Date().toISOString();
      
      // Log Activity
      logUserActivity({
        userId: user.id!,
        activityType: 'LOGIN',
        metadata: {}
      });
      
      return user;
  }
  return null;
};

/**
 * Log a pedagogical activity or system interaction
 */
export const logUserActivity = (data: Omit<UserActivityLog, 'id' | 'timestamp'>) => {
  const log: UserActivityLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...data
  };
  _activityLogStore.unshift(log);

  // Trigger Alert if user fails too many times (Simulation)
  if (data.activityType === 'MISSION_ATTEMPT' && data.metadata.result === 'failure') {
    // Check previous logs for failures
    const recentFailures = _activityLogStore.filter(l => 
        l.userId === data.userId && 
        l.activityType === 'MISSION_ATTEMPT' && 
        l.metadata.result === 'failure'
    ).length;

    if (recentFailures >= 3) {
       createSystemAlert({
         severity: 'medium',
         type: 'STUCK_USER',
         message: `O aluno ID ${data.userId} falhou 3x consecutivas em ${data.metadata.subject}.`,
         affectedUserId: data.userId
       });
    }
  }
};

/**
 * Create a system alert for the Admin
 */
export const createSystemAlert = (data: Omit<SystemAlert, 'id' | 'timestamp' | 'status'>) => {
  const alert: SystemAlert = {
    id: `alt-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'open',
    ...data
  };
  _alertsStore.unshift(alert);
};

export const resolveAlert = (id: string) => {
  const alert = _alertsStore.find(a => a.id === id);
  if (alert) alert.status = 'resolved';
};

/**
 * Log an admin or system action
 */
export const logAuditAction = (data: Omit<AuditLog, 'id' | 'timestamp'>) => {
  _auditStore.unshift({
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...data
  });
};

// Update user stats in store (so dashboard reflects progress)
export const updateUserInStore = (updatedUser: UserProfile) => {
    const index = _usersStore.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        _usersStore[index] = updatedUser;
    }
};
