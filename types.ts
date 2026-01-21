
export interface Student {
  id: string;
  name: string;
  internalMarks: number;
  photoBase64: string;
  enrolledAt: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: number;
  status: 'present' | 'late';
  confidence: number;
  period: number; // 1-6 representing the hour slot
}

export type AppView = 'dashboard' | 'enroll' | 'scan' | 'evaluation' | 'records';

export interface AcademicEvaluation {
  studentId: string;
  studentName: string;
  rawGrade: string;
  aci: number;
  gaf: string;
  finalGrade: string;
  confidenceLabel: 'High' | 'Medium' | 'Low';
  needsReview: boolean;
  presentCount: number;
  absentCount: number;
  lastSeen: number | null;
}
