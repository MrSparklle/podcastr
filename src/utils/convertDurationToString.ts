export function convertDurationToString(duration: number): string {
  // const hours = Math.floor(duration / (60 * 60));
  // const minutes = Math.floor((duration % 3600) / 60);
  // const seconds = duration % 60;

  // const finalResult = [hours, minutes, seconds]
  //   .map((unit) => String(unit).padStart(2, '0'))
  //   .join(':');

  const finalResult = new Date(duration * 1000).toISOString().substr(11, 8);

  return finalResult;
}
