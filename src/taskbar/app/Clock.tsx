import {useEffect, useState} from "react";

export const Clock = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const [date, setDate] = useState("01/01/1970");

    useEffect(() => {
        const update_time = () => {
            const now = new Date();

            setHours(now.getHours());
            setMinutes(now.getMinutes());
            setDate(`${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`);
        };

        update_time();

        // TODO: is this the best way? should the interval sync with irl seconds?
        const interval = setInterval(update_time, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="px-3 py-1 flex flex-col items-center">
            {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}
            <div className="text-xs">{date}</div>
        </div>
    );
}
