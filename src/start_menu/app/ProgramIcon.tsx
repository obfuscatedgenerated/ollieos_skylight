import type {AbstractFileSystem} from "ollieos/kernel/filesystem";

import {use, useMemo} from "react";
import {AppWindow} from "lucide-react";

interface ProgramIconProps {
    fs: AbstractFileSystem;
    icon_path: string | undefined;
    className?: string;
    alt?: string;
}

export const DefaultProgramIcon = ({className = ""}: {className?: string}) => {
    return <AppWindow className={className} />;
}

export const ProgramIcon = ({fs, icon_path, className = "", alt = ""}: ProgramIconProps) => {
    // memoise the file content promise
    const icon_content_promise: Promise<null | Uint8Array> = useMemo(() => {
        if (!icon_path || (!icon_path.endsWith(".svg") && !icon_path.endsWith(".png"))) {
            return Promise.resolve(null);
        }

        return fs.read_file(icon_path, true) as Promise<Uint8Array>;
    }, [fs, icon_path]);

    const icon_content = use(icon_content_promise);
    const icon_content_blob_url = useMemo(() => {
        if (!icon_content) {
            return null;
        }

        const blob = new Blob([icon_content as Uint8Array<ArrayBuffer>], {type: icon_path!.endsWith(".svg") ? "image/svg+xml" : "image/png"});
        return URL.createObjectURL(blob);
    }, [icon_content, icon_path]);

    if (!icon_content_blob_url) {
        return <DefaultProgramIcon className={className} />;
    }

    return <img src={icon_content_blob_url} alt={alt} className={className} />;
}

// TODO: some sort of caching scheme, since start menu gets restarted each time, so all these get reloaded? or maybe it should just show and hide instead of spawning and killing
