import type {ProgramMainData} from "ollieos/types";
import type {SpawnResult} from "ollieos/kernel";

import {useCallback, useRef} from "react";
import {LayoutPanelLeft} from "lucide-react";

export const StartButton = ({main_data}: {main_data: ProgramMainData}) => {
    const {kernel} = main_data;

    const start_menu_process = useRef<SpawnResult | null>(null);

    const on_click = useCallback(
        () => {
            if (start_menu_process.current !== null) {
                start_menu_process.current.process.kill(0);
                start_menu_process.current = null;
            } else {
                start_menu_process.current = kernel.spawn("sl_startmenu");
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
