// tailwind/plugins/clamp.js

export default (opts = {}) => {
    const root = Number(opts.root ?? 16);
    const defaults = {minw: 380, maxw: 1900, base: 0, ...(opts.defaults || {})};
    const presets = opts.presets || {};

    const buildClamp = (minPx, maxPx, base = defaults.base, minw = defaults.minw, maxw = defaults.maxw) => {
        minPx = Number(minPx);
        maxPx = Number(maxPx);
        base = Number(base);
        minw = Number(minw);
        maxw = Number(maxw);

        if (minPx > maxPx) [minPx, maxPx] = [maxPx, minPx];
        const invalidRange = !(maxw > minw);

        if (minPx === maxPx || invalidRange) {
            const fsRem = minPx / root;
            const out = {fontSize: `${fsRem}rem`};
            if (base > 0) out.lineHeight = `${fsRem * base}rem`;
            return out;
        }

        const minRem = minPx / root;
        const maxRem = maxPx / root;
        const slope = ((maxRem - minRem) / (maxw - minw)) * 100;
        const intercept = minRem - (slope * (minw / 100));

        const out = {
            fontSize: `clamp(${minRem}rem, calc(${intercept}rem + ${slope}vw), ${maxRem}rem)`
        };
        if (base > 0) {
            out.lineHeight = `clamp(${minRem * base}rem, calc(${intercept * base}rem + ${slope * base}vw), ${maxRem * base}rem)`;
        }

        return out;
    };

    return ({matchUtilities, addUtilities}) => {
        // Arbitrary utility: p-fs-clamp-[min,max,base?,minw?,maxw?]
        matchUtilities(
            {
                'p-fs-clamp': (raw) => {
                    const p = String(raw).split(',').map(s => s.trim()).filter(Boolean);
                    if (p.length < 2) return {};
                    const minPx = Number(p[0]);
                    const maxPx = Number(p[1]);
                    const base = p[2] !== undefined ? Number(p[2]) : Number(defaults.base);
                    const minw = p[3] !== undefined ? Number(p[3]) : Number(defaults.minw);
                    const maxw = p[4] !== undefined ? Number(p[4]) : Number(defaults.maxw);
                    if (![minPx, maxPx, base, minw, maxw].every(Number.isFinite)) return {};
                    return buildClamp(minPx, maxPx, base, minw, maxw);
                }
            },
            {values: {}, type: 'any'}
        );

        // presets: .p-fs-clamp-h1, .p-fs-clamp-h2, ...
        const presetUtilities = Object.fromEntries(
            Object.entries(presets).map(([name, conf]) => {
                const {min, max, base, minw, maxw} = conf;
                return [`.p-fs-clamp-${name}`, buildClamp(min, max, base, minw, maxw)];
            })
        );

        addUtilities(presetUtilities);
    };
};
