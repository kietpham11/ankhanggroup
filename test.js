const parseDateToTime = (dateStr) => {
  if (!dateStr) return 0;
  const parts = dateStr.split(' ')[0].split('/');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
  }
  return 0;
};
const candTime = parseDateToTime('16/05/2025');
const dateFrom = '2025-05-16';
const dateTo = '2025-05-16';
const fromTime = new Date(dateFrom).getTime();
const toTime = new Date(dateTo).getTime() + 86399999;
console.log('candTime:', candTime, new Date(candTime).toISOString());
console.log('fromTime:', fromTime, new Date(fromTime).toISOString());
console.log('toTime:', toTime, new Date(toTime).toISOString());
console.log('matches:', !(candTime < fromTime) && !(candTime > toTime));
