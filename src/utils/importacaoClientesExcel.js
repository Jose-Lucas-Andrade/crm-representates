import {
  obterLinhasModeloImportacaoClientes,
  processarImportacaoClientesLinhas,
} from "./importacaoClientes";

async function carregarXlsx() {
  return import("xlsx");
}

export async function gerarModeloImportacaoXlsx() {
  const XLSX = await carregarXlsx();
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(
    obterLinhasModeloImportacaoClientes()
  );

  XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

  return XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
}

export async function processarImportacaoClientesXlsx(
  arquivo,
  clientesExistentes = []
) {
  const XLSX = await carregarXlsx();
  const buffer = await arquivo.arrayBuffer();
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: false,
  });

  if (!workbook.SheetNames?.length) {
    return {
      total: 0,
      validas: [],
      invalidas: [],
      duplicadas: [],
      erroFatal: "O arquivo Excel nao possui abas com dados.",
    };
  }

  const primeiraAba = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[primeiraAba];

  if (!worksheet) {
    return {
      total: 0,
      validas: [],
      invalidas: [],
      duplicadas: [],
      erroFatal: "Nao foi possivel ler a primeira aba do arquivo Excel.",
    };
  }

  const linhas = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
    dateNF: "yyyy-mm-dd",
  });

  return processarImportacaoClientesLinhas(linhas, clientesExistentes);
}
