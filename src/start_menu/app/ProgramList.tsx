import type {ProgramGUIProps, PrivilegedProgramMainData} from "ollieos/types";
import {Suspense, useCallback, useMemo} from "react";
import {DefaultProgramIcon, ProgramIcon} from "./ProgramIcon";

export const ProgramList = ({main_data}: {main_data: PrivilegedProgramMainData}) => {
    const {kernel, process} = main_data;

    const prog_reg = useMemo(() => kernel.get_program_registry(), [kernel]);
    const fs = useMemo(() => kernel.get_fs(), [kernel]);

    const programs = useMemo(() =>
        prog_reg.listProgramNames(true, true)
            .map((prog_name) => {
                const gui = prog_reg.getProgram(prog_name)?.gui;
                if (!gui) {
                    return null;
                }

                return {prog_name, gui};
            })
            .filter((x): x is {prog_name: string, gui: ProgramGUIProps} => x !== null)
            .sort((a, b) => a.gui.display_name.localeCompare(b.gui.display_name)),
        [prog_reg]
    );

    const program_clicked = useCallback((prog_name: string, gui: ProgramGUIProps) => {
        let command = prog_name;
        let args = [];
        if (gui.start_with_args) {
            args = gui.start_with_args;
        }

        if (gui.starts_in_terminal_window) {
            // TODO: use custom privilege agent that knows if called like this somehow? then dont need to share privilege to this program
            command = "windowed_terminal";

            // TODO: is this secure? can it lead to privilege escalation if not parsed right, if the program gui props give risky args?
            args = [prog_name, ...(gui.start_with_args ?? [])];
        }

        // start privileged if windowed terminal always (therefore also covers starting terminal normally from program list)
        const spawn_result = kernel.spawn(process, command, args, undefined, command === "windowed_terminal");
        spawn_result.completion.then((code) => {
            if (spawn_result.process.is_detached) {
                return;
            }

           spawn_result.process.kill(code);
        });

        process.kill(0);
        // TODO: should this use a base gui shell provided by skylight instead? might be able to securely tell it to use privilege when opening here instead of passing privilege to the start menu itself
    }, [prog_reg]);

    return (
        <div className="flex-1 flex flex-col gap-1 pr-2 overflow-y-auto nice-scroll">
            {programs.map(({prog_name, gui}) => (
                <div key={prog_name} className="flex gap-2 px-2 py-1 rounded transition-colors hover:bg-accent cursor-pointer" onClick={() => program_clicked(prog_name, gui)}>
                    <Suspense fallback={<DefaultProgramIcon className="w-6 h-6" />}>
                        <ProgramIcon fs={fs} icon_path={gui.icon_path} className="w-6 h-6" />
                    </Suspense>

                    <span>{gui.display_name}</span>
                </div>
            ))}
        </div>
    );
}