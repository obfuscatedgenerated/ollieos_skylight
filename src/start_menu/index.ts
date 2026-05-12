import type {PrivilegedProgram} from "ollieos/types";

import {render} from "./app";

export default {
    name: "sl_startmenu",
    description: "Skylight Start Menu",
    usage_suffix: "",
    arg_descriptions: {},
    hide_from_help: true,
    compat: "2.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { process } = data;

        // spawn children in home directory
        process.cwd = "~";

        const wind = process.create_window();

        wind.title = "Start Menu";

        wind.set_custom_flag("no-top-bar", true);

        // matching tailwind spacing
        const height_rem = 0.25 * 100;
        const width_rem = 0.25 * 80;
        const taskbar_spacing_rem = 0.25 * 11;

        wind.x = "0vw";
        wind.y = `calc(100vh - ${height_rem + taskbar_spacing_rem}rem)`;

        wind.height = `${height_rem}rem`;
        wind.width = `${width_rem}rem`;

        render(wind.dom, wind.height, data);
        wind.request_layer("overlay");
        wind.show();

        process.add_exit_listener(() => {
            wind.close();
        });

        // TODO: kill when clicking outside window

        process.detach();
        return 0;
    }
} as PrivilegedProgram;
