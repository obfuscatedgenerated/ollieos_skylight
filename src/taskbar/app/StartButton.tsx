import type {ProgramMainData} from "ollieos/types";
import type {SpawnResult} from "ollieos/kernel";

import {useCallback, useMemo, useRef} from "react";
import {LayoutPanelLeft} from "lucide-react";

export const StartButton = ({main_data}: {main_data: ProgramMainData}) => {
    const {kernel, shell} = main_data;

    const proc_mgr = useMemo(() => kernel.get_process_manager(), [kernel]);
    const start_menu_process = useRef<SpawnResult | null>(null);

    const on_click = useCallback(
        () => {
            // TODO: once dead flag added to process, remove this bypass
            if (start_menu_process.current !== null && proc_mgr.list_pids().includes(start_menu_process.current.process.pid)) {
                start_menu_process.current.process.kill(0);
                start_menu_process.current = null;
            } else {
                start_menu_process.current = kernel.spawn("sl_startmenu", [], shell);
            }
        },
        [kernel]
    );

    return (
        <button className="cursor-pointer px-3 py-1 aspect-square hover:bg-gray-700 flex items-center justify-center" onClick={on_click} title="Open start menu">
            <LayoutPanelLeft className="w-6 h-6" />
        </button>
    );
}
