import type {ProgramMainData} from "ollieos/types";
import {useCallback, useEffect, useState} from "react";
import {ArrowUp, Folder} from "lucide-react";
import {FileIcon} from "./FileIcon";

const EntryTile = ({path, directory = false, selected}: {path: string, directory?: boolean, selected: boolean}) => (
    <div
        className={`flex flex-col items-center justify-center gap-1 w-30 h-20 truncate p-2 ${selected ? "bg-accent" : "hover:bg-accent/50"} select-none`}
    >
        {directory ? <Folder className="w-10 h-10" /> : <FileIcon file={path} className="w-10 h-10" />}
        <span className="max-w-full truncate">{path}</span>
    </div>
);

const EntryListLine = ({path, directory = false, selected}: {path: string, directory?: boolean, selected: boolean}) => (
    <div
        className={`flex flex-row items-center justify-start gap-2 p-2 ${selected ? "bg-accent" : "hover:bg-accent/50"} select-none`}
    >
        {directory ? <Folder className="w-5 h-5" /> : <FileIcon file={path} className="w-5 h-5" />}
        <span className="max-w-full truncate">{path}</span>
    </div>
);

export const App = ({main_data}: {main_data: ProgramMainData}) => {
    const {kernel, process} = main_data;

    const [input_path, setInputPath] = useState(process.cwd);
    const [active_path, setActivePath] = useState(process.cwd);

    const update_path = useCallback(
        (new_path: string) => {
            process.cwd = new_path;
            setActivePath(new_path);
            setInputPath(new_path);
        },
        []
    );

    const visit_subdir = useCallback(
        (subdir: string) => {
            const fs = kernel.get_fs();
            const new_path = fs.absolute(fs.join(active_path, subdir));
            update_path(new_path);
        },
        [active_path, update_path]
    );

    const [dirs, setDirs] = useState<string[]>([]);
    const [files, setFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setDirs([]);
        setFiles([]);
        setLoading(true);

        const fs = kernel.get_fs();
        fs.list_dir(active_path, true).then(async (entries) => {
            console.log("entries", entries);
            // find the first non-directory and divide the entries into directories and files

            let found_non_dir = false;
            for (let i = 0; i < entries.length; i++) {
                // dirs first, so first file marks start of all files
                if (!(await fs.dir_exists(`${active_path}/${entries[i]}`))) {
                    found_non_dir = true;
                    setDirs(entries.slice(0, i));
                    setFiles(entries.slice(i));
                    break;
                }
            }

            // if non-file was not found, then all are directories
            if (!found_non_dir) {
                setDirs(entries);
                setFiles([]);
            }

            setLoading(false);
        });
    }, [active_path]);

    const [selected, setSelected] = useState<string | null>(null);

    const [list_view, setListView] = useState(false);
    // TODO: persist setting to ~/.skylight/settings/files.json etc

    return (
        <main className="bg-background text-foreground flex flex-col font-sans gap-2 h-full">
            <div className="flex flex-row gap-3 p-2">
                <button className="cursor-pointer" onClick={() => visit_subdir("..")} title="Up one directory">
                    <ArrowUp />
                </button>

                <input
                    className="w-full bg-white text-black px-2 py-1"
                    value={input_path}
                    onChange={(e) => setInputPath(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            update_path(input_path);
                        }
                    }}
                />

                <div className="h-full w-0.5 bg-accent mx-1" />

                <label className="text-nowrap flex flex-row items-center gap-2">
                    <input type="checkbox" checked={list_view} onChange={(e) => setListView(e.target.checked)} />
                    List view
                </label>
            </div>
            <div className={`p-2 m-2 flex gap-1 overflow-y-auto nice-scroll ${list_view ? "flex-col" : "flex-row flex-wrap"}`}>
                {loading && <p>Loading...</p>}

                {dirs.map((dir) => (
                    <button
                        onClick={() => setSelected(dir)}
                        onDoubleClick={() => visit_subdir(dir)}
                        key={dir}
                        aria-selected={selected === dir}
                        title={dir}
                    >
                        {list_view ? (
                            <EntryListLine path={dir} directory selected={selected === dir} />
                        ) : (
                            <EntryTile path={dir} directory selected={selected === dir} />
                        )}
                    </button>
                ))}
                {files.map((file) => (
                    <button
                        onClick={() => setSelected(file)}
                        // TODO: open file on double click (need associations)
                        key={file}
                        aria-selected={selected === file}
                        title={file}
                    >
                        {list_view ? (
                            <EntryListLine path={file} selected={selected === file} />
                        ) : (
                            <EntryTile path={file} selected={selected === file} />
                        )}
                    </button>
                ))}
            </div>
        </main>
    );
}

// TODO: right click context menu

