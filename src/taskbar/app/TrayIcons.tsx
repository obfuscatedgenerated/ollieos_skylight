import {JSX} from "react";
import type {ProgramMainData} from "ollieos/types";

export type TrayIcon = (props: {main_data: ProgramMainData}) => JSX.Element;

export const TrayIcons = ({icons, main_data}: {icons: TrayIcon[], main_data: ProgramMainData}) => {
    return (
        <div className="ml-auto flex items-center gap-2 h-full p-2">
            {icons.map((Icon, i) => <Icon key={i} main_data={main_data} />)}
        </div>
    );
}
