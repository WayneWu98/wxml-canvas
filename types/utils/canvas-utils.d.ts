import WXMLCanvas from 'src';
import { INormalizedWXML } from './wxml-utils';
export declare const normalizer: {
    size(str: string): string;
    isUrl(str: string): boolean;
    url(str: string): string;
    isLinearGradient(str: string): boolean;
    linearGradient(str: string, metrics: Metrics, ctx: CanvasRenderingContext2D): void;
};
export declare const drawRect: (this: WXMLCanvas, { position, radius, backgroundColor, backgroundImage, }: {
    radius?: BorderRadius | undefined;
    position?: Metrics | undefined;
    backgroundColor?: string | undefined;
    backgroundImage?: string | undefined;
}) => Promise<unknown>;
export declare const drawBorder: () => void;
export declare const drawText: () => void;
export declare const drawImage: () => void;
export declare const drawBg: (wxml: INormalizedWXML) => Promise<unknown>;
export declare const drawColor: ({ metrics, color, radius }: IElementColor, ctx: WechatMiniprogram.CanvasContext) => void;
export declare const draw: (els: IElement[], ctx: WechatMiniprogram.CanvasContext, canvas: WechatMiniprogram.Canvas) => void;
