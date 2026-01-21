
import React from 'react';
import { Student, AttendanceRecord, AppView } from '../types';

interface DashboardProps {
  students: Student[];
  records: AttendanceRecord[];
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, records, onNavigate }) => {
  const totalCount = students.length;
  const avgConfidence = records.length > 0 
    ? Math.round((records.reduce((acc, r) => acc + r.confidence, 0) / records.length) * 100) 
    : 0;
  
  const highRiskCount = students.filter(s => {
    const sRecords = records.filter(r => r.studentId === s.id);
    return s.internalMarks > 90 && sRecords.length < 2; 
  }).length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Nodes', val: totalCount, sub: 'Active Directory', color: 'indigo' },
          { label: 'Neural Fidelity', val: `${avgConfidence}%`, sub: 'Recognition Mean', color: 'indigo' },
          { label: 'Risk Flags', val: highRiskCount, sub: 'Identity Alerts', color: highRiskCount > 0 ? 'rose' : 'indigo' },
          { label: 'Total Events', val: records.length, sub: 'Attendance Logs', color: 'indigo' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 group hover:border-indigo-200 transition-all duration-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
            <p className={`text-4xl font-black tracking-tight ${stat.color === 'rose' ? 'text-rose-500' : 'text-slate-900'}`}>{stat.val}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-2 opacity-60 uppercase">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white border border-slate-200/60 p-12 rounded-[3rem] shadow-xl shadow-slate-200/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 text-indigo-900">
              <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M11 20H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h12a2 2 0 012 2v7M11 20l4-4 4 4m-4-4v9"/></svg>
            </div>
            
            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                Analytics Hub
              </div>
              <h2 className="text-4xl font-black text-slate-900 leading-tight mb-6">Cross-Reference Intelligence Report</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
                Execute deep-dive analytics on biometric presence vs academic baseline markers to ensure maximum institutional integrity.
              </p>
              <button 
                onClick={() => onNavigate('evaluation')} 
                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
              >
                Execute Analytics Engine
              </button>
            </div>
         </div>

         <div className="flex flex-col gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/30">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">System Health</h3>
               <div className="space-y-6">
                  {[
                    { k: 'Vision Kernel', v: 'Optimal', c: 'text-emerald-500' },
                    { k: 'Cloud Uplink', v: '14ms', c: 'text-indigo-600' },
                    { k: 'Encryption', v: 'L3 RSA', c: 'text-slate-900' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-5 last:border-0 last:pb-0">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{item.k}</span>
                       <span className={`text-xs font-black uppercase tracking-widest ${item.c}`}>{item.v}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-100/50">
               <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Memory Status</h4>
               <div className="text-3xl font-black mb-6">32.4 GB <span className="text-sm opacity-50 font-bold">Allocated</span></div>
               <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-white w-2/3"></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
