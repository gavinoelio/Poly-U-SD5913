import {YEAR, DEFAULTS, validateArchive, monthDays, withinLimit, nextMatch} from './engine.js';

const $ = id => document.getElementById(id);
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const state = {...DEFAULTS};
let archive = [];
let loading = false;
const number = value => Number.isInteger(value) ? String(value) : value.toFixed(1);
const dateLabel = record => `${record.day} ${monthNames[record.month - 1]}`;
const weekday = record => new Intl.DateTimeFormat('en-GB', {weekday:'long', timeZone:'UTC'}).format(new Date(`${record.iso}T12:00:00Z`));

function render(message) {
  const days = monthDays(archive, state.month);
  const chosen = days.find(record => record.day === state.day);
  const matches = days.filter(record => withinLimit(record.rain, state.limit));
  $('month').value = state.month;
  $('limit').value = state.limit;
  $('limit-output').textContent = `${number(state.limit)} mm`;
  $('limit').setAttribute('aria-valuetext', `${number(state.limit)} millimetres of daily rain`);
  $('month-title').textContent = monthNames[state.month - 1];
  $('match-count').textContent = matches.length;
  const calendar = $('calendar');
  calendar.replaceChildren();
  // JS Sunday=0 becomes Monday=0. Dates are explicitly UTC for stable alignment.
  const offset = (new Date(Date.UTC(YEAR, state.month - 1, 1)).getUTCDay() + 6) % 7;
  for (let i = 0; i < offset; i++) {
    const spacer = document.createElement('span');
    spacer.setAttribute('aria-hidden', 'true');
    calendar.append(spacer);
  }
  for (const record of days) {
    const match = withinLimit(record.rain, state.limit);
    const selected = record.day === state.day;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `day${match ? ' is-match' : ''}${selected ? ' is-selected' : ''}`;
    button.dataset.day = record.day;
    button.tabIndex = selected ? 0 : -1;
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', `${dateLabel(record)} ${YEAR}, ${record.rain.toFixed(1)} mm, ${match ? 'within' : 'above'} your limit`);
    const date = document.createElement('span');
    date.className = 'date-number';
    date.textContent = record.day;
    const rain = document.createElement('span');
    rain.className = 'rain-number';
    rain.textContent = `${number(record.rain)} mm`;
    button.append(date, rain);
    calendar.append(button);
  }
  const match = withinLimit(chosen.rain, state.limit);
  $('day-title').textContent = dateLabel(chosen);
  $('day-weekday').textContent = weekday(chosen).toUpperCase();
  $('rain-value').textContent = chosen.rain.toFixed(1);
  $('day-status').textContent = match ? 'Within your limit' : 'Above your limit';
  $('day-status').classList.toggle('is-match', match);
  const difference = Math.abs(chosen.rain - state.limit);
  $('comparison').textContent = difference === 0
    ? `Exactly at your ${number(state.limit)} mm limit. This date is included.`
    : `${difference.toFixed(1)} mm ${match ? 'below' : 'above'} your ${number(state.limit)} mm limit. ${match ? 'This date fits your choice.' : 'Try another date or adjust your limit.'}`;
  const max = Math.max(30, ...days.map(record => record.rain));
  $('rain-fill').style.width = `${chosen.rain / max * 100}%`;
  $('limit-marker').style.left = `${state.limit / max * 100}%`;
  $('meter-max').textContent = `${number(max)} mm · month scale`;
  $('feedback').textContent = message ?? `${dateLabel(chosen)}: ${chosen.rain.toFixed(1)} mm; ${match ? 'within' : 'above'} your ${number(state.limit)} mm limit. ${matches.length} of ${days.length} dates match.`;
}

$('month').addEventListener('change', event => {
  state.month = Number(event.target.value);
  state.day = Math.min(state.day, monthDays(archive, state.month).length);
  render();
});
$('limit').addEventListener('input', event => {
  state.limit = Number(event.target.value);
  render();
});
$('calendar').addEventListener('click', event => {
  const button = event.target.closest('button[data-day]');
  if (!button) return;
  state.day = Number(button.dataset.day);
  render();
  $('calendar').querySelector(`[data-day="${state.day}"]`).focus({preventScroll:true});
});
$('find-next').addEventListener('click', () => {
  const days = monthDays(archive, state.month);
  const found = nextMatch(days, state.day, state.limit);
  if (!found) {
    render(`No dates in ${monthNames[state.month - 1]} meet your ${number(state.limit)} mm limit. Raise the limit or choose another month.`);
    return;
  }
  const previous = state.day;
  state.day = found.day;
  const month = monthNames[state.month - 1];
  const lead = found.day === previous ? `This is the only matching date in ${month}.`
    : found.day < previous ? `Wrapped to the start of ${month}; the search stays in this month.`
    : `Next match in ${month}.`;
  render(`${lead} ${dateLabel(found)}: ${found.rain.toFixed(1)} mm.`);
});
$('calendar').addEventListener('keydown', event => {
  const button = event.target.closest('button[data-day]');
  if (!button) return;
  const length = monthDays(archive, state.month).length;
  const moves = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7};
  if (!(event.key in moves) && event.key !== 'Home' && event.key !== 'End') return;
  event.preventDefault();
  state.day = event.key === 'Home' ? 1 : event.key === 'End' ? length
    : Math.max(1, Math.min(length, Number(button.dataset.day) + moves[event.key]));
  render();
  $('calendar').querySelector(`[data-day="${state.day}"]`).focus({preventScroll:true});
});
$('reset').addEventListener('click', () => {
  Object.assign(state, DEFAULTS);
  render('Reset to 24 September and a 5 mm limit. Choose a date or find a matching day.');
});

async function loadArchive() {
  if (loading) return;
  loading = true;
  $('retry').disabled = true;
  $('load-state').hidden = false;
  $('load-error').hidden = true;
  $('experience').hidden = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('./data/rainfall-2025.json', {signal: controller.signal, cache: 'no-store'});
    if (!response.ok) throw new Error(`The data file returned HTTP ${response.status}.`);
    archive = validateArchive(await response.json());
    render();
    $('experience').hidden = false;
  } catch (error) {
    const reason = error.name === 'AbortError' ? 'Loading took longer than 8 seconds.' : error.message;
    $('error-detail').textContent = `${reason} Serve this folder over HTTP as described in README.md, then try again.`;
    $('load-error').hidden = false;
  } finally {
    clearTimeout(timeout);
    loading = false;
    $('retry').disabled = false;
    $('load-state').hidden = true;
  }
}
$('retry').addEventListener('click', loadArchive);
loadArchive();
