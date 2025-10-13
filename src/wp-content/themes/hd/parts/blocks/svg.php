<?php
/**
 * This SVG file defines reusable icon symbols for a plus and minus icon, each drawn as circular outline buttons.
 * It uses <symbol> elements inside <defs> so they can be referenced throughout the site using <use>.
 * The file is optimized for accessibility and hidden by default, serving as a lightweight icon sprite.
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

ob_start();

?>
<svg class="absolute size-[0] overflow-hidden" xmlns="http://www.w3.org/2000/svg" hidden aria-hidden="true" focusable="false">
	<defs>
		<symbol id="icon-circle-minus-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/></symbol>
		<symbol id="icon-circle-plus-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/></symbol>
        <symbol id="icon-check-circle-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5L11 14l4-4m6 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0" /></symbol>
        <symbol id="icon-check-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917L9.724 16.5L19 7.5"/></symbol>
        <symbol id="icon-arrow-left-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4l4 4" /></symbol>
        <symbol id="icon-arrow-right-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0l-4 4m4-4l-4-4"/></symbol>
        <symbol id="icon-star" viewBox="0 0 18 18"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z"></path></symbol>
        <symbol id="icon-angle-top-solid" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15l7-7l7 7"/></symbol>
        <symbol id="icon-globe-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87c1.07 1.413 2.075 1.228 3.192 2.644c1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58c1.402.693 2.918.351 2.918 2.334c0 .276 0 2.008 1.972 2.008c2.026.031 2.026-1.678 2.026-2.008c0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"/></symbol>
        <symbol id="icon-question-circle-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.44 2.44 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/></symbol>
        <symbol id="icon-chevron-right-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 16l4-4l-4-4"/></symbol>
        <symbol id="icon-chevron-left-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 8l-4 4l4 4"/></symbol>
        <symbol id="icon-dots-horizontal-outline" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="3" d="M6 12h.01m6 0h.01m5.99 0h.01"/></symbol>
	</defs>
</svg>
<?php

echo \HD_Helper::JSMinify( ob_get_clean(), true );
