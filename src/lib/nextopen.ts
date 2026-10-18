/** Next open day of the show home (Thu 17:00–19:30, Sat/Sun 11:00–16:00). Used at build time and again in the browser. */
const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function nextOpen(now: Date = new Date()): string {
  for (let i = 0; i < 8; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const dow = d.getDay();
    const close = dow === 4 ? 19.5 : dow === 0 || dow === 6 ? 16 : 0;
    const hour = now.getHours() + now.getMinutes() / 60;
    if (!close || (i === 0 && hour >= close)) continue;
    const opens = dow === 4 ? 17 : 11;
    if (i === 0 && hour >= opens) return 'open now, until ' + (dow === 4 ? '7.30pm' : '4pm');
    const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : names[dow] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
    return when + ', ' + (dow === 4 ? '5pm' : '11am');
  }
  return 'Thursday, 5pm';
}
