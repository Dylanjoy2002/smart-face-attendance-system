
import React from 'react';
import { AttendanceRecord, Student } from '../types';

interface RecordsProps {
  records: AttendanceRecord[];
  students: Student[];
}

const Records: React.FC<RecordsProps> = ({ records, students }) => {
  return (
    <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden animate-in fade-in duration-1000">
      <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-3xl rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Activity Archive</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Historical Biometric Events</p>
        </div>
        <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 relative z-10">
           <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Logs: {records.length.toString().padStart(4, '0')}</span>
           <div className="w-[1px] h-4 bg-slate-200"></div>
           <span className="text-[10px] font-black uppercase text-slate-400">Stream OK</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Identity Node</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center">Temporal slot</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Timestamp</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Confidence Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-10 py-32 text-center">
                  <div className="flex flex-col items-center gap-8 opacity-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-900">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <span className="font-bold text-[10px] uppercase tracking-[0.5em] text-slate-600">No Historical Data Recorded</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-all duration-300 group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-base group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {record.studentName.charAt(0)}
                      </div>
                      <span className="font-black text-slate-900 text-sm tracking-tight uppercase">{record.studentName}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="px-5 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-xl">
                      Hour {record.period}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 tracking-tight">{new Date(record.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="inline-flex flex-col items-end">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${record.confidence > 0.9 ? 'text-emerald-500' : 'text-amber-500'}`}>
                         {Math.round(record.confidence * 100)}% Match
                       </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Records;
