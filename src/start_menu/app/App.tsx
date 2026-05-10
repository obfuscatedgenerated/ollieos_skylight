import type {PrivilegedProgramMainData} from "ollieos/types";

import {ProgramList} from "./ProgramList";
import {SideOptions} from "./SideOptions";

export const App = ({main_data, css_height}: {main_data: PrivilegedProgramMainData, css_height: string}) => {
    return (
        <main className="bg-background text-foreground flex flex-row-reverse p-2 font-sans gap-2" style={{height: css_height}}>
            <ProgramList main_data={main_data} />
            <SideOptions main_data={main_data} />
        </main>
    );
}
