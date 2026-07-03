import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SubscriptionPlan,
  School,
  User,
  Class,
  Subject,
  Student,
  Teacher,
  Attendance,
  Assignment,
  Notice,
  ExamResult,
  FeeTransaction
} from '../types';

export interface SchoolDbContextType {
  plans: SubscriptionPlan[];
  schools: School[];
  users: User[];
  classes: Class[];
  subjects: Subject[];
  students: Student[];
  teachers: Teacher[];
  attendance: Attendance[];
  assignments: Assignment[];
  notices: Notice[];
  examResults: ExamResult[];
  feeTransactions: FeeTransaction[];
  
  // Update methods
  addSchool: (school: Omit<School, 'id' | 'registeredAt' | 'balance' | 'studentCount' | 'teacherCount'>) => School;
  updateSchoolStatus: (id: string, status: 'active' | 'suspended') => void;
  deleteSchool: (id: string) => void;
  updateSchoolPlan: (schoolId: string, planId: string) => void;
  
  addClass: (cls: Omit<Class, 'id'>) => void;
  addSubject: (subj: Omit<Subject, 'id'>) => void;
  
  addStudent: (student: Omit<Student, 'id' | 'balanceDue'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  
  saveAttendance: (records: Omit<Attendance, 'id'>[]) => void;
  
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  deleteAssignment: (id: string) => void;
  
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  deleteNotice: (id: string) => void;
  
  addExamResult: (result: Omit<ExamResult, 'id'>) => void;
  
  payFee: (transactionId: string) => void;
  addFeeTransaction: (transaction: Omit<FeeTransaction, 'id' | 'date' | 'status'>) => void;
  
  // Helper loaders
  resetDatabase: () => void;
}

const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    maxStudents: 150,
    maxTeachers: 15,
    features: [
      'Core Student Directory',
      'Basic Class Timetables',
      'Daily Attendance Logbook',
      'Simple Notices & Board',
      'Email Notifications'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 99,
    maxStudents: 500,
    maxTeachers: 40,
    features: [
      'Everything in Basic',
      'Extended Attendance Tracker',
      'Exams & Digital Gradebooks',
      'Homework & Assignments',
      'In-App Notice Alerts',
      'Standard Ticket Support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    maxStudents: 9999, // unlimited
    maxTeachers: 999, // unlimited
    features: [
      'Everything in Standard',
      'Instant Online Fees Portal',
      'Detailed Student Progress Cards',
      'Interactive Parent Dashboard',
      'School Custom Subdomain',
      '24/7 Priority Helpline Support'
    ]
  }
];

const DEFAULT_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'Greenwood International School',
    domain: 'greenwood.edu',
    planId: 'premium',
    status: 'active',
    logoType: 'tree',
    studentCount: 3,
    teacherCount: 2,
    registeredAt: '2026-03-15',
    contactEmail: 'admin@greenwood.edu',
    balance: 1450
  },
  {
    id: 'school-2',
    name: 'Horizon Heights Academy',
    domain: 'horizon.edu',
    planId: 'standard',
    status: 'active',
    logoType: 'sun',
    studentCount: 0,
    teacherCount: 0,
    registeredAt: '2026-05-10',
    contactEmail: 'admin@horizon.edu',
    balance: 590
  },
  {
    id: 'school-3',
    name: 'Oakridge Grammar School',
    domain: 'oakridge.edu',
    planId: 'basic',
    status: 'suspended',
    logoType: 'book',
    studentCount: 0,
    teacherCount: 0,
    registeredAt: '2026-01-20',
    contactEmail: 'admin@oakridge.edu',
    balance: 0
  }
];

