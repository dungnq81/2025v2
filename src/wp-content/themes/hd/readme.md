# HD Theme Core Review

## Overview
HD is a bespoke WordPress theme that bootstraps itself through `functions.php` by defining environment constants, enforcing a PHP 8.2 minimum, wiring the Composer autoloader, and instantiating the central `HD\Core\Theme` and `HD\API\API` singletons. 【F:src/wp-content/themes/hd/functions.php†L9-L52】

## Theme bootstrap & lifecycle
- `HD\Core\Theme` hooks into `after_setup_theme` to register core supports (thumbnails, HTML5, block styles), adjust media defaults, and expose custom logo settings. 【F:src/wp-content/themes/hd/inc/Core/Theme.php†L23-L76】
- During `setup()` the theme initializes admin utilities, customizer logic, performance optimizer, shortcode registry, AJAX endpoints, and optional integrations for ACF and WooCommerce. 【F:src/wp-content/themes/hd/inc/Core/Theme.php†L78-L98】
- Front-end assets are funneled through helper wrappers that handle versioning, localization, and dependency attributes (`module`, `defer`, `async`). Dynamic hooks allow per-template asset enqueueing. 【F:src/wp-content/themes/hd/inc/Core/Theme.php†L100-L163】【F:src/wp-content/themes/hd/inc/Utilities/Helpers/Asset.php†L15-L92】

## Admin experience
- `HD\Core\Admin\Admin` enforces required post titles, adds trash confirmation prompts, and aligns Gutenberg/classic editor styles. 【F:src/wp-content/themes/hd/inc/Core/Admin/Admin.php†L19-L70】
- Admin menus and submenus can be conditionally hidden per user ID using theme options, with extra controls for row actions and thumbnail columns in list tables. 【F:src/wp-content/themes/hd/inc/Core/Admin/Admin.php†L72-L197】
- Additional columns render thumbnails (including ACF term images and YouTube fallbacks), improving content scanning in the dashboard. 【F:src/wp-content/themes/hd/inc/Core/Admin/Admin.php†L199-L286】

## Performance & optimization layer
- `HD\Core\Optimizer` cleans default WordPress head output, normalizes media handling, customizes permalink structure, and registers tailored image sizes while disabling unused renditions. 【F:src/wp-content/themes/hd/inc/Core/Optimizer.php†L17-L119】【F:src/wp-content/themes/hd/inc/Core/Optimizer.php†L204-L234】
- Script/style tags are post-processed to add `type="module"`, `async`, and `defer` flags where requested, including lazy-loading support driven by theme settings. 【F:src/wp-content/themes/hd/inc/Core/Optimizer.php†L121-L202】
- Utility helpers expose cache purging across popular plugins and sanitize inline assets to avoid malicious patterns before minification. 【F:src/wp-content/themes/hd/inc/Utilities/Helpers/Helper.php†L211-L295】

## REST API strategy
- `HD\API\API` auto-discovers endpoint classes, registers custom routes, and locks down default post-type collections by replacing responses with empty payloads. 【F:src/wp-content/themes/hd/inc/API/API.php†L13-L105】
- Only whitelisted custom routes bypass the `rest_pre_dispatch` guard, reducing accidental data exposure. 【F:src/wp-content/themes/hd/inc/API/API.php†L28-L69】

## Utility highlights
- `HD\Utilities\Helpers\Helper` centralizes environment checks, localization helpers, dynamic option filtering, cache purges, and sanitization/minification utilities for inline assets. 【F:src/wp-content/themes/hd/inc/Utilities/Helpers/Helper.php†L19-L205】【F:src/wp-content/themes/hd/inc/Utilities/Helpers/Helper.php†L211-L348】
- Asset management wrappers abstract `wp_enqueue_*` while preserving extra attributes and inline injections, encouraging consistent usage throughout the theme. 【F:src/wp-content/themes/hd/inc/Utilities/Helpers/Asset.php†L15-L92】

## Observations & potential follow-up
- Inline admin scripts injected via `adminFooterScript()` could be migrated to bundled assets for easier maintenance and localization. 【F:src/wp-content/themes/hd/inc/Core/Admin/Admin.php†L34-L69】
- REST API blocking uses hard-coded post types; consider making the list configurable to avoid surprises when registering new custom types. 【F:src/wp-content/themes/hd/inc/API/API.php†L17-L63】
- Helper sanitization is comprehensive but relies on regex replacements; targeted unit tests would help ensure no desired markup is stripped inadvertently. 【F:src/wp-content/themes/hd/inc/Utilities/Helpers/Helper.php†L83-L205】