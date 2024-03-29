import { queryWXML, normalizeWxmls, parse2els, draw, getCanvasFittedScale, } from './utils/index';
const initialOptions = {
    instanceContext: wx,
    selectors: [],
    interval: 0,
};
var EventType;
(function (EventType) {
    EventType["DRAWING"] = "drawing";
    EventType["ABORTED"] = "aborted";
})(EventType || (EventType = {}));
export default class WXMLCanvas {
    constructor(options) {
        this._els = [];
        this.isAborted = false;
        this._flushing = false;
        this.abortResolve = () => Promise.resolve();
        this.listeners = {
            [EventType.DRAWING]: new Set(),
            [EventType.ABORTED]: new Set(),
        };
        this.options = new Proxy({}, {
            get: (_, key) => {
                var _a;
                return (_a = this._options[key]) !== null && _a !== void 0 ? _a : initialOptions[key];
            },
            set: (_, key, value) => {
                if (this.options[key] !== value) {
                    this._options[key] = value;
                    return true;
                }
                return false;
            },
        });
        this._options = options;
    }
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
        return this._canvas;
    }
    get ctx() {
        return this._ctx;
    }
    getFittedSize(limit = 1334) {
        return WXMLCanvas.getFittedSizeFromCanvas(this.canvas, limit);
    }
    _init() {
        return new Promise((resolve, reject) => {
            if (typeof this.options.canvas === 'string') {
                wx.createSelectorQuery()
                    .select(this.options.canvas)
                    .fields({ node: true, size: true })
                    .exec(res => {
                    if (!(res === null || res === void 0 ? void 0 : res[0])) {
                        return reject(new Error('Canvas is not found.'));
                    }
                    this._canvas = res === null || res === void 0 ? void 0 : res[0].node;
                    this._ctx = this._canvas.getContext('2d');
                    resolve();
                });
                return;
            }
            this._canvas = this.options.canvas;
            this._ctx = this._canvas.getContext('2d');
            resolve();
        })
            .then(() => queryWXML(this.options.selectors, this.options.instanceContext))
            .then(normalizeWxmls)
            .then(res => {
            const { width, height } = res[0].metrics;
            const scale = getCanvasFittedScale(Math.max(width, height));
            this._canvas.width = Math.floor(width * scale);
            this._canvas.height = Math.floor(height * scale);
            this._ctx.scale(scale, scale);
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
            return draw(this._els, this.ctx, this.canvas, this);
        })
            .then(() => (this.flushing = false));
    }
    redraw() {
        return this.abort()
            .then(() => this._init())
            .then(() => this.draw());
    }
    abort() {
        var _a;
        if (!this.flushing) {
            (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return Promise.resolve();
        }
        return new Promise(resolve => {
            this.isAborted = true;
            this.abortResolve = () => {
                var _a;
                this.emit(EventType.ABORTED);
                (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.flushing = false;
                resolve();
            };
        });
    }
    on(eventType, callback) {
        this.listeners[eventType].add(callback);
    }
    off(eventType, callback) {
        this.listeners[eventType].delete(callback);
    }
    emit(eventType) {
        this.listeners[eventType].forEach(callback => callback());
    }
    static getFittedSizeFromCanvas({ width, height }, limit = 1334) {
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