const DEFAULT_USERS: User[] = [
  {
    id: 'user-super',
    email: 'superadmin@saas.com',
    name: 'Arthur Pendragon',
    role: 'super_admin'
  },
  {
    id: 'user-admin-g',
    email: 'admin@greenwood.edu',
    name: 'Sarah Greenwood',
    role: 'school_admin',
    schoolId: 'school-1'
  },
  {
    id: 'user-teacher-emily',
    email: 'teacher.emily@greenwood.edu',
    name: 'Emily Rogers',
    role: 'teacher',
    schoolId: 'school-1'
  },
  {
    id: 'user-teacher-robert',
    email: 'teacher.robert@greenwood.edu',
    name: 'Robert Vance',
    role: 'teacher',
    schoolId: 'school-1'
  },
  {
    id: 'user-student-alex',
    email: 'student.alex@greenwood.edu',
    name: 'Alex Mercer',
    role: 'student',
    schoolId: 'school-1'
  },
  {
    id: 'user-parent-sarah',
    email: 'parent.sarah@greenwood.edu',
    name: 'Sarah Mercer',
    role: 'parent',
    schoolId: 'school-1',
    parentOf: ['student-g-1']
  }
];

const DEFAULT_CLASSES: Class[] = [
  {
    id: 'class-g-10a',
    schoolId: 'school-1',
    name: 'Grade 10',
    section: 'A',
    classTeacherId: 'teacher-g-1',
    room: 'Room 301'
  },
  {
    id: 'class-g-9b',
    schoolId: 'school-1',
    name: 'Grade 9',
    section: 'B',
    classTeacherId: 'teacher-g-2',
    room: 'Room 204'
  }
];

const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'subject-g-math',
    schoolId: 'school-1',
    name: 'Mathematics',
    code: 'MTH-10',
    classId: 'class-g-10a',
    teacherId: 'teacher-g-1'
  },
  {
    id: 'subject-g-phys',
    schoolId: 'school-1',
    name: 'Physics',
    code: 'PHY-10',
    classId: 'class-g-10a',
    teacherId: 'teacher-g-1'
  },
  {
    id: 'subject-g-eng',
    schoolId: 'school-1',
    name: 'English Literature',
    code: 'ENG-10',
    classId: 'class-g-10a',
    teacherId: 'teacher-g-2'
  }
];

const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'student-g-1',
    schoolId: 'school-1',
    name: 'Alex Mercer',
    rollNumber: '1001',
    classId: 'class-g-10a',
    guardianEmail: 'parent.sarah@greenwood.edu',
    guardianName: 'Sarah Mercer',
    balanceDue: 150
  },
  {
    id: 'student-g-2',
    schoolId: 'school-1',
    name: 'Chloe Bennett',
    rollNumber: '1002',
    classId: 'class-g-10a',
    guardianEmail: 'parent.john@greenwood.edu',
    guardianName: 'John Bennett',
    balanceDue: 0
  },
  {
    id: 'student-g-3',
    schoolId: 'school-1',
    name: 'Daniel Craig',
    rollNumber: '1003',
    classId: 'class-g-10a',
    guardianEmail: 'parent.daniel@greenwood.edu',
    guardianName: 'James Craig',
    balanceDue: 350
  }
];

const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 'teacher-g-1',
    schoolId: 'school-1',
    name: 'Emily Rogers',
    email: 'teacher.emily@greenwood.edu',
    phone: '+1 555-0199',
    designation: 'Senior Mathematics Specialist',
    joiningDate: '2024-08-15',
    salary: 4200
  },
  {
    id: 'teacher-g-2',
    schoolId: 'school-1',
    name: 'Robert Vance',
    email: 'teacher.robert@greenwood.edu',
    phone: '+1 555-0123',
    designation: 'Literature Department Head',
    joiningDate: '2023-01-10',
    salary: 4500
  }
];

