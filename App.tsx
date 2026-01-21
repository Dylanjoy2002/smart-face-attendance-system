
import React, { useState, useEffect } from 'react';
import { AppView, Student, AttendanceRecord } from './types';
import Dashboard from './components/Dashboard';
import Enrollment from './components/Enrollment';
import Scanner from './components/Scanner';
import Records from './components/Records';
import Evaluation from './components/Evaluation';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const savedStudents = localStorage.getItem('face_attendance_students');
    const savedRecords = localStorage.getItem('face_attendance_records');
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  useEffect(() => {
    localStorage.setItem('face_attendance_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('face_attendance_records', JSON.stringify(records));
  }, [records]);

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
    setView('dashboard');
  };

  const addRecord = (studentId: string, studentName: string, confidence: number, period: number) => {
    const today = new Date().toDateString();
    const alreadyPresentForPeriod = records.some(r => 
      r.studentId === studentId && 
      r.period === period &&
      new Date(r.timestamp).toDateString() === today
    );

    if (alreadyPresentForPeriod) return;

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      studentId,
      studentName,
      timestamp: Date.now(),
      status: 'present',
      confidence,
      period
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const NavItem = ({ label, target, active }: { label: string, target: AppView, active: boolean }) => (
    <button
      onClick={() => setView(target)}
      className={`relative px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-900">
      <header className="bg-white/70 backdrop-blur-2xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-200 group-hover:rotate-6 transition-transform">
              S
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">Student attendance</h1>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 opacity-70">Vision System</span>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-1.5 p-1.5 bg-slate-100/50 border border-slate-200/50 rounded-2xl">
            <NavItem label="Overview" target="dashboard" active={view === 'dashboard'} />
            <NavItem label="Verify" target="scan" active={view === 'scan'} />
            <NavItem label="Analytics" target="evaluation" active={view === 'evaluation'} />
            <NavItem label="Directory" target="enroll" active={view === 'enroll'} />
            <NavItem label="History" target="records" active={view === 'records'} />
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Connection</p>
              <div className="flex items-center gap-2 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[9px] font-black text-emerald-500 uppercase">Secure</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-12 relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100/30 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-100/30 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          {view === 'dashboard' && <Dashboard students={students} records={records} onNavigate={(v) => setView(v)} />}
          {view === 'enroll' && <Enrollment onEnroll={addStudent} />}
          {view === 'scan' && <Scanner students={students} onSuccess={addRecord} />}
          {view === 'records' && <Records records={records} students={students} />}
          {view === 'evaluation' && <Evaluation students={students} records={records} />}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between opacity-50 font-bold text-[9px] uppercase tracking-[0.25em] text-slate-400">
          <p>© {new Date().getFullYear()} STUDENT ATTENDANCE INTERFACE</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <p>V4.0.2 ENTERPRISE</p>
            <p>ENCRYPTED STORAGE</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
