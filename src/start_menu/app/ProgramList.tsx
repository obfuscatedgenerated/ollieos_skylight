import type {ProgramMainData} from "ollieos/types";
import {useCallback, useMemo} from "react";

export const ProgramList = ({main_data}: {main_data: ProgramMainData}) => {
    const {kernel, shell, process} = main_data;
    const prog_reg = useMemo(() => kernel.get_program_registry(), [kernel]);

    const programs = useMemo(() => prog_reg.listProgramNames(true, true).filter((name) => !prog_reg.getProgram(name).hide_from_help).sort(), [prog_reg]);
    const program_clicked = useCallback((prog_name: string) => {
        shell.execute(prog_name);
        process.kill(0);
        // TODO: should this use a base gui shell provided by skylight instead?
    }, [prog_reg]);

    if (!shell) {
        return <div className="flex-1 flex items-center justify-center text-sm italic text-muted-foreground">No shell available!</div>;
    }

    return (
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-thin">
            {programs.map((prog_name) => (
                <div key={prog_name} className="px-2 py-1 rounded hover:bg-accent cursor-pointer" onClick={() => program_clicked(prog_name)}>
                    {prog_name}
                </div>
            ))}
        </div>
    );
}