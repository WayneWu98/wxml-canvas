export declare const normalizer: {
    size(str: string): string;
    isUrl(str: string): boolean;
    url(str: string): string;
    isLinearGradient(str: string): boolean;
    linearGradient(str: string, metrics: Metrics, ctx: CanvasRenderingContext2D): void;
};
export declare const drawColor: ({ metrics, color, radius }: IElementColor, ctx: WechatMiniprogram.CanvasContext) => Promise<void>;
export declare const drawText: () => void;
export declare const drawImage: (el: IElementImage, ctx: WechatMiniprogram.CanvasContext, canvas: WechatMiniprogram.Canvas) => Promise<unknown>;
export declare const draw: (els: IElement[], ctx: WechatMiniprogram.CanvasContext, canvas: WechatMiniprogram.Canvas) => Promise<any>;
