// tabs/fx-tabs.js

import {$$, on, off, closest} from "../utils/dom.js";
import Events from "../utils/events.js";

const WRAPPER = "[data-tabs]";
const ACTIVE_CLASS = "is-active";

const FxTabs = {
    initAll(root = document) {
        $$(WRAPPER, root).forEach((tabList) => {
            const collapseEnabled = tabList.dataset.activeCollapse === "true";
            const id = tabList.getAttribute("id");
            if (!id) return;

            const contentWrapper = root.querySelector(`[data-tabs-content="${id}"]`);
            if (!contentWrapper) return;

            const tabButtons = tabList.querySelectorAll(".tabs-title > a");
            const tabPanels = contentWrapper.querySelectorAll(".tabs-panel");

            tabButtons.forEach((btn) => {
                const li = btn.parentElement;
                const panelId = btn.getAttribute("href");
                const panel = contentWrapper.querySelector(panelId);
                if (!panel) return;

                const active = li.classList.contains(ACTIVE_CLASS);
                btn.setAttribute("role", "tab");
                btn.setAttribute("aria-controls", panelId.replace("#", ""));
                btn.setAttribute("aria-selected", active ? "true" : "false");
                panel.setAttribute("role", "tabpanel");
                panel.setAttribute("aria-hidden", active ? "false" : "true");

                if (!active) {
                    panel.classList.remove(ACTIVE_CLASS);
                } else {
                    panel.classList.add(ACTIVE_CLASS);
                }
            });
            tabButtons.forEach((btn) => {
                const panelId = btn.getAttribute("href");
                if (!panelId || !panelId.startsWith("#")) return;
                const panel = contentWrapper.querySelector(panelId);
                if (!panel) return;

                const handler = (e) => {
                    e.preventDefault();
                    const li = btn.parentElement;
                    const isActive = li.classList.contains(ACTIVE_CLASS);

                    if (isActive && !collapseEnabled) return;

                    if (collapseEnabled && isActive) {
                        li.classList.remove(ACTIVE_CLASS);
                        btn.setAttribute("aria-selected", "false");
                        panel.classList.remove(ACTIVE_CLASS);
                        panel.setAttribute("aria-hidden", "true");
                        Events.emit("tabs.change", {tab: btn, panel, wrapper: tabList});
                        return;
                    }

                    tabList.querySelectorAll(".tabs-title").forEach((t) => t.classList.remove(ACTIVE_CLASS));
                    tabPanels.forEach((p) => {
                        p.classList.remove(ACTIVE_CLASS);
                        p.setAttribute("aria-hidden", "true");
                    });
                    tabButtons.forEach((b) => b.setAttribute("aria-selected", "false"));

                    li.classList.add(ACTIVE_CLASS);
                    btn.setAttribute("aria-selected", "true");

                    panel.classList.add(ACTIVE_CLASS);
                    panel.setAttribute("aria-hidden", "false");

                    Events.emit("tabs.change", {tab: btn, panel, wrapper: tabList});
                };

                btn.__fx_tab_handler = handler;
                on(btn, "click", handler);
            });
        });
    },
    destroyAll(root = document) {
        $$(WRAPPER, root).forEach((tabList) => {
            tabList.querySelectorAll(".tabs-title > a").forEach((btn) => {
                if (btn.__fx_tab_handler) off(btn, "click", btn.__fx_tab_handler);
            });
        });
    },
};

export default FxTabs;
