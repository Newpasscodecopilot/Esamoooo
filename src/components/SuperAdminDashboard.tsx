import React, { useState } from 'react';
import { useSchoolDb } from '../db/mockDb';
import { School, SubscriptionPlan, User } from '../types';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  Trash2, 
  CreditCard, 
  Search, 
  Plus, 
  ArrowLeft, 
  Database,
  Grid,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';

interface SuperAdminDashboardProps {
  onLogout: () => void;
  currentUser: User;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout, currentUser }) => {
  const { 
    schools, 
    plans, 
    updateSchoolStatus, 
    deleteSchool, 
    updateSchoolPlan, 
    addSchool 
  } = useSchoolDb();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);

  // Add School form state
  const [schoolName, setSchoolName] = useState('');
  const [domain, setDomain] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [planId, setPlanId] = useState('premium');
  const [logoType, setLogoType] = useState<'tree' | 'sun' | 'star' | 'book' | 'globe'>('tree');

  // Math metrics
  const activeSchoolsCount = schools.filter(s => s.status === 'active').length;
  const totalBalanceSaaS = schools.reduce((sum, s) => sum + s.balance, 0);
  
  // Projected MRR based on school subscription prices
  const projectedMRR = schools.reduce((sum, s) => {
    if (s.status === 'suspended') return sum;
    const plan = plans.find(p => p.id === s.planId);
    return sum + (plan ? plan.price : 0);
  }, 0);

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !domain || !contactEmail) return;

    addSchool({
      name: schoolName,
      domain: domain.toLowerCase().replace(/\s+/g, ''),
      planId,
      status: 'active',
      logoType,
      contactEmail
    });

    // Reset fields
    setSchoolName('');
    setDomain('');
    setContactEmail('');
    setShowAddModal(false);
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          school.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : school.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* SaaS Dashboard Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogout}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
            title="Return to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-900/40">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight block">Super Admin Center</span>
            <span className="text-[10px] text-blue-400 font-mono">SaaS Host Network Controls</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-semibold">{currentUser.name}</span>
            <span className="text-[9px] text-slate-400 font-mono">{currentUser.email}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto w-full p-6 flex-1 space-y-6">
        
        {/* Statistics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Registered Tenants</span>
              <span className="text-2xl font-bold font-display text-slate-900">{schools.length} <span className="text-xs text-slate-400 font-normal">Schools</span></span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Active Subscriptions</span>
              <span className="text-2xl font-bold font-display text-slate-900">{activeSchoolsCount} <span className="text-xs text-slate-400 font-normal">Active</span></span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Projected MRR</span>
              <span className="text-2xl font-bold font-display text-slate-900">${projectedMRR} <span className="text-xs text-slate-400 font-normal">/ mo</span></span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Simulated School Revenue</span>
              <span className="text-2xl font-bold font-display text-slate-900">${totalBalanceSaaS} <span className="text-xs text-slate-400 font-normal">Total</span></span>
            </div>
          </div>
        </div>

        {/* School Management Section */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Section Controller */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">Multi-Tenant Network Control</h2>
              <p className="text-xs text-slate-400">Deploy scripts, alter packages, audit school structures, or suspend services immediately</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search bar */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All States</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

              {/* Add button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Deploy School
              </button>
            </div>
          </div>

          {/* School List Table */}
          <div className="overflow-x-auto">
            {filteredSchools.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">✕</div>
                <p className="text-sm font-semibold text-slate-700">No schools match search filters</p>
                <p className="text-xs text-slate-400">Deploy a school tenant using the button above.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4 font-semibold">School Tenant Details</th>
                    <th className="p-4 font-semibold">Registered Subdomain</th>
                    <th className="p-4 font-semibold">Subscription Plan</th>
                    <th className="p-4 font-semibold">School Capacity</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchools.map((school) => {
                    const plan = plans.find(p => p.id === school.planId);
                    return (
                      <tr key={school.id} className="hover:bg-slate-50/60 transition duration-150">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl" role="img" aria-label="emblem">
                              {getLogoIcon(school.logoType)}
                            </span>
                            <div>
                              <span className="block font-bold text-slate-900">{school.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{school.contactEmail}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-500">
                          <div className="flex items-center gap-1">
                            <span>{school.domain}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        </td>
                        <td className="p-4 font-medium text-blue-600">
                          <div className="flex flex-col gap-1">
                            {editingSchoolId === school.id ? (
                              <select
                                value={school.planId}
                                onChange={e => {
                                  updateSchoolPlan(school.id, e.target.value);
                                  setEditingSchoolId(null);
                                }}
                                className="border border-slate-200 bg-white p-1 rounded focus:outline-none focus:border-blue-500"
                              >
                                {plans.map(p => (
                                  <option key={p.id} value={p.id}>{p.name} (${p.price}/mo)</option>
                                ))}
                              </select>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="capitalize">{school.planId} Plan</span>
                                <button 
                                  onClick={() => setEditingSchoolId(school.id)}
                                  className="text-[10px] text-slate-400 hover:text-blue-600 underline font-sans"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono font-normal">MRR: ${plan ? plan.price : 0}/mo</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-500 space-y-0.5">
                          <p>👥 {school.studentCount} / {plan ? (plan.maxStudents === 9999 ? 'Unlimited' : plan.maxStudents) : 0} Students</p>
                          <p>👨‍🏫 {school.teacherCount} / {plan ? (plan.maxTeachers === 999 ? 'Unlimited' : plan.maxTeachers) : 0} Teachers</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            school.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${school.status === 'active' ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                            {school.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            {school.status === 'active' ? (
                              <button
                                onClick={() => updateSchoolStatus(school.id, 'suspended')}
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-lg transition"
                                title="Suspend school access"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => updateSchoolStatus(school.id, 'active')}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg transition"
                                title="Activate school access"
                              >
                                Activate
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to completely delete ${school.name}? This will purge all student rosters and data associated.`)) {
                                  deleteSchool(school.id);
                                }
                              }}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              title="Delete School"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Plan Pricing Audit Cards */}
        <div className="space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">SaaS Packages Structure</h3>
            <p className="text-xs text-slate-400">Current active tier boundaries applied globally across all schools</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <span className="font-display font-bold text-sm text-slate-900">{p.name} Plan</span>
                  <span className="font-mono font-bold text-sm text-blue-600">${p.price}/mo</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono space-y-1">
                  <p>Max Students: {p.maxStudents === 9999 ? 'Unlimited' : p.maxStudents}</p>
                  <p>Max Teachers: {p.maxTeachers === 999 ? 'Unlimited' : p.maxTeachers}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Included Modules:</span>
                  <div className="flex flex-wrap gap-1">
                    {p.features.map((f, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-600 text-[9px] px-2 py-0.5 rounded border border-slate-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Deploy New School Tenant</h3>
                <p className="text-xs text-slate-400">Generates isolated databases instantly</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">School Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Summit Preparatory"
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Domain Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., summitprep.edu"
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">School Administrator Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., headmaster@summitprep.edu"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Package Tier</label>
                  <select
                    value={planId}
                    onChange={e => setPlanId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price}/mo)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Aesthetic Logo Symbol</label>
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
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 text-xs font-bold py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
                >
                  Deploy Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
