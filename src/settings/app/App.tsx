import type {ProgramMainData} from "ollieos/types";
import {useCallback, useEffect, useRef, useState} from "react";
import {CircleAlert} from "lucide-react";

const SettingsGroup = ({title, children}: {title: string, children: React.ReactNode}) => {
    return (
        <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="flex flex-col gap-1 m-2 flex-wrap items-start justify-start max-h-48 overflow-auto">
                {children}
            </div>
        </div>
    );
}

const SettingButton = ({label, on_click}: {label: string, on_click: () => void}) => {
    return (
        <button className="cursor-pointer bg-primary text-white rounded px-3 py-1 transition-colors hover:bg-primary/80" onClick={on_click}>
            {label}
        </button>
    );
}

const ErrorMessage = ({message, visible}: {message: string, visible: boolean}) => {
    return (
        <div className={`transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"} bg-red-500 text-white px-4 py-2 rounded`}>
            <CircleAlert className="w-5 h-5 inline-block mr-4" />
            {message}
        </div>
    );
}

interface ErrorState {
    message: string;
    id: number;
    visible: boolean;
}

const ERROR_DISPLAY_DURATION = 5000;
const ERROR_GARBAGE_COLLECT_DURATION = 6000;

export const App = ({main_data, css_height}: {main_data: ProgramMainData, css_height: string}) => {
    const {kernel, process} = main_data;

    const [errors, setErrors] = useState<ErrorState[]>([]);
    const error_id_ref = useRef(0);

    const show_error = useCallback(
        (message: string) => {
            const id = error_id_ref.current++;
            console.error(`Settings error ${id}: ${message}`);
            const error: ErrorState = {message, id, visible: true};
            setErrors(errors => [...errors, error]);

            // make no longer visible after duration
            setTimeout(() => {
                setErrors(errors => errors.map(e => e.id === id ? {...e, visible: false} : e));
            }, ERROR_DISPLAY_DURATION);

            // remove from state after garbage collect duration
            setTimeout(() => {
                setErrors(errors => errors.filter(e => e.id !== id));
            }, ERROR_GARBAGE_COLLECT_DURATION);
        },
        []
    );

    const reload_wallpaper = useCallback(
        () => {
            const ipc = kernel.get_ipc();
            const channel_id = ipc.create_channel("sl_desktop");

            if (!channel_id) {
                show_error("Failed to create IPC channel. Is desktop service running?");
                return;
            }

            ipc.channel_send(channel_id, "reload");
        },
        [kernel]
    );

    return (
        <main className="bg-background text-foreground flex flex-col p-2 font-sans gap-2" style={{height: css_height}}>
            <h1 className="text-2xl font-bold">Settings</h1>

            <div className="flex flex-col gap-1 m-2">
                <SettingsGroup title="Desktop">
                    <SettingButton label="Reload wallpaper" on_click={reload_wallpaper} />
                    {/*TODO: file picker*/}
                </SettingsGroup>
            </div>

            <div className="absolute bottom-0 right-4 transform flex flex-col items-center gap-2 max-h-9/10 overflow-clip">
                {errors.map(error => (
                    <ErrorMessage key={error.id} message={error.message} visible={error.visible} />
                ))}
            </div>
        </main>
    );
}
