import type {Program} from "ollieos/types";

import {render} from "./app";

export default {
    name: "sl_calc",
    description: "Skylight Calculator",
    usage_suffix: "",
    arg_descriptions: {},
    gui: {
        display_name: "Calculator"
        // TODO: export icon
    },
    compat: "2.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { process } = data;

        const wind = process.create_window();

        wind.title = "Calculator";

        wind.x = "0";
        wind.y = "0";

        const width_rem = 0.25 * 70;
        const height_rem = 0.25 * 90;

        wind.width = `${width_rem}rem`;
        wind.height = `${height_rem}rem`;

        render(wind.dom, wind.height, data);
        wind.request_layer("top");
        wind.show();

        process.add_exit_listener(() => {
            wind.close();
        });

        process.detach();
        return 0;
    }
} as Program;
