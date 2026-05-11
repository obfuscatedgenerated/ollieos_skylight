import type {PrivilegedProgram, Program} from "ollieos/types";

import { render } from "./app";

export default {
    name: "sl_taskbar",
    description: "Skylight Taskbar",
    usage_suffix: "",
    arg_descriptions: {},
    hide_from_help: true,
    compat: "2.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { process } = data;

        const wind = process.create_window();

        wind.title = "Taskbar";

        wind.set_custom_flag("no-top-bar", true);

        // matching tailwind spacing
        const height_rem = 0.25 * 11;

        wind.x = "0vw";
        wind.y = `calc(100vh - ${height_rem}rem)`;

        wind.height = `${height_rem}rem`;
        wind.width = "100vw";

        render(wind.dom, wind.height, data);
        wind.request_layer("overlay");
        wind.show();

        process.add_exit_listener(() => {
            wind.close();
        });

        process.detach();
        return 0;
    }
} as PrivilegedProgram;
