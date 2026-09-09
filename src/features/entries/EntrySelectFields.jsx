import { SelectField } from "../../components/ui/SelectField.jsx";
import { ENTRY_TYPES, PAYMENT_METHODS, formatPaymentMethod } from "../../constants/entries.js";

const typeOptions = ENTRY_TYPES.map((type) => ({ ...type, tone: type.value === "entrada" ? "income" : "expense" }));
const methodOptions = PAYMENT_METHODS.map((method) => ({ value: method, label: formatPaymentMethod(method) }));
const allTypes = [{ value: "", label: "Todos" }, ...typeOptions];
const allMethods = [{ value: "", label: "Todas" }, ...methodOptions];

export function EntrySelectFields({ filters = false, type, method, onTypeChange, onMethodChange }) {
  return (
    <>
      <SelectField label="Tipo" name={filters ? undefined : "type"} options={filters ? allTypes : typeOptions} value={type} onChange={onTypeChange} />
      <SelectField label="Forma" name={filters ? undefined : "method"} options={filters ? allMethods : methodOptions} value={method} onChange={onMethodChange} />
    </>
  );
}
