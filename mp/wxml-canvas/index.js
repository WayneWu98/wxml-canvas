import { queryWXML, normalizeWxmls, parse2els, draw } from './utils/index';
const initialOptions = {
    instanceContext: wx,
    selectors: [],
};
var EventType;
(function (EventType) {
    EventType["DRAWING"] = "drawing";
    EventType["ABORTED"] = "aborted";
})(EventType || (EventType = {}));
export default class WXMLCanvas {
    _canvas;
    _ctx;
    _options;
    _els = [];
    isAborted = false;
    _flushing = false;
    abortResolve = () => Promise.resolve();
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
    listeners = {
        [EventType.DRAWING]: new Set(),
        [EventType.ABORTED]: new Set(),
    };
    options = new Proxy({}, {
        get: (_, key) => {
            return this._options[key] ?? initialOptions[key];
        },
        set: (_, key, value) => {
            if (this.options[key] !== value) {
                this._options[key] = value;
                return true;
            }
            return false;
        },
    });
    constructor(options) {
        this._options = options;
    }
    _init() {
        return new Promise((resolve, reject) => {
            wx.createSelectorQuery()
                .select(this.options.canvas)
                .fields({ node: true, size: true })
                .exec(res => {
                if (!res?.[0]) {
                    return reject(new Error('Canvas is not found.'));
                }
                this._canvas = res?.[0].node;
                this._ctx = this._canvas.getContext('2d');
                resolve();
            });
        })
            .then(() => queryWXML(this.options.selectors, this.options.instanceContext))
            .then(normalizeWxmls)
            .then(res => {
            this._canvas.width = res[0].metrics.width;
            this._canvas.height = res[0].metrics.height;
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
        if (!this.flushing) {
            this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return Promise.resolve();
        }
        return new Promise(resolve => {
            this.isAborted = true;
            this.abortResolve = () => {
                this.emit(EventType.ABORTED);
                this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
}
