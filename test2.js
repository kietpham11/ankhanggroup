const parseDateToTime = (dateStr) => {
  if (!dateStr) return 0;
  const parts = dateStr.split(' ')[0].split('/');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
  }
  return 0;
};
const filter = (dateFrom, dateTo, dateStr) => {
  const t = parseDateToTime(dateStr);
  if (t > 0) {
    if (dateFrom && t < new Date(dateFrom).getTime()) return false;
    if (dateTo && t > new Date(dateTo).getTime() + 86399999) return false;
  }
  return true;
}
console.log('10/05/2025 from 10/05/2025 to 10/05/2025:', filter('2025-05-10', '2025-05-10', '10/05/2025'));
console.log('04/06/2026 14:30 from 04/06/2026 to 04/06/2026:', filter('2026-06-04', '2026-06-04', '04/06/2026 14:30'));
