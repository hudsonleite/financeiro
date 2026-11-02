import { useState } from "react";
import { EntrySelectFields } from "./EntrySelectFields.jsx";
import { parseMoney } from "../../utils/money.js";
import { PAYMENT_METHODS } from "../../constants/entries.js";

export function EntryForm({ dateKey, onSave }) {
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const amount = parseMoney(formData.get("amount").toString());
    const type = formData.get("type");
    const method = formData.get("method");

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Informe um valor válido maior que zero, como 1.234,56.");
      return;
    }

    try {
      onSave({
      date: formData.get("date"),
      description: method,
      amount,
      type,
      method,
    });

      setSelectedMethod(PAYMENT_METHODS[(PAYMENT_METHODS.indexOf(method) + 1) % PAYMENT_METHODS.length]);
      const amountInput = form.elements.namedItem("amount");
      amountInput.value = "";
      amountInput.focus();
      setError("");
    } catch (failure) {
      setError(failure.message);
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <input type="hidden" name="date" value={dateKey} />
      <div className="form-grid">
        <EntrySelectFields method={selectedMethod} onMethodChange={setSelectedMethod} />
      </div>
      <label>
        Valor
        <input name="amount" type="text" inputMode="decimal" placeholder="0,00" required />
      </label>
      {error ? <p role="alert">{error}</p> : null}
      <button className="primary-action" type="submit">
        Salvar lançamento
      </button>
    </form>
  );
}
