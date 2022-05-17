import {
  INormalizedWXML,
  queryWXML,
  normalizeWxmls,
  parse2els,
  draw,
} from './utils/index';

interface IOptions {
  width?: number;
  height?: number;
  canvas: string;
  classNames: string[];
  instanceContext?: InstanceContext;
}

type InitialOptions = Required<{
  [key in Exclude<keyof IOptions, 'canvas'>]: IOptions[key];
}>;

const initialOptions: InitialOptions = {
  width: 750,
  height: 1334,
  instanceContext: wx,
  classNames: [],
};

enum EventType {
  READY = 'ready',
  UPDATE = 'update',
  ERROR = 'error',
  FINISH = 'finish',
}

interface IListeners {
  [EventType.READY]: Set<() => void>;
  [EventType.UPDATE]: Set<() => void>;
  [EventType.ERROR]: Set<(err: Error) => void>;
  [EventType.FINISH]: Set<() => void>;
}

export default class WXMLCanvas {
  private _canvas?: WechatMiniprogram.Canvas;
  private _ctx?: WechatMiniprogram.CanvasContext;
  private wxml: INormalizedWXML[] = [];
  private _options: IOptions;
  private isReady = false;

  get canvas() {
    return this._canvas;
  }

  get ctx() {
    return this._ctx;
  }
  private listeners: IListeners = {
    [EventType.READY]: new Set(),
    [EventType.UPDATE]: new Set(),
    [EventType.ERROR]: new Set(),
    [EventType.FINISH]: new Set(),
  };

  readonly options: Required<IOptions> = new Proxy({} as Required<IOptions>, {
    get: (_, key: keyof IOptions) => {
      return this._options[key] ?? initialOptions[key as keyof InitialOptions];
    },
    set: <T extends keyof IOptions>(_: any, key: T, value: IOptions[T]) => {
      if (this.options[key] !== value) {
        this._options[key] = value;
        this.emit(EventType.UPDATE);
        return true;
      }

      return false;
    },
  });

  constructor(options: IOptions) {
    this._options = options;
    this._init().then(() => this.emit(EventType.READY));
  }

  private _init() {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select(this.options.canvas)
        .fields({ node: true, size: true })
        .exec(res => {
          if (!res?.[0]) {
            return reject(new Error('Canvas is not found.'));
          }

          this._canvas = res?.[0].node as WechatMiniprogram.Canvas;
          this._ctx = this._canvas.getContext('2d');
          this._canvas.width = this.options.width;
          this._canvas.height = this.options.height;

          resolve(true);
        });
    });
  }

  draw() {
    queryWXML(this.options.classNames, this.options.instanceContext)
      .then(normalizeWxmls)
      .then(res => parse2els(res, this.ctx))
      .then(els => {
        draw(
          els,
          this.ctx as WechatMiniprogram.CanvasContext,
          this.canvas as WechatMiniprogram.Canvas
        );
      });
  }

  on(eventType: EventType, callback: () => void) {
    if (eventType === EventType.READY && this.isReady) {
      callback();
    }

    this.listeners[eventType].add(callback);
  }

  off(eventType: EventType, callback: () => void) {
    this.listeners[eventType].delete(callback);
  }

  emit(eventType: EventType.ERROR, err: Error): void;
  emit(eventType: EventType.UPDATE | EventType.READY | EventType.FINISH): void;
  emit(eventType: EventType, ...rest: any[]): void {
    switch (eventType) {
      case EventType.ERROR:
        this.listeners[eventType].forEach(callback => callback(rest[0]));
        break;
      case EventType.READY:
        this.isReady = true;
      default:
        this.listeners[eventType].forEach(callback => callback());
    }
  }
}
