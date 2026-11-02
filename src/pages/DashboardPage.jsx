import { Dashboard } from "../features/dashboard/Dashboard.jsx";
import { WeeklyIncomeChart } from "../features/dashboard/WeeklyIncomeChart.jsx";

export function DashboardPage({ entries, allEntries, todayEntries }) {
  return <>
    <Dashboard entries={entries} todayEntries={todayEntries} />
    <WeeklyIncomeChart entries={allEntries} />
  </>;
}
