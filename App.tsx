import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { Onboarding } from './components/Onboarding';
import { DiagnosticAssessment } from './components/DiagnosticAssessment';
import { Dashboard } from './components/Dashboard';
import { ActivityScreen } from './components/ActivityScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ParentDashboard } from './components/ParentDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AssessmentReportView } from './components/AssessmentReportView';
import { CertificatesScreen, TasksScreen, NotificationsScreen, MessagesScreen } from './components/student/StudentFeatures';
import { UserProfile, Subject, TopicMetrics, LiteracyLevel, NumeracyLevel, AssessmentReport } from './types';
import { registerUserToAdmin } from './services/mockAdminData';

// --- MAIN CONTENT WRAPPER (Inside Router) ---
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  
  // Temporary state for Parent Registration flow
  const [tempParentData, setTempParentData] = useState<{name: string, email: string} | undefined>(undefined);

  // --- HANDLERS ---

  // Global Home/Reset Handler (Clicking EDUC Logo)
  const handleGoHome = () => {
    setUser(null);
    navigate('/');
  };

  // Auth Handlers
  const handleParentRegisterSuccess = (name: string, email: string) => {
    setTempParentData({ name, email });
    navigate('/onboarding');
  };

  const handleStudentLogin = () => {
    // Mock user for "Login" simulation
    setUser({
        name: 'Super Aluno',
        age: 10,
        ageGroup: '9-11',
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=SuperNova",
        xp: 1250,
        level: 12,
        badges: ['badge1', 'badge2'],
        consentGiven: true,
        parentEmail: 'pais@email.com',
        learningStats: {},
        literacyLevel: LiteracyLevel.ALPHABETIC,
        numeracyLevel: NumeracyLevel.LOGICAL_REASONING,
        accessibility: { highContrast: false, dyslexiaFont: false, soundEnabled: true }
    });
    navigate('/dashboard');
  };

  // Onboarding & Diagnostic
  const handleOnboardingComplete = (profile: UserProfile) => {
    const profileWithSettings = {
        ...profile,
        accessibility: {
            highContrast: false,
            dyslexiaFont: false,
            soundEnabled: true
        }
    };
    registerUserToAdmin(profileWithSettings);
    setUser(profileWithSettings);
    navigate('/diagnostic');
  };

  const handleDiagnosticComplete = (report: AssessmentReport) => {
      if (user) {
          const updatedUser: UserProfile = {
              ...user,
              literacyLevel: report.literacyLevel,
              numeracyLevel: report.numeracyLevel,
              assessmentReport: report,
              xp: user.xp + 50,
              badges: [...user.badges, 'badge_explorer']
          };
          setUser(updatedUser);
          navigate('/dashboard');
      }
  };

  // Student Navigation
  const handleSelectSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    navigate('/activity');
  };

  const handleActivityComplete = (xpEarned: number, updatedStats: Record<string, TopicMetrics>) => {
    if (user) {
      setUser(prev => prev ? ({
        ...prev,
        xp: prev.xp + xpEarned,
        level: Math.floor((prev.xp + xpEarned) / 100) + 1,
        learningStats: updatedStats
      }) : null);
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => setUser(updatedProfile);

  // Accessibility Toggles
  const toggleHighContrast = () => {
    if (user) {
        setUser({ ...user, accessibility: { ...user.accessibility, highContrast: !user.accessibility.highContrast } });
    }
  };

  const toggleDyslexiaFont = () => {
    if (user) {
        setUser({ ...user, accessibility: { ...user.accessibility, dyslexiaFont: !user.accessibility.dyslexiaFont } });
    }
  };

  // --- PROTECTED ROUTE WRAPPER ---
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return (
      <Layout 
        ageGroup={user.ageGroup}
        user={user}
        onToggleHighContrast={toggleHighContrast}
        onToggleDyslexiaFont={toggleDyslexiaFont}
        onOpenParentArea={() => navigate('/parent')}
        onLogoClick={handleGoHome}
      >
        {children}
      </Layout>
    );
  };

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={
        <LandingPage 
          onLoginClick={() => navigate('/auth')} 
          onAdminClick={() => navigate('/admin/login')}
          onLogoClick={handleGoHome} 
        />
      } />
      
      <Route path="/auth" element={
        <AuthScreen 
          onBack={() => navigate('/')}
          onParentSuccess={handleParentRegisterSuccess}
          onStudentLogin={handleStudentLogin}
        />
      } />

      <Route path="/admin/login" element={
        <AdminLogin 
          onLoginSuccess={() => navigate('/admin/console')} 
          onBack={handleGoHome}
        />
      } />

      <Route path="/admin/console" element={
        <AdminPortal onExit={handleGoHome} />
      } />

      <Route path="/onboarding" element={
        // Onboarding is technically semi-protected (needs parent data) but we handle it loosely here
        <Onboarding 
          onComplete={handleOnboardingComplete} 
          onBack={() => navigate('/auth')}
          parentData={tempParentData} 
        />
      } />

      {/* --- STUDENT PROTECTED ROUTES --- */}
      
      <Route path="/diagnostic" element={
        <ProtectedRoute>
          <DiagnosticAssessment 
            user={user!}
            onComplete={handleDiagnosticComplete}
            onBack={handleGoHome}
          />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard 
            user={user!} 
            onSelectSubject={handleSelectSubject}
            onOpenProfile={() => navigate('/profile')}
            onOpenReport={() => navigate('/report')}
            onOpenCertificates={() => navigate('/certificates')}
            onOpenTasks={() => navigate('/tasks')}
            onOpenNotifications={() => navigate('/notifications')}
            onOpenMessages={() => navigate('/messages')}
          />
        </ProtectedRoute>
      } />

      <Route path="/activity" element={
        <ProtectedRoute>
          {currentSubject ? (
            <ActivityScreen 
              user={user!} 
              subject={currentSubject} 
              onBack={() => navigate('/dashboard')}
              onComplete={handleActivityComplete}
            />
          ) : (
             <Navigate to="/dashboard" />
          )}
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfileScreen
            user={user!}
            onBack={() => navigate('/dashboard')}
            onUpdate={handleUpdateProfile}
          />
        </ProtectedRoute>
      } />

      <Route path="/certificates" element={
        <ProtectedRoute>
          <CertificatesScreen user={user!} onBack={() => navigate('/dashboard')} />
        </ProtectedRoute>
      } />

      <Route path="/tasks" element={
        <ProtectedRoute>
          <TasksScreen user={user!} onBack={() => navigate('/dashboard')} />
        </ProtectedRoute>
      } />

      <Route path="/notifications" element={
        <ProtectedRoute>
          <NotificationsScreen user={user!} onBack={() => navigate('/dashboard')} />
        </ProtectedRoute>
      } />

      <Route path="/messages" element={
        <ProtectedRoute>
          <MessagesScreen user={user!} onBack={() => navigate('/dashboard')} />
        </ProtectedRoute>
      } />

      <Route path="/parent" element={
        <ProtectedRoute>
          <ParentDashboard
            user={user!}
            onBack={() => navigate('/dashboard')}
          />
        </ProtectedRoute>
      } />

      <Route path="/report" element={
        <ProtectedRoute>
          {user?.assessmentReport ? (
            <AssessmentReportView
              user={user}
              report={user.assessmentReport}
              onBack={() => navigate('/dashboard')}
              onHomeClick={handleGoHome}
            />
          ) : (
            <Navigate to="/dashboard" />
          )}
        </ProtectedRoute>
      } />
      
      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// --- ROOT APP ---
function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;