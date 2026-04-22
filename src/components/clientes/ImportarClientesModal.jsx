import { useMemo, useRef, useState } from "react";
import Button from "../ui/Button";
import {
  gerarModeloImportacaoCsv,
  processarImportacaoClientes,
} from "../../utils/importacaoClientes";
import { importarClientesEmLote } from "../../services/clientes";

export default function ImportarClientesModal({
  aberto,
  onFechar,
  clientesExistentes,
  onImportado,
}) {
  const inputRef = useRef(null);
  const [arquivo, setArquivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loadingValidacao, setLoadingValidacao] = useState(false);
  const [loadingImportacao, setLoadingImportacao] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const totalValidas = resultado?.validas?.length || 0;
  const totalInvalidas = resultado?.invalidas?.length || 0;
  const totalDuplicadas = resultado?.duplicadas?.length || 0;

  const resumo = useMemo(() => {
    if (!resultado) {
      return null;
    }

    return {
      total: resultado.total,
      validas: totalValidas,
      invalidas: totalInvalidas,
      duplicadas: totalDuplicadas,
    };
  }, [resultado, totalDuplicadas, totalInvalidas, totalValidas]);

  if (!aberto) {
    return null;
  }

  async function handleValidar() {
    if (!arquivo) {
      setMensagem("Selecione um arquivo CSV antes de validar.");
      return;
    }

    setLoadingValidacao(true);
    setMensagem("");

    try {
      const texto = await arquivo.text();
      const processado = processarImportacaoClientes(
        texto,
        clientesExistentes || []
      );
      setResultado(processado);

      if (processado.erroFatal) {
        setMensagem(processado.erroFatal);
        return;
      }

      setMensagem("Arquivo validado com sucesso.");
    } catch (error) {
      setMensagem(`Nao foi possivel ler o arquivo: ${error.message}`);
    } finally {
      setLoadingValidacao(false);
    }
  }

  async function handleImportar() {
    if (!resultado || totalValidas === 0) {
      setMensagem("Nao ha linhas validas para importar.");
      return;
    }

    setLoadingImportacao(true);
    setMensagem("");

    const resposta = await importarClientesEmLote(
      resultado.validas.map((item) => item.dados)
    );

    if (!resposta.ok) {
      setMensagem(resposta.error || "Erro ao importar clientes.");
      setLoadingImportacao(false);
      return;
    }

    setMensagem(
      `${resposta.importados} cliente(s) importado(s) com sucesso.`
    );

    if (onImportado) {
      await onImportado();
    }

    setResultado((atual) =>
      atual
        ? {
            ...atual,
            importado: true,
          }
        : atual
    );
    setLoadingImportacao(false);
  }

  function handleBaixarModelo() {
    const conteudo = gerarModeloImportacaoCsv();
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "modelo-importacao-clientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function resetarEstado() {
    setArquivo(null);
    setResultado(null);
    setMensagem("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function fecharModal() {
    resetarEstado();
    onFechar();
  }

  return (
    <div style={styles.overlay} onClick={fecharModal}>
      <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Importar clientes por planilha</h2>
            <p style={styles.subtitle}>
              Envie um arquivo CSV no modelo padrao para adicionar varios
              clientes de uma vez.
            </p>
          </div>
          <button style={styles.closeButton} onClick={fecharModal}>
            Fechar
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Modelo e regras rapidas</h3>
              <Button onClick={handleBaixarModelo}>Baixar modelo</Button>
            </div>
            <ul style={styles.rulesList}>
              <li>Use o modelo padrao para evitar erros de coluna.</li>
              <li>O campo nome e obrigatorio.</li>
              <li>Status aceitos: PROSPECT, NEGOCIACAO, CLIENTE, INATIVO.</li>
              <li>Classificacoes aceitas: QUENTE, MORNO, FRIO.</li>
              <li>Linhas com erro nao serao importadas.</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Arquivo CSV</h3>
            <div style={styles.uploadBox}>
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                onChange={(event) => {
                  const novoArquivo = event.target.files?.[0] || null;
                  setArquivo(novoArquivo);
                  setResultado(null);
                  setMensagem("");
                }}
              />
              <p style={styles.fileInfo}>
                {arquivo
                  ? `Arquivo selecionado: ${arquivo.name}`
                  : "Selecione um arquivo CSV para validar."}
              </p>
              <div style={styles.actionsRow}>
                <Button onClick={handleValidar} disabled={loadingValidacao}>
                  {loadingValidacao ? "Validando..." : "Validar arquivo"}
                </Button>
                <Button variant="secondary" onClick={resetarEstado}>
                  Limpar
                </Button>
              </div>
            </div>
          </div>

          {mensagem ? <div style={styles.messageBox}>{mensagem}</div> : null}

          {resultado ? (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Resumo da validacao</h3>

              {resultado.erroFatal ? null : (
                <>
                  <div style={styles.summaryGrid}>
                    <ResumoCard label="Total de linhas" value={resumo.total} />
                    <ResumoCard label="Linhas validas" value={resumo.validas} />
                    <ResumoCard
                      label="Linhas com erro"
                      value={resumo.invalidas}
                    />
                    <ResumoCard
                      label="Possiveis duplicados"
                      value={resumo.duplicadas}
                    />
                  </div>

                  {resultado.invalidas.length > 0 ? (
                    <div style={styles.resultBlock}>
                      <h4 style={styles.resultTitle}>Linhas com erro</h4>
                      <ul style={styles.resultList}>
                        {resultado.invalidas.map((item) => (
                          <li key={`${item.linha}-${item.erro}`}>
                            Linha {item.linha}: {item.erro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {resultado.duplicadas.length > 0 ? (
                    <div style={styles.resultBlock}>
                      <h4 style={styles.resultTitle}>Possiveis duplicados</h4>
                      <ul style={styles.resultList}>
                        {resultado.duplicadas.map((item) => (
                          <li key={`${item.linha}-${item.motivo}`}>
                            Linha {item.linha}: {item.motivo}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div style={styles.actionsRow}>
                    <Button
                      onClick={handleImportar}
                      disabled={loadingImportacao || totalValidas === 0}
                    >
                      {loadingImportacao
                        ? "Importando..."
                        : "Importar clientes validos"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ResumoCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <span style={styles.summaryLabel}>{label}</span>
      <strong style={styles.summaryValue}>{value}</strong>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: 880,
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: 24,
    borderBottom: "1px solid #e2e8f0",
  },
  title: {
    margin: "0 0 8px",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
  closeButton: {
    border: "none",
    background: "transparent",
    color: "#475569",
    cursor: "pointer",
    fontWeight: 700,
  },
  content: {
    display: "grid",
    gap: 20,
    padding: 24,
  },
  section: {
    display: "grid",
    gap: 12,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
  },
  rulesList: {
    margin: 0,
    paddingLeft: 18,
    color: "#475569",
    lineHeight: 1.6,
  },
  uploadBox: {
    padding: 16,
    borderRadius: 14,
    border: "1px dashed #94a3b8",
    background: "#f8fafc",
    display: "grid",
    gap: 12,
  },
  fileInfo: {
    margin: 0,
    color: "#334155",
  },
  actionsRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  messageBox: {
    padding: "12px 14px",
    borderRadius: 12,
    background: "#eff6ff",
    color: "#1d4ed8",
    lineHeight: 1.6,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  },
  summaryCard: {
    display: "grid",
    gap: 6,
    padding: 14,
    borderRadius: 14,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 22,
    color: "#0f172a",
  },
  resultBlock: {
    display: "grid",
    gap: 8,
  },
  resultTitle: {
    margin: 0,
  },
  resultList: {
    margin: 0,
    paddingLeft: 18,
    color: "#475569",
    lineHeight: 1.6,
  },
};
