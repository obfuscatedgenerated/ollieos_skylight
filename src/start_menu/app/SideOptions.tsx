import {ProgramMainData} from "ollieos/types";
import {Power, Settings} from "lucide-react";
import {useCallback} from "react";

const SideOption = ({Icon, label, on_click}: {Icon: React.ComponentType<{className?: string}>, label: string, on_click: () => void}) => {
    return (
        <button className="cursor-pointer bg-background text-foreground rounded p-2 text-left hover:bg-gray-700 flex items-center gap-2" onClick={on_click} title={label}>
            <Icon className="w-5 h-5" />
        </button>
    );
}

export const SideOptions = ({main_data}: {main_data: ProgramMainData}) => {
    const {kernel, shell, process} = main_data;

    const exec_and_kill = useCallback(
        (prog_name: string) => {
            shell.execute(prog_name);
            process.kill(0);
        },
        [kernel, process]
    );

    return (
        <div className="flex flex-col justify-end gap-2">
            <SideOption Icon={Settings} label="Settings" on_click={() => exec_and_kill("sl_settings")} />
            <SideOption Icon={Power} label="Shut down" on_click={() => exec_and_kill("shutdown")} />
        </div>
    );
}
