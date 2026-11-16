import {useEffect, useMemo, useState} from "react";
import {Globe, Loader2, Plug} from "lucide-react";

import type {ProgramMainData} from "ollieos/types";
import type {Kernel} from "ollieos/kernel";

export const NetworkTrayIcon = ({main_data}: {main_data: ProgramMainData<Kernel>}) => {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);

    const {process, kernel} = main_data;
    const network = useMemo(() => kernel.get_network_manager(), [kernel]);

    // get initial state (doesn't connect, so never triggers the local network prompt)
    useEffect(() => {
        network?.is_up().then(setConnected);
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

    if (!network) {
        return <></>;
    }

    // explicit opt in: waiting lets the manager connect, and the prompt comes from this click
    const connect = async () => {
        if (connected || connecting) {
            return;
        }

        setConnecting(true);
        try {
            setConnected(await network.is_up(true));
        } finally {
            setConnecting(false);
        }
    };

    if (connected) {
        return <Globe className="text-emerald-500 w-6 h-6" aria-label="Online" />;
    }

    return (
        <button type="button" onClick={connect} title="Connect to porter" aria-label={connecting ? "Connecting" : "Offline, click to connect"}>
            {connecting
                ? <Loader2 className="text-amber-500 w-6 h-6 animate-spin" />
                : <Plug className="text-red-500 w-6 h-6" />}
        </button>
    );
}