const DEFAULT_ATTENDANCE: Attendance[] = [
  // Student 1 (Alex Mercer) - 80% present
  { id: 'att-1', schoolId: 'school-1', studentId: 'student-g-1', date: '2026-07-01', status: 'present', classId: 'class-g-10a' },
  { id: 'att-2', schoolId: 'school-1', studentId: 'student-g-1', date: '2026-06-30', status: 'present', classId: 'class-g-10a' },
  { id: 'att-3', schoolId: 'school-1', studentId: 'student-g-1', date: '2026-06-29', status: 'absent', classId: 'class-g-10a' },
  { id: 'att-4', schoolId: 'school-1', studentId: 'student-g-1', date: '2026-06-28', status: 'present', classId: 'class-g-10a' },
  { id: 'att-5', schoolId: 'school-1', studentId: 'student-g-1', date: '2026-06-27', status: 'present', classId: 'class-g-10a' },
  // Student 2 (Chloe Bennett) - 100% present
  { id: 'att-6', schoolId: 'school-1', studentId: 'student-g-2', date: '2026-07-01', status: 'present', classId: 'class-g-10a' },
  { id: 'att-7', schoolId: 'school-1', studentId: 'student-g-2', date: '2026-06-30', status: 'present', classId: 'class-g-10a' },
  { id: 'att-8', schoolId: 'school-1', studentId: 'student-g-2', date: '2026-06-29', status: 'present', classId: 'class-g-10a' },
  { id: 'att-9', schoolId: 'school-1', studentId: 'student-g-2', date: '2026-06-28', status: 'present', classId: 'class-g-10a' },
  { id: 'att-10', schoolId: 'school-1', studentId: 'student-g-2', date: '2026-06-27', status: 'present', classId: 'class-g-10a' },
  // Student 3 (Daniel Craig) - 60% present
  { id: 'att-11', schoolId: 'school-1', studentId: 'student-g-3', date: '2026-07-01', status: 'present', classId: 'class-g-10a' },
  { id: 'att-12', schoolId: 'school-1', studentId: 'student-g-3', date: '2026-06-30', status: 'absent', classId: 'class-g-10a' },
  { id: 'att-13', schoolId: 'school-1', studentId: 'student-g-3', date: '2026-06-29', status: 'absent', classId: 'class-g-10a' },
  { id: 'att-14', schoolId: 'school-1', studentId: 'student-g-3', date: '2026-06-28', status: 'present', classId: 'class-g-10a' },
  { id: 'att-15', schoolId: 'school-1', studentId: 'student-g-3', date: '2026-06-27', status: 'present', classId: 'class-g-10a' }
];

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    schoolId: 'school-1',
    title: 'Advanced Calculus Problem Set 4',
    description: 'Complete exercises 1 to 15 on page 142. Make sure to detail the limits and show proofs for trigonometric bounds.',
    dueDate: '2026-07-08',
    classId: 'class-g-10a',
    subjectId: 'subject-g-math',
    teacherId: 'teacher-g-1'
  },
  {
    id: 'asg-2',
    schoolId: 'school-1',
    title: 'Newtonian Mechanics Lab Write-up',
    description: 'Compile data gathered during last Thursday\'s friction coefficient experiment. Draw the force diagrams and submit the PDF.',
    dueDate: '2026-07-10',
    classId: 'class-g-10a',
    subjectId: 'subject-g-phys',
    teacherId: 'teacher-g-1'
  },
  {
    id: 'asg-3',
    schoolId: 'school-1',
    title: 'Shakespeare’s Hamlet Analysis Essay',
    description: 'Write a 1500-word critical review of Gertrude\'s role and tragic choices in Act 3, Scene 4. Standard citation rules apply.',
    dueDate: '2026-07-14',
    classId: 'class-g-10a',
    subjectId: 'subject-g-eng',
    teacherId: 'teacher-g-2'
  }
];

