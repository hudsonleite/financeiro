import { useState } from "react";
import { PanelHeader } from "../../components/ui/PanelHeader.jsx";
import { formatPaymentMethod } from "../../constants/entries.js";
import { EntryList } from "./EntryList.jsx";
import { EntrySelectFields } from "./EntrySelectFields.jsx";
import { EntryTotals } from "./EntryTotals.jsx";

export function EntryListSection({ entries, onDeleteEntry }) {
  const [type, setType] = useState("");
  const [method, setMethod] = useState("");
  const filteredEntries = entries.filter((entry) =>
    (!type || entry.type === type) &&
    (!method || formatPaymentMethod(entry.method) === formatPaymentMethod(method)),
  );

  return (
    <section className="list-panel">
      <PanelHeader
        eyebrow="Últimos registros"
        title="Lançamentos do mês"
        actions={
          <div className="entry-filters">
            <EntrySelectFields filters type={type} method={method} onTypeChange={setType} onMethodChange={setMethod} />
          </div>
        }
      />
      <EntryTotals entries={filteredEntries} />
      {filteredEntries.length === 0 && (type || method) ? (
        <div className="empty-state" role="status">Nenhum lançamento encontrado com os filtros selecionados.</div>
      ) : (
        <EntryList entries={filteredEntries} onDeleteEntry={onDeleteEntry} />
      )}
    </section>
  );
}
