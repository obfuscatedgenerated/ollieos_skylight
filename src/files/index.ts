import type { Program } from "ollieos/types";
import {render} from "./app";

export default {
    name: "sl_files",
    description: "Skylight Files",
    usage_suffix: "",
    arg_descriptions: {},
    gui: {
        display_name: "Files",
        icon_path: "/usr/bin/skylight/icons/sl_settings.svg"
    },
    compat: "3.0.0",
    needs_dom: true,
    main: async (data) => {
        // extract from data to make code less verbose
        const { process } = data;

        const wind = await process.create_window();

        wind.x = "25vw";
        wind.y = "25vh";

        wind.height = "50vh";
        wind.width = "50vw";

        wind.title = "Files";

        render(wind.dom, data);
        wind.show();

        wind.add_event_listener("close", () => {
            process.kill(0);
        });

        process.detach();
        return 0;
    }
} satisfies Program;
