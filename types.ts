export interface CropSettings {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface GridSettings {
    rows: number;
    cols: number;
}

export interface FrameData {
    id: number;
    dataUrl: string;
    isExcluded: boolean;
}

export interface GifSettings {
    fps: number;
    quality: number;
    transparent: string | null;
    repeat: number;
}