module.exports = () => {
  const today = new Date();
  const day = today.getUTCDate();
  const month = today.getUTCMonth();
  const year = today.getUTCFullYear();
  const hours = today.getUTCHours() + 5;
  const minutes = today.getUTCMinutes();
  const seconds = today.getUTCSeconds();
  const miliseconds = today.getUTCMilliseconds();

  return {
    date: new Date(
      Date.UTC(year, month, day, hours, minutes, seconds, miliseconds),
    ),
    month: month + 1,
    year,
    day,
    hours,
    minutes,
    seconds,
    miliseconds,
  };
};
