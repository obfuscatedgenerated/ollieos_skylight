import type { Program } from "ollieos/types";

import { render } from "./app";

export default {
    name: "sl_taskbar",
    description: "Skylight Taskbar",
    usage_suffix: "",
    arg_descriptions: {},
    compat: "2.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { process } = data;

        const wind = process.create_window();

        wind.title = "Taskbar";

        wind.set_custom_flag("no-top-bar", true);

        wind.x = "0vw";
        wind.y = "92.5vh";

        wind.height = "7.5vh";
        wind.width = "100vw";

        render(wind.dom, wind.height);
        wind.show();

        process.detach();
        return 0;
    }
} as Program;
