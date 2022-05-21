export const parseColor = function (rawColor, ctx, metrics) {
    if (rawColor.startsWith('linear-gradient') && metrics && ctx) {
        const splitted = rawColor
            .replace(/linear-gradient\((.*)\)$/, '$1')
            .split(/\,\s(?=[(rgb)(#)])/)
            .map(s => s.trim());
        let x0 = metrics.width / 2;
        let y0 = metrics.height;
        let x1 = metrics.width / 2;
        let y1 = 0;
        let refSize = metrics.height;
        let deg = splitted[0].endsWith('deg')
            ? (parseFloat(splitted.shift()) / 180) * Math.PI
            : Math.PI;
        if (Math.abs((Math.tan(deg) * metrics.height) / 2) < metrics.width / 2) {
            let reverse = false;
            if (deg > Math.PI / 2 && deg < (Math.PI * 3) / 2) {
                reverse = true;
                deg = deg - Math.PI;
                deg < 0 && (deg += 2 * Math.PI);
            }
            const dy = Math.abs((metrics.width / 2 - (metrics.height / 2) * Math.tan(deg)) *
                Math.sin(deg) *
                Math.sin(Math.PI / 2 - deg));
            const dx = dy * Math.tan(deg);
            if (reverse) {
                x0 = metrics.width / 2 + dx;
                y0 = -dy;
                x1 = metrics.width / 2 - dx;
                y1 = metrics.height + dy;
            }
            else {
                x1 = metrics.width / 2 + dx;
                y1 = -dy;
                x0 = metrics.width / 2 - dx;
                y0 = metrics.height + dy;
            }
        }
        else {
            deg -= Math.PI / 2;
            let reverse = false;
            if (deg > Math.PI / 2 && deg < (Math.PI * 3) / 2) {
                reverse = true;
                deg = deg - Math.PI;
                deg < 0 && (deg += 2 * Math.PI);
            }
            const dx = Math.abs((metrics.height / 2 - (metrics.width / 2) * Math.tan(deg)) *
                Math.sin(deg) *
                Math.sin(Math.PI / 2 - deg));
            const dy = dx * Math.tan(deg);
            if (reverse) {
                x0 = metrics.width + dx;
                y0 = metrics.height / 2 + dy;
                x1 = -dx;
                y1 = metrics.height / 2 - dy;
            }
            else {
                x0 = -dx;
                y0 = metrics.height / 2 - dy;
                x1 = metrics.width + dx;
                y1 = metrics.height / 2 + dy;
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
export const parseBgSize2Mode = function (bgPosition) {
    switch (bgPosition) {
        case 'cover':
            return "aspectFill";
        case 'contain':
            return "aspectFit";
        default:
            return "top left";
    }
};
export const parseBorderWidth = function (borderWidth) {
    const ws = borderWidth.split(' ').map(parseSize);
    let parsed;
    if (ws.length === 1) {
        parsed = [ws[0], ws[0], ws[0], ws[0]];
    }
    else if (ws.length === 2) {
        parsed = [ws[0], ws[1], ws[0], ws[1]];
    }
    else if (ws.length === 3) {
        parsed = [ws[0], ws[1], ws[2], ws[0]];
    }
    else {
        parsed = [ws[0], ws[1], ws[2], ws[3]];
    }
    return parsed;
};
export const parseBorderColor = function (borderColor) {
    const colors = borderColor.split(/\s(?=[(rgb)(#)])/);
    let color;
    if (colors.length === 1) {
        color = [colors[0], colors[0], colors[0], colors[0]];
    }
    else if (colors.length === 2) {
        color = [colors[0], colors[1], colors[0], colors[1]];
    }
    else if (colors.length === 3) {
        color = [colors[0], colors[1], colors[2], colors[0]];
    }
    else {
        color = [colors[0], colors[1], colors[2], colors[3]];
    }
    return color;
};
export const parseFittedRadius = function (radius, { width, height }) {
    radius = parseSize(radius);
    if (radius > Math.min(width, height) / 2) {
        return Math.min(width, height) / 2;
    }
    return radius;
};
export const parseLineHeight = function (lineHeight, fontSize) {
    if (lineHeight === 'normal') {
        return fontSize * 1.375;
    }
    return parseSize(lineHeight);
};
export const parsePadding = function (padding) {
    const ps = padding.split(' ').map(parseSize);
    let parsed;
    if (ps.length === 1) {
        parsed = [ps[0], ps[0], ps[0], ps[0]];
    }
    else if (ps.length === 2) {
        parsed = [ps[0], ps[1], ps[0], ps[1]];
    }
    else if (ps.length === 3) {
        parsed = [ps[0], ps[1], ps[2], ps[0]];
    }
    else {
        parsed = [ps[0], ps[1], ps[2], ps[3]];
    }
    return parsed;
};
export const parseTextOverflow2Endian = function (textOverflow) {
    if (textOverflow === 'ellipsis') {
        return "ellipsis";
    }
    return "clip";
};
export const parseShadow = function (boxShadow) {
    const [color, offsetX, offsetY, blur] = boxShadow.split(/(?<=[^\,])\s/);
    return {
        color,
        offsetX: parseSize(offsetX),
        offsetY: parseSize(offsetY),
        blur: parseSize(blur),
    };
};
