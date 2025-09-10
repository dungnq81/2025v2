/* tailwind/plugins/_compose.js */

import plugin from 'tailwindcss/plugin';

export function composeHandlers (...handlers) {
    return plugin((api) => {
        for (const h of handlers) {
            if (typeof h === 'function') h(api);
        }
    });
}
