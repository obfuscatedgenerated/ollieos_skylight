import type {PrivilegedProgram} from "ollieos/types";

import {render, teardown} from "./app";

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

        const wind = process.create_window();

        wind.title = "Start Menu";

        wind.set_custom_flag("no-top-bar", true);

        wind.x = "0vw";
        wind.y = "55vh";

        wind.height = "40vh";
        wind.width = "20vw";

        // TODO: rem based height to match tailwind

        render(wind.dom, wind.height, data);
        wind.show();

        process.add_exit_listener(() => {
            teardown(wind.dom);
            wind.close();
        });

        // TODO: kill when clicking outside window

        process.detach();
        return 0;
    }
} as PrivilegedProgram;
