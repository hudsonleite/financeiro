import { PanelHeader } from "../../components/ui/PanelHeader.jsx";
import { EntryList } from "./EntryList.jsx";

export function EntryListSection({ entries }) {
  return (
    <section className="list-panel">
      <PanelHeader eyebrow="Ultimos registros" title="Lancamentos do mes" />
      <EntryList entries={entries} />
    </section>
  );
}
