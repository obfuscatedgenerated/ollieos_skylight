import type {PrivilegedProgram} from "ollieos/types";

export default {
    name: "sl_root",
    description: "Skylight",
    usage_suffix: "",
    arg_descriptions: {},
    hide_from_help: true,
    compat: "2.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { kernel, process } = data;

        // invoke sl_taskbar with privilege
        kernel.spawn("sl_taskbar", [], undefined, true);

        process.detach();
        return 0;
    }
} as PrivilegedProgram;
