import type {AbstractFileSystem} from "ollieos/kernel/filesystem";

import {use} from "react";
import {AppWindow} from "lucide-react";

interface ProgramIconProps {
    fs: AbstractFileSystem;
    icon_path: string | undefined;
    className?: string;
    alt?: string;
}

const ICON_TYPES: Record<string, string> = {
    ".svg": "image/svg+xml",
    ".png": "image/png",
};

// a component that suspends before it mounts keeps no state, so a promise made inside it is remade on every retry and never settles
// so each icon's promise lives here instead, made once per filesystem and path for as long as this program runs
const icon_url_promises = new WeakMap<AbstractFileSystem, Map<string, Promise<string | null>>>();

// a data url is just a string, so it goes with the rest of the program. a blob url would stay in the browser until revoked
const to_data_url = (bytes: Uint8Array, mime_type: string): string => {
    let binary = "";
    const chunk_size = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunk_size) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk_size));
    }

    return `data:${mime_type};base64,${btoa(binary)}`;
};

const load_icon_url = async (fs: AbstractFileSystem, icon_path: string): Promise<string | null> => {
    const extension = Object.keys(ICON_TYPES).find((ext) => icon_path.endsWith(ext));
    if (!extension) {
        return null;
    }

    try {
        if (!(await fs.exists(icon_path))) {
            return null;
        }

        const content = await fs.read_file(icon_path, true) as Uint8Array;
        return to_data_url(content, ICON_TYPES[extension]);
    } catch (e) {
        console.warn(`Failed to load program icon ${icon_path}:`, e);
        return null;
    }
};

const get_icon_url_promise = (fs: AbstractFileSystem, icon_path: string): Promise<string | null> => {
    let by_path = icon_url_promises.get(fs);
    if (!by_path) {
        by_path = new Map();
        icon_url_promises.set(fs, by_path);
    }

    let promise = by_path.get(icon_path);
    if (!promise) {
        promise = load_icon_url(fs, icon_path);
        by_path.set(icon_path, promise);
    }

    return promise;
};

export const DefaultProgramIcon = ({className = ""}: {className?: string}) => {
    return <AppWindow className={className} />;
}

export const ProgramIcon = ({fs, icon_path, className = "", alt = ""}: ProgramIconProps) => {
    const icon_url = icon_path ? use(get_icon_url_promise(fs, icon_path)) : null;

    if (!icon_url) {
        return <DefaultProgramIcon className={className} />;
    }

    return <img src={icon_url} alt={alt} className={className} />;
}

// TODO: the cache only lasts while this program runs, and the start menu gets restarted each time, so every open reloads the icons. maybe it should show and hide instead of spawning and killing