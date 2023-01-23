export function convertSeconds(secondsActive: number) {
  const dateObj = new Date(secondsActive * 1000);
  const days = dateObj.getUTCDay();
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();

  //   TODO: Finish up styling and a good format for time

  const timeActive =
    days.toString().padStart(2, "0") +
    ":" +
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");
  console.log(timeActive);
  return timeActive;
  // return {
  //     days,
  //     hours,
  //     minutes,
  //     seconds
  // }
}
