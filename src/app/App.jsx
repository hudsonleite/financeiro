import { Header } from "../components/layout/Header.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { EntryModal } from "../features/entries/EntryModal.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { EntriesPage } from "../pages/EntriesPage.jsx";
import { useFinancialApp } from "./useFinancialApp.js";
import { APP_VIEWS } from "./viewConfig.js";
import { useState } from "react";

export function App() {
  const app = useFinancialApp();
  const [mockMessage, setMockMessage] = useState("");
  function loadExamples() {
    try {
      const count = app.loadMockEntries();
      setMockMessage(count ? `${count} lançamentos de exemplo adicionados: entradas e saídas de 01/09 a 18/10/2026 e saídas de 18/10 até hoje.` : "Todos os exemplos desse período já foram carregados.");
    } catch (error) { setMockMessage(error.message); }
  }
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
        <button className="ghost-button" type="button" onClick={app.exportBackup}>Exportar backup dos registros</button>
        <button className="ghost-button" type="button" onClick={loadExamples}>Carregar exemplos</button>
        {mockMessage ? <p role="status">{mockMessage}</p> : null}
        {app.storageError ? <p role="alert">{app.storageError}</p> : null}
        <Header
          title={pageTitle}
          onOpenToday={app.activeView === "launches" ? () => app.setSelectedDate(app.todayKey) : null}
        />

        {app.activeView === "dashboard" ? (
          <DashboardPage entries={app.monthEntries} allEntries={app.entries} todayEntries={app.entriesForDate(app.todayKey)} />
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
