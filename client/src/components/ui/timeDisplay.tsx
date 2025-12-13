import React, { useEffect, useState } from "react";
import { finished } from "stream";
import Timer from "./timer";

interface TimeDisplayProps {
    statusSignal : (data: string) => void;
    end_time : string;
}

export default function TimeDisplay({ statusSignal, end_time } : TimeDisplayProps) {
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        function updateStatus(s : string) {
            statusSignal(s);
        }

        const getTimeRemaining = setInterval(() => {
            const [endHours, endMins, endSec] = end_time
            .split(":")
            .map(Number);
            
            const d = new Date();
            const end_time_serial = endHours * 60 * 60 + endMins * 60 + endSec;
            const cur_time =
            d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
            
            const remaining_time = end_time_serial - cur_time;
            if (remaining_time <= 0) {
                updateStatus("finished");
                clearInterval(getTimeRemaining);
            }

            setTimeRemaining(remaining_time);
        }, 1000);

        return () => clearInterval(getTimeRemaining);
    }, [end_time, timeRemaining]);

    useEffect(() => {
        console.log("end time changed to ", end_time);
    }, [end_time])

    return (
        <div>
            <h1>Timer</h1>
            <div className="time left">
                {Timer(timeRemaining)}
            </div>
            <div>
                
            </div>
        </div>
    );
}