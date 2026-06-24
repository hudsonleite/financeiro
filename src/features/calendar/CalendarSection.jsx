import { MONTHS } from "../../constants/calendar.js";
import { IconButton } from "../../components/ui/IconButton.jsx";
import { PanelHeader } from "../../components/ui/PanelHeader.jsx";
import { CalendarGrid } from "./CalendarGrid.jsx";

export function CalendarSection({
  currentDate,
  entriesForDate,
  onChangeMonth,
  onCurrentMonth,
  onSelectDate,
}) {
  const title = `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <section className="calendar-panel">
      <PanelHeader
        eyebrow="Calendario"
        title={title}
        actions={
          <div className="month-actions">
            <IconButton label="Mes anterior" onClick={() => onChangeMonth(-1)}>
              {"<"}
            </IconButton>
            <button className="ghost-button" onClick={onCurrentMonth}>
              Mes atual
            </button>
            <IconButton label="Proximo mes" onClick={() => onChangeMonth(1)}>
              {">"}
            </IconButton>
          </div>
        }
      />

      <CalendarGrid currentDate={currentDate} entriesForDate={entriesForDate} onSelectDate={onSelectDate} />
    </section>
  );
}