const DEFAULT_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    schoolId: 'school-1',
    title: 'Annual Athletic Games Registration Open',
    content: 'Our annual multi-school sports games registration is now officially active. Track & Field, Basketball, and swimming registrations will close next Friday. Sign up at the athletics physical block with your respective house heads.',
    targetAudience: 'all',
    createdAt: '2026-06-28'
  },
  {
    id: 'notice-2',
    schoolId: 'school-1',
    title: 'Grade 10 Parent-Teacher Conference',
    content: 'The first Term 2 PTM is scheduled for this Friday from 2:00 PM to 5:30 PM in the primary school block, Room 301. Attendance is highly requested for review of final midterm scripts and progress reports.',
    targetAudience: 'parents',
    createdAt: '2026-06-30'
  },
  {
    id: 'notice-3',
    schoolId: 'school-1',
    title: 'Term Syllabus Review Agenda',
    content: 'All high-school faculty are requested to assemble in the main conference room tomorrow at 4:15 PM for finalizing the curriculum timeline and review sheet structures.',
    targetAudience: 'teachers',
    createdAt: '2026-07-01'
  }
];

const DEFAULT_EXAM_RESULTS: ExamResult[] = [
  // Alex Mercer (student-g-1)
  { id: 'er-1', schoolId: 'school-1', studentId: 'student-g-1', subjectId: 'subject-g-math', marksObtained: 88, maxMarks: 100, examName: 'Midterm Term 1', grade: 'A' },
  { id: 'er-2', schoolId: 'school-1', studentId: 'student-g-1', subjectId: 'subject-g-phys', marksObtained: 94, maxMarks: 100, examName: 'Midterm Term 1', grade: 'A+' },
  { id: 'er-3', schoolId: 'school-1', studentId: 'student-g-1', subjectId: 'subject-g-eng', marksObtained: 72, maxMarks: 100, examName: 'Midterm Term 1', grade: 'B-' },
  // Chloe Bennett (student-g-2)
  { id: 'er-4', schoolId: 'school-1', studentId: 'student-g-2', subjectId: 'subject-g-math', marksObtained: 97, maxMarks: 100, examName: 'Midterm Term 1', grade: 'A+' },
  { id: 'er-5', schoolId: 'school-1', studentId: 'student-g-2', subjectId: 'subject-g-phys', marksObtained: 90, maxMarks: 100, examName: 'Midterm Term 1', grade: 'A' },
  { id: 'er-6', schoolId: 'school-1', studentId: 'student-g-2', subjectId: 'subject-g-eng', marksObtained: 88, maxMarks: 100, examName: 'Midterm Term 1', grade: 'A' },
  // Daniel Craig (student-g-3)
  { id: 'er-7', schoolId: 'school-1', studentId: 'student-g-3', subjectId: 'subject-g-math', marksObtained: 64, maxMarks: 100, examName: 'Midterm Term 1', grade: 'C+' },
  { id: 'er-8', schoolId: 'school-1', studentId: 'student-g-3', subjectId: 'subject-g-phys', marksObtained: 70, maxMarks: 100, examName: 'Midterm Term 1', grade: 'B' },
  { id: 'er-9', schoolId: 'school-1', studentId: 'student-g-3', subjectId: 'subject-g-eng', marksObtained: 75, maxMarks: 100, examName: 'Midterm Term 1', grade: 'B+' }
];

const DEFAULT_FEE_TRANSACTIONS: FeeTransaction[] = [
  // Alex Mercer (student-g-1)
  { id: 'fee-1', schoolId: 'school-1', studentId: 'student-g-1', amount: 150, date: '2026-07-01', status: 'pending', feeType: 'July Monthly Academic Tuition' },
  { id: 'fee-2', schoolId: 'school-1', studentId: 'student-g-1', amount: 150, date: '2026-06-01', status: 'paid', feeType: 'June Monthly Academic Tuition' },
  { id: 'fee-3', schoolId: 'school-1', studentId: 'student-g-1', amount: 120, date: '2026-05-15', status: 'paid', feeType: 'Sports & Athletics Annual Fee' },
  // Daniel Craig (student-g-3)
  { id: 'fee-4', schoolId: 'school-1', studentId: 'student-g-3', amount: 350, date: '2026-07-01', status: 'pending', feeType: 'July Academic Tuition & Bus Fee' },
  { id: 'fee-5', schoolId: 'school-1', studentId: 'student-g-3', amount: 350, date: '2026-06-01', status: 'paid', feeType: 'June Academic Tuition & Bus Fee' }
];

