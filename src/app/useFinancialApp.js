import { useMemo, useState } from "react";
import { useEntries } from "../features/entries/useEntries.js";
import { fromDateKey, toDateKey } from "../utils/date.js";

export function useFinancialApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { entries, addEntry, deleteEntry, entriesForDate } = useEntries();

  const todayKey = toDateKey(new Date());
  const monthEntries = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return entries.filter((entry) => {
      const date = fromDateKey(entry.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [currentDate, entries]);

  function changeMonth(direction) {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + direction, 1));
  }

  return {
    activeView,
    addEntry,
    changeMonth,
    currentDate,
    deleteEntry,
    entriesForDate,
    monthEntries,
    selectedDate,
    setActiveView,
    setCurrentDate,
    setSelectedDate,
    sidebarCollapsed,
    todayKey,
    toggleSidebar: () => setSidebarCollapsed((value) => !value),
  };
}
