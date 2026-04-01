export const CLIENTE_STATUS = {
  PROSPECT: "PROSPECT",
  NEGOCIACAO: "NEGOCIACAO",
  CLIENTE: "CLIENTE",
  INATIVO: "INATIVO",
};

export const CLIENTE_STATUS_OPTIONS = [
  { value: CLIENTE_STATUS.PROSPECT, label: "Prospect" },
  { value: CLIENTE_STATUS.NEGOCIACAO, label: "Negociacao" },
  { value: CLIENTE_STATUS.CLIENTE, label: "Cliente" },
  { value: CLIENTE_STATUS.INATIVO, label: "Inativo" },
];

export function getClienteStatusLabel(status) {
  return (
    CLIENTE_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}
