# /// script
# requires-python = ">=3.10"
# dependencies = ["matplotlib==3.10.6"]
# ///
"""Read the committed snapshot and draw a twelve-month rainfall calendar."""
import calendar
import csv
from datetime import date, timedelta
import json
import math
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

HERE = Path(__file__).resolve().parent
DATA = HERE / "data" / "hong-kong-rain-2025.json"
OUT = HERE / "out"
PAPER, INK, MUTED = "#f6f3eb", "#163c3c", "#536a68"
ACCENT = "#b45d25"
COLORS = ["#e4e9e5", "#cee7df", "#a0d5c7", "#64b5a6", "#348e83", "#14645f", "#073d3d"]
LABELS = ["0", ">0 to <1", "1 to <5", "5 to <15", "15 to <30", "30 to <60", "60+"]


def load_daily(path):
    """Reject missing dates and invalid rain instead of showing false dry days."""
    payload = json.loads(path.read_bytes())
    if payload.get("daily_units", {}).get("rain_sum") != "mm":
        raise ValueError("Expected rain_sum in millimetres.")
    if payload.get("timezone") != "Asia/Hong_Kong":
        raise ValueError("Expected Hong Kong local dates.")
    times, values = payload["daily"]["time"], payload["daily"]["rain_sum"]
    expected = [(date(2025, 1, 1) + timedelta(days=i)).isoformat() for i in range(365)]
    if times != expected or len(values) != 365:
        raise ValueError("Expected 365 ordered dates with no gaps or duplicates.")
    result = {}
    for day, value in zip(times, values):
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0:
            raise ValueError(f"Invalid or missing rain on {day}: {value!r}")
        result[date.fromisoformat(day)] = float(value)
    return result


def rain_color(value):
    """Explicit bands retain a separate colour for zero."""
    if value == 0:
        return 0
    for index, upper in enumerate((1, 5, 15, 30, 60), start=1):
        if value < upper:
            return index
    return 6



def export_monthly_summary(daily, path):
    """Export exact monthly statistics, using the same >=1 mm wet-day rule."""
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.writer(stream)
        writer.writerow(["month", "total_rain_mm", "wet_days_ge_1mm",
                         "wettest_date", "wettest_rain_mm"])
        for month in range(1, 13):
            days = {day: value for day, value in daily.items() if day.month == month}
            wettest = max(days, key=days.get)
            writer.writerow([f"2025-{month:02d}", f"{sum(days.values()):.1f}",
                             sum(value >= 1 for value in days.values()),
                             wettest.isoformat(), f"{days[wettest]:.1f}"])


def main():
    daily = load_daily(DATA)
    total = sum(daily.values())
    wet_days = sum(value >= 1 for value in daily.values())
    wettest = max(daily, key=daily.get)
    summer = sum(value for day, value in daily.items() if 5 <= day.month <= 9)
    share = summer / total if total else 0
    plt.rcParams.update({"font.family": "DejaVu Sans", "svg.fonttype": "none"})
    fig = plt.figure(figsize=(14, 13), facecolor=PAPER)
    fig.text(.055, .96, "HONG KONG / 2025", fontsize=12, weight="bold", color=MUTED)
    fig.text(.055, .914, "A year, measured in rain", fontsize=32, weight="bold", color=INK)
    fig.text(.055, .88, "One square, one day. Darker squares mean more rain.", fontsize=13, color=MUTED)
    stats = [(f"{total:,.1f} mm", "TOTAL MODELLED RAIN"), (str(wet_days), "DAYS WITH AT LEAST 1 mm"),
             (f"{share:.0%}", "OF RAIN FALLING MAY–SEP")]
    for x, (value, label) in zip((.055, .37, .69), stats):
        fig.text(x, .827, value, fontsize=25, weight="bold", color=INK)
        fig.text(x, .805, label, fontsize=9, color=MUTED)
    grid = fig.add_gridspec(3, 4, left=.055, right=.955, bottom=.19, top=.75, hspace=.45, wspace=.24)
    cal = calendar.Calendar(firstweekday=0)
    for month in range(1, 13):
        ax = fig.add_subplot(grid[(month - 1) // 4, (month - 1) % 4])
        ax.set_xlim(0, 7)
        ax.set_ylim(6, -1.2)
        ax.set_aspect("equal")
        ax.axis("off")
        monthly = sum(value for day, value in daily.items() if day.month == month)
        ax.text(0, -1.03, calendar.month_abbr[month].upper(), fontsize=12, weight="bold", color=INK)
        ax.text(7, -1.03, f"{monthly:.1f} mm", ha="right", fontsize=9, color=MUTED)
        for col, label in enumerate(("M", "T", "W", "T", "F", "S", "S")):
            ax.text(col + .5, -.42, label, ha="center", fontsize=8, color=MUTED)
        for row, week in enumerate(cal.monthdayscalendar(2025, month)):
            for col, number in enumerate(week):
                if number == 0:
                    continue
                day = date(2025, month, number)
                band = rain_color(daily[day])
                ax.add_patch(Rectangle((col + .04, row + .04), .92, .92, facecolor=COLORS[band], linewidth=0))
                if day == wettest:
                    ax.add_patch(Rectangle((col + .04, row + .04), .92, .92,
                                           fill=False, edgecolor=ACCENT, linewidth=2))
                ax.text(col + .5, row + .52, str(number), va="center", ha="center", fontsize=8,
                        color="white" if band >= 4 else INK)
    fig.text(.055, .139, "DAILY RAIN / mm", fontsize=10, weight="bold", color=INK)
    for i, (color, label) in enumerate(zip(COLORS, LABELS)):
        x = .055 + i * .13
        fig.add_artist(Rectangle((x, .102), .024, .017, transform=fig.transFigure, facecolor=color, linewidth=0))
        fig.text(x + .03, .105, label, fontsize=9, color=INK)
    fig.add_artist(Rectangle((.055, .157), .014, .014, transform=fig.transFigure,
                             fill=False, edgecolor=ACCENT, linewidth=2))
    fig.text(.076, .159, "Outlined square: wettest day of the year", fontsize=9, color=INK)
    fig.text(.055, .069, f"Wettest modelled day: {wettest:%d %b} · {daily[wettest]:.1f} mm.  Blank spaces fall outside the month.", fontsize=10, color=INK)
    fig.text(.055, .041, "Source: Open-Meteo / ERA5 · Hong Kong local dates · Location requested: 22.3193°N, 114.1694°E", fontsize=9, color=MUTED)
    fig.text(.055, .022, "Gridded reanalysis, not a station record. Colour bands compress differences; daily totals hide when rain fell within a day.", fontsize=9, color=MUTED)
    OUT.mkdir(exist_ok=True)
    export_monthly_summary(daily, OUT / "rainfall-monthly-summary-2025.csv")
    for extension in ("png", "svg"):
        fig.savefig(OUT / f"rainfall-calendar-2025.{extension}", dpi=180, facecolor=PAPER)
    plt.close(fig)
    print(f"Validated {len(daily)} days; total {total:.1f} mm; {wet_days} days >=1 mm; May–Sep share {share:.2%}.")
    print(f"Wettest: {wettest}, {daily[wettest]:.1f} mm. Saved PNG, SVG and monthly summary CSV in {OUT}")


if __name__ == "__main__":
    main()
