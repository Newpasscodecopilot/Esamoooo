import React, { useState } from 'react';
import { useSchoolDb } from '../db/mockDb';
import { SubscriptionPlan, User } from '../types';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Calendar, 
  Check, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Smartphone, 
  Database,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';

interface SaaSPageProps {
  onLogin: (user: User) => void;
}

export const SaaSPage: React.FC<SaaSPageProps> = ({ onLogin }) => {
  const { plans, schools, users, addSchool } = useSchoolDb();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('premium');
  
  // Registration form state
  const [schoolName, setSchoolName] = useState('');
  const [domain, setDomain] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logoType, setLogoType] = useState<'tree' | 'sun' | 'star' | 'book' | 'globe'>('tree');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleRegisterSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !domain || !contactEmail) return;

    const cleanDomain = domain.toLowerCase().replace(/\s+/g, '');
    const newSchool = addSchool({
      name: schoolName,
      domain: cleanDomain,
      planId: selectedPlanId,
      status: 'active',
      logoType,
      contactEmail
    });

    setRegSuccess(`Successfully registered! An administrator login has been provisioned at ${contactEmail}. Switch to School Admin role to view.`);
    
    // Clear state after short delay and close modal
    setTimeout(() => {
      setRegSuccess(null);
      setShowRegisterModal(false);
      // Auto login as this new school admin for a seamless demo experience!
      const autoAdmin = users.find(u => u.email === contactEmail) || {
        id: `user-admin-${Date.now()}`,
        email: contactEmail,
        name: `${schoolName} Administrator`,
        role: 'school_admin' as const,
        schoolId: newSchool.id
      };
      onLogin(autoAdmin);
      
      // Reset fields
      setSchoolName('');
      setDomain('');
      setContactEmail('');
    }, 2500);
  };

  const getLogoIcon = (type: string) => {
    switch (type) {
      case 'tree': return '🌳';
      case 'sun': return '☀️';
      case 'star': return '⭐';
      case 'book': return '📚';
      case 'globe': return '🌐';
      default: return '🏫';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-500 selection:text-white">
      {/* Banner announcement */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
        <span>V2.4 Active — Experience our responsive Multi-School ERP Dashboard & Parent Portal Mobile Simulator</span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-sky-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-100">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                eSchool<span className="text-blue-600 font-medium font-sans">SaaS</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-none">Multi-Tenant School ERP</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Core Modules</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing Plans</a>
            <a href="#schools" className="hover:text-blue-600 transition">Registered Tenants</a>
            <a href="#demo" className="hover:text-blue-600 transition">Role Demo Login</a>
          </nav>
          <div className="flex items-center gap-3">
            <a 
              href="#demo" 
              className="text-xs font-semibold px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-lg transition"
            >
              Interactive Demo
            </a>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4.5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition active:scale-95"
            >
              Register School
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Comprehensive SaaS Architecture
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight">
              Empower your schools with <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">unified control</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal">
              A high-performance school SaaS ERP designed for modern education. Complete with distinct, deeply integrated portals for administrators, educators, students, and parents.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full sm:w-auto text-sm font-semibold px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 hover:shadow-xl transition flex items-center justify-center gap-2 group"
              >
                Get Started Now
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </button>
              <a
                href="#demo"
                className="w-full sm:w-auto text-sm font-semibold px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200/80 transition flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-slate-400" />
                Launch Interactive Demo
              </a>
            </div>
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/60 max-w-md mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl font-bold text-slate-900 font-display">100%</span>
                <span className="text-xs text-slate-500 font-medium">Cloud Secured</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-slate-900 font-display">5+</span>
                <span className="text-xs text-slate-500 font-medium">Portal Roles</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-slate-900 font-display">99.9%</span>
                <span className="text-xs text-slate-500 font-medium">Uptime Guarantee</span>
              </div>
            </div>
          </div>

          {/* Interactive Screen Preview */}
          <div className="lg:col-span-6 mt-12 lg:mt-0 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-sky-500/10 rounded-3xl blur-2xl transform rotate-3 scale-95"></div>
            <div className="relative bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden">
              {/* Fake browser bar */}
              <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                </div>
                <div className="mx-auto bg-slate-800 rounded-md text-[10px] text-slate-400 font-mono py-0.5 px-6 truncate max-w-xs">
                  https://eschool-saas.com/demo/dashboard
                </div>
              </div>
              {/* Content Preview */}
              <div className="p-6 bg-slate-50 text-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">G</div>
                    <span className="text-xs font-bold text-slate-800">Greenwood International</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">Active Subscriber</span>
                </div>
                {/* Mini Charts Dashboard */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[9px] text-slate-400 font-medium">Students</span>
                    <p className="text-lg font-bold text-blue-600 font-display">120</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[9px] text-slate-400 font-medium">Faculty</span>
                    <p className="text-lg font-bold text-sky-600 font-display">12</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[9px] text-slate-400 font-medium">Revenue</span>
                    <p className="text-lg font-bold text-emerald-600 font-display">$4.8k</p>
                  </div>
                </div>
                {/* Visual school statistics graph representation */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-700">Attendance Trend</span>
                    <span className="text-slate-400">Past 5 Days</span>
                  </div>
                  <div className="h-16 flex items-end justify-between px-2 pt-2 gap-2">
                    <div className="w-full bg-blue-100 rounded-t-sm h-12"></div>
                    <div className="w-full bg-blue-100 rounded-t-sm h-14"></div>
                    <div className="w-full bg-red-100 rounded-t-sm h-8"></div>
                    <div className="w-full bg-blue-100 rounded-t-sm h-15"></div>
                    <div className="w-full bg-blue-600 rounded-t-sm h-16"></div>
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-400 pt-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-20 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-950">
              One unified platform, endless possibilities
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We provide the core school administration features bundled into elegant dashboards for every stakeholder. Take attendance, run examinations, track schedules, and invoice fees seamlessly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200/60 bg-white hover:bg-slate-50 transition duration-300 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">Multi-Role Dashboards</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Super Admins, School Admins, Teachers, Students, and Parents each log into custom workspaces styled with features tuned for their precise needs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/60 bg-white hover:bg-slate-50 transition duration-300 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">Attendance Tracker</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Teachers mark attendance daily. Admins analyze reports instantly. Parents receive notification details, reducing unexcused student absences.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/60 bg-white hover:bg-slate-50 transition duration-300 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">Exams & Gradebook</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Grade midterm and finals easily. Direct mark-sheet exports, automatic GPAs, grading scales, and parent progress visualizers are standard.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/60 bg-white hover:bg-slate-50 transition duration-300 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">Instant Invoicing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Configure student fees templates, collect partial payments, generate receipts, and reconcile accounts in real-time from the parent portal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="font-display font-bold text-3xl text-slate-950">
              Honest, predictable licensing
            </h2>
            <p className="text-slate-500 text-sm">
              Deploy our tenant scripts with custom packaging limits. Pay only for student capacities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const isPremium = plan.id === 'premium';
              return (
                <div 
                  key={plan.id}
                  className={`bg-white rounded-3xl p-8 border transition hover:shadow-lg relative flex flex-col justify-between ${
                    isPremium 
                      ? 'border-blue-600 shadow-md shadow-blue-50 ring-1 ring-blue-500' 
                      : 'border-slate-200/80'
                  }`}
                >
                  {isPremium && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular Plan
                    </span>
                  )}
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Best for {plan.id === 'basic' ? 'small academies' : plan.id === 'standard' ? 'growing schools' : 'large institutional campuses'}.
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold font-display text-slate-900">${plan.price}</span>
                      <span className="text-slate-400 text-xs font-medium">/ month</span>
                    </div>

                    <ul className="space-y-3.5 text-xs text-slate-600 pt-6 border-t border-slate-150">
                      <li className="flex items-center gap-2.5 font-medium text-slate-900">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Up to {plan.maxStudents === 9999 ? 'Unlimited' : plan.maxStudents} Students</span>
                      </li>
                      <li className="flex items-center gap-2.5 font-medium text-slate-900">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Up to {plan.maxTeachers === 999 ? 'Unlimited' : plan.maxTeachers} Teachers</span>
                      </li>
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-slate-500">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        setShowRegisterModal(true);
                      }}
                      className={`w-full text-xs font-bold py-3 px-4 rounded-xl transition duration-150 ${
                        isPremium
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg shadow-blue-100'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Subscribe & Signup
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registered Tenants list for proof of concept / quick switching */}
      <section id="schools" className="py-16 px-6 bg-slate-100/50 border-t border-slate-200/40">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900">Active Tenant Schools</h2>
              <p className="text-xs text-slate-400">Instantly switch admin logins using the credentials in the interactive section below</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">
              {schools.length} Active Schools
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {schools.map(school => (
              <div key={school.id} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-4 justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" role="img" aria-label="school-logo">
                      {getLogoIcon(school.logoType)}
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-900 line-clamp-1">{school.name}</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">{school.domain}</p>
                  <p className="text-xs text-slate-500 font-medium">Plan: <span className="capitalize text-blue-600">{school.planId}</span></p>
                  
                  <div className="flex gap-3 text-[10px] text-slate-400 pt-2 font-mono">
                    <span>👥 {school.studentCount} Students</span>
                    <span>👨‍🏫 {school.teacherCount} Teachers</span>
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  school.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {school.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Demo Interactive Login Launcher */}
      <section id="demo" className="py-20 px-6 bg-gradient-to-b from-white to-blue-50/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Sandbox Environment</span>
            <h2 className="font-display font-bold text-3xl text-slate-950">
              Interactive Demo Portals
            </h2>
            <p className="text-slate-500 text-sm">
              Click any portal role below to instantly login as a simulated user. Edit data inside any role and see the changes sync immediately across other views!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Super Admin Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:border-blue-500 transition shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">SaaS Host</span>
                  <Smartphone className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">Super Admin Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Full SaaS operations. Register and manage tenant schools, activate/suspend domains, audit package pricing models, and monitor SaaS revenue trends.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-600 font-mono space-y-0.5 border border-slate-100">
                  <p><span className="text-slate-400">Login:</span> superadmin@saas.com</p>
                  <p><span className="text-slate-400">Pass:</span> admin123</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const sUser = users.find(u => u.role === 'super_admin');
                  if (sUser) onLogin(sUser);
                }}
                className="w-full text-xs font-semibold py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition cursor-pointer active:scale-[0.98]"
              >
                Launch Super Admin Dashboard
              </button>
            </div>

            {/* School Admin Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:border-blue-500 transition shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Tenant Admin</span>
                  <Database className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">School Admin Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Manage academic settings for "Greenwood International". Create grades, hire teachers, register students, configure fees invoicing, and broadcast notices.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-600 font-mono space-y-0.5 border border-slate-100">
                  <p><span className="text-slate-400">Login:</span> admin@greenwood.edu</p>
                  <p><span className="text-slate-400">School:</span> Greenwood Int.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const sUser = users.find(u => u.email === 'admin@greenwood.edu');
                  if (sUser) onLogin(sUser);
                }}
                className="w-full text-xs font-semibold py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer active:scale-[0.98]"
              >
                Launch School Admin Dashboard
              </button>
            </div>

            {/* Teacher Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:border-blue-500 transition shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Faculty</span>
                  <Users className="w-4 h-4 text-sky-500" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">Teacher Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Login as "Emily Rogers" (Math & Physics). Roll-call daily student attendance, compile grades, upload study materials, and assign homework.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-600 font-mono space-y-0.5 border border-slate-100">
                  <p><span className="text-slate-400">Login:</span> teacher.emily@greenwood.edu</p>
                  <p><span className="text-slate-400">Classes:</span> Grade 10-A Math</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const sUser = users.find(u => u.email === 'teacher.emily@greenwood.edu');
                  if (sUser) onLogin(sUser);
                }}
                className="w-full text-xs font-semibold py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer active:scale-[0.98]"
              >
                Launch Teacher Dashboard
              </button>
            </div>

            {/* Student Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:border-blue-500 transition shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Scholar</span>
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">Student Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Login as "Alex Mercer" (Grade 10-A). Track daily timetable schedules, review attendance analytics, inspect midterm grade sheets, and check assigned coursework.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-600 font-mono space-y-0.5 border border-slate-100">
                  <p><span className="text-slate-400">Login:</span> student.alex@greenwood.edu</p>
                  <p><span className="text-slate-400">Class:</span> Grade 10 Section A</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const sUser = users.find(u => u.email === 'student.alex@greenwood.edu');
                  if (sUser) onLogin(sUser);
                }}
                className="w-full text-xs font-semibold py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer active:scale-[0.98]"
              >
                Launch Student Dashboard
              </button>
            </div>

            {/* Parent Portal */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:border-blue-500 transition shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Guardian</span>
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">Parent Portal Simulator</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Monitor "Alex Mercer"'s performance metrics. Reconcile outstanding tuition fees instantly with the interactive card payment simulator.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-600 font-mono space-y-0.5 border border-slate-100">
                  <p><span className="text-slate-400">Login:</span> parent.sarah@greenwood.edu</p>
                  <p><span className="text-slate-400">Child:</span> Alex Mercer (10-A)</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const sUser = users.find(u => u.email === 'parent.sarah@greenwood.edu');
                  if (sUser) onLogin(sUser);
                }}
                className="w-full text-xs font-semibold py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer active:scale-[0.98]"
              >
                Launch Parent Dashboard
              </button>
            </div>

            {/* Custom School Register Trigger */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-slate-300 rounded-2xl p-6 border border-slate-850 shadow-sm space-y-4 flex flex-col justify-between text-left">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Add School</span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="font-display font-bold text-base text-white">Create Your School</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Want to see how starting from scratch works? Set up your own custom school. Our tenant script generator automatically seeds a clean admin account for your selected domain.
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full text-xs font-semibold py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition cursor-pointer active:scale-[0.98]"
              >
                Launch Tenant Provisioner
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Registration Modal Dialog */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Provision New School Tenant</h3>
                <p className="text-xs text-slate-400">Fills subscription plans automatically</p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {regSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                <p className="text-sm font-semibold text-slate-800">{regSuccess}</p>
                <p className="text-xs text-slate-400">Configuring layout panels...</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSchool} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">School Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sterling Academy"
                    value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Subdomain Prefix</label>
                  <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:border-indigo-500">
                    <input
                      type="text"
                      required
                      placeholder="sterling"
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      className="w-full text-xs p-2.5 focus:outline-none"
                    />
                    <span className="bg-slate-50 px-3 py-2.5 text-xs text-slate-400 font-mono border-l border-slate-100 flex items-center">
                      .eschool.edu
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Administrator Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., principal@sterling.edu"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Subscription Plan</label>
                    <select
                      value={selectedPlanId}
                      onChange={e => setSelectedPlanId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                    >
                      {plans.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (${p.price}/mo)</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Aesthetic Logo Emblem</label>
                    <select
                      value={logoType}
                      onChange={e => setLogoType(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                    >
                      <option value="tree">🌳 Evergreen Tree</option>
                      <option value="sun">☀️ Rising Sun</option>
                      <option value="star">⭐ Golden Star</option>
                      <option value="book">📚 Open Folio</option>
                      <option value="globe">🌐 Blue Planet</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="w-1/2 text-xs font-bold py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 text-xs font-bold py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
                  >
                    Deploy Script
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Modern minimalist footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">eS</div>
            <span className="font-display font-semibold text-sm text-white">eSchool Multi School ERP SaaS</span>
          </div>
          <p>© 2026 ProjectWorlds SaaS Script Engine. Under MIT Licensed Sandbox Sandbox distribution.</p>
          <div className="flex gap-4">
            <span className="hover:text-white transition cursor-pointer">Terms</span>
            <span className="hover:text-white transition cursor-pointer">Security API</span>
            <span className="hover:text-white transition cursor-pointer">Status Live</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
