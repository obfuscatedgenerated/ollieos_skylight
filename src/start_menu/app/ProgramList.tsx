import type {ProgramGUIProps, ProgramMainData} from "ollieos/types";
import {useCallback, useMemo} from "react";

export const ProgramList = ({main_data}: {main_data: ProgramMainData}) => {
    const {kernel, shell, process} = main_data;
    const prog_reg = useMemo(() => kernel.get_program_registry(), [kernel]);

    const programs = useMemo(() =>
        prog_reg.listProgramNames()
            .map((prog_name) => {
                const gui = prog_reg.getProgram(prog_name)?.gui;
                if (!gui) {
                    return null;
                }

                return {prog_name, gui};
            })
            .filter((x): x is {prog_name: string, gui: {display_name: string}} => x !== null)
            .sort((a, b) => a.gui.display_name.localeCompare(b.gui.display_name)),
        [prog_reg]
    );

    const program_clicked = useCallback((prog_name: string, gui: ProgramGUIProps) => {
        let shell_line = prog_name;
        if (gui.start_with_args) {
            shell_line += " " + gui.start_with_args.join(" ");
        }

        if (gui.starts_in_terminal_window) {
            // TODO: need privilege to start windowed terminal, either give taskbar program privilege and assign privlege ourself (risky) or use custom privilege agent that knows if called like this somehow?
            shell_line = `windowed_terminal ${shell_line}`;
        }

        shell.execute(shell_line);
        process.kill(0);
        // TODO: should this use a base gui shell provided by skylight instead?
    }, [prog_reg]);

    if (!shell) {
        return <div className="flex-1 flex items-center justify-center text-sm italic text-muted-foreground">No shell available!</div>;
    }

    return (
        <div className="flex-1 flex flex-col gap-1 pr-2 overflow-y-auto nice-scroll">
            {programs.map(({prog_name, gui}) => (
                <div key={prog_name} className="px-2 py-1 rounded transition-colors hover:bg-accent cursor-pointer" onClick={() => program_clicked(prog_name, gui)}>
                    {gui.display_name}
                </div>
            ))}
        </div>
    );
}