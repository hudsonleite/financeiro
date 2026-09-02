import { Header } from "../components/layout/Header.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { EntryModal } from "../features/entries/EntryModal.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { EntriesPage } from "../pages/EntriesPage.jsx";
import { useFinancialApp } from "./useFinancialApp.js";
import { APP_VIEWS } from "./viewConfig.js";

export function App() {
  const app = useFinancialApp();
  const pageTitle = APP_VIEWS[app.activeView].title;

  return (
    <div className={`app-layout ${app.sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        activeView={app.activeView}
        collapsed={app.sidebarCollapsed}
        onChangeView={app.setActiveView}
        onToggle={app.toggleSidebar}
      />

      <main className="shell">
        <Header
          title={pageTitle}
          onOpenToday={app.activeView === "launches" ? () => app.setSelectedDate(app.todayKey) : null}
        />

        {app.activeView === "dashboard" ? (
          <DashboardPage entries={app.monthEntries} todayEntries={app.entriesForDate(app.todayKey)} />
        ) : (
          <EntriesPage
            currentDate={app.currentDate}
            entries={app.monthEntries}
            entriesForDate={app.entriesForDate}
            onChangeMonth={app.changeMonth}
            onCurrentMonth={() => app.setCurrentDate(new Date())}
            onDeleteEntry={app.deleteEntry}
            onSelectDate={app.setSelectedDate}
          />
        )}

        {app.selectedDate ? (
          <EntryModal
            dateKey={app.selectedDate}
            entries={app.entriesForDate(app.selectedDate)}
            onClose={() => app.setSelectedDate(null)}
            onDeleteEntry={app.deleteEntry}
            onSave={app.addEntry}
          />
        ) : null}
      </main>
    </div>
  );
}
