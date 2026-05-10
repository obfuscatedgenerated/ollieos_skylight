import {JSX} from "react";
import type {PrivilegedProgramMainData} from "ollieos/types";

export type TrayIcon = (props: {main_data: PrivilegedProgramMainData}) => JSX.Element;

export const TrayIcons = ({icons, main_data}: {icons: TrayIcon[], main_data: PrivilegedProgramMainData}) => {
    return (
        <div className="ml-auto flex items-center gap-2 h-full p-2">
            {icons.map((Icon, i) => <Icon key={i} main_data={main_data} />)}
        </div>
    );
}
