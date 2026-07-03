export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
}

export interface School {
  id: string;
  name: string;
  domain: string;
  planId: string;
  status: 'active' | 'suspended';
  logoType: 'tree' | 'sun' | 'star' | 'book' | 'globe';
  studentCount: number;
  teacherCount: number;
  registeredAt: string;
  contactEmail: string;
  balance: number; // Fees collected
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  schoolId?: string;
  parentOf?: string[]; // studentIds
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  section: string;
  classTeacherId: string;
  room: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string;
}

export interface Student {
  id: string;
  schoolId: string;
  name: string;
  rollNumber: string;
  classId: string;
  guardianEmail: string;
  guardianName: string;
  balanceDue: number;
}

export interface Teacher {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  joiningDate: string;
  salary: number;
}

export interface Attendance {
  id: string;
  schoolId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late';
  classId: string;
}

export interface Assignment {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  dueDate: string;
  classId: string;
  subjectId: string;
  teacherId: string;
}

export interface Notice {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'teachers' | 'students' | 'parents';
  createdAt: string;
}

export interface ExamResult {
  id: string;
  schoolId: string;
  studentId: string;
  subjectId: string;
  marksObtained: number;
  maxMarks: number;
  examName: string;
  grade: string;
}

export interface FeeTransaction {
  id: string;
  schoolId: string;
  studentId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  feeType: string;
}
