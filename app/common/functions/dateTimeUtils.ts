import { format } from "date-fns";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateString = (date: string): string => {
    
    return format(new Date(date), "EEEE, dd MMMM yyyy");
};

export const getTimeString = (time: string): string => {
    const date = time
    return dayjs.utc(date).format("HH:mm");
};