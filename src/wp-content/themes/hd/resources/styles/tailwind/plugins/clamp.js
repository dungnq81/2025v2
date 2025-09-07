// tailwind/plugins/clamp.js

export default (opts = {}) => {
    const root = Number(opts.root ?? 16);
    const defaults = { minw: 640, maxw: 1536, base: 0, ...( opts.defaults || {} ) };
    const presets = opts.presets || {};

    const buildClamp = (min, max, base = defaults.base, minw = defaults.minw, maxw = defaults.maxw) => {
        min = Number(min);
        max = Number(max);
        base = Number(base);
        minw = Number(minw);
        maxw = Number(maxw);

        if (min > max) [ min, max ] = [ max, min ];
        const invalidRange = !( maxw > minw );

        if (min === max || invalidRange) {
            const fsRem = min / root;
            const out = { fontSize: `${fsRem}rem` };
            if (base > 0) out.lineHeight = `${fsRem * base}rem`;
            return out;
        }

        const minRem = min / root;
        const maxRem = max / root;
        const minwRem = minw / root;
        const maxwRem = maxw / root;
        const slope = ( ( maxRem - minRem ) / ( maxwRem - minwRem ) ) * 100;
        const intercept = minRem - slope * minwRem / 100;

        const out = {
            fontSize: `clamp(${minRem}rem, calc(${intercept}rem + ${slope}vw), ${maxRem}rem)`
        };

        if (base > 0) {
            out.lineHeight = `clamp(${minRem * base}rem, calc(${intercept * base}rem + ${slope * base}vw), ${maxRem * base}rem)`;
        }

        return out;
    };

    return ({ matchUtilities, addUtilities }) => {
        // Arbitrary utility: p-fs-clamp-[min,max,base?,minw?,maxw?]
        matchUtilities(
            {
                'p-fs-clamp': (raw) => {
                    const p = String(raw).split(',').map(s => s.trim()).filter(Boolean);
                    if (p.length < 2) return {};
                    const min = Number(p[0]);
                    const max = Number(p[1]);
                    const base = p[2] !== undefined ? Number(p[2]) : Number(defaults.base);
                    const minw = p[3] !== undefined ? Number(p[3]) : Number(defaults.minw);
                    const maxw = p[4] !== undefined ? Number(p[4]) : Number(defaults.maxw);
                    if (![ min, max, base, minw, maxw ].every(Number.isFinite)) return {};
                    return buildClamp(min, max, base, minw, maxw);
                }
            },
            { values: {}, type: 'any' }
        );

        // presets: .p-fs-clamp-h1, .p-fs-clamp-h2, ...
        const presetUtilities = Object.fromEntries(
            Object.entries(presets).map(([ name, conf ]) => {
                const { min, max, base, minw, maxw } = conf;
                return [ `.p-fs-clamp-${name}`, buildClamp(min, max, base, minw, maxw) ];
            })
        );

        addUtilities(presetUtilities);
    };
};
