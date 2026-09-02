import { ENTRY_TYPES, PAYMENT_METHODS } from "../../constants/entries.js";
import { parseMoney } from "../../utils/money.js";

export function EntryForm({ dateKey, onSave }) {
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const amount = parseMoney(formData.get("amount").toString());
    const type = formData.get("type");
    const method = formData.get("method");

    if (amount <= 0) {
      alert("Informe um valor maior que zero.");
      return;
    }

    onSave({
      date: formData.get("date"),
      description: method,
      amount,
      type,
      method,
    });

    form.reset();
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <input type="hidden" name="date" value={dateKey} />
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
      <label>
        Valor
        <input name="amount" type="text" inputMode="decimal" placeholder="0,00" required />
      </label>
      <button className="primary-action" type="submit">
        Salvar lancamento
      </button>
    </form>
  );
}