const LOCAL_STORAGE_KEY = 'school_erp_saas_db';

export const SchoolDbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<{
    plans: SubscriptionPlan[];
    schools: School[];
    users: User[];
    classes: Class[];
    subjects: Subject[];
    students: Student[];
    teachers: Teacher[];
    attendance: Attendance[];
    assignments: Assignment[];
    notices: Notice[];
    examResults: ExamResult[];
    feeTransactions: FeeTransaction[];
  }>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved DB, resetting to defaults', e);
      }
    }
    return {
      plans: DEFAULT_PLANS,
      schools: DEFAULT_SCHOOLS,
      users: DEFAULT_USERS,
      classes: DEFAULT_CLASSES,
      subjects: DEFAULT_SUBJECTS,
      students: DEFAULT_STUDENTS,
      teachers: DEFAULT_TEACHERS,
      attendance: DEFAULT_ATTENDANCE,
      assignments: DEFAULT_ASSIGNMENTS,
      notices: DEFAULT_NOTICES,
      examResults: DEFAULT_EXAM_RESULTS,
      feeTransactions: DEFAULT_FEE_TRANSACTIONS
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  const resetDatabase = () => {
    const initial = {
      plans: DEFAULT_PLANS,
      schools: DEFAULT_SCHOOLS,
      users: DEFAULT_USERS,
      classes: DEFAULT_CLASSES,
      subjects: DEFAULT_SUBJECTS,
      students: DEFAULT_STUDENTS,
      teachers: DEFAULT_TEACHERS,
      attendance: DEFAULT_ATTENDANCE,
      assignments: DEFAULT_ASSIGNMENTS,
      notices: DEFAULT_NOTICES,
      examResults: DEFAULT_EXAM_RESULTS,
      feeTransactions: DEFAULT_FEE_TRANSACTIONS
    };
    setDb(initial);
  };

  const addSchool = (schoolData: Omit<School, 'id' | 'registeredAt' | 'balance' | 'studentCount' | 'teacherCount'>) => {
    const newId = `school-${Date.now()}`;
    const newSchool: School = {
      ...schoolData,
      id: newId,
      registeredAt: new Date().toISOString().split('T')[0],
      balance: 0,
      studentCount: 0,
      teacherCount: 0
    };
    
    // Create an administrator for this school
    const newAdminUser: User = {
      id: `user-admin-${Date.now()}`,
      email: schoolData.contactEmail,
      name: `${schoolData.name} Administrator`,
      role: 'school_admin',
      schoolId: newId
    };

    setDb(prev => ({
      ...prev,
      schools: [...prev.schools, newSchool],
      users: [...prev.users, newAdminUser]
    }));

    return newSchool;
  };

  const updateSchoolStatus = (id: string, status: 'active' | 'suspended') => {
    setDb(prev => ({
      ...prev,
      schools: prev.schools.map(s => s.id === id ? { ...s, status } : s)
    }));
  };

  const deleteSchool = (id: string) => {
    setDb(prev => ({
      ...prev,
      schools: prev.schools.filter(s => s.id !== id),
      users: prev.users.filter(u => u.schoolId !== id) // Remove school users as well
    }));
  };

  const updateSchoolPlan = (schoolId: string, planId: string) => {
    setDb(prev => ({
      ...prev,
      schools: prev.schools.map(s => s.id === schoolId ? { ...s, planId } : s)
    }));
  };

  const addClass = (clsData: Omit<Class, 'id'>) => {
    const newClass: Class = {
      ...clsData,
      id: `class-${Date.now()}`
    };
    setDb(prev => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));
  };

  const addSubject = (subjData: Omit<Subject, 'id'>) => {
    const newSubj: Subject = {
      ...subjData,
      id: `subj-${Date.now()}`
    };
    setDb(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubj]
    }));
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'balanceDue'>) => {
    const studentId = `student-${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id: studentId,
      balanceDue: 150 // Standard tuition fee
    };

    // Create student login user
    const emailPrefix = studentData.name.toLowerCase().replace(/\s+/g, '.');
    const newStudentUser: User = {
      id: `user-student-${Date.now()}`,
      email: `student.${emailPrefix}@${db.schools.find(s => s.id === studentData.schoolId)?.domain || 'saas.edu'}`,
      name: studentData.name,
      role: 'student',
      schoolId: studentData.schoolId
    };

    // Create a parent login user
    const newParentUser: User = {
      id: `user-parent-${Date.now()}`,
      email: studentData.guardianEmail,
      name: studentData.guardianName,
      role: 'parent',
      schoolId: studentData.schoolId,
      parentOf: [studentId]
    };

    // Auto-create a pending transaction for this student
    const newFeeTx: FeeTransaction = {
      id: `fee-${Date.now()}`,
      schoolId: studentData.schoolId,
      studentId: studentId,
      amount: 150,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      feeType: 'July Monthly Academic Tuition'
    };

    setDb(prev => {
      // Recalculate school student count
      const updatedSchools = prev.schools.map(s => {
        if (s.id === studentData.schoolId) {
          return { ...s, studentCount: s.studentCount + 1 };
        }
        return s;
      });

      return {
        ...prev,
        schools: updatedSchools,
        students: [...prev.students, newStudent],
        users: [...prev.users, newStudentUser, newParentUser],
        feeTransactions: [...prev.feeTransactions, newFeeTx]
      };
    });
  };

  const updateStudent = (updatedStudent: Student) => {
    setDb(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    }));
  };

  const deleteStudent = (id: string) => {
    setDb(prev => {
      const student = prev.students.find(s => s.id === id);
      if (!student) return prev;
      
      const updatedSchools = prev.schools.map(s => {
        if (s.id === student.schoolId) {
          return { ...s, studentCount: Math.max(0, s.studentCount - 1) };
        }
        return s;
      });

      return {
        ...prev,
        schools: updatedSchools,
        students: prev.students.filter(s => s.id !== id),
        // Clean up exams, attendance, and fee transactions for that student
        attendance: prev.attendance.filter(a => a.studentId !== id),
        examResults: prev.examResults.filter(e => e.studentId !== id),
        feeTransactions: prev.feeTransactions.filter(f => f.studentId !== id)
      };
    });
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const teacherId = `teacher-${Date.now()}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id: teacherId
    };

    const newTeacherUser: User = {
      id: `user-teacher-${Date.now()}`,
      email: teacherData.email,
      name: teacherData.name,
      role: 'teacher',
      schoolId: teacherData.schoolId
    };

    setDb(prev => {
      // Recalculate school teacher count
      const updatedSchools = prev.schools.map(s => {
        if (s.id === teacherData.schoolId) {
          return { ...s, teacherCount: s.teacherCount + 1 };
        }
        return s;
      });

      return {
        ...prev,
        schools: updatedSchools,
        teachers: [...prev.teachers, newTeacher],
        users: [...prev.users, newTeacherUser]
      };
    });
  };

  const updateTeacher = (updatedTeacher: Teacher) => {
    setDb(prev => ({
      ...prev,
      teachers: prev.teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t)
    }));
  };

  const deleteTeacher = (id: string) => {
    setDb(prev => {
      const teacher = prev.teachers.find(t => t.id === id);
      if (!teacher) return prev;

      const updatedSchools = prev.schools.map(s => {
        if (s.id === teacher.schoolId) {
          return { ...s, teacherCount: Math.max(0, s.teacherCount - 1) };
        }
        return s;
      });

      return {
        ...prev,
        schools: updatedSchools,
        teachers: prev.teachers.filter(t => t.id !== id),
        users: prev.users.filter(u => u.email !== teacher.email)
      };
    });
  };

  const saveAttendance = (records: Omit<Attendance, 'id'>[]) => {
    setDb(prev => {
      // Filter out existing records for the same student, class, and date to avoid duplicates
      const idsToRemove = new Set(
        records.map(r => `${r.studentId}-${r.classId}-${r.date}`)
      );
      const remainingAttendance = prev.attendance.filter(
        a => !idsToRemove.has(`${a.studentId}-${a.classId}-${a.date}`)
      );

      const newRecords = records.map((r, index) => ({
        ...r,
        id: `att-saved-${Date.now()}-${index}`
      }));

      return {
        ...prev,
        attendance: [...remainingAttendance, ...newRecords]
      };
    });
  };

  const addAssignment = (asgData: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`
    };
    setDb(prev => ({
      ...prev,
      assignments: [...prev.assignments, newAsg]
    }));
  };

  const deleteAssignment = (id: string) => {
    setDb(prev => ({
      ...prev,
      assignments: prev.assignments.filter(a => a.id !== id)
    }));
  };

  const addNotice = (noticeData: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `notice-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDb(prev => ({
      ...prev,
      notices: [newNotice, ...prev.notices]
    }));
  };

  const deleteNotice = (id: string) => {
    setDb(prev => ({
      ...prev,
      notices: prev.notices.filter(n => n.id !== id)
    }));
  };

  const addExamResult = (resultData: Omit<ExamResult, 'id'>) => {
    const newResult: ExamResult = {
      ...resultData,
      id: `er-${Date.now()}`
    };
    setDb(prev => ({
      ...prev,
      examResults: [...prev.examResults, newResult]
    }));
  };

  const payFee = (transactionId: string) => {
    setDb(prev => {
      const tx = prev.feeTransactions.find(f => f.id === transactionId);
      if (!tx) return prev;

      // Update student balance due
      const updatedStudents = prev.students.map(s => {
        if (s.id === tx.studentId) {
          return { ...s, balanceDue: Math.max(0, s.balanceDue - tx.amount) };
        }
        return s;
      });

      // Update school balance account
      const updatedSchools = prev.schools.map(s => {
        if (s.id === tx.schoolId) {
          return { ...s, balance: s.balance + tx.amount };
        }
        return s;
      });

      const updatedTransactions = prev.feeTransactions.map(f => {
        if (f.id === transactionId) {
          return { ...f, status: 'paid' as const };
        }
        return f;
      });

      return {
        ...prev,
        students: updatedStudents,
        schools: updatedSchools,
        feeTransactions: updatedTransactions
      };
    });
  };

  const addFeeTransaction = (transactionData: Omit<FeeTransaction, 'id' | 'date' | 'status'>) => {
    const newTx: FeeTransaction = {
      ...transactionData,
      id: `fee-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setDb(prev => {
      // Add balance due to the student
      const updatedStudents = prev.students.map(s => {
        if (s.id === transactionData.studentId) {
          return { ...s, balanceDue: s.balanceDue + transactionData.amount };
        }
        return s;
      });

      return {
        ...prev,
        students: updatedStudents,
        feeTransactions: [...prev.feeTransactions, newTx]
      };
    });
  };

  return (
    <SchoolDbContext.Provider
      value={{
        ...db,
        addSchool,
        updateSchoolStatus,
        deleteSchool,
        updateSchoolPlan,
        addClass,
        addSubject,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        saveAttendance,
        addAssignment,
        deleteAssignment,
        addNotice,
        deleteNotice,
        addExamResult,
        payFee,
        addFeeTransaction,
        resetDatabase
      }}
    >
      {children}
    </SchoolDbContext.Provider>
  );
};

export const useSchoolDb = () => {
  const context = useContext(SchoolDbContext);
  if (!context) {
    throw new Error('useSchoolDb must be used within a SchoolDbProvider');
  }
  return context;
};

const SchoolDbContext = createContext<SchoolDbContextType | undefined>(undefined);
