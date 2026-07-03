import React, { useState } from 'react';
import { useSchoolDb } from '../db/mockDb';
import { User, Attendance, ExamResult, Assignment } from '../types';
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
  GraduationCap
} from 'lucide-react';

interface StudentDashboardProps {
  onLogout: () => void;
  currentUser: User;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onLogout, currentUser }) => {
  const {
    classes,
    subjects,
    students,
    teachers,
    attendance,
    notices,
    assignments,
    examResults
  } = useSchoolDb();

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'grading' | 'assignments'>('overview');
  
  // Find current student context
  const mySchoolId = currentUser.schoolId || 'school-1';
  const currentStudent = students.find(s => s.guardianEmail === currentUser.email || s.name === currentUser.name);
  const myStudentId = currentStudent?.id || 'student-g-1';

  // Filter lists to this school / student
  const studentInfo = students.find(s => s.id === myStudentId);
  const myClassId = studentInfo?.classId || 'class-g-10a';
  const myClass = classes.find(c => c.id === myClassId);
  const mySubjects = subjects.filter(s => s.classId === myClassId);
  
  const myAttendance = attendance.filter(a => a.studentId === myStudentId);
  const myAssignments = assignments.filter(a => a.classId === myClassId);
  const myExamResults = examResults.filter(er => er.studentId === myStudentId);
  const schoolNotices = notices.filter(n => n.schoolId === mySchoolId && (n.targetAudience === 'all' || n.targetAudience === 'students'));

  // Attendance metrics
  const totalDaysAudited = myAttendance.length;
  const daysPresent = myAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = totalDaysAudited > 0 ? Math.round((daysPresent / totalDaysAudited) * 100) : 100;

  // Transcript average
  const gradedExamsCount = myExamResults.length;
  const totalMarksEarned = myExamResults.reduce((sum, e) => sum + e.marksObtained, 0);
  const totalMarksPossible = myExamResults.reduce((sum, e) => sum + e.maxMarks, 0);
  const finalPercentage = totalMarksPossible > 0 ? Math.round((totalMarksEarned / totalMarksPossible) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-left">
      
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogout}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
            title="Return home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-9 w-9 bg-white text-slate-900 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">
            ⚡
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight block">Student Desk</span>
            <span className="text-[10px] text-slate-400 font-mono">Academic Performance Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-semibold">{currentUser.name}</span>
            <span className="text-[9px] text-slate-400 font-mono">Roll Number: #{studentInfo?.rollNumber || 'N/A'}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs bg-slate-800 hover:bg-slate-705 text-slate-100 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Switch Role
          </button>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-1 bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-sm h-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Scholar Home
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
            Midterm Transcripts
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'assignments' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Assigned Homework ({myAssignments.length})
          </button>
        </aside>

        {/* Workspace Display */}
        <div className="flex-1 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Scholar Registered Context
                  </span>
                  <h2 className="text-xl font-bold font-display">Welcome back, {studentInfo?.name}!</h2>
                  <p className="text-xs text-slate-300">
                    Currently enrolled in <span className="font-bold underline">{myClass ? `${myClass.name} - Section ${myClass.section}` : 'N/A'}</span> (Classroom: {myClass?.room || '301'})
                  </p>
                </div>

                <div className="flex gap-4 font-mono text-center text-xs shrink-0">
                  <div className="bg-white/10 p-3 rounded-xl border border-white/5 min-w-24">
                    <span className="block text-[10px] text-slate-400 font-sans">Attendance</span>
                    <span className="text-lg font-bold font-display text-white">{attendanceRate}%</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl border border-white/5 min-w-24">
                    <span className="block text-[10px] text-slate-400 font-sans">Avg Score</span>
                    <span className="text-lg font-bold font-display text-white">{finalPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Course Directory & Announcements */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Course catalog */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 text-left">
                  <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-50 pb-3">Enrolled Courses</h3>
                  {mySubjects.length === 0 ? (
                    <p className="text-xs text-slate-400">No courses listed for your grade section.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {mySubjects.map(sub => {
                        const t = teachers.find(tch => tch.id === sub.teacherId);
                        return (
                          <div key={sub.id} className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-slate-900">{sub.name}</span>
                              <span className="block text-[9px] text-slate-400 font-mono">Code: {sub.code}</span>
                            </div>
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                              Instructor: {t ? t.name : 'Faculty'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Announcement list */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 space-y-4 text-left">
                  <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-50 pb-3">School Announcements</h3>
                  
                  {schoolNotices.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No new announcements for students.</p>
                  ) : (
                    <div className="space-y-3">
                      {schoolNotices.slice(0, 3).map(notice => (
                        <div key={notice.id} className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                          <span className="font-bold text-xs text-slate-900 block">{notice.title}</span>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{notice.content}</p>
                          <span className="block text-[9px] text-slate-400 font-mono pt-1">Posted: {notice.createdAt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ATTENDANCE LOG */}
          {activeTab === 'attendance' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Attendance Log</h3>
                <p className="text-xs text-slate-400">Verifiable, teacher-submitted attendance logs</p>
              </div>

              {myAttendance.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No attendance reports submitted by advisors yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {myAttendance.map(entry => (
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

          {/* TAB 3: GRADES TRANSCRIPTS */}
          {activeTab === 'grading' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6 overflow-hidden">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Exams transcript & reports</h3>
                <p className="text-xs text-slate-400">Midterm, final examinations, and class assignment GPAs</p>
              </div>

              {myExamResults.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No exam results published for your roster yet.</p>
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
                      {myExamResults.map(res => {
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

          {/* TAB 4: COURSE WORK HOMEWORK */}
          {activeTab === 'assignments' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Assigned homework & syllabus projects</h3>
                <p className="text-xs text-slate-400">Complete these before due dates to maintain transcripts scores</p>
              </div>

              {myAssignments.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No coursework assignments registered.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {myAssignments.map(asg => {
                    const sub = subjects.find(s => s.id === asg.subjectId);
                    return (
                      <div key={asg.id} className="p-4 border border-slate-150 bg-slate-50/50 rounded-xl space-y-3 text-left">
                        <div className="space-y-1">
                          <span className="block font-bold text-xs text-slate-900">{asg.title}</span>
                          <span className="text-[10px] text-blue-600 font-medium">Subject: {sub ? sub.name : 'N/A'}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{asg.description}</p>
                        <div className="text-[10px] text-rose-500 font-bold font-mono pt-1.5 border-t border-slate-100">
                          ⏱️ Deadline: {asg.dueDate}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
