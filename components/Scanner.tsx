
import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../types';
import { identifyStudent } from '../services/geminiService';

interface ScannerProps {
  students: Student[];
  onSuccess: (id: string, name: string, confidence: number, period: number) => void;
}

const Scanner: React.FC<ScannerProps> = ({ students, onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'not-found' | 'error'>('idle');
  const [recognizedName, setRecognizedName] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { setStatus('error'); }
    };
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleScan = async () => {
    if (students.length === 0) return alert("Directory is currently empty.");
    if (videoRef.current && canvasRef.current) {
      setStatus('processing');
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        const result = await identifyStudent(dataUrl, students);
        
        if (result.studentId && result.name) {
          setRecognizedName(result.name);
          setStatus('success');
          onSuccess(result.studentId, result.name, result.confidence, activePeriod);
          setTimeout(() => { setStatus('idle'); setRecognizedName(null); }, 3000);
        } else {
          setStatus('not-found');
          setTimeout(() => setStatus('idle'), 3000);
        }
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700">
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl shadow-indigo-100/30 text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Face Recognition</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-10">Verification Protocol V3</p>

        <div className="mb-12">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Current Period</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5, 6].map(p => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`w-12 h-12 rounded-2xl font-black text-xs transition-all duration-300 ${
                  activePeriod === p 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110' 
                    : 'bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-400'
                }`}
              >
                H{p}
              </button>
            ))}
          </div>
        </div>

        <div className="relative aspect-video bg-slate-100 rounded-[3rem] overflow-hidden border-8 border-white shadow-inner group">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5000ms]" />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-56 h-56 border-2 border-indigo-600/20 rounded-full animate-pulse"></div>
             <div className="absolute w-48 h-48 border border-white/40 rounded-full"></div>
          </div>
          
          {status === 'processing' && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Analyzing Face Profile...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="absolute inset-0 bg-indigo-600/90 backdrop-blur-xl flex flex-col items-center justify-center text-white animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mb-4">✓</div>
              <h3 className="text-4xl font-black tracking-tight">{recognizedName}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-70 text-indigo-100">Attendance Logged (H{activePeriod})</p>
            </div>
          )}

          {status === 'not-found' && (
            <div className="absolute inset-0 bg-rose-500/90 backdrop-blur-xl flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
              <div className="text-5xl mb-4">✕</div>
              <h3 className="text-2xl font-black tracking-tighter uppercase">No Match Found</h3>
              <p className="text-[10px] font-bold uppercase mt-2 opacity-70">Please check your lighting</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleScan} 
          disabled={status !== 'idle'} 
          className="mt-12 w-full py-6 rounded-[2rem] bg-indigo-600 text-white font-black text-sm uppercase tracking-[0.4em] transition-all duration-500 disabled:opacity-30 active:scale-95 shadow-2xl shadow-indigo-100"
        >
          Activate Scanner
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Scanner;
