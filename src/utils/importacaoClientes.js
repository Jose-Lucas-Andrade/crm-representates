import {
  CLIENTE_CLASSIFICACAO,
  CLIENTE_STATUS,
} from "../constants/clientes";

const COLUNAS_ACEITAS = [
  "nome",
  "empresa",
  "telefone",
  "email",
  "cidade",
  "status",
  "classificacao",
  "proxima_acao",
  "proxima_visita",
];

const STATUS_VALIDOS = new Set(Object.values(CLIENTE_STATUS));
const CLASSIFICACOES_VALIDAS = new Set(Object.values(CLIENTE_CLASSIFICACAO));

export function gerarModeloImportacaoCsv() {
  const cabecalho = COLUNAS_ACEITAS.join(",");
  const exemplo = [
    "Joao da Silva",
    "Mercado Central",
    "11999999999",
    "joao@email.com",
    "Sao Paulo",
    "PROSPECT",
    "MORNO",
    "Ligar para apresentar mix",
    "2026-05-10",
  ]
    .map(escaparCampoCsv)
    .join(",");

  return `${cabecalho}\n${exemplo}\n`;
}

export function processarImportacaoClientes(textoCsv, clientesExistentes = []) {
  const linhas = parseCsvClientes(textoCsv);

  if (linhas.length === 0) {
    return {
      total: 0,
      validas: [],
      invalidas: [],
      duplicadas: [],
      erroFatal: "Arquivo vazio ou sem dados validos.",
    };
  }

  const cabecalho = linhas[0].map((coluna) => normalizarCabecalho(coluna));
  const colunasDesconhecidas = cabecalho.filter(
    (coluna) => coluna && !COLUNAS_ACEITAS.includes(coluna)
  );

  if (!cabecalho.includes("nome")) {
    return {
      total: Math.max(linhas.length - 1, 0),
      validas: [],
      invalidas: [],
      duplicadas: [],
      erroFatal: "A coluna obrigatoria 'nome' nao foi encontrada no arquivo.",
    };
  }

  if (colunasDesconhecidas.length > 0) {
    return {
      total: Math.max(linhas.length - 1, 0),
      validas: [],
      invalidas: [],
      duplicadas: [],
      erroFatal: `O arquivo possui colunas nao reconhecidas: ${colunasDesconhecidas.join(", ")}.`,
    };
  }

  const validas = [];
  const invalidas = [];

  for (let index = 1; index < linhas.length; index += 1) {
    const valores = linhas[index];
    const linhaNumero = index + 1;

    if (valores.every((valor) => !String(valor || "").trim())) {
      continue;
    }

    const linha = montarObjetoDaLinha(cabecalho, valores);
    const normalizada = normalizarLinhaCliente(linha);
    const erro = validarLinhaCliente(normalizada);

    if (erro) {
      invalidas.push({
        linha: linhaNumero,
        erro,
        dados: normalizada,
      });
      continue;
    }

    validas.push({
      linha: linhaNumero,
      dados: normalizada,
    });
  }

  const duplicadas = detectarDuplicidadeClientes(validas, clientesExistentes);

  return {
    total: Math.max(linhas.length - 1, 0),
    validas,
    invalidas,
    duplicadas,
    erroFatal: null,
  };
}

export function normalizarLinhaCliente(linha) {
  const nome = limparTexto(linha.nome);
  const telefone = normalizarTelefone(linha.telefone);
  const email = limparTexto(linha.email).toLowerCase();
  const status = limparTexto(linha.status).toUpperCase() || CLIENTE_STATUS.PROSPECT;
  const classificacao =
    limparTexto(linha.classificacao).toUpperCase() ||
    CLIENTE_CLASSIFICACAO.MORNO;
  const proximaVisita = normalizarData(linha.proxima_visita);

  return {
    nome,
    empresa: limparTexto(linha.empresa) || null,
    telefone: telefone || null,
    email: email || null,
    cidade: limparTexto(linha.cidade) || null,
    status,
    classificacao,
    proxima_acao: limparTexto(linha.proxima_acao) || null,
    proxima_visita: proximaVisita,
  };
}

