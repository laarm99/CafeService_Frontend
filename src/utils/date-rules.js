import dayjs from "dayjs";

// La semana de nomina corta los lunes: la fecha mas antigua permitida es el lunes de la semana actual.
export const earliestAllowedDate = () => {
    const today = dayjs().startOf("day");
    const offset = (today.day() + 6) % 7;
    return today.subtract(offset, "day");
};

export const disabledBeforeCutoff = (current) =>
    !!current && current.isBefore(earliestAllowedDate(), "day");

export const disabledBeforeDate = (limit, inclusive = true) => (current) => {
    if (!current) return false;
    if (disabledBeforeCutoff(current)) return true;
    if (!limit) return false;
    const base = dayjs(limit);
    return inclusive ? current.isBefore(base, "day") : !current.isAfter(base, "day");
};

export const disabledFutureAndCutoff = (current) =>
    !!current && (disabledBeforeCutoff(current) || current.isAfter(dayjs(), "day"));
