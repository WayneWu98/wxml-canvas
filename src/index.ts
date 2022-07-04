import { queryWXML, normalizeWxmls, parse2els, draw } from './utils/index';

interface IOptions {
  canvas: string;
  selectors: string[];
  instanceContext?: InstanceContext;
  interval: number;
}

type InitialOptions = Required<{
  [key in Exclude<keyof IOptions, 'canvas'>]: IOptions[key];
}>;

const initialOptions: InitialOptions = {
  instanceContext: wx,
  selectors: [],
  interval: 0,
};

enum EventType {
  DRAWING = 'drawing',
  ABORTED = 'aborted',
}

interface IListeners {
  [EventType.DRAWING]: Set<() => void>;
  [EventType.ABORTED]: Set<() => void>;
}

export default class WXMLCanvas {
  private _canvas?: WechatMiniprogram.Canvas;
  private _ctx?: WechatMiniprogram.CanvasContext;
  private _options: IOptions;
  private _els: IElement[] = [];
  isAborted = false;
  private _flushing = false;
  abortResolve: Function = () => Promise.resolve();

  get flushing() {
    return this._flushing;
  }

  set flushing(v) {
    if (v) {
      this.emit(EventType.DRAWING);
    }
    this._flushing = v;
  }

  get canvas() {
    return this._canvas as WechatMiniprogram.Canvas;
  }

  get ctx() {
    return this._ctx as WechatMiniprogram.CanvasContext;
  }

  getFittedSize(limit = 1334) {
    return WXMLCanvas.getFittedSizeFromCanvas(this.canvas, limit);
  }

  private listeners: IListeners = {
    [EventType.DRAWING]: new Set(),
    [EventType.ABORTED]: new Set(),
  };

  readonly options: Required<IOptions> = new Proxy({} as Required<IOptions>, {
    get: (_, key: keyof IOptions) => {
      return this._options[key] ?? initialOptions[key as keyof InitialOptions];
    },
    set: <T extends keyof IOptions>(_: any, key: T, value: IOptions[T]) => {
      if (this.options[key] !== value) {
        this._options[key] = value;
        return true;
      }

      return false;
    },
  });

  constructor(options: IOptions) {
    this._options = options;
  }

  private _init() {
    return new Promise<void>((resolve, reject) => {
      wx.createSelectorQuery()
        .select(this.options.canvas)
        .fields({ node: true, size: true })
        .exec(res => {
          if (!res?.[0]) {
            return reject(new Error('Canvas is not found.'));
          }
          this._canvas = res?.[0].node as WechatMiniprogram.Canvas;
          this._ctx = this._canvas.getContext('2d');
          resolve();
        });
    })
      .then(() =>
        queryWXML(this.options.selectors, this.options.instanceContext)
      )
      .then(normalizeWxmls)
      .then(res => {
        const dpr = wx.getSystemInfoSync().pixelRatio;
        this._canvas!.width = res[0].metrics.width * dpr;
        this._canvas!.height = res[0].metrics.height * dpr;
        this._ctx!.scale(dpr, dpr);
        this._els = parse2els(res, this.ctx, this.canvas);
      });
  }

  draw() {
    this.flushing = true;
    this.isAborted = false;
    return this._init()
      .then(() => {
        if (this.isAborted) {
          this.abortResolve();
          throw new Error('Aborted');
        }
        return draw(
          this._els,
          this.ctx as WechatMiniprogram.CanvasContext,
          this.canvas as WechatMiniprogram.Canvas,
          this
        );
      })
      .then(() => (this.flushing = false));
  }

  redraw() {
    return this.abort()
      .then(() => this._init())
      .then(() => this.draw());
  }

  abort() {
    if (!this.flushing) {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return Promise.resolve();
    }
    return new Promise<void>(resolve => {
      this.isAborted = true;
      this.abortResolve = () => {
        this.emit(EventType.ABORTED);
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.flushing = false;
        resolve();
      };
    });
  }

  on(eventType: EventType, callback: () => void) {
    this.listeners[eventType].add(callback);
  }

  off(eventType: EventType, callback: () => void) {
    this.listeners[eventType].delete(callback);
  }

  private emit(eventType: EventType): void {
    this.listeners[eventType].forEach(callback => callback());
  }

  static getFittedSizeFromCanvas(
    { width, height }: WechatMiniprogram.Canvas,
    limit = 1334
  ) {
    if (Math.max(width, height) <= limit) {
      return { width, height };
    }
    if (width > height) {
      return {
        width: limit,
        height: (height / width) * limit,
      };
    }
    return {
      width: (width / height) * limit,
      height: limit,
    };
  }
}
