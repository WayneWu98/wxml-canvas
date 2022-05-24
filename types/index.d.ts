/// <reference types="miniprogram-api-typings" />
/// <reference types="./src/typings" />
interface IOptions {
    width?: number;
    height?: number;
    canvas: string;
    selectors: string[];
    instanceContext?: InstanceContext;
}
declare enum EventType {
    READY = "ready",
    UPDATE = "update",
    ERROR = "error",
    FINISH = "finish"
}
export default class WXMLCanvas {
    private _canvas?;
    private _ctx?;
    private _options;
    private isReady;
    get canvas(): WechatMiniprogram.Canvas;
    get ctx(): WechatMiniprogram.CanvasContext;
    private listeners;
    readonly options: Required<IOptions>;
    constructor(options: IOptions);
    private _init;
    draw(): void;
    on(eventType: EventType, callback: () => void): void;
    off(eventType: EventType, callback: () => void): void;
    emit(eventType: EventType.ERROR, err: Error): void;
    emit(eventType: EventType.UPDATE | EventType.READY | EventType.FINISH): void;
}
export {};
