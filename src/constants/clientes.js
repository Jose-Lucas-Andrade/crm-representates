export const CLIENTE_STATUS = {
  PROSPECT: "PROSPECT",
  NEGOCIACAO: "NEGOCIACAO",
  CLIENTE: "CLIENTE",
  INATIVO: "INATIVO",
};

export const CLIENTE_CLASSIFICACAO = {
  QUENTE: "QUENTE",
  MORNO: "MORNO",
  FRIO: "FRIO",
};

export const CLIENTE_STATUS_OPTIONS = [
  { value: CLIENTE_STATUS.PROSPECT, label: "Prospect" },
  { value: CLIENTE_STATUS.NEGOCIACAO, label: "Negociação" },
  { value: CLIENTE_STATUS.CLIENTE, label: "Cliente" },
  { value: CLIENTE_STATUS.INATIVO, label: "Inativo" },
];

export const CLIENTE_CLASSIFICACAO_OPTIONS = [
  { value: CLIENTE_CLASSIFICACAO.QUENTE, label: "Quente" },
  { value: CLIENTE_CLASSIFICACAO.MORNO, label: "Morno" },
  { value: CLIENTE_CLASSIFICACAO.FRIO, label: "Frio" },
];

export function getClienteStatusLabel(status) {
  return (
    CLIENTE_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

export function getClienteClassificacaoLabel(classificacao) {
  return (
    CLIENTE_CLASSIFICACAO_OPTIONS.find(
      (option) => option.value === classificacao
    )?.label ?? classificacao
  );
}
