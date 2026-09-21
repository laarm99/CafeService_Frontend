export const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end - start;

    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};