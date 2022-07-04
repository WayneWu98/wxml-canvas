/// <reference types="miniprogram-api-typings" />
/// <reference types="./src/typings" />
interface IOptions {
    canvas: string;
    selectors: string[];
    instanceContext?: InstanceContext;
    interval: number;
}
declare enum EventType {
    DRAWING = "drawing",
    ABORTED = "aborted"
}
export default class WXMLCanvas {
    private _canvas?;
    private _ctx?;
    private _options;
    private _els;
    isAborted: boolean;
    private _flushing;
    abortResolve: Function;
    get flushing(): boolean;
    set flushing(v: boolean);
    get canvas(): WechatMiniprogram.Canvas;
    get ctx(): WechatMiniprogram.CanvasContext;
    getFittedSize(limit?: number): {
        width: number;
        height: number;
    };
    private listeners;
    readonly options: Required<IOptions>;
    constructor(options: IOptions);
    private _init;
    draw(): Promise<boolean>;
    redraw(): Promise<boolean>;
    abort(): Promise<void>;
    on(eventType: EventType, callback: () => void): void;
    off(eventType: EventType, callback: () => void): void;
    private emit;
    static getFittedSize({ width, height }: {
        width: number;
        height: number;
    }, limit?: number): {
        width: number;
        height: number;
    };
}
export {};
