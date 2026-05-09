import type {ProgramMainData} from "ollieos/types";

export const App = ({main_data, css_height}: {main_data: ProgramMainData, css_height: string}) => {
    return (
        <main className="bg-background text-foreground flex p-2 font-sans" style={{height: css_height}}>
            I AM A START MENU!!!
        </main>
    );
}
