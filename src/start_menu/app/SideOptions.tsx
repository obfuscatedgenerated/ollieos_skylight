import {PrivilegedProgramMainData} from "ollieos/types";
import {Power, RotateCcw, Settings} from "lucide-react";
import {useCallback, useState} from "react";

const SideOption = ({Icon, label, on_click}: {Icon: React.ComponentType<{className?: string}>, label: string, on_click: () => void}) => {
    return (
        <button className="cursor-pointer bg-background text-foreground rounded p-2 text-left transition-colors hover:bg-accent flex items-center gap-2" onClick={on_click} title={label}>
            <Icon className="w-5 h-5" />
        </button>
    );
}

export const SideOptions = ({main_data}: {main_data: PrivilegedProgramMainData}) => {
    const {kernel, process} = main_data;

    const exec_and_kill = useCallback(
        async (prog_name: string, args: string[] = []) => {
            const spawn_result = kernel.spawn(prog_name, args);
            spawn_result.completion.then((code) => {
                if (spawn_result.process.is_detached) {
                    return;
                }

                spawn_result.process.kill(code);
            });

            process.kill(0);
        },
        [kernel, process]
    );

    const [power_options_visible, setPowerOptionsVisible] = useState(false);

    return (
        <div className="flex flex-col justify-end gap-2 relative">
            <SideOption Icon={Settings} label="Settings" on_click={() => exec_and_kill("sl_settings")} />
            <SideOption Icon={Power} label="Power options" on_click={() => setPowerOptionsVisible(true)} />

            {power_options_visible && (
                <div className="absolute bottom-10 left-0 bg-background-2 text-foreground rounded shadow-lg flex flex-col gap-1 p-2 w-40">
                    <button className="flex items-center justify-start gap-2 cursor-pointer px-2 py-1 rounded transition-colors hover:bg-accent" onClick={() => exec_and_kill("shutdown")}>
                        <Power className="w-4 h-4" />
                        Shut down
                    </button>
                    <button className="flex items-center justify-start gap-2 cursor-pointer px-2 py-1 rounded transition-colors hover:bg-accent" onClick={() => exec_and_kill("shutdown", ["-r"])}>
                        <RotateCcw className="w-4 h-4" />
                        Restart
                    </button>
                    <button className="flex items-center justify-start cursor-pointer px-2 py-1 rounded transition-colors hover:bg-accent" onClick={() => setPowerOptionsVisible(false)}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
