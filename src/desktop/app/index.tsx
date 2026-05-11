import styles from "../../common.css";

import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import type {PrivilegedProgramMainData} from "ollieos/types";

export const render = (dom: ShadowRoot, main_data: PrivilegedProgramMainData) => {
    const react_root = document.createElement("div");
    dom.appendChild(react_root);

    createRoot(react_root).render(
        <React.StrictMode>
            <style>{styles}</style>
            <App main_data={main_data} />
        </React.StrictMode>
    );
}
