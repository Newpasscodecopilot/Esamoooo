import React, { useState } from 'react';
import { useSchoolDb } from '../db/mockDb';
import { User, Attendance, ExamResult, Assignment } from '../types';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  ClipboardList, 
  Check, 
  Plus, 
  X, 
  ArrowLeft,
  FileSpreadsheet,
  Megaphone,
  Briefcase
} from 'lucide-react';

interface TeacherDashboardProps {
  onLogout: () => void;
  currentUser: User;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout, currentUser }) => {
  const {
    classes,
    subjects,
    students,
    teachers,
    attendance,
    notices,
    assignments,
    saveAttendance,
    addExamResult,
    addAssignment,
    deleteAssignment
  } = useSchoolDb();

  const [activeTab, setActiveTab] = useState<'attendance' | 'grading' | 'assignments' | 'notices'>('attendance');
  
  // Find current teacher context
  const mySchoolId = currentUser.schoolId || 'school-1';
  const currentTeacher = teachers.find(t => t.email === currentUser.email);
  const myTeacherId = currentTeacher?.id || 'teacher-g-1';

  // Filter lists to this school
  const myClasses = classes.filter(c => c.schoolId === mySchoolId);
  const mySubjects = subjects.filter(s => s.schoolId === mySchoolId && s.teacherId === myTeacherId);
  const schoolNotices = notices.filter(n => n.schoolId === mySchoolId && (n.targetAudience === 'all' || n.targetAudience === 'teachers'));
  const schoolStudents = students.filter(s => s.schoolId === mySchoolId);
  const myAssignments = assignments.filter(a => a.schoolId === mySchoolId && a.teacherId === myTeacherId);

  // States for Roll Call (Attendance Tab)
  const [attClassId, setAttClassId] = useState(myClasses[0]?.id || 'class-g-10a');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attState, setAttState] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [attSuccess, setAttSuccess] = useState(false);

  // States for Entering Marks (Grading Tab)
  const [gradeClassId, setGradeClassId] = useState(myClasses[0]?.id || 'class-g-10a');
  const [gradeSubjectId, setGradeSubjectId] = useState(mySubjects[0]?.id || 'subject-g-math');
  const [examName, setExamName] = useState('Term 2 Assessment');
  const [marksState, setMarksState] = useState<Record<string, { marks: number, max: number }>>({});
  const [marksSuccess, setMarksSuccess] = useState(false);

  // States for Assignments Tab
  const [showAsgModal, setShowAsgModal] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgDesc, setAsgDesc] = useState('');
  const [asgDueDate, setAsgDueDate] = useState('');
  const [asgClassId, setAsgClassId] = useState(myClasses[0]?.id || 'class-g-10a');
  const [asgSubjectId, setAsgSubjectId] = useState(mySubjects[0]?.id || 'subject-g-math');

  // Load students for chosen class
  const classStudents = schoolStudents.filter(s => s.classId === attClassId);
  const gradingStudents = schoolStudents.filter(s => s.classId === gradeClassId);

  // Calculate grading details helper
  const calculateGrade = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    return 'F';
  };

  // Submit handlers
  const handleSaveAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classStudents.length === 0) return;

    const records = classStudents.map(student => ({
      schoolId: mySchoolId,
      studentId: student.id,
      date: attDate,
      status: attState[student.id] || 'present',
      classId: attClassId
    }));

    saveAttendance(records);
    setAttSuccess(true);
    setTimeout(() => setAttSuccess(false), 2000);
  };

  const handleSaveMarksSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gradingStudents.length === 0) return;

    gradingStudents.forEach(student => {
      const state = marksState[student.id] || { marks: 80, max: 100 };
      addExamResult({
        schoolId: mySchoolId,
        studentId: student.id,
        subjectId: gradeSubjectId,
        marksObtained: Number(state.marks),
        maxMarks: Number(state.max),
        examName,
        grade: calculateGrade(state.marks, state.max)
      });
    });

    setMarksSuccess(true);
    setTimeout(() => setMarksSuccess(false), 2000);
  };

  const handleAddAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle || !asgDueDate) return;

    addAssignment({
      schoolId: mySchoolId,
      title: asgTitle,
      description: asgDesc,
      dueDate: asgDueDate,
      classId: asgClassId,
      subjectId: asgSubjectId,
      teacherId: myTeacherId
    });

    setAsgTitle('');
    setAsgDesc('');
    setAsgDueDate('');
    setShowAsgModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-left">
      
      {/* Header bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogout}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
            title="Return home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-9 w-9 bg-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            🎓
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight block">Faculty Space</span>
            <span className="text-[10px] text-violet-400 font-mono">Academic Class Registries</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-semibold">{currentUser.name}</span>
            <span className="text-[9px] text-slate-400 font-mono">Lecturer ID: {myTeacherId}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Switch Role
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-1 bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-sm h-fit">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Daily Roll-Call
          </button>

          <button
            onClick={() => setActiveTab('grading')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'grading' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Enter Exam Marks
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'assignments' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Study Homework ({myAssignments.length})
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full text-left text-xs font-bold p-3 rounded-xl transition flex items-center gap-3 ${
              activeTab === 'notices' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Faculty Noticeboard
          </button>
        </aside>

        {/* Dynamic Action panels */}
        <div className="flex-1 space-y-6">

          {/* TAB 1: DAILY ROLL CALL */}
          {activeTab === 'attendance' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
              <div className="border-b border-slate-50 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">Attendance Logbook</h3>
                  <p className="text-xs text-slate-400">Perform daily student audits. Syncs with parent portals instantly.</p>
                </div>
                
                <div className="flex gap-2 text-xs">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Class Section</span>
                    <select
                      value={attClassId}
                      onChange={e => setAttClassId(e.target.value)}
                      className="border border-slate-200 p-2 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                    >
                      {myClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - Section {c.section}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Audit Date</span>
                    <input
                      type="date"
                      value={attDate}
                      onChange={e => setAttDate(e.target.value)}
                      className="border border-slate-200 p-2 rounded-lg focus:outline-none focus:border-indigo-500 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {classStudents.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-xs">No students registered in this class roster.</p>
              ) : (
                <form onSubmit={handleSaveAttendanceSubmit} className="space-y-4">
                  <div className="space-y-2">
                    {classStudents.map(student => {
                      const currentSelection = attState[student.id] || 'present';
                      return (
                        <div 
                          key={student.id}
                          className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-900 block">{student.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Roll: #{student.rollNumber}</span>
                          </div>

                          {/* Attendance selector switches */}
                          <div className="flex gap-1 bg-slate-200/60 p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => setAttState(prev => ({ ...prev, [student.id]: 'present' }))}
                              className={`text-[10px] font-bold px-3 py-1 rounded transition-colors duration-150 ${
                                currentSelection === 'present' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => setAttState(prev => ({ ...prev, [student.id]: 'absent' }))}
                              className={`text-[10px] font-bold px-3 py-1 rounded transition-colors duration-150 ${
                                currentSelection === 'absent' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => setAttState(prev => ({ ...prev, [student.id]: 'late' }))}
                              className={`text-[10px] font-bold px-3 py-1 rounded transition-colors duration-150 ${
                                currentSelection === 'late' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600'
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 justify-end pt-4 border-t border-slate-50">
                    {attSuccess && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Logbook updated!
                      </span>
                    )}
                    <button
                      type="submit"
                      className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-100"
                    >
                      Save Roll-Call
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: ENTER GRADES / MARKS */}
          {activeTab === 'grading' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
              <div className="border-b border-slate-50 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">Transcript Grading Desk</h3>
                  <p className="text-xs text-slate-400">Record midterm or assignment grades. Automatically drafts GPAs.</p>
                </div>

                <div className="grid grid-cols-2 sm:flex gap-2 text-xs">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Class</span>
                    <select
                      value={gradeClassId}
                      onChange={e => setGradeClassId(e.target.value)}
                      className="border border-slate-200 p-2 rounded-lg bg-white focus:outline-none text-xs"
                    >
                      {myClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Subject Code</span>
                    <select
                      value={gradeSubjectId}
                      onChange={e => setGradeSubjectId(e.target.value)}
                      className="border border-slate-200 p-2 rounded-lg bg-white focus:outline-none text-xs"
                    >
                      {mySubjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Exam Description</span>
                    <input
                      type="text"
                      value={examName}
                      onChange={e => setExamName(e.target.value)}
                      placeholder="e.g., Final Midterm"
                      className="border border-slate-200 p-2 rounded-lg focus:outline-none focus:border-indigo-500 text-xs w-full sm:w-44"
                    />
                  </div>
                </div>
              </div>

              {gradingStudents.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-xs">No student records match selected class section.</p>
              ) : (
                <form onSubmit={handleSaveMarksSubmit} className="space-y-4">
                  <div className="space-y-2">
                    {gradingStudents.map(student => {
                      const currentVal = marksState[student.id] || { marks: 80, max: 100 };
                      return (
                        <div 
                          key={student.id}
                          className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{student.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Roll: #{student.rollNumber}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              required
                              placeholder="Score"
                              value={currentVal.marks}
                              onChange={e => setMarksState(prev => ({
                                ...prev,
                                [student.id]: { ...currentVal, marks: Number(e.target.value) }
                              }))}
                              className="w-16 p-2 rounded border focus:outline-none bg-white font-mono text-center text-xs"
                            />
                            <span className="text-slate-400">/</span>
                            <input
                              type="number"
                              required
                              placeholder="Max"
                              value={currentVal.max}
                              onChange={e => setMarksState(prev => ({
                                ...prev,
                                [student.id]: { ...currentVal, max: Number(e.target.value) }
                              }))}
                              className="w-16 p-2 rounded border focus:outline-none bg-white font-mono text-center text-xs"
                            />
                            <span className="text-[11px] bg-slate-200 font-bold px-2 py-1.5 rounded text-slate-700 min-w-10 text-center">
                              Grade: {calculateGrade(currentVal.marks, currentVal.max)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 justify-end pt-4 border-t border-slate-50">
                    {marksSuccess && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Grading report generated!
                      </span>
                    )}
                    <button
                      type="submit"
                      className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-100"
                    >
                      Publish Grades
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: STUDY ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 font-display">Syllabus Homework & Projects</h3>
                  <p className="text-xs text-slate-400">Designate assignments, set deadlines, and upload descriptions</p>
                </div>
                <button
                  onClick={() => setShowAsgModal(true)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Assign Coursework
                </button>
              </div>

              {myAssignments.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No assignments posted. Click button to upload a task.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {myAssignments.map(asg => {
                    const c = myClasses.find(cls => cls.id === asg.classId);
                    const sub = mySubjects.find(s => s.id === asg.subjectId);
                    return (
                      <div key={asg.id} className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 space-y-3 relative text-left">
                        <div className="space-y-1">
                          <span className="block font-bold text-xs text-slate-900">{asg.title}</span>
                          <span className="text-[10px] text-indigo-600 font-medium">Subject: {sub ? sub.name : 'N/A'} ({c ? `${c.name}-${c.section}` : 'All'})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{asg.description}</p>
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
                          <span>📅 Due: {asg.dueDate}</span>
                          <button
                            onClick={() => deleteAssignment(asg.id)}
                            className="text-rose-500 hover:text-rose-700 text-[10px]"
                          >
                            Purge Task
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FACULTY NOTICES */}
          {activeTab === 'notices' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-50 pb-3">Faculty Noticeboard</h3>
              
              {schoolNotices.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No notices issued for faculty yet.</p>
              ) : (
                <div className="space-y-3">
                  {schoolNotices.map(notice => (
                    <div key={notice.id} className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{notice.title}</span>
                        <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase">
                          {notice.targetAudience}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
                      <span className="block text-[9px] text-slate-400 font-mono pt-1">Broadcasted on {notice.createdAt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Assignment Upload Modal */}
      {showAsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 font-display">Assign Coursework</h3>
            <form onSubmit={handleAddAssignmentSubmit} className="space-y-3.5">
              <input
                type="text"
                required
                placeholder="Assignment Title (e.g., Chemistry Homework 2)"
                value={asgTitle}
                onChange={e => setAsgTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-indigo-500 focus:outline-none"
              />

              <textarea
                required
                placeholder="Describe project details, rules, or questions..."
                value={asgDesc}
                onChange={e => setAsgDesc(e.target.value)}
                rows={4}
                className="w-full text-xs p-2.5 rounded-lg border focus:border-indigo-500 focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Target Grade</span>
                  <select
                    value={asgClassId}
                    onChange={e => setAsgClassId(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-white focus:outline-none text-xs"
                  >
                    {myClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Course subject</span>
                  <select
                    value={asgSubjectId}
                    onChange={e => setAsgSubjectId(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-white focus:outline-none text-xs"
                  >
                    {mySubjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Submission Deadline</span>
                <input
                  type="date"
                  required
                  value={asgDueDate}
                  onChange={e => setAsgDueDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAsgModal(false)}
                  className="w-1/2 text-xs font-semibold py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
