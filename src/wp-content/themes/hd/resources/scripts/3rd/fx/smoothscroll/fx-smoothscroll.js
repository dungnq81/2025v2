// smoothscroll/fx-smoothscroll.js

import {$$, on} from "../utils/dom.js";
import Events from "../utils/events.js";

const SELECTOR = "[data-fx-scroll]";

const FxSmoothScroll = {
    activeAnimation: null,
    smoothScrollTo(targetY, {
        offset = 0,
        onStart = null,
        onUpdate = null,
        onEnd = null,
    } = {}) {
        if (this.activeAnimation) {
            cancelAnimationFrame(this.activeAnimation);
            this.activeAnimation = null;
        }

        const startY = window.scrollY;
        let currentY = startY;
        let velocity = 0;

        const maxSpeed = 50;
        const minSpeed = 0.4;
        const decelFactor = 0.12;
        const nearFactor = 0.18;
        const NEAR_DISTANCE = 30;

        const finalTarget = targetY - offset;
        if (onStart) onStart({startY, targetY: finalTarget});

        const animate = () => {
            const dist = finalTarget - currentY;
            const absDist = Math.abs(dist);
            if (absDist < 0.8) {
                window.scrollTo(0, finalTarget);
                if (onEnd) onEnd({finalY: finalTarget});
                this.activeAnimation = null;
                return;
            }

            velocity = dist * decelFactor;
            if (absDist < NEAR_DISTANCE) {
                velocity *= nearFactor;
            }

            if (velocity > maxSpeed) velocity = maxSpeed;
            if (velocity < -maxSpeed) velocity = -maxSpeed;
            if (velocity > 0 && velocity < minSpeed) velocity = minSpeed;
            if (velocity < 0 && velocity > -minSpeed) velocity = -minSpeed;

            currentY += velocity;
            window.scrollTo(0, currentY);

            if (onUpdate) onUpdate({y: currentY, velocity, dist});
            this.activeAnimation = requestAnimationFrame(animate);
        };

        this.activeAnimation = requestAnimationFrame(animate);
    },
    initAll(root = document) {
        $$(SELECTOR, root).forEach((a) => {
            const handler = (e) => {
                const href = a.getAttribute("href");
                if (!href || !href.startsWith("#")) return;

                e.preventDefault();

                const target = document.querySelector(href);
                if (!target) return;

                const offset = parseInt(
                    a.dataset.fxOffset ??
                    a.closest("[data-fx-offset]")?.dataset.fxOffset ??
                    document.body.dataset.fxOffset ??
                    0
                );

                const rect = target.getBoundingClientRect();
                const targetY = rect.top + window.scrollY;

                this.smoothScrollTo(targetY, {
                    offset,
                    onStart: () => Events.emit("smoothscroll.start", {link: a, target}),
                    onEnd: () => Events.emit("smoothscroll.goto", {link: a, target}),
                });
            };

            a.__fx_ss_handler = handler;
            on(a, "click", handler);
        });
    },
    destroyAll(root = document) {
        if (this.activeAnimation) cancelAnimationFrame(this.activeAnimation);
        this.activeAnimation = null;
        $$(SELECTOR, root).forEach((a) => {
            if (a.__fx_ss_handler) {
                a.removeEventListener("click", a.__fx_ss_handler);
            }
        });
    },
};

export default FxSmoothScroll;
