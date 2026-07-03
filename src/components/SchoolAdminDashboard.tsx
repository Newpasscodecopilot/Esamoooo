import React, { useState } from 'react';
import { useSchoolDb } from '../db/mockDb';
import { User, Teacher, Student, Class, Subject, Notice, FeeTransaction } from '../types';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  Megaphone, 
  Plus, 
  Trash2, 
  PlusCircle, 
  Search, 
  ArrowLeft,
  Briefcase,
  FileSpreadsheet,
  Settings,
  Grid
} from 'lucide-react';

interface SchoolAdminDashboardProps {
  onLogout: () => void;
  currentUser: User;
}

export const SchoolAdminDashboard: React.FC<SchoolAdminDashboardProps> = ({ onLogout, currentUser }) => {
  const {
    schools,
    classes,
    subjects,
    students,
    teachers,
    notices,
    feeTransactions,
    addClass,
    addSubject,
    addStudent,
    deleteStudent,
    addTeacher,
    deleteTeacher,
    addNotice,
    deleteNotice,
    addFeeTransaction
  } = useSchoolDb();

  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'curriculum' | 'notices' | 'fees'>('overview');
  
  // Find current school context
  const school = schools.find(s => s.id === currentUser.schoolId);
  const mySchoolId = currentUser.schoolId || 'school-1';

  // Filter lists to only include this school's records
  const myTeachers = teachers.filter(t => t.schoolId === mySchoolId);
  const myStudents = students.filter(s => s.schoolId === mySchoolId);
  const myClasses = classes.filter(c => c.schoolId === mySchoolId);
  const mySubjects = subjects.filter(sub => sub.schoolId === mySchoolId);
  const myNotices = notices.filter(n => n.schoolId === mySchoolId);
  const myTransactions = feeTransactions.filter(f => f.schoolId === mySchoolId);

  // Stats calculation
  const totalClasses = myClasses.length;
  const totalStudents = myStudents.length;
  const totalTeachers = myTeachers.length;
  const schoolRevenue = school ? school.balance : 0;
  const pendingFeesSum = myStudents.reduce((sum, s) => sum + s.balanceDue, 0);

  // Search states
  const [teacherSearch, setTeacherSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('all');

  // Modals / forms triggers
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [showChargeFeeModal, setShowChargeFeeModal] = useState(false);

  // Forms states
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tDesignation, setTDesignation] = useState('Lecturer');
  const [tSalary, setTSalary] = useState(3000);

  const [sName, setSName] = useState('');
  const [sRoll, setSRoll] = useState('');
  const [sClassId, setSClassId] = useState('');
  const [sGuardianEmail, setSGuardianEmail] = useState('');
  const [sGuardianName, setSGuardianName] = useState('');

  const [cName, setCName] = useState('');
  const [cSection, setCSection] = useState('');
  const [cRoom, setCRoom] = useState('');
  const [cTeacherId, setCTeacherId] = useState('');

  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subClassId, setSubClassId] = useState('');
  const [subTeacherId, setSubTeacherId] = useState('');

  const [nTitle, setNTitle] = useState('');
  const [nContent, setNContent] = useState('');
  const [nAudience, setNAudience] = useState<'all' | 'teachers' | 'students' | 'parents'>('all');

  const [feeStudentId, setFeeStudentId] = useState('');
  const [feeType, setFeeType] = useState('Special Activity Levy');
  const [feeAmount, setFeeAmount] = useState(50);

  // Form Submissions
  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tEmail) return;

    addTeacher({
      schoolId: mySchoolId,
      name: tName,
      email: tEmail,
      phone: tPhone || '+1 555-0100',
      designation: tDesignation,
      joiningDate: new Date().toISOString().split('T')[0],
      salary: Number(tSalary)
    });

    // Reset Form
    setTName('');
    setTEmail('');
    setTPhone('');
    setTDesignation('Lecturer');
    setTSalary(3000);
    setShowAddTeacherModal(false);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName || !sClassId || !sGuardianEmail) return;

    addStudent({
      schoolId: mySchoolId,
      name: sName,
      rollNumber: sRoll || `${1000 + myStudents.length + 1}`,
      classId: sClassId,
      guardianEmail: sGuardianEmail,
      guardianName: sGuardianName || 'Guardian'
    });

    // Reset Form
    setSName('');
    setSRoll('');
    setSClassId('');
    setSGuardianEmail('');
    setSGuardianName('');
    setShowAddStudentModal(false);
  };

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cSection) return;

    addClass({
      schoolId: mySchoolId,
      name: cName,
      section: cSection,
      classTeacherId: cTeacherId || (myTeachers[0]?.id || ''),
      room: cRoom || 'TBD'
    });

    setCName('');
    setCSection('');
    setCRoom('');
    setCTeacherId('');
    setShowAddClassModal(false);
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subClassId || !subTeacherId) return;

    addSubject({
      schoolId: mySchoolId,
      name: subName,
      code: subCode || 'SUBJ-' + Math.floor(100 + Math.random() * 900),
      classId: subClassId,
      teacherId: subTeacherId
    });

    setSubName('');
    setSubCode('');
    setSubClassId('');
    setSubTeacherId('');
    setShowAddSubjectModal(false);
  };

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nTitle || !nContent) return;

    addNotice({
      schoolId: mySchoolId,
      title: nTitle,
      content: nContent,
      targetAudience: nAudience
    });

    setNTitle('');
    setNContent('');
    setNAudience('all');
    setShowAddNoticeModal(false);
  };

  const handleChargeFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeStudentId || !feeAmount) return;

    addFeeTransaction({
      schoolId: mySchoolId,
      studentId: feeStudentId,
      amount: Number(feeAmount),
      feeType
    });

    setFeeStudentId('');
    setFeeType('Special Activity Levy');
    setFeeAmount(50);
    setShowChargeFeeModal(false);
  };

  // Filters
  const filteredTeachers = myTeachers.filter(t => 
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || 
    t.email.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredStudents = myStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.rollNumber.includes(studentSearch);
    const matchesClass = studentClassFilter === 'all' ? true : s.classId === studentClassFilter;
    return matchesSearch && matchesClass;
  });

  if (!school) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border max-w-md mx-auto mt-20 space-y-4">
        <p className="text-red-500 font-semibold">School Context Misconfigured or Tenant Suspended</p>
        <button onClick={onLogout} className="px-4 py-2 bg-slate-900 text-white rounded text-xs">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onLogout}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-500"
              title="Main Landing"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
              {school.name.charAt(0)}
            </div>
            <div>
              <span className="font-display font-bold text-base text-slate-900 tracking-tight block leading-none">
                {school.name}
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Admin Workspace • Subscriber Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-slate-800">{currentUser.name}</span>
              <span className="text-[9px] text-slate-400 font-mono font-medium">Domain: {school.domain}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-2 rounded-xl transition"
            >
              Switch Role
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-6">
        
        {/* Left Navigation Workspace Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-1 bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-sm h-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Grid className="w-4 h-4" />
            Workspace Home
          </button>
          
          <button
            onClick={() => setActiveTab('teachers')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'teachers' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Faculty Staff ({totalTeachers})
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'students' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student Directory ({totalStudents})
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'curriculum' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Curriculum Setup
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'notices' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Notice Broadcasts ({myNotices.length})
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'fees' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Fees & Billing
          </button>
        </aside>

        {/* Dynamic Workspace Container */}
        <div className="flex-1 space-y-6">

          {/* TAB 1: OVERVIEW HOME */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Internal metrics quick-bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Academics</span>
                  <p className="text-xl font-bold font-display text-slate-900">{totalClasses} Classes</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Total Enrolled</span>
                  <p className="text-xl font-bold font-display text-slate-900">{totalStudents} Students</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Tuition Fees Collected</span>
                  <p className="text-xl font-bold font-display text-emerald-600">${schoolRevenue}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Outstanding Ledger</span>
                  <p className="text-xl font-bold font-display text-rose-600">${pendingFeesSum}</p>
                </div>
              </div>

              {/* Multi school features details / announcement feed overview */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Notice Feed panel */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="font-display font-bold text-sm text-slate-900">Broadcast notice feed</h3>
                    <span className="text-[10px] text-slate-400 font-mono">Recent notices ({myNotices.length})</span>
                  </div>
                  
                  {myNotices.length === 0 ? (
                    <p className="text-xs text-slate-400 p-6 text-center">No notices posted yet. Go to Notices Broadcasts tab to broadcast announcements.</p>
                  ) : (
                    <div className="space-y-3">
                      {myNotices.slice(0, 3).map(notice => (
                        <div key={notice.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1 text-left">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-xs text-slate-900">{notice.title}</h4>
                            <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {notice.targetAudience}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notice.content}</p>
                          <span className="block text-[9px] text-slate-400 font-mono pt-1">Posted on {notice.createdAt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Short statistics visual represent */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 text-left">
                  <h3 className="font-display font-bold text-sm text-slate-900">Ledger Distribution</h3>
                  <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>Paid Fees ($)</span>
                        <span>{schoolRevenue + pendingFeesSum > 0 ? Math.round((schoolRevenue / (schoolRevenue + pendingFeesSum)) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${schoolRevenue + pendingFeesSum > 0 ? (schoolRevenue / (schoolRevenue + pendingFeesSum)) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>Unpaid Fees ($)</span>
                        <span>{schoolRevenue + pendingFeesSum > 0 ? Math.round((pendingFeesSum / (schoolRevenue + pendingFeesSum)) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-rose-500 h-2 rounded-full" 
                          style={{ width: `${schoolRevenue + pendingFeesSum > 0 ? (pendingFeesSum / (schoolRevenue + pendingFeesSum)) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: TEACHERS */}
          {activeTab === 'teachers' && (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Faculty Roster</h3>
                  <p className="text-xs text-slate-400">Manage teachers, salaries, roles and assignments</p>
                </div>
                <button
                  onClick={() => setShowAddTeacherModal(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Teacher
                </button>
              </div>

              {filteredTeachers.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <p className="text-xs text-slate-400">No teachers found in the roster.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono uppercase border-b border-slate-100">
                        <th className="p-4">Name & Designation</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Salary (Monthly)</th>
                        <th className="p-4">Joining Date</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTeachers.map(teacher => (
                        <tr key={teacher.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div>
                              <span className="block font-bold text-slate-900">{teacher.name}</span>
                              <span className="text-[10px] text-slate-400">{teacher.designation}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-slate-500">
                            <p>{teacher.email}</p>
                            <p>{teacher.phone}</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-800">
                            ${teacher.salary}
                          </td>
                          <td className="p-4 text-slate-500">
                            {teacher.joiningDate}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => deleteTeacher(teacher.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              title="Delete Teacher"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STUDENTS */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden space-y-4 p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-50 pb-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Student Directory</h3>
                  <p className="text-xs text-slate-400">Add student records, view guardians and tuition outstanding</p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 flex-1 sm:w-44"
                  />
                  
                  <select
                    value={studentClassFilter}
                    onChange={e => setStudentClassFilter(e.target.value)}
                    className="text-xs p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Classes</option>
                    {myClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}-{c.section}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    <Plus className="w-4.5 h-4.5" /> Admission
                  </button>
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">No student records found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono uppercase border-b border-slate-100">
                        <th className="p-4">Name & Roll</th>
                        <th className="p-4">Assigned Class</th>
                        <th className="p-4">Guardian Contact</th>
                        <th className="p-4">Outstanding Fee</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map(student => {
                        const sClass = myClasses.find(c => c.id === student.classId);
                        return (
                          <tr key={student.id} className="hover:bg-slate-50/50">
                            <td className="p-4">
                              <div>
                                <span className="block font-bold text-slate-900">{student.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">Roll: #{student.rollNumber}</span>
                              </div>
                            </td>
                            <td className="p-4 font-medium text-slate-600">
                              {sClass ? `${sClass.name} - Section ${sClass.section}` : 'Unassigned'}
                            </td>
                            <td className="p-4 text-slate-500">
                              <p className="font-semibold text-slate-800">{student.guardianName}</p>
                              <p className="font-mono text-[10px]">{student.guardianEmail}</p>
                            </td>
                            <td className="p-4 font-bold text-rose-600">
                              ${student.balanceDue}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete students ${student.name}? This removes their logins and transcript registers too.`)) {
                                    deleteStudent(student.id);
                                  }
                                }}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                title="Revoke Admission"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CURRICULUM */}
          {activeTab === 'curriculum' && (
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Classes Block */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 font-display">Classes Config</h3>
                    <p className="text-[11px] text-slate-400 font-normal">Registered classes & teachers</p>
                  </div>
                  <button
                    onClick={() => setShowAddClassModal(true)}
                    className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {myClasses.map(c => {
                    const ct = myTeachers.find(t => t.id === c.classTeacherId);
                    return (
                      <div key={c.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{c.name} - Section {c.section}</span>
                          <span className="block text-[10px] text-slate-400">Room: {c.room}</span>
                        </div>
                        <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-medium text-slate-700">
                          Teacher: {ct ? ct.name : 'Unassigned'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subjects Block */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 font-display">Subjects Catalog</h3>
                    <p className="text-[11px] text-slate-400 font-normal">Associated faculty & codes</p>
                  </div>
                  <button
                    onClick={() => setShowAddSubjectModal(true)}
                    className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {mySubjects.map(sub => {
                    const c = myClasses.find(cls => cls.id === sub.classId);
                    const t = myTeachers.find(tch => tch.id === sub.teacherId);
                    return (
                      <div key={sub.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{sub.name}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">Code: {sub.code} ({c ? `${c.name}-${c.section}` : 'N/A'})</span>
                        </div>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                          {t ? t.name : 'Unassigned'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: NOTICES */}
          {activeTab === 'notices' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 font-display">Announcements Broadcaster</h3>
                  <p className="text-xs text-slate-400">Notify teachers, parents, and students instantly</p>
                </div>
                <button
                  onClick={() => setShowAddNoticeModal(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Broadcast
                </button>
              </div>

              {myNotices.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No announcement broadcasts yet.</p>
              ) : (
                <div className="space-y-3">
                  {myNotices.map(notice => (
                    <div key={notice.id} className="p-4 border border-slate-100 bg-slate-50/60 rounded-xl flex justify-between gap-4 text-left">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{notice.title}</span>
                          <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {notice.targetAudience}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
                        <span className="block font-mono text-[9px] text-slate-400">Date: {notice.createdAt}</span>
                      </div>
                      <button
                        onClick={() => deleteNotice(notice.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 shrink-0 h-fit"
                        title="Delete announcement"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FEES */}
          {activeTab === 'fees' && (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 font-display">Financial Billing Ledger</h3>
                  <p className="text-xs text-slate-400">Monitor collections history and generate manual charges</p>
                </div>
                
                <button
                  onClick={() => setShowChargeFeeModal(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Invoice Student
                </button>
              </div>

              {myTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No billing ledgers found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono uppercase border-b border-slate-100">
                        <th className="p-4">Student Roll & Name</th>
                        <th className="p-4">Billing Fee Type</th>
                        <th className="p-4">Charged Amt</th>
                        <th className="p-4">Payment Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myTransactions.map(tx => {
                        const s = myStudents.find(student => student.id === tx.studentId);
                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/50">
                            <td className="p-4">
                              <span className="block font-bold text-slate-900">{s ? s.name : 'Unknown Scholar'}</span>
                              <span className="text-[10px] text-slate-400 font-mono">Roll: #{s ? s.rollNumber : 'N/A'}</span>
                            </td>
                            <td className="p-4 text-slate-600 font-medium">
                              {tx.feeType}
                            </td>
                            <td className="p-4 font-bold text-slate-800">
                              ${tx.amount}
                            </td>
                            <td className="p-4 font-mono text-slate-500">
                              {tx.date}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                                tx.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODAL WINDOWS FOR INPUT SUBMISSIONS */}
      
      {/* 1. Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Add Faculty Member</h3>
            <form onSubmit={handleAddTeacherSubmit} className="space-y-3.5">
              <input
                type="text"
                required
                placeholder="Teacher's Full Name"
                value={tName}
                onChange={e => setTName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="Institutional Email"
                value={tEmail}
                onChange={e => setTEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number (Optional)"
                value={tPhone}
                onChange={e => setTPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Designation"
                  value={tDesignation}
                  onChange={e => setTDesignation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Monthly Salary ($)"
                  value={tSalary}
                  onChange={e => setTSalary(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="w-1/2 text-xs font-semibold py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Submit Hiring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 font-display">Student Admission</h3>
            <form onSubmit={handleAddStudentSubmit} className="space-y-3.5">
              <input
                type="text"
                required
                placeholder="Student's Full Name"
                value={sName}
                onChange={e => setSName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Roll Number (e.g., 1044)"
                value={sRoll}
                onChange={e => setSRoll(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Assign Class</label>
                <select
                  required
                  value={sClassId}
                  onChange={e => setSClassId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Grade Section</option>
                  {myClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Guardian Name"
                  value={sGuardianName}
                  onChange={e => setSGuardianName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Guardian Email"
                  value={sGuardianEmail}
                  onChange={e => setSGuardianEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="w-1/2 text-xs font-semibold py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Admit Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xs w-full border border-slate-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 font-display">Configure Grade Class</h3>
            <form onSubmit={handleAddClassSubmit} className="space-y-3.5">
              <input
                type="text"
                required
                placeholder="Class Name (e.g., Grade 11)"
                value={cName}
                onChange={e => setCName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Section Name (e.g., A)"
                value={cSection}
                onChange={e => setCSection(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Room Name (e.g., Room 402)"
                value={cRoom}
                onChange={e => setCRoom(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Class Advisor</label>
                <select
                  value={cTeacherId}
                  onChange={e => setCTeacherId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Class Teacher</option>
                  {myTeachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="w-1/2 text-xs font-semibold py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xs w-full border border-slate-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 font-display">Create Subject</h3>
            <form onSubmit={handleAddSubjectSubmit} className="space-y-3.5">
              <input
                type="text"
                required
                placeholder="Subject Name (e.g., Chemistry)"
                value={subName}
                onChange={e => setSubName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Code (e.g., CHE-10)"
                value={subCode}
                onChange={e => setSubCode(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Assigned Grade</label>
                <select
                  required
                  value={subClassId}
                  onChange={e => setSubClassId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Target Class</option>
                  {myClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}-{c.section}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Teaching Instructor</label>
                <select
                  required
                  value={subTeacherId}
                  onChange={e => setSubTeacherId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Lecturer</option>
                  {myTeachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="w-1/2 text-xs font-semibold py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Notice Modal */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Broadcast Notice</h3>
            <form onSubmit={handleAddNoticeSubmit} className="space-y-3.5">
              <input
                type="text"
                required
                placeholder="Notice Title"
                value={nTitle}
                onChange={e => setNTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />
              
              <textarea
                required
                placeholder="Notice content text..."
                value={nContent}
                onChange={e => setNContent(e.target.value)}
                rows={4}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Audience Group</label>
                <select
                  value={nAudience}
                  onChange={e => setNAudience(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Everyone</option>
                  <option value="teachers">Only Teachers</option>
                  <option value="parents">Only Parents</option>
                  <option value="students">Only Students</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="w-1/2 text-xs font-semibold py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Emit Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Invoice Student Modal */}
      {showChargeFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Charge Manual Invoicing Fee</h3>
            <form onSubmit={handleChargeFeeSubmit} className="space-y-3.5">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Select Scholar</label>
                <select
                  required
                  value={feeStudentId}
                  onChange={e => setFeeStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose Student</option>
                  {myStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name} (Roll: {st.rollNumber})</option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                required
                placeholder="Billing Fee Type (e.g., Annual Lab Levy)"
                value={feeType}
                onChange={e => setFeeType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Amount ($)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g., 50"
                  value={feeAmount}
                  onChange={e => setFeeAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChargeFeeModal(false)}
                  className="w-1/2 text-xs font-semibold py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Invoice Fee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
