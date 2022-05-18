"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./utils/index");
const initialOptions = {
    width: 750,
    height: 1334,
    instanceContext: wx,
    classNames: [],
};
var EventType;
(function (EventType) {
    EventType["READY"] = "ready";
    EventType["UPDATE"] = "update";
    EventType["ERROR"] = "error";
    EventType["FINISH"] = "finish";
})(EventType || (EventType = {}));
class WXMLCanvas {
    constructor(options) {
        this.isReady = false;
        this.listeners = {
            [EventType.READY]: new Set(),
            [EventType.UPDATE]: new Set(),
            [EventType.ERROR]: new Set(),
            [EventType.FINISH]: new Set(),
        };
        this.options = new Proxy({}, {
            get: (_, key) => {
                var _a;
                return (_a = this._options[key]) !== null && _a !== void 0 ? _a : initialOptions[key];
            },
            set: (_, key, value) => {
                if (this.options[key] !== value) {
                    this._options[key] = value;
                    this.emit(EventType.UPDATE);
                    return true;
                }
                return false;
            },
        });
        this._options = options;
        this._init().then(() => this.emit(EventType.READY));
    }
    get canvas() {
        return this._canvas;
    }
    get ctx() {
        return this._ctx;
    }
    _init() {
        return new Promise((resolve, reject) => {
            wx.createSelectorQuery()
                .select(this.options.canvas)
                .fields({ node: true, size: true })
                .exec(res => {
                if (!(res === null || res === void 0 ? void 0 : res[0])) {
                    return reject(new Error('Canvas is not found.'));
                }
                this._canvas = res === null || res === void 0 ? void 0 : res[0].node;
                this._ctx = this._canvas.getContext('2d');
                resolve(true);
            });
        });
    }
    draw() {
        (0, index_1.queryWXML)(this.options.classNames, this.options.instanceContext)
            .then(index_1.normalizeWxmls)
            .then(res => {
            this._canvas.width = res[0].metrics.width;
            this._canvas.height = res[0].metrics.height;
            return (0, index_1.parse2els)(res, this.ctx, this.canvas);
        })
            .then(els => {
            (0, index_1.draw)(els, this.ctx, this.canvas);
        });
    }
    on(eventType, callback) {
        if (eventType === EventType.READY && this.isReady) {
            callback();
        }
        this.listeners[eventType].add(callback);
    }
    off(eventType, callback) {
        this.listeners[eventType].delete(callback);
    }
    emit(eventType, ...rest) {
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
exports.default = WXMLCanvas;
