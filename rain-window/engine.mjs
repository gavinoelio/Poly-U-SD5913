// Pure rules shared by the interface and Node's built-in test runner.
export const YEAR = 2025;
export const DEFAULTS = Object.freeze({month: 9, day: 24, limit: 5});

export function validateArchive(payload) {
  if (payload?.timezone !== 'Asia/Hong_Kong' || payload?.daily_units?.rain_sum !== 'mm') {
    throw new Error('Expected rainfall in mm using Hong Kong local dates.');
  }
  const times = payload?.daily?.time;
  const values = payload?.daily?.rain_sum;
  if (!Array.isArray(times) || !Array.isArray(values) || times.length !== 365 || values.length !== 365) {
    throw new Error('The archive needs all 365 daily records.');
  }
  return times.map((iso, index) => {
    const expected = new Date(Date.UTC(YEAR, 0, index + 1)).toISOString().slice(0, 10);
    const rain = values[index];
    if (iso !== expected || typeof rain !== 'number' || !Number.isFinite(rain) || rain < 0) {
      throw new Error(`Invalid date or rainfall at record ${index + 1}.`);
    }
    return Object.freeze({iso, month: Number(iso.slice(5, 7)), day: Number(iso.slice(8)), rain});
  });
}

export function monthDays(archive, month) {
  return archive.filter(record => record.month === month);
}

export function withinLimit(rain, limit) {
  return rain <= limit;
}

// Search strictly after the selected date, wrap once, and prefer another day.
export function nextMatch(days, selectedDay, limit) {
  const start = days.findIndex(record => record.day === selectedDay);
  if (start < 0 || !Number.isFinite(limit) || limit < 0) return null;
  for (let step = 1; step <= days.length; step++) {
    const candidate = days[(start + step) % days.length];
    if (withinLimit(candidate.rain, limit)) return candidate;
  }
  return null;
}
