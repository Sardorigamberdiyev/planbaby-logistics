const withDate = date => {
  const thatDate = new Date(date);
  const thatYear = thatDate.getUTCFullYear();
  const thatMonth = thatDate.getUTCMonth() + 1;
  const thatDay = thatDate.getUTCDate();
  const thatHours = thatDate.getUTCHours();
  const thatMinutes = thatDate.getUTCMinutes();

  const month = thatMonth.toString().length < 2 ? `0${thatMonth}` : thatMonth;
  const day = thatDay.toString().length < 2 ? `0${thatDay}` : thatDay;
  const hours = thatHours.toString().length < 2 ? `0${thatHours}` : thatHours;
  const minutes =
    thatMinutes.toString().length < 2 ? `0${thatMinutes}` : thatMinutes;

  return `${day}.${month}.${thatYear}, ${hours}:${minutes}`;
};

export default withDate;
