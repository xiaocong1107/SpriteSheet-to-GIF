import React, { useState } from 'react';
import { CropSettings, GridSettings } from '../types';
import { analyzeSpriteSheet } from '../services/geminiService';

interface SidebarProps {
  imageSrc: string | null;
  originalSize: { width: number; height: number };
  crop: CropSettings;
  grid: GridSettings;
  fps: number;
  onCropChange: (crop: CropSettings) => void;
  onGridChange: (grid: GridSettings) => void;
  onFpsChange: (fps: number) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onGenerateGif: () => void;
  isGenerating: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  imageSrc,
  originalSize,
  crop,
  grid,
  fps,
  onCropChange,
  onGridChange,
  onFpsChange,
  onImageUpload,
  onReset,
  onGenerateGif,
  isGenerating
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (field: keyof CropSettings, value: string) => {
    const val = parseInt(value) || 0;
    onCropChange({ ...crop, [field]: val });
  };

  const handleGridChange = (field: keyof GridSettings, value: string) => {
    const val = parseInt(value) || 1;
    onGridChange({ ...grid, [field]: Math.max(1, val) });
  };

  const handleAutoDetect = async () => {
    if (!imageSrc) return;
    setIsAnalyzing(true);
    try {
        const result = await analyzeSpriteSheet(imageSrc);
        if (result) {
            onGridChange({ rows: result.rows, cols: result.cols });
            // Assume full crop for auto-detect simplicity, or could be smarter
            onCropChange({ x: 0, y: 0, width: originalSize.width, height: originalSize.height });
        }
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
      
      {/* Upload Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Sprite Sheet Upload</h2>
        <p className="text-slate-500 text-sm mb-4">Click or drag PNG / JPG to analyze and split.</p>
        
        <label className={`
            flex flex-col items-center justify-center w-full h-48 
            border-2 border-dashed rounded-xl cursor-pointer transition-all
            ${imageSrc ? 'border-blue-200 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
        `}>
            {imageSrc ? (
                <div className="relative w-full h-full p-2 flex items-center justify-center">
                    <img src={imageSrc} alt="Preview" className="max-w-full max-h-full object-contain" />
                    <div className="absolute bottom-2 bg-white/80 px-2 py-1 rounded text-xs text-slate-600 font-mono">
                        {originalSize.width} x {originalSize.height}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
                    <p className="text-xs text-slate-500">PNG, JPG (MAX. 5MB)</p>
                </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
        </label>
        
        {imageSrc && (
             <div className="mt-3 flex justify-end gap-2">
                <button 
                    onClick={handleAutoDetect}
                    disabled={isAnalyzing}
                    className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-full font-medium transition-colors"
                >
                    {isAnalyzing ? (
                        <>
                         <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         AI Detecting...
                        </>
                    ) : (
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                        AI Auto-Detect Layout
                        </>
                    )}
                </button>
             </div>
        )}
      </div>

      {/* Crop Inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Start X</label>
                <input 
                    type="number" 
                    value={crop.x} 
                    onChange={(e) => handleInputChange('x', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Start Y</label>
                <input 
                    type="number" 
                    value={crop.y} 
                    onChange={(e) => handleInputChange('y', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Width</label>
                <input 
                    type="number" 
                    value={crop.width} 
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Height</label>
                <input 
                    type="number" 
                    value={crop.height} 
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                />
            </div>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Columns (Horizontal)</label>
                <input 
                    type="number" 
                    min="1"
                    value={grid.cols} 
                    onChange={(e) => handleGridChange('cols', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Rows (Vertical)</label>
                <input 
                    type="number" 
                    min="1"
                    value={grid.rows} 
                    onChange={(e) => handleGridChange('rows', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                />
            </div>
        </div>
      </div>

       {/* Animation Settings */}
       <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-500">Playback Speed (FPS)</label>
                <span className="text-xs font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{fps} FPS</span>
            </div>
            <div className="flex items-center gap-3">
                <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    step="1"
                    value={fps} 
                    onChange={(e) => onFpsChange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
                <input 
                    type="number" 
                    min="1"
                    max="60"
                    value={fps} 
                    onChange={(e) => onFpsChange(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                    className="w-14 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Slow (1fps)</span>
                <span>Fast (60fps)</span>
            </div>
        </div>
      </div>

        {/* Calculated Info */}
      <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 space-y-1">
        <div className="flex justify-between">
            <span>Single Frame:</span>
            <span className="font-mono text-slate-700">
                {Math.floor(crop.width / grid.cols)} × {Math.floor(crop.height / grid.rows)} px
            </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center justify-between gap-4 pt-4">
         <button 
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
        >
            Reset Original
        </button>
        <button 
            onClick={onGenerateGif}
            disabled={!imageSrc || isGenerating}
            className={`
                flex-1 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all
                ${!imageSrc || isGenerating ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5'}
            `}
        >
            {isGenerating ? 'Generating...' : 'Generate GIF'}
        </button>
      </div>

    </div>
  );
};