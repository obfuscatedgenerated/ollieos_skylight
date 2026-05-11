import type { Program } from "ollieos/types";
import {render} from "./app";

export default {
    name: "sl_settings",
    description: "Skylight Settings",
    usage_suffix: "",
    arg_descriptions: {},
    gui: {
        display_name: "Settings"
    },
    compat: "2.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { process } = data;

        const wind = process.create_window();

        wind.x = "25vw";
        wind.y = "25vh";

        wind.height = "50vh";
        wind.width = "50vw";

        wind.title = "Settings";

        render(wind.dom, wind.height, data);
        wind.show();

        wind.add_event_listener("close", () => {
            process.kill(0);
        });

        process.detach();
        return 0;
    }
} as Program;
