import type {Program} from "ollieos/types";
import {Kernel} from "ollieos/kernel";

export default {
    name: "sl_root",
    description: "Skylight",
    usage_suffix: "",
    arg_descriptions: {},
    hide_from_help: true,
    space: "kernel",
    reason: "Launch Skylight shell. To prevent this appearing, install the Skylight service or default shell.",
    compat: "3.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { kernel, process } = data;

        // invoke children with privilege
        // TODO: should they all have it
        const children = ["sl_desktop", "sl_taskbar"];
        for (const child of children) {
            const spawn_result = await kernel.spawn(process, child, [], undefined, true);
            process.add_exit_listener(() => {
                spawn_result.process.kill();
            });
        }

        process.detach();
        return 0;
    }
} satisfies Program;
