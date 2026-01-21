
import React from 'react';
import { Student, AttendanceRecord, AcademicEvaluation } from '../types';

interface EvaluationProps {
  students: Student[];
  records: AttendanceRecord[];
}

const getLetterGrade = (marks: number) => {
  if (marks >= 90) return 'A';
  if (marks >= 80) return 'B';
  if (marks >= 70) return 'C';
  if (marks >= 60) return 'D';
  return 'F';
};

const adjustGrade = (grade: string, steps: number): string => {
  const grades = ['F', 'D', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];
  const currentIndex = grades.indexOf(grade);
  if (currentIndex === -1) return grade;
  const newIndex = Math.max(0, Math.min(grades.length - 1, currentIndex + steps));
  return grades[newIndex];
};

const Evaluation: React.FC<EvaluationProps> = ({ students, records }) => {
  const TARGET_SESSIONS = 30;

  const evaluations: AcademicEvaluation[] = students.map(student => {
    const studentRecords = records.filter(r => r.studentId === student.id);
    const avgConfidence = studentRecords.length > 0 
      ? studentRecords.reduce((acc, r) => acc + r.confidence, 0) / studentRecords.length 
      : 0;
    
    const days = new Set(studentRecords.map(r => new Date(r.timestamp).toDateString())).size;
    const consistency = days > 0 ? Math.min(1, studentRecords.length / (days * 6)) : 0;
    
    const aci = (avgConfidence * 0.6) + (consistency * 0.4);
    const presentCount = studentRecords.length;
    const absentCount = Math.max(0, TARGET_SESSIONS - presentCount);
    const lastSeen = studentRecords.length > 0 ? Math.max(...studentRecords.map(r => r.timestamp)) : null;

    const attendanceRate = presentCount / TARGET_SESSIONS;
    let gafSteps = 0;
    if (aci > 0.8 && attendanceRate >= 0.75) gafSteps = 1;
    if (aci < 0.5 || (student.internalMarks > 85 && attendanceRate < 0.4)) gafSteps = -1;

    const rawGrade = getLetterGrade(student.internalMarks);
    const finalGrade = adjustGrade(rawGrade, gafSteps);

    return {
      studentId: student.id,
      studentName: student.name,
      rawGrade,
      aci,
      gaf: gafSteps > 0 ? `+${gafSteps}` : gafSteps < 0 ? `${gafSteps}` : '0',
      finalGrade,
      confidenceLabel: aci > 0.8 ? 'High' : aci > 0.6 ? 'Medium' : 'Low',
      needsReview: aci < 0.5 || (student.internalMarks >= 85 && aci < 0.6),
      presentCount,
      absentCount,
      lastSeen
    };
  });

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden animate-in fade-in duration-1000">
      <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white/50 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/30 blur-3xl rounded-full -mr-40 -mt-40"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Integrity Analysis</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Neural Analytics Matrix</p>
        </div>
        <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 relative z-10">
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Cycle: 30 Sessions</span>
          <div className="w-[1px] h-4 bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Ver 4.2.1</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Identity Node</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center">Sessions</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center">Fidelity Index</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center">Calculated</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {evaluations.map((evalData) => (
              <tr key={evalData.studentId} className={`hover:bg-slate-50 transition-all duration-300 group ${evalData.needsReview ? 'bg-rose-50/20' : ''}`}>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-lg group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">{evalData.studentName.charAt(0)}</div>
                    <div>
                      <p className="font-black text-slate-900 text-base tracking-tight">{evalData.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Raw Baseline: {evalData.rawGrade}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 text-center">
                  <span className="font-black text-slate-900 text-base">{evalData.presentCount} <span className="text-slate-300 font-medium text-xs">/ 30</span></span>
                </td>
                <td className="px-10 py-8 text-center">
                   <div className="inline-flex flex-col items-center">
                      <span className="font-black text-indigo-600 text-sm">{(evalData.aci * 100).toFixed(1)}%</span>
                      <div className="w-16 h-1 bg-slate-100 mt-2 overflow-hidden rounded-full">
                        <div className={`h-full ${evalData.aci > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${evalData.aci * 100}%` }}></div>
                      </div>
                   </div>
                </td>
                <td className="px-10 py-8 text-center">
                  <span className={`text-4xl font-black ${evalData.needsReview ? 'text-rose-500' : 'text-indigo-600'} drop-shadow-sm`}>{evalData.finalGrade}</span>
                </td>
                <td className="px-10 py-8 text-right">
                  {evalData.needsReview ? (
                    <span className="px-5 py-2 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 animate-pulse">Critical Review</span>
                  ) : (
                    <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] flex items-center justify-end gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Authorized
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Evaluation;
