export const normalizer = {
    size(str) {
        return str.replace(/[^\d]/g, '');
    },
    isUrl(str) {
        return /^url\(.*\)$/.test(str);
    },
    url(str) {
        return str.replace(/^url\("(.*)"\)$/, '$1');
    },
    isLinearGradient(str) {
        return /^linear-gradient\(.*\)$/.test(str);
    },
    linearGradient(str, metrics, ctx) {
        const splited = str.replace(/^linear-gradient\((.*)\)$/, '$1').split(',');
        let linearPosition = {
            x0: (metrics.right - metrics.left) / 2,
            y0: 0,
            x1: (metrics.right - metrics.left) / 2,
            y1: 1,
        };
        if (/deg$/.test(splited[0])) {
            const radian = (parseFloat(splited.pop()) / 360) * Math.PI * 2;
            const w = (Math.tan(radian) * metrics.height) / 2;
            const h = (Math.atan(radian) * metrics.width) / 2;
        }
    },
};
export const drawRect = function ({ position, radius, backgroundColor, backgroundImage, }) {
    return new Promise((resolve, reject) => {
        if (!(this === null || this === void 0 ? void 0 : this.ctx)) {
            return reject(new TypeError('canvas context has not been initialized'));
        }
        this.ctx.save();
        if (backgroundColor) {
            this.ctx.fillStyle = backgroundColor;
        }
    });
};
export const drawBorder = function () { };
export const drawText = function () { };
export const drawImage = function () { };
export const drawBg = function (wxml) {
    return new Promise((resolve, reject) => {
    });
};
export const drawColor = function ({ metrics, color, radius }, ctx) {
    console.log('fill color');
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(metrics.left, metrics.top);
    ctx.lineTo(metrics.right, metrics.top);
    ctx.lineTo(metrics.right, metrics.bottom);
    ctx.lineTo(metrics.left, metrics.bottom);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};
export const draw = (els, ctx, canvas) => {
    els.forEach(el => {
        switch (el.type) {
            case "color":
                drawColor(el, ctx);
        }
    });
};
