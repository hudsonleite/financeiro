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
        eyebrow="Calendário"
        title={title}
        actions={
          <div className="month-actions" role="group" aria-label="Navegação do calendário">
            <IconButton label="Mês anterior" onClick={() => onChangeMonth(-1)}>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5" /></svg>
            </IconButton>
            <button className="month-current-button" type="button" onClick={onCurrentMonth}>
              Mês atual
            </button>
            <IconButton label="Próximo mês" onClick={() => onChangeMonth(1)}>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5" /></svg>
            </IconButton>
          </div>
        }
      />

      <CalendarGrid currentDate={currentDate} entriesForDate={entriesForDate} onSelectDate={onSelectDate} />
    </section>
  );
}
