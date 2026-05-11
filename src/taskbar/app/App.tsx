import type {PrivilegedProgramMainData} from "ollieos/types";

import {StartButton} from "./StartButton";
import {TrayIcons} from "./TrayIcons";

import {NetworkTrayIcon} from "./NetworkTrayIcon";
import {Clock} from "./Clock";

export const App = ({main_data, css_height}: {main_data: PrivilegedProgramMainData, css_height: string}) => {
    return (
        <main className="bg-background/80 backdrop-blur-xl text-foreground flex items-center font-sans" style={{height: css_height}}>
            <StartButton main_data={main_data} />
            <TrayIcons main_data={main_data} icons={[NetworkTrayIcon]} />
            <Clock />
        </main>
    );
}
