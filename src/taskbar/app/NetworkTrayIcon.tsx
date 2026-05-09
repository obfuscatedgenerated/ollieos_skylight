import {useEffect, useMemo, useState} from "react";
import {Globe, Plug} from "lucide-react";

import type {ProgramMainData} from "ollieos/types";

export const NetworkTrayIcon = ({main_data}: {main_data: ProgramMainData}) => {
    const [connected, setConnected] = useState(false);

    const {process, kernel} = main_data;
    const network = useMemo(() => kernel.get_network_manager(), [kernel]);

    // get initial state
    useEffect(() => {
        network.is_up().then(setConnected);
    }, [network]);

    // listen for network state changes
    useEffect(() => {
        const change_listener = (up: boolean) => {
            setConnected(up);
        }

        process.network_add_manager_listener("state_change", change_listener);

        return () => {
            process.network_remove_manager_listener("state_change", change_listener);
        };
    }, [process]);

    return connected ? <Globe className="text-emerald-500 w-6 h-6" aria-label="Online" /> : <Plug className="text-red-500 w-6 h-6" aria-label="Offline" />;
}
