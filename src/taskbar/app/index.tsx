import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

export const render = (dom: ShadowRoot, css_height: string) => {
    createRoot(dom).render(
        <React.StrictMode>
            <main className="bg-background fg-foreground" style={{fontFamily: "Arial, sans-serif", margin: "0", padding: "10px", height: css_height, boxSizing: "border-box"}}>
                <App />
            </main>
        </React.StrictMode>
    );
}
