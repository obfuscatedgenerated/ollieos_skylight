import type {PrivilegedProgramMainData} from "ollieos/types";
import {useEffect, useState} from "react";

export const App = ({main_data}: {main_data: PrivilegedProgramMainData}) => {
    // load desktop from /home/desktop.png, falling back to blank with bg color if it doesn't exist
    const [src, setSrc] = useState("");
    useEffect(() => {
        const fs = main_data.kernel.get_fs();
        fs.read_file("/home/desktop.png", true).then((data: Uint8Array<ArrayBuffer>) => {
            const blob = new Blob([data], {type: "image/png"});
            const url = URL.createObjectURL(blob);
            setSrc(url);
        });
    }, []);

    if (!src) {
        return <div className="w-screen h-screen bg-background-2" />;
    }

    return (
        <img aria-hidden="true" draggable="false" src={src} className="w-screen h-screen" />
    );
}
