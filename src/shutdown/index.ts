import type {PrivilegedProgram} from "ollieos/types";

import {render} from "./app";

export default {
    name: "sl_shutdown",
    description: "Skylight Shutdown Overlay and Handler",
    usage_suffix: "",
    arg_descriptions: {},
    hide_from_help: true,
    compat: "2.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { process, args, kernel } = data;

        const wind = process.create_window();

        wind.title = "Shutdown";

        wind.set_custom_flag("no-top-bar", true);

        wind.x = "0";
        wind.y = "0";

        wind.height = "100vh";
        wind.width = "100vw";

        render(wind.dom, data);
        wind.request_layer("administrative");
        wind.show();

        // pass args invisibly to shutdown cli in background
        kernel.spawn(process, "shutdown", args, undefined);

        process.add_exit_listener(() => {
            wind.close();
        });

        process.detach();
        return 0;
    }
} as PrivilegedProgram;
