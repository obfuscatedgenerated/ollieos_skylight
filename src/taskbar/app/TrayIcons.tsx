import {JSX} from "react";
import type {ProgramMainData} from "ollieos/types";
import type {Kernel} from "ollieos/kernel";

export type TrayIcon = (props: {main_data: ProgramMainData<Kernel>}) => JSX.Element;

export const TrayIcons = ({icons, main_data}: {icons: TrayIcon[], main_data: ProgramMainData<Kernel>}) => {
    return (
        <div className="ml-auto flex items-center gap-2 h-full p-2">
            {icons.map((Icon, i) => <Icon key={i} main_data={main_data} />)}
        </div>
    );
}
