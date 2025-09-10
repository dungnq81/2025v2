/* tailwind/plugins/index.js */

import { composeHandlers } from './_compose.js';

/* .p-fs-clamp- */
import presets from './clamp-presets.js';
import fluidTypeFactory from './clamp.js';

const fluidType = fluidTypeFactory({
    root: 16,
    defaults: { minw: 640, maxw: 1536, base: 0 },
    presets,
});

/* // */

export default composeHandlers(
    fluidType
);
