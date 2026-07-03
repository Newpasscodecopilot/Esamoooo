import { useState } from 'react';
import { SchoolDbProvider, useSchoolDb } from './db/mockDb';
import { User, UserRole } from './types';
import { SaaSPage } from './components/SaaSPage';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { SchoolAdminDashboard } from './components/SchoolAdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  Smartphone, 
  Database, 
  Building2, 
  GraduationCap, 
  Users 
} from 'lucide-react';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { users, resetDatabase } = useSchoolDb();
  const [showSandboxBar, setShowSandboxBar] = useState(true);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSandboxSwitch = (role: UserRole, email: string) => {
    const matched = users.find(u => u.role === role && u.email === email);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'school_admin': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'teacher': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'student': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'parent': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative font-sans">
      
      {/* Dynamic Content Router */}
      <div className="flex-1 pb-24">
        {currentUser === null ? (
          <SaaSPage onLogin={handleLogin} />
        ) : (
          <>
            {currentUser.role === 'super_admin' && (
              <SuperAdminDashboard currentUser={currentUser} onLogout={handleLogout} />
            )}
            {currentUser.role === 'school_admin' && (
              <SchoolAdminDashboard currentUser={currentUser} onLogout={handleLogout} />
            )}
            {currentUser.role === 'teacher' && (
              <TeacherDashboard currentUser={currentUser} onLogout={handleLogout} />
            )}
            {currentUser.role === 'student' && (
              <StudentDashboard currentUser={currentUser} onLogout={handleLogout} />
            )}
            {currentUser.role === 'parent' && (
              <ParentDashboard currentUser={currentUser} onLogout={handleLogout} />
            )}
          </>
        )}
      </div>

      {/* Persistent Floating Sandbox Switcher Bar */}
      {showSandboxBar && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl max-w-2xl w-[92%] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white">
          <div className="flex items-center gap-2 font-bold shrink-0">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <div>
              <span>Interactive Role Sandbox</span>
              <p className="text-[9px] text-slate-400 font-normal leading-none">Perform cross-role live tests</p>
            </div>
          </div>

          {/* Quick toggle list */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              onClick={() => handleSandboxSwitch('super_admin', 'superadmin@saas.com')}
              className={`px-2.5 py-1.5 rounded-lg border font-semibold transition text-[10px] ${
                currentUser?.role === 'super_admin' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
              }`}
              title="Super Admin Dashboard"
            >
              Super Admin
            </button>

            <button
              onClick={() => handleSandboxSwitch('school_admin', 'admin@greenwood.edu')}
              className={`px-2.5 py-1.5 rounded-lg border font-semibold transition text-[10px] ${
                currentUser?.role === 'school_admin' && currentUser?.email === 'admin@greenwood.edu'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
              }`}
              title="Greenwood Admin Dashboard"
            >
              School Admin
            </button>

            <button
              onClick={() => handleSandboxSwitch('teacher', 'teacher.emily@greenwood.edu')}
              className={`px-2.5 py-1.5 rounded-lg border font-semibold transition text-[10px] ${
                currentUser?.role === 'teacher' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
              }`}
              title="Emily Rogers (Teacher) Dashboard"
            >
              Teacher
            </button>

            <button
              onClick={() => handleSandboxSwitch('student', 'student.alex@greenwood.edu')}
              className={`px-2.5 py-1.5 rounded-lg border font-semibold transition text-[10px] ${
                currentUser?.role === 'student' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
              }`}
              title="Alex Mercer (Student) Dashboard"
            >
              Student
            </button>

            <button
              onClick={() => handleSandboxSwitch('parent', 'parent.sarah@greenwood.edu')}
              className={`px-2.5 py-1.5 rounded-lg border font-semibold transition text-[10px] ${
                currentUser?.role === 'parent' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
              }`}
              title="Sarah Mercer (Parent) Dashboard"
            >
              Parent
            </button>
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2.5 shrink-0">
            {currentUser && (
              <button
                onClick={handleLogout}
                className="text-[10px] text-slate-400 hover:text-white font-semibold transition"
                title="Log out session"
              >
                Logout
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Reset simulated database back to initial seeds? All your custom students, teachers, classes and payments will be cleared.')) {
                  resetDatabase();
                  handleLogout();
                }
              }}
              className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
              title="Reset Sandbox Database"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowSandboxBar(false)}
              className="text-[10px] text-slate-400 hover:text-white font-bold p-1 pl-1.5 border-l border-slate-800"
              title="Minimize panel"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating help / maximize button if bar minimized */}
      {!showSandboxBar && (
        <button
          onClick={() => setShowSandboxBar(true)}
          className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition duration-200 hover:scale-105"
          title="Restore Sandbox Switcher"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}

export default function App() {
  return (
    <SchoolDbProvider>
      <AppContent />
    </SchoolDbProvider>
  );
}
