import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateArchive, monthDays, withinLimit, nextMatch} from '../engine.js';

const payload = JSON.parse(readFileSync(new URL('../data/rainfall-2025.json', import.meta.url), 'utf8'));
const archive = validateArchive(payload);
const september = monthDays(archive, 9);

test('saved archive retains all dates, annual total and peak day', () => {
  assert.equal(archive.length, 365);
  assert.equal(archive[0].iso, '2025-01-01');
  assert.equal(archive.at(-1).iso, '2025-12-31');
  assert.equal(archive.reduce((n, day) => n + Math.round(day.rain * 10), 0), 18533);
  assert.equal(archive.reduce((peak, day) => day.rain > peak.rain ? day : peak).iso, '2025-09-24');
});
test('February and month transitions keep the right number of days', () => {
  assert.equal(monthDays(archive, 2).length, 28);
  assert.equal(monthDays(archive, 1).length, 31);
  assert.equal(september.length, 30);
});
test('a value exactly at the limit matches, including zero', () => {
  assert.equal(withinLimit(5, 5), true);
  assert.equal(withinLimit(0, 0), true);
  assert.equal(withinLimit(5.1, 5), false);
});
test('initial next-date action picks 26 September at 2.0 mm', () => {
  const found = nextMatch(september, 24, 5);
  assert.equal(found.iso, '2025-09-26');
  assert.equal(found.rain, 2);
});
test('search wraps to first match and repeated actions advance', () => {
  assert.equal(nextMatch(september, 30, 5).day, 1);
  const first = nextMatch(september, 1, 5);
  assert.equal(first.day, 2);
  assert.equal(nextMatch(september, first.day, 5).day, 3);
});
test('zero-rain September correctly reports no match', () => {
  assert.equal(nextMatch(september, 24, 0), null);
});
test('one matching date remains a stable result', () => {
  const days = [{day:1,rain:10}, {day:2,rain:0}, {day:3,rain:10}];
  assert.equal(nextMatch(days, 2, 0).day, 2);
});
test('invalid selections and invalid search thresholds do not throw', () => {
  assert.equal(nextMatch([], 1, 5), null);
  assert.equal(nextMatch(september, 31, 5), null);
  assert.equal(nextMatch(september, 1, -1), null);
  assert.equal(nextMatch(september, 1, NaN), null);
});
test('invalid data is rejected instead of becoming a false dry day', () => {
  for (const invalid of [null, -1, true, '0', Infinity, NaN]) {
    const altered = structuredClone(payload);
    altered.daily.rain_sum[0] = invalid;
    assert.throws(() => validateArchive(altered), /Invalid/);
  }
});
test('missing, duplicate and out-of-order dates, wrong units and timezone are rejected', () => {
  for (const alter of [
    p => p.daily.time.pop(),
    p => p.daily.rain_sum.pop(),
    p => p.daily.time[1] = p.daily.time[0],
    p => [p.daily.time[0],p.daily.time[1]] = [p.daily.time[1],p.daily.time[0]],
    p => p.daily_units.rain_sum = 'inch',
    p => p.timezone = 'UTC'
  ]) {
    const altered = structuredClone(payload);
    alter(altered);
    assert.throws(() => validateArchive(altered));
  }
});
