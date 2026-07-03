import React, { useState } from 'react';
import { useSchoolDb } from '../db/mockDb';
import { User, Attendance, ExamResult, FeeTransaction } from '../types';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  ClipboardList, 
  Check, 
  ArrowLeft,
  FileSpreadsheet,
  Megaphone,
  Briefcase,
  DollarSign,
  Heart,
  CreditCard,
  Lock
} from 'lucide-react';

interface ParentDashboardProps {
  onLogout: () => void;
  currentUser: User;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onLogout, currentUser }) => {
  const {
    classes,
    subjects,
    students,
    teachers,
    attendance,
    notices,
    feeTransactions,
    examResults,
    payFee
  } = useSchoolDb();

  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'attendance' | 'grading'>('overview');
  
  // Find current parent context
  const mySchoolId = currentUser.schoolId || 'school-1';
  
  // A parent might represent multiple children. By default, fetch children whose guardian is this parent
  const myChildren = students.filter(s => s.guardianEmail === currentUser.email);
  const [selectedChildId, setSelectedChildId] = useState(myChildren[0]?.id || 'student-g-1');

  // Active child context
  const activeChild = students.find(s => s.id === selectedChildId);
  const childClassId = activeChild?.classId || 'class-g-10a';
  const childClass = classes.find(c => c.id === childClassId);

  // Filter child specific lists
  const childAttendance = attendance.filter(a => a.studentId === selectedChildId);
  const childExamResults = examResults.filter(er => er.studentId === selectedChildId);
  const childTransactions = feeTransactions.filter(f => f.studentId === selectedChildId);
  const schoolNotices = notices.filter(n => n.schoolId === mySchoolId && (n.targetAudience === 'all' || n.targetAudience === 'parents'));

  // Metrics
  const pendingFees = childTransactions.filter(f => f.status === 'pending');
  const totalDaysAudited = childAttendance.length;
  const daysPresent = childAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = totalDaysAudited > 0 ? Math.round((daysPresent / totalDaysAudited) * 100) : 100;

  // Grade aggregate
  const gradedExamsCount = childExamResults.length;
  const totalMarksEarned = childExamResults.reduce((sum, e) => sum + e.marksObtained, 0);
  const totalMarksPossible = childExamResults.reduce((sum, e) => sum + e.maxMarks, 0);
  const gradePercentage = totalMarksPossible > 0 ? Math.round((totalMarksEarned / totalMarksPossible) * 100) : 0;

  // Payment Form States
  const [showPayModal, setShowPayModal] = useState(false);
  const [payingTx, setPayingTx] = useState<FeeTransaction | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  const handlePayFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingTx) return;

    // Simulate standard credit card clearance delay
    setPaySuccess(true);
    setTimeout(() => {
      payFee(payingTx.id);
      setPaySuccess(false);
      setShowPayModal(false);
      setPayingTx(null);
      setCardNumber('');
      setCardExpiry('');
      setCardCVV('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-left">
      
      {/* Header bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogout}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
            title="Return home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-9 w-9 bg-white text-slate-900 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
            🏡
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight block">Parent Portal Simulator</span>
            <span className="text-[10px] text-slate-400 font-mono">Guardian Oversight Room</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-semibold">{currentUser.name}</span>
            <span className="text-[9px] text-slate-400 font-mono">Guardian Workspace</span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-100 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Switch Role
          </button>
        </div>
      </header>

      {/* Children context select row */}
      <div className="bg-white border-b border-slate-200/60 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
            <span className="text-xs font-bold text-slate-700">Select child details workspace:</span>
          </div>
          <div className="flex gap-2">
            {myChildren.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-4.5 py-1.5 text-xs font-bold rounded-xl transition ${
                  selectedChildId === child.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-50' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                👶 {child.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-1 bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-sm h-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Users className="w-4 h-4" />
            Guardian Home
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'fees' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Pay School Fees ({pendingFees.length})
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'attendance' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Attendance ({attendanceRate}%)
          </button>

          <button
            onClick={() => setActiveTab('grading')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'grading' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exams report
          </button>
        </aside>

        {/* Dynamic Action panels */}
        <div className="flex-1 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Children Status summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1 text-center sm:text-left border-r border-slate-100 last:border-0 pr-4">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Assigned Room</span>
                  <p className="text-base font-bold text-slate-900 font-display">
                    {childClass ? `${childClass.name} - ${childClass.section}` : 'N/A'}
                  </p>
                  <p className="text-[10px] text-slate-500">Instructor block: {childClass?.room || '301'}</p>
                </div>

                <div className="space-y-1 text-center sm:text-left border-r border-slate-100 last:border-0 pr-4">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Attendance Audits</span>
                  <p className="text-base font-bold text-slate-900 font-display">{attendanceRate}% Present</p>
                  <p className="text-[10px] text-slate-500">Audited days: {totalDaysAudited}</p>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Outstanding Balance</span>
                  <p className="text-base font-bold text-rose-600 font-display">${activeChild?.balanceDue}</p>
                  <p className="text-[10px] text-slate-500">Unpaid fee items: {pendingFees.length}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Active Fee Items */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 text-left">
                  <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-50 pb-3">Unpaid fees invoice</h3>
                  {pendingFees.length === 0 ? (
                    <p className="text-xs text-emerald-600 font-semibold py-4 text-center">✓ No outstanding fees due.</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingFees.map(f => (
                        <div key={f.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 line-clamp-1">{f.feeType}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">Amt: ${f.amount}</span>
                          </div>
                          <button
                            onClick={() => {
                              setPayingTx(f);
                              setShowPayModal(true);
                            }}
                            className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            Pay
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Announcement feed list */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 space-y-4 text-left">
                  <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-50 pb-3">Principal broadcasts notice</h3>
                  
                  {schoolNotices.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No notices issued to guardians.</p>
                  ) : (
                    <div className="space-y-3">
                      {schoolNotices.slice(0, 3).map(notice => (
                        <div key={notice.id} className="p-3.5 bg-slate-50/60 border border-slate-100 rounded-xl space-y-1">
                          <span className="font-bold text-xs text-slate-900 block">{notice.title}</span>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{notice.content}</p>
                          <span className="block text-[9px] text-slate-400 font-mono pt-1">Issued: {notice.createdAt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PAY SCHOOL FEES */}
          {activeTab === 'fees' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Tuition fees & Ledger</h3>
                <p className="text-xs text-slate-400">Reconcile partial or full academic payments with our sandbox simulator</p>
              </div>

              {childTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No transactions registered for student.</p>
              ) : (
                <div className="space-y-2.5">
                  {childTransactions.map(tx => (
                    <div 
                      key={tx.id} 
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{tx.feeType}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">Date billed: {tx.date}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-800 text-sm">${tx.amount}</span>
                        {tx.status === 'paid' ? (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-[9px] uppercase tracking-wider">
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setPayingTx(tx);
                              setShowPayModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-xl text-[10px] transition shadow-md shadow-blue-100"
                          >
                            Pay Online
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ATTENDANCE LOGS */}
          {activeTab === 'attendance' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Attendance Registry</h3>
                <p className="text-xs text-slate-400">View daily attendance audits and summaries</p>
              </div>

              {childAttendance.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No attendance reports published yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {childAttendance.map(entry => (
                    <div key={entry.id} className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 font-mono">{entry.date}</span>
                      <span className={`px-3 py-1 rounded-lg font-bold text-[9px] uppercase tracking-wider ${
                        entry.status === 'present' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : entry.status === 'absent' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GRADING REPORT CARD */}
          {activeTab === 'grading' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6 overflow-hidden">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Transcript Report Card</h3>
                <p className="text-xs text-slate-400">Midterm GPAs and academic assessments overview</p>
              </div>

              {childExamResults.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center font-semibold">No grading reports posted by lecturers.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono uppercase border-b border-slate-100">
                        <th className="p-4">Assigned Course</th>
                        <th className="p-4">Exam Block</th>
                        <th className="p-4">Marks Earned</th>
                        <th className="p-4 text-center">Letter Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {childExamResults.map(res => {
                        const sub = subjects.find(s => s.id === res.subjectId);
                        return (
                          <tr key={res.id} className="hover:bg-slate-50/40">
                            <td className="p-4 text-slate-900 font-bold">
                              {sub ? sub.name : 'Unknown Subject'}
                            </td>
                            <td className="p-4 text-slate-500">
                              {res.examName}
                            </td>
                            <td className="p-4 font-mono text-slate-700">
                              {res.marksObtained} / {res.maxMarks} ({Math.round((res.marksObtained / res.maxMarks) * 100)}%)
                            </td>
                            <td className="p-4 text-center">
                              <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-100">
                                {res.grade}
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

      {/* ONLINE FEE PAYMENT MODAL SIMULATOR */}
      {showPayModal && payingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm text-left">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-100 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 font-display">Secured Card Checkout</h3>
                <p className="text-xs text-slate-400 font-mono">Simulated sandbox gateway</p>
              </div>
              <button
                onClick={() => {
                  setShowPayModal(false);
                  setPayingTx(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-semibold"
              >
                ✕
              </button>
            </div>

            {paySuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold mx-auto animate-bounce">
                  ✓
                </div>
                <p className="text-sm font-semibold text-slate-800">Clearing card transactions...</p>
                <p className="text-xs text-slate-400">Ledger balance reconciliations active.</p>
              </div>
            ) : (
              <form onSubmit={handlePayFeeSubmit} className="space-y-4">
                
                {/* Billing Summary */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Billing Item</span>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{payingTx.feeType}</p>
                  <p className="text-sm font-extrabold text-blue-600 font-mono pt-1">${payingTx.amount} Due</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Card Holder Number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">CVV Code</label>
                      <input
                        type="password"
                        required
                        placeholder="***"
                        maxLength={3}
                        value={cardCVV}
                        onChange={e => setCardCVV(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Sandbox. Do not enter actual credentials.</span>
                </div>

                <button
                  type="submit"
                  className="w-full text-xs font-bold py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
                >
                  Pay Invoice
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
