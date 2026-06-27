import { useMemo, useState } from "react";
import { Header } from "../components/layout/Header.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { CalendarSection } from "../features/calendar/CalendarSection.jsx";
import { Dashboard } from "../features/dashboard/Dashboard.jsx";
import { EntryListSection } from "../features/entries/EntryListSection.jsx";
import { EntryModal } from "../features/entries/EntryModal.jsx";
import { useEntries } from "../features/entries/useEntries.js";
import { fromDateKey, toDateKey } from "../utils/date.js";

export function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
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

  const pageTitle = activeView === "dashboard" ? "Dashboard" : "Lan\u00e7amentos";

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} onChangeView={setActiveView} />

      <main className="shell">
        <Header title={pageTitle} onOpenToday={() => setSelectedDate(toDateKey(new Date()))} />

        {activeView === "dashboard" ? (
          <Dashboard entries={monthEntries} todayEntries={entriesForDate(toDateKey(new Date()))} />
        ) : (
          <>
            <CalendarSection
              currentDate={currentDate}
              entriesForDate={entriesForDate}
              onChangeMonth={changeMonth}
              onCurrentMonth={() => setCurrentDate(new Date())}
              onSelectDate={setSelectedDate}
            />

            <EntryListSection entries={monthEntries} />
          </>
        )}

        {selectedDate ? (
          <EntryModal
            dateKey={selectedDate}
            entries={entriesForDate(selectedDate)}
            onClose={() => setSelectedDate(null)}
            onSave={addEntry}
          />
        ) : null}
      </main>
    </div>
  );
}
