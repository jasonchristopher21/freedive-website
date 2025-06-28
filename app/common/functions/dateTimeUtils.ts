import { format } from "date-fns";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateString = (date: Date): string => {
    return format(new Date(date), "EEEE, dd MMMM yyyy");
};

export const getTimeString = (time: Date): string => {
    // Ensure the time is in the correct format
    const date = `${new Date().toISOString().slice(0, 10)}T${time}`;
    return dayjs.utc(date).tz("Asia/Singapore").format("HH:mm");
};