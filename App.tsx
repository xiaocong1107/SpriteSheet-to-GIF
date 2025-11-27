import React, { useState, useEffect, useRef } from 'react';
import { CropSettings, GridSettings, FrameData, GifSettings } from './types';
import { Sidebar } from './components/Sidebar';
import { FrameGrid } from './components/FrameGrid';
import { getWorkerUrl } from './utils/gifHelper';

// Add global definition for GIF library loaded via CDN
declare class GIF {
    constructor(options: any);
    addFrame(imageElement: HTMLImageElement | HTMLCanvasElement, options?: any): void;
    on(event: string, callback: (data: any) => void): void;
    render(): void;
}

const App: React.FC = () => {
    // --- State ---
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
    
    // Default crop is empty until image loads
    const [crop, setCrop] = useState<CropSettings>({ x: 0, y: 0, width: 0, height: 0 });
    const [grid, setGrid] = useState<GridSettings>({ rows: 4, cols: 4 });
    const [fps, setFps] = useState<number>(10);
    
    const [frames, setFrames] = useState<FrameData[]>([]);
    const [generatedGif, setGeneratedGif] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // References
    const imageRef = useRef<HTMLImageElement | null>(null);

    // --- Handlers ---

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setImageSrc(result);
            
            // Create an image object to get dimensions
            const img = new Image();
            img.onload = () => {
                setOriginalSize({ width: img.width, height: img.height });
                setCrop({ x: 0, y: 0, width: img.width, height: img.height });
                imageRef.current = img;
            };
            img.src = result;
        };
        reader.readAsDataURL(file);
        setGeneratedGif(null);
    };

    const handleReset = () => {
        if (originalSize.width > 0) {
            setCrop({ x: 0, y: 0, width: originalSize.width, height: originalSize.height });
            setGrid({ rows: 4, cols: 4 });
            setFps(10);
            setGeneratedGif(null);
        }
    };

    const toggleFrame = (id: number) => {
        setFrames(prev => prev.map(f => f.id === id ? { ...f, isExcluded: !f.isExcluded } : f));
    };

    // --- Core Logic: Slice Frames ---

    useEffect(() => {
        if (!imageRef.current || !imageSrc || crop.width === 0 || crop.height === 0) return;

        const img = imageRef.current;
        const frameW = crop.width / grid.cols;
        const frameH = crop.height / grid.rows;

        const newFrames: FrameData[] = [];
        let count = 0;

        for (let r = 0; r < grid.rows; r++) {
            for (let c = 0; c < grid.cols; c++) {
                const canvas = document.createElement('canvas');
                canvas.width = Math.floor(frameW);
                canvas.height = Math.floor(frameH);
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    // Source X/Y based on crop start + grid position
                    const sx = crop.x + (c * frameW);
                    const sy = crop.y + (r * frameH);

                    ctx.drawImage(
                        img, 
                        sx, sy, frameW, frameH, // Source
                        0, 0, Math.floor(frameW), Math.floor(frameH) // Dest
                    );
                    
                    newFrames.push({
                        id: count,
                        dataUrl: canvas.toDataURL('image/png'),
                        isExcluded: false // Reset exclusion on re-slice? Or keep map? Let's reset for simplicity.
                    });
                    count++;
                }
            }
        }
        setFrames(newFrames);
    }, [imageSrc, crop, grid]); // Re-run when these change

    // --- GIF Generation ---

    const generateGif = () => {
        if (frames.length === 0) return;
        setIsGenerating(true);
        setGeneratedGif(null);

        const activeFrames = frames.filter(f => !f.isExcluded);
        if (activeFrames.length === 0) {
            setIsGenerating(false);
            return;
        }

        // Initialize GIF.js
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: Math.floor(crop.width / grid.cols),
            height: Math.floor(crop.height / grid.rows),
            workerScript: getWorkerUrl(),
            transparent: null // Or 0x000000 for transparent background if needed
        });

        // Load images and add to GIF
        let loadedCount = 0;
        
        activeFrames.forEach((frame) => {
            const img = new Image();
            img.onload = () => {
                // Delay is in milliseconds. 1000ms / fps = ms per frame
                gif.addFrame(img, { delay: 1000 / fps });
                loadedCount++;
                if (loadedCount === activeFrames.length) {
                    gif.render();
                }
            };
            img.src = frame.dataUrl;
        });

        gif.on('finished', (blob: Blob) => {
            setGeneratedGif(URL.createObjectURL(blob));
            setIsGenerating(false);
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            S
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">SpriteForge</h1>
                    </div>
                    
                    <div className="bg-slate-100 p-1 rounded-lg flex">
                         <button className="px-4 py-1.5 text-sm font-medium text-slate-500 rounded-md hover:text-slate-700">GIF to Sprite</button>
                         <button className="px-4 py-1.5 text-sm font-medium bg-white text-blue-600 shadow-sm rounded-md">Sprite to GIF</button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Panel: Controls */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-[calc(100vh-8rem)] lg:sticky lg:top-24">
                   <Sidebar 
                        imageSrc={imageSrc}
                        originalSize={originalSize}
                        crop={crop}
                        grid={grid}
                        fps={fps}
                        onCropChange={setCrop}
                        onGridChange={setGrid}
                        onFpsChange={setFps}
                        onImageUpload={handleImageUpload}
                        onReset={handleReset}
                        onGenerateGif={generateGif}
                        isGenerating={isGenerating}
                   />
                </div>

                {/* Right Panel: Preview Grid */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <FrameGrid 
                        frames={frames} 
                        onToggleFrame={toggleFrame} 
                        rows={grid.rows}
                        cols={grid.cols}
                    />
                    
                    {/* Generated GIF Result Modal/Area */}
                    {generatedGif && (
                         <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 flex items-start gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="bg-[url('https://media.istockphoto.com/id/1145618475/vector/checkered-seamless-pattern.jpg?s=612x612&w=0&k=20&c=M0lqgXh6I4K-9mXGjA_eK2T6I7y0-5J3X2-7-6_6X-I=')] bg-contain">
                                <img src={generatedGif} alt="Result" className="min-w-[100px] border border-slate-200 rounded-lg" />
                             </div>
                             <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">GIF Generated Successfully!</h3>
                                <div className="flex gap-4 text-xs text-slate-500 mb-4">
                                    <span>FPS: {fps}</span>
                                    <span>Frames: {frames.filter(f => !f.isExcluded).length}</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">Your animation is ready. Right click to save or use the button below.</p>
                                <a 
                                    href={generatedGif} 
                                    download="sprite-animation.gif"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    Download GIF
                                </a>
                             </div>
                         </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default App;