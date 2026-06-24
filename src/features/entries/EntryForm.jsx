import { ENTRY_TYPES, PAYMENT_METHODS } from "../../constants/entries.js";
import { parseMoney } from "../../utils/money.js";

export function EntryForm({ dateKey, onSave }) {
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const amount = parseMoney(formData.get("amount").toString());

    if (amount <= 0) {
      alert("Informe um valor maior que zero.");
      return;
    }

    onSave({
      date: formData.get("date"),
      description: formData.get("description").toString().trim(),
      amount,
      type: formData.get("type"),
      method: formData.get("method"),
    });

    form.reset();
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <input type="hidden" name="date" value={dateKey} />
      <label>
        Descricao
        <input name="description" type="text" placeholder="Ex: Pix, dinheiro, pedido..." required />
      </label>
      <label>
        Valor
        <input name="amount" type="text" inputMode="decimal" placeholder="0,00" required />
      </label>
      <div className="form-grid">
        <label>
          Tipo
          <select name="type">
            {ENTRY_TYPES.map((type) => (
              <option value={type.value} key={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Forma
          <select name="method">
            {PAYMENT_METHODS.map((method) => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </label>
      </div>
      <button className="primary-action" type="submit">
        Salvar lancamento
      </button>
    </form>
  );
}
