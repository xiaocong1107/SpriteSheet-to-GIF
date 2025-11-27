import React from 'react';
import { FrameData } from '../types';

interface FrameGridProps {
  frames: FrameData[];
  onToggleFrame: (id: number) => void;
  rows: number;
  cols: number;
}

export const FrameGrid: React.FC<FrameGridProps> = ({ frames, onToggleFrame, rows, cols }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800">Split Confirmation (Grid)</h2>
        <p className="text-slate-500 text-sm mt-1">
          Click cells to exclude frames. Verify the grid cuts are accurate.
        </p>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[400px]">
        {frames.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
                No frames generated yet. Upload an image to start.
            </div>
        ) : (
            <div
            className="grid gap-[1px] bg-slate-300 border border-slate-300 mx-auto"
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                maxWidth: '100%'
            }}
            >
            {frames.map((frame) => (
                <div
                key={frame.id}
                onClick={() => onToggleFrame(frame.id)}
                className={`relative aspect-square cursor-pointer group bg-white overflow-hidden ${
                    frame.isExcluded ? 'opacity-50' : 'hover:opacity-90'
                }`}
                >
                <img
                    src={frame.dataUrl}
                    alt={`Frame ${frame.id}`}
                    className="w-full h-full object-contain"
                />
                {frame.isExcluded && (
                    <div className="absolute inset-0 bg-red-50/50 flex items-center justify-center">
                    <div className="bg-red-500 text-white p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    </div>
                )}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-[10px] px-1 rounded">
                    #{frame.id + 1}
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex justify-between text-sm text-slate-600">
            <span>Total Frames: <span className="font-semibold text-slate-900">{frames.length}</span></span>
            <span>Active: <span className="font-semibold text-green-600">{frames.filter(f => !f.isExcluded).length}</span></span>
            <span>Excluded: <span className="font-semibold text-red-500">{frames.filter(f => f.isExcluded).length}</span></span>
        </div>
      </div>
    </div>
  );
};
