import { Dashboard } from "../features/dashboard/Dashboard.jsx";

export function DashboardPage({ entries, todayEntries }) {
  return <Dashboard entries={entries} todayEntries={todayEntries} />;
}
