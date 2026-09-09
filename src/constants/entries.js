export const ENTRY_TYPES = [
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
];

export const PAYMENT_METHODS = ["Dinheiro", "Pix", "Debito", "Credito", "Rede", "Stone", "Outro"];

export function formatPaymentMethod(method) {
  const labels = { Debito: "Débito", Credito: "Crédito" };
  return labels[method] ?? method;
}
