type ClassNames = (string | ClassNames)[];

interface IOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  canvas: string;
  classNames: ClassNames;
  container: string;
}

type InitialOptions = Required<{
  [key in Exclude<
    keyof IOptions,
    'canvas' | 'backgroundColor' | 'container'
  >]: IOptions[key];
}>;

const initialOptions: InitialOptions = {
  width: 750,
  height: 1334,
  classNames: [],
};

class WXMLCanvas {
  private canvas?: WechatMiniprogram.Canvas;
  private ctx?: WechatMiniprogram.CanvasContext;
  private _options: IOptions;

  readonly options: Required<IOptions> = new Proxy({} as Required<IOptions>, {
    get: (_, key: keyof IOptions) => {
      return this._options[key] ?? initialOptions[key as keyof InitialOptions];
    },
    set: <T extends keyof IOptions>(_: any, key: T, value: IOptions[T]) => {
      this._options[key] = value;
      return true;
    },
  });

  constructor(options: IOptions) {
    this._options = options;
    this._init();
  }

  private _init() {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select(this.options.canvas)
        .fields({ node: true, size: true }, res => {})
        .exec(res => {
          if (!res.length) {
            return reject(new Error('canvas not found'));
          }

          this.canvas = res?.[0].node as WechatMiniprogram.Canvas;
          this.ctx = this.canvas.getContext('2d');

          resolve(true);
        });
    });
  }
}
