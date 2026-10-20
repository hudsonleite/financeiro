import {useMemo,useState} from "react";
import {useEntries} from "../features/entries/useEntries.js";
import {fromDateKey,toDateKey} from "../utils/date.js";
export function useFinancialApp() {
 const [currentDate,setCurrentDate]=useState(new Date());
 const [selectedDate,setSelectedDate]=useState(null);
 const [activeView,setActiveView]=useState("dashboard");
 const [sidebarCollapsed,setSidebarCollapsed]=useState(true);
 const {entries,addEntry,deleteEntry,entriesForDate,exportBackup}=useEntries();
 const todayKey=toDateKey(new Date());
 const monthEntries=useMemo(()=>entries.filter(entry=>{const d=fromDateKey(entry.date);return d.getFullYear()===currentDate.getFullYear()&&d.getMonth()===currentDate.getMonth();}),[currentDate,entries]);
 function changeMonth(direction){setCurrentDate(d=>new Date(d.getFullYear(),d.getMonth()+direction,1));}
 return {activeView,addEntry,changeMonth,currentDate,deleteEntry,entriesForDate,exportBackup,monthEntries,selectedDate,setActiveView,setCurrentDate,setSelectedDate,sidebarCollapsed,todayKey,toggleSidebar:()=>setSidebarCollapsed(v=>!v)};
}
