import { queryWXML, normalizeWxmls, parse2els, draw } from './utils/index';

interface IOptions {
  canvas: string;
  selectors: string[];
  instanceContext?: InstanceContext;
}

type InitialOptions = Required<{
  [key in Exclude<keyof IOptions, 'canvas'>]: IOptions[key];
}>;

const initialOptions: InitialOptions = {
  instanceContext: wx,
  selectors: [],
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
  private _options: IOptions;
  private isReady = false;

  get canvas() {
    return this._canvas as WechatMiniprogram.Canvas;
  }

  get ctx() {
    return this._ctx as WechatMiniprogram.CanvasContext;
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
    this._init()
      .then(() => this.emit(EventType.READY))
      .catch(err => this.emit(EventType.ERROR, err));
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
          resolve(true);
        });
    });
  }

  draw() {
    queryWXML(this.options.selectors, this.options.instanceContext)
      .then(normalizeWxmls)
      .then(res => {
        this._canvas!.width = res[0].metrics.width;
        this._canvas!.height = res[0].metrics.height;
        return parse2els(res, this.ctx, this.canvas);
      })
      .then(els =>
        draw(
          els,
          this.ctx as WechatMiniprogram.CanvasContext,
          this.canvas as WechatMiniprogram.Canvas
        )
      )
      .then(() => this.emit(EventType.FINISH))
      .catch(err => this.emit(EventType.ERROR, err));
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
