/// <reference types="./src/typings" />
/// <reference types="miniprogram-api-typings" />
interface IOptions {
    width?: number;
    height?: number;
    canvas: string;
    classNames: string[];
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
    private wxml;
    private _options;
    private isReady;
    get canvas(): WechatMiniprogram.Canvas | undefined;
    get ctx(): WechatMiniprogram.CanvasContext | undefined;
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
