import type {ProgramMainData, ProgramGUIProps} from "ollieos/types";
import type {Kernel} from "ollieos/kernel";

import {Suspense, useCallback, useEffect, useMemo, useState} from "react";
import {DefaultProgramIcon, ProgramIcon} from "./ProgramIcon";

// directories list_programs already covers
const PROGRAM_DIRS = ["/bin", "/usr/bin"];

interface ListedProgram {
    // the name, or the path for programs outside PROGRAM_DIRS
    command: string;
    gui: ProgramGUIProps;
}

export const ProgramList = ({main_data}: {main_data: ProgramMainData<Kernel>}) => {
    const {kernel, process} = main_data;

    const fs = useMemo(() => kernel.get_fs(), [kernel]);

    const [programs, setPrograms] = useState<ListedProgram[]>([]);
    useEffect(() => {
        const load_programs = async () => {
            // keyed by name, so a sibling replaces an installed program of the same name
            const by_name = new Map<string, ListedProgram>();

            for (const {name, metadata} of await kernel.list_programs()) {
                if (metadata.gui) {
                    by_name.set(name, {command: name, gui: metadata.gui});
                }
            }

            // siblings of this program, e.g. served by live-pkg, are always listed so they can be tested without installing
            const own_dir = process.program_path.slice(0, process.program_path.lastIndexOf("/"));
            if (!PROGRAM_DIRS.includes(own_dir) && await fs.dir_exists(own_dir)) {
                for (const file of await fs.list_dir(own_dir)) {
                    if (!file.endsWith(".js")) {
                        continue;
                    }

                    const path = `${own_dir}/${file.slice(0, -".js".length)}`;
                    const found = await kernel.find_program(path);
                    if (found?.metadata.gui) {
                        by_name.set(found.metadata.name, {command: path, gui: found.metadata.gui});
                    }
                }
            }

            setPrograms([...by_name.values()].sort((a, b) => a.gui.display_name.localeCompare(b.gui.display_name)));
        };

        void load_programs();
    }, [kernel, process, fs]);

    const program_clicked = useCallback(async ({command: program_command, gui}: ListedProgram) => {
        let command = program_command;
        let args: string[] = [];
        if (gui.start_with_args) {
            args = gui.start_with_args;
        }

        if (gui.starts_in_terminal_window) {
            // TODO: use custom privilege agent that knows if called like this somehow? then dont need to share privilege to this program
            command = "windowed_terminal";

            // TODO: is this secure? can it lead to privilege escalation if not parsed right, if the program gui props give risky args?
            args = [program_command, ...(gui.start_with_args ?? [])];
        }

        // start privileged if windowed terminal always (therefore also covers starting terminal normally from program list)
        const spawn_result = await kernel.spawn(process, command, args, undefined, command === "windowed_terminal");
        spawn_result.completion.then((code) => {
            if (spawn_result.process.is_detached) {
                return;
            }

            spawn_result.process.kill(code);
        });

        process.kill(0);
        // TODO: should this use a base gui shell provided by skylight instead? might be able to securely tell it to use privilege when opening here instead of passing privilege to the start menu itself
    }, [kernel, process]);

    return (
        <div className="flex-1 flex flex-col gap-1 pr-2 overflow-y-auto nice-scroll">
            {programs.map((program) => (
                <div key={program.command} className="flex gap-2 px-2 py-1 rounded transition-colors hover:bg-accent cursor-pointer" onClick={() => program_clicked(program)}>
                    <Suspense fallback={<DefaultProgramIcon className="w-6 h-6" />}>
                        <ProgramIcon fs={fs} icon_path={program.gui.icon_path} className="w-6 h-6" />
                    </Suspense>

                    <span>{program.gui.display_name}</span>
                </div>
            ))}
        </div>
    );
}