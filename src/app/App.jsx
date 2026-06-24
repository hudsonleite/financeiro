import { useMemo, useState } from "react";
import { Header } from "../components/layout/Header.jsx";
import { CalendarSection } from "../features/calendar/CalendarSection.jsx";
import { Dashboard } from "../features/dashboard/Dashboard.jsx";
import { EntryListSection } from "../features/entries/EntryListSection.jsx";
import { EntryModal } from "../features/entries/EntryModal.jsx";
import { useEntries } from "../features/entries/useEntries.js";
import { fromDateKey, toDateKey } from "../utils/date.js";

export function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const { entries, addEntry, entriesForDate } = useEntries();

  const monthEntries = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return entries.filter((entry) => {
      const date = fromDateKey(entry.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [currentDate, entries]);

  function changeMonth(direction) {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  }

  return (
    <main className="shell">
      <Header onOpenToday={() => setSelectedDate(toDateKey(new Date()))} />

      <Dashboard entries={monthEntries} todayEntries={entriesForDate(toDateKey(new Date()))} />

      <CalendarSection
        currentDate={currentDate}
        entriesForDate={entriesForDate}
        onChangeMonth={changeMonth}
        onCurrentMonth={() => setCurrentDate(new Date())}
        onSelectDate={setSelectedDate}
      />

      <EntryListSection entries={monthEntries} />

      {selectedDate ? (
        <EntryModal
          dateKey={selectedDate}
          entries={entriesForDate(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onSave={addEntry}
        />
      ) : null}
    </main>
  );
}
