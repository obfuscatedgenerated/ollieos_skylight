import type {PrivilegedProgram, Program} from "ollieos/types";

import { render } from "./app";
import {teardown} from "../start_menu/app";

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

        wind.x = "0vw";
        wind.y = "95vh";

        wind.height = "5vh";
        wind.width = "100vw";

        // TODO: rem based height to match tailwind

        render(wind.dom, wind.height, data);
        wind.request_layer("overlay");
        wind.show();

        process.add_exit_listener(() => {
            teardown(wind.dom);
            wind.close();
        });

        process.detach();
        return 0;
    }
} as PrivilegedProgram;
