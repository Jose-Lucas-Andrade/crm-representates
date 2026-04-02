function diferencaEmDias(data) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataReferencia = new Date(`${data}T00:00:00`);
  dataReferencia.setHours(0, 0, 0, 0);

  const diffMs = dataReferencia.getTime() - hoje.getTime();
  return Math.round(diffMs / 86400000);
}

export function filtrarProximasAcoes(clientes, limiteDias = 2) {
  return (clientes || [])
    .filter((cliente) => cliente.proxima_acao && cliente.proxima_visita)
    .map((cliente) => ({
      ...cliente,
      diasParaAcao: diferencaEmDias(cliente.proxima_visita),
    }))
    .filter((cliente) => cliente.diasParaAcao <= limiteDias)
    .sort((a, b) => a.diasParaAcao - b.diasParaAcao)
    .slice(0, 6);
}
