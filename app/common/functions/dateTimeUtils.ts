import { format } from "date-fns";

export const getDateString = (date: Date): string => {
    return format(new Date(date), "EEEE, dd MMMM yyyy");
};

export const getTimeString = (time: Date): string => {
    // Ensure the time is in the correct format
    const date = `${new Date().toISOString().slice(0, 10)}T${time}`;
    return format(new Date(date), "HH:mm");
};