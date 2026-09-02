import { CalendarSection } from "../features/calendar/CalendarSection.jsx";
import { EntryListSection } from "../features/entries/EntryListSection.jsx";

export function EntriesPage({ currentDate, entries, entriesForDate, onChangeMonth, onCurrentMonth, onDeleteEntry, onSelectDate }) {
  return (
    <>
      <CalendarSection
        currentDate={currentDate}
        entriesForDate={entriesForDate}
        onChangeMonth={onChangeMonth}
        onCurrentMonth={onCurrentMonth}
        onSelectDate={onSelectDate}
      />
      <EntryListSection entries={entries} onDeleteEntry={onDeleteEntry} />
    </>
  );
}