export function validarLinhaCliente(linha) {
  if (!linha.nome) {
    return "Nome obrigatorio.";
  }

  if (linha.email && !emailValido(linha.email)) {
    return "Email invalido.";
  }

  if (!STATUS_VALIDOS.has(linha.status)) {
    return "Status invalido.";
  }

  if (!CLASSIFICACOES_VALIDAS.has(linha.classificacao)) {
    return "Classificacao invalida.";
  }

  if (linha.proxima_visita && !dataValida(linha.proxima_visita)) {
    return "Data de proxima visita invalida. Use YYYY-MM-DD.";
  }

  return null;
}

export function detectarDuplicidadeClientes(validas, clientesExistentes = []) {
  const vistos = new Set();
  const existentes = new Set(
    clientesExistentes
      .map((cliente) => chaveDuplicidade(cliente.nome, cliente.telefone))
      .filter(Boolean)
  );

  const duplicadas = [];

  validas.forEach((item) => {
    const chave = chaveDuplicidade(item.dados.nome, item.dados.telefone);
    if (!chave) {
      return;
    }

    if (existentes.has(chave) || vistos.has(chave)) {
      duplicadas.push({
        linha: item.linha,
        motivo: "Possivel duplicado por nome + telefone.",
        dados: item.dados,
      });
      return;
    }

    vistos.add(chave);
  });

  return duplicadas;
}

function parseCsvClientes(texto) {
  const linhas = [];
  let linhaAtual = [];
  let campoAtual = "";
  let emAspas = false;
  const textoNormalizado = (texto || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  for (let i = 0; i < textoNormalizado.length; i += 1) {
    const caractere = textoNormalizado[i];
    const proximo = textoNormalizado[i + 1];

    if (caractere === '"') {
      if (emAspas && proximo === '"') {
        campoAtual += '"';
        i += 1;
      } else {
        emAspas = !emAspas;
      }
      continue;
    }

    if (caractere === "," && !emAspas) {
      linhaAtual.push(campoAtual);
      campoAtual = "";
      continue;
    }

    if (caractere === "\n" && !emAspas) {
      linhaAtual.push(campoAtual);
      linhas.push(linhaAtual);
      linhaAtual = [];
      campoAtual = "";
      continue;
    }

    campoAtual += caractere;
  }

  if (campoAtual.length > 0 || linhaAtual.length > 0) {
    linhaAtual.push(campoAtual);
    linhas.push(linhaAtual);
  }

  return linhas.filter((linha) => linha.some((campo) => String(campo).trim()));
}

function montarObjetoDaLinha(cabecalho, valores) {
  const objeto = {};

  cabecalho.forEach((coluna, index) => {
    if (!coluna) {
      return;
    }

    objeto[coluna] = valores[index] ?? "";
  });

  return objeto;
}

function normalizarCabecalho(valor) {
  return limparTexto(valor).toLowerCase();
}

function limparTexto(valor) {
  return String(valor || "").trim();
}

function normalizarTelefone(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function normalizarData(valor) {
  const texto = limparTexto(valor);
  if (!texto) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return texto;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    const [dia, mes, ano] = texto.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  return texto;
}

function dataValida(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }

  const data = new Date(`${valor}T00:00:00`);
  return (
    !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor
  );
}

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function chaveDuplicidade(nome, telefone) {
  const nomeNormalizado = limparTexto(nome).toLowerCase();
  const telefoneNormalizado = normalizarTelefone(telefone);

  if (!nomeNormalizado || !telefoneNormalizado) {
    return null;
  }

  return `${nomeNormalizado}::${telefoneNormalizado}`;
}

function escaparCampoCsv(valor) {
  const texto = String(valor ?? "");
  if (texto.includes(",") || texto.includes('"') || texto.includes("\n")) {
    return `"${texto.replace(/"/g, '""')}"`;
  }

  return texto;
}
