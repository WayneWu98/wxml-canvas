export const parseColor = function (rawColor, ctx, metrics) {
    if (rawColor.startsWith('linear-gradient') && metrics && ctx) {
        const splitted = rawColor
            .replace(/linear-gradient\((.*)\)$/, '$1')
            .split(/\,\s(?=[(rgb)(#)])/)
            .map(s => s.trim());
        let x0 = 0;
        let y0 = metrics.height;
        let x1 = 0;
        let y1 = 0;
        let refSize = metrics.height;
        if (splitted[0].endsWith('deg')) {
            const angle = splitted.shift();
            switch (angle) {
                case '90deg':
                    x0 = y0 = y1 = 0;
                    refSize = x1 = metrics.width;
                    break;
                case '180deg':
                    x0 = x1 = y0 = 0;
                    y1 = metrics.height;
                case '270deg':
                    x1 = y0 = y1 = 0;
                    refSize = x0 = metrics.width;
            }
        }
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        splitted
            .map(s => s.split(/\s(?=[^\s]+$)/))
            .forEach(([color, position]) => {
            gradient.addColorStop(parseSize(position, refSize) / refSize, color);
        });
        return gradient;
    }
    if (/^#[0-9a-f]+/.test(rawColor) || /^rgb/.test(rawColor)) {
        return rawColor;
    }
    return '';
};
export const parseSize = function (size, refSize) {
    if (/%$/.test(size)) {
        return (parseFloat(size) / 100) * (refSize !== null && refSize !== void 0 ? refSize : 1);
    }
    return parseFloat(size);
};
