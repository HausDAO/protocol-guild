export function convertSeconds(secondsActive: number) {
  const d = Math.floor(secondsActive / (3600 * 24));
  const h = Math.floor((secondsActive % (3600 * 24)) / 3600);
  const m = Math.floor((secondsActive % 3600) / 60);
  const s = Math.floor(secondsActive % 60);


  return `${d}d ${h}h ${m}m ${s}s`;

}
