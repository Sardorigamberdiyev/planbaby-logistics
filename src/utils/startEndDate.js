module.exports = (query = {}, isToday = false) => {
    const { 
        startYear: sy, 
        startMonth: sm, 
        startDay: sd, 
        endYear: ey, 
        endMonth: em, 
        endDay: ed 
    } = query;

    const today = new Date();

    const ty = today.getUTCFullYear();
    const tm = today.getUTCMonth();
    const td = today.getUTCDate();

    const startDate = new Date(Date.UTC(sy || ty, sm ? sm - 1 : tm, sd || 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(ey || ty, em ? em - 1 : tm, ed || td, 23, 59, 59, 999));
    
    const isFullDate = (sy && sm && sd && ey && em && ed) || isToday;

    return isFullDate ? { startDate, endDate, sy, sm, sd, ey, em, ed } : {};
}