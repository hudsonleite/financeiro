import { WEEKDAYS } from "../../constants/calendar.js";
import { toDateKey } from "../../utils/date.js";
import { sumEntries } from "../../utils/entries.js";
import { formatCurrency } from "../../utils/money.js";

export function CalendarGrid({ currentDate, entriesForDate, onSelectDate }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    days.push(<div className="day-cell muted" key={`empty-${i}`} />);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const dateKey = toDateKey(date);
    const dailyEntries = entriesForDate(dateKey);
    const dailyTotal = sumEntries(dailyEntries);
    const isToday = dateKey === toDateKey(new Date());

    days.push(
      <button
        className={`day-cell ${isToday ? "today" : ""}`}
        key={dateKey}
        onClick={() => onSelectDate(dateKey)}
      >
        <span className="day-number">{day}</span>
        <span className="day-total">{dailyEntries.length ? formatCurrency(dailyTotal) : ""}</span>
        <span className="day-count">{dailyEntries.length ? `${dailyEntries.length} lanc.` : ""}</span>
      </button>,
    );
  }

  return (
    <>
      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">{days}</div>
    </>
  );
}
