import type {PrivilegedProgramMainData} from "ollieos/types";
import {useCallback, useEffect, useState} from "react";

export const App = ({main_data}: {main_data: PrivilegedProgramMainData}) => {
    const {kernel, process} = main_data;

    // load desktop from ~/.skylight/desktop.png, falling back to blank with bg color if it doesn't exist
    const [src, setSrc] = useState("");
    const load_desktop_image = useCallback(() => {
        const fs = kernel.get_fs();
        fs.read_file(fs.absolute("~/.skylight/desktop.png"), true).then((data: Uint8Array<ArrayBuffer>) => {
            const blob = new Blob([data], {type: "image/png"});
            const url = URL.createObjectURL(blob);
            setSrc(url);
        });
    }, []);

    useEffect(() => {
        load_desktop_image();
    }, [load_desktop_image]);

    // reload image on ipc signal
    useEffect(() => {
        const ipc = kernel.get_ipc();
        // TODO: switch to lodestar
        ipc.service_register("sl_desktop", process.pid, async (channel_id) => {
            ipc.channel_listen(channel_id, process.pid, async (message) => {
                if (message.data === "reload") {
                    load_desktop_image();
                }
            });
        });

        return () => {
            ipc.service_unregister("sl_desktop");
        };
    }, [kernel, load_desktop_image]);

    if (!src) {
        return <div className="w-screen h-screen bg-background-2" />;
    }

    return (
        <img aria-hidden="true" draggable="false" src={src} className="w-screen h-screen" />
    );
}
