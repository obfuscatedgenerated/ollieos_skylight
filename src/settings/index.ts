import type { Program } from "ollieos/types";



export default {
    name: "sl_settings",
    description: "Skylight Settings",
    usage_suffix: "",
    arg_descriptions: {},
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
        wind.dom.innerHTML = "placeholder";

        wind.show();

        process.detach();
        return 0;
    }
} as Program;
