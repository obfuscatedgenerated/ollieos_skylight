import type {Program} from "ollieos/types";

import {render} from "./app";

export default {
    name: "sl_desktop",
    description: "Skylight Desktop",
    usage_suffix: "",
    arg_descriptions: {},
    hide_from_help: true,
    space: "kernel",
    reason: "Should not be invoked. Please use sl_root to start skylight.",
    compat: "3.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { process } = data;

        const wind = process.create_window();

        wind.title = "Desktop";

        wind.set_custom_flag("no-top-bar", true);

        wind.x = "0";
        wind.y = "0";

        wind.height = "100vh";
        wind.width = "100vw";

        render(wind.dom, data);
        wind.request_layer("background");
        wind.show();

        process.add_exit_listener(() => {
            wind.close();
        });

        process.detach();
        return 0;
    }
} satisfies Program;
