import type {PrivilegedProgramMainData} from "ollieos/types";
import {LoaderCircle} from "lucide-react";

export const App = ({main_data}: {main_data: PrivilegedProgramMainData}) => {
    return (
        <div className="w-screen h-screen bg-primary flex flex-col gap-4 items-center justify-center">
            <LoaderCircle className="animate-spin w-16 h-16 text-white" />

            <span className="text-white text-lg">
                {main_data.args.includes("-r") ? "Restarting..." : "Shutting down..."}
            </span>
        </div>
    );
}
