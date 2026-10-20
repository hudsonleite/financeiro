import { useState } from "react";
import { EntrySelectFields } from "./EntrySelectFields.jsx";
import { parseMoney } from "../../utils/money.js";
export function EntryForm({dateKey,onSave}) {
  const [error,setError]=useState("");
  function handleSubmit(event) {
    event.preventDefault();setError("");
    const form=event.currentTarget;
    const data=new FormData(form);
    try {
      onSave({date:dateKey,description:String(data.get("description")??""),amount:parseMoney(String(data.get("amount")??"")),type:data.get("type"),method:data.get("method")});
      form.reset();
    } catch(err) {setError(err.message||"Não foi possível salvar.");}
  }
  return <form className="entry-form" onSubmit={handleSubmit}>
    <div className="form-grid"><EntrySelectFields /></div>
    <label>Descrição (opcional)<input name="description" type="text" maxLength="200" placeholder="Ex.: Pagamento fornecedor"/></label>
    <label>Valor<input name="amount" type="text" inputMode="decimal" placeholder="0,00" required/></label>
    {error?<p className="confirmation-error" role="alert">{error}</p>:null}
    <button className="primary-action" type="submit">Salvar lançamento</button>
  </form>;
}
