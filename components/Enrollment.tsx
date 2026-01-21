
import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../types';

interface EnrollmentProps {
  onEnroll: (student: Student) => void;
}

const Enrollment: React.FC<EnrollmentProps> = ({ onEnroll }) => {
  const [name, setName] = useState('');
  const [marks, setMarks] = useState(75);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isCapturing) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCapturing]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access required for enrollment.");
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        setPhoto(canvasRef.current.toDataURL('image/jpeg'));
        setIsCapturing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !photo) return;
    onEnroll({
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      name,
      internalMarks: marks,
      photoBase64: photo,
      enrolledAt: Date.now()
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-1000">
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/30 overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-2/5 p-12 bg-indigo-600 text-white flex flex-col justify-between">
           <div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
              </div>
              <h2 className="text-4xl font-black tracking-tight leading-tight mb-4">Enroll Profile</h2>
              <p className="text-indigo-100 text-sm font-medium opacity-70 leading-relaxed"> Register new students into the biometric directory with performance baseline metrics.</p>
           </div>
           
           <div className="mt-12 p-6 bg-white/10 rounded-3xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">System Requirement</p>
              <p className="text-xs font-medium mt-2">Clear frontal face capture required for high-fidelity recognition.</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-12 lg:p-16 space-y-10">
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Student Full Name</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                placeholder="Johnathan Doe"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Baseline Performance ({marks}%)</label>
              <div className="flex items-center gap-8 px-8 py-4 bg-slate-50 border border-slate-100 rounded-3xl">
                <input type="range" min="0" max="100" value={marks} onChange={(e) => setMarks(parseInt(e.target.value))} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                <span className="font-black text-indigo-600 text-2xl">{marks}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Biometric Signature</label>
              {!isCapturing && !photo && (
                <button 
                  type="button" 
                  onClick={() => setIsCapturing(true)} 
                  className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 shadow-sm transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase">Start Face Capture</span>
                </button>
              )}
              {isCapturing && (
                <div className="relative aspect-video bg-slate-100 rounded-[3rem] overflow-hidden border-4 border-white shadow-lg">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <button type="button" onClick={takePhoto} className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95">Snap Profile</button>
                </div>
              )}
              {photo && !isCapturing && (
                <div className="relative aspect-video rounded-[3rem] overflow-hidden group border-4 border-white shadow-lg">
                  <img src={photo} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm">
                     <button type="button" onClick={() => setPhoto(null)} className="px-8 py-3 bg-white text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Retake Capture</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!name || !photo} 
            className="w-full py-6 rounded-[2rem] bg-indigo-600 text-white font-black text-sm uppercase tracking-[0.6em] transition-all duration-500 disabled:opacity-30 active:scale-95 shadow-2xl shadow-indigo-100"
          >
            Finalize Enrollment
          </button>
        </form>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Enrollment;
