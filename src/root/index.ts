import type {Program} from "ollieos/types";
import {Kernel} from "ollieos/kernel";

export default {
    name: "sl_root",
    description: "Skylight",
    usage_suffix: "",
    arg_descriptions: {},
    hide_from_help: true,
    compat: "2.0.0",
    main: async (data) => {
        // extract from data to make code less verbose
        const { kernel: userspace_kernel, process, term } = data;
        let kernel: Kernel;

        if (!userspace_kernel.privileged) {
            const maybe_kernel = await userspace_kernel.request_privilege("Launch Skylight shell. To prevent this appearing, install the Skylight service or default shell.");
            if (!maybe_kernel) {
                term.writeln("Privilege request denied. Skylight cannot start.");
                return 1;
            }
            kernel = maybe_kernel;
        } else {
            kernel = userspace_kernel as unknown as Kernel;
        }

        // invoke sl_taskbar with privilege
        const spawn_result = kernel.spawn("sl_taskbar", [], undefined, true);
        process.add_exit_listener(() => {
            spawn_result.process.kill();
        });

        process.detach();
        return 0;
    }
} as Program;
