import { IconButton } from "../../components/ui/IconButton.jsx";
import { formatDate } from "../../utils/date.js";
import { EntryForm } from "./EntryForm.jsx";
import { EntryList } from "./EntryList.jsx";

export function EntryModal({ dateKey, entries, onClose, onSave }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">Novo lancamento</span>
            <h2 id="modal-title">{formatDate(dateKey)}</h2>
          </div>
          <IconButton label="Fechar" onClick={onClose}>
            x
          </IconButton>
        </div>

        <EntryForm dateKey={dateKey} onSave={onSave} />

        <div className="modal-list">
          <h3>Lancamentos do dia</h3>
          <EntryList entries={entries} />
        </div>
      </section>
    </div>
  );
}
