// ===== ELEMENTOS DA TELA =====
const telaLogin = document.getElementById('tela-login');
const painelPrincipal = document.getElementById('painel-principal');
const formLogin = document.getElementById('form-login');
const mensagemErro = document.getElementById('mensagem-erro');
const btnSair = document.getElementById('btn-sair');

// ===== VERIFICA SE JÁ EXISTE UMA SESSÃO ATIVA =====
async function verificarSessao() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    mostrarPainel();
  } else {
    mostrarLogin();
  }
}

function mostrarPainel() {
  telaLogin.classList.add('oculto');
  painelPrincipal.classList.remove('oculto');
  carregarListaPaginas();
}

function mostrarLogin() {
  telaLogin.classList.remove('oculto');
  painelPrincipal.classList.add('oculto');
}

// ===== LOGIN =====
formLogin.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const email = document.getElementById('email-login').value;
  const senha = document.getElementById('senha-login').value;

  mensagemErro.textContent = '';

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: senha
  });

  if (error) {
    mensagemErro.textContent = 'E-mail ou senha incorretos.';
    return;
  }

  mostrarPainel();
});

// ===== LOGOUT =====
btnSair.addEventListener('click', async function () {
  await supabaseClient.auth.signOut();
  mostrarLogin();
});

// ===== NAVEGAÇÃO ENTRE SEÇÕES DO DASHBOARD =====
const botoesMenu = document.querySelectorAll('.botao-menu-dashboard');
const secoesDashboard = document.querySelectorAll('.secao-dashboard');

botoesMenu.forEach(function (botao) {
  botao.addEventListener('click', function () {
    const secaoAlvo = botao.getAttribute('data-secao');

    botoesMenu.forEach(function (b) {
      b.classList.remove('ativo');
    });

    botao.classList.add('ativo');

    secoesDashboard.forEach(function (secao) {
      secao.classList.add('oculto');
    });

    const secaoParaMostrar = document.getElementById(secaoAlvo);
    if (secaoParaMostrar) {
      secaoParaMostrar.classList.remove('oculto');
    }
  });
});

// ===== EXPANDIR/RECOLHER O MENU LATERAL DO DASHBOARD =====
const menuDashboard = document.getElementById('menu-dashboard');
const btnToggleMenu = document.getElementById('btn-toggle-menu');

btnToggleMenu.addEventListener('click', function () {
  menuDashboard.classList.toggle('aberto');
});

// ================================================================
// ===== SEÇÃO: PÁGINAS ===========================================
// ================================================================

const listaPaginasDashboard = document.getElementById('lista-paginas-dashboard');
const btnNovaPagina = document.getElementById('btn-nova-pagina');
const editorPagina = document.getElementById('editor-pagina');
const tituloEditorPagina = document.getElementById('titulo-editor-pagina');
const inputNomePagina = document.getElementById('input-nome-pagina');
const listaBlocos = document.getElementById('lista-blocos');
const btnSalvarPagina = document.getElementById('btn-salvar-pagina');
const btnCancelarPagina = document.getElementById('btn-cancelar-pagina');
const botoesAdicionarBloco = document.querySelectorAll('[data-tipo-bloco]');

let blocosAtuais = [];
let paginaEmEdicaoId = null;

// ===== CARREGAR LISTA DE PÁGINAS =====
async function carregarListaPaginas() {
  const { data, error } = await supabaseClient
    .from('paginas')
    .select('*')
    .order('ordem', { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  listaPaginasDashboard.innerHTML = '';

  data.forEach(function (pagina) {
    const item = document.createElement('div');
    item.className = 'item-lista';

    const nome = document.createElement('span');
    nome.className = 'item-lista-nome';
    nome.textContent = pagina.nome + (pagina.fixa ? ' (fixa)' : '');

    const acoes = document.createElement('div');
    acoes.className = 'item-lista-acoes';

    const btnEditar = document.createElement('button');
    btnEditar.className = 'botao-secundario';
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', function () {
      abrirEditorPagina(pagina);
    });
    acoes.appendChild(btnEditar);

    if (!pagina.fixa) {
      const btnApagar = document.createElement('button');
      btnApagar.className = 'botao-perigo';
      btnApagar.textContent = 'Apagar';
      btnApagar.addEventListener('click', function () {
        apagarPagina(pagina.id);
      });
      acoes.appendChild(btnApagar);
    }

    item.appendChild(nome);
    item.appendChild(acoes);
    listaPaginasDashboard.appendChild(item);
  });
}

// ===== APAGAR PÁGINA =====
async function apagarPagina(id) {
  const confirmar = confirm('Tem certeza que deseja apagar esta página?');
  if (!confirmar) return;

  const { error } = await supabaseClient.from('paginas').delete().eq('id', id);

  if (error) {
    alert('Erro ao apagar: ' + error.message);
    return;
  }

  carregarListaPaginas();
}

// ===== ABRIR EDITOR (nova página ou edição) =====
function abrirEditorPagina(pagina) {
  editorPagina.classList.remove('oculto');

  if (pagina) {
    paginaEmEdicaoId = pagina.id;
    tituloEditorPagina.textContent = 'Editar página';
    inputNomePagina.value = pagina.nome;
    blocosAtuais = Array.isArray(pagina.conteudo) ? JSON.parse(JSON.stringify(pagina.conteudo)) : [];
  } else {
    paginaEmEdicaoId = null;
    tituloEditorPagina.textContent = 'Nova página';
    inputNomePagina.value = '';
    blocosAtuais = [];
  }

  renderizarBlocos();
  editorPagina.scrollIntoView({ behavior: 'smooth' });
}

btnNovaPagina.addEventListener('click', function () {
  abrirEditorPagina(null);
});

btnCancelarPagina.addEventListener('click', function () {
  editorPagina.classList.add('oculto');
});

// ===== ADICIONAR NOVO BLOCO =====
botoesAdicionarBloco.forEach(function (botao) {
  botao.addEventListener('click', function () {
    const tipo = botao.getAttribute('data-tipo-bloco');

    let tamanhoPadrao = 16;
    if (tipo === 'cabecalho') tamanhoPadrao = 32;
    if (tipo === 'subcabecalho') tamanhoPadrao = 22;

    blocosAtuais.push({
      tipo: tipo,
      texto: '',
      tamanhoFonte: tamanhoPadrao,
      negrito: false,
      link: ''
    });

    renderizarBlocos();
  });
});

// ===== RENDERIZAR BLOCOS NO EDITOR =====
function renderizarBlocos() {
  listaBlocos.innerHTML = '';

  blocosAtuais.forEach(function (bloco, indice) {
    const caixaBloco = document.createElement('div');
    caixaBloco.className = 'bloco-editor';

    // Cabeçalho do bloco (tipo + botões mover/remover)
    const cabecalhoBloco = document.createElement('div');
    cabecalhoBloco.className = 'bloco-editor-cabecalho';

    const rotuloTipo = document.createElement('span');
    rotuloTipo.className = 'bloco-editor-tipo';
    const nomesTipos = { cabecalho: 'Cabeçalho', subcabecalho: 'Subcabeçalho', texto: 'Texto' };
    rotuloTipo.textContent = nomesTipos[bloco.tipo] || bloco.tipo;

    const botoesBloco = document.createElement('div');
    botoesBloco.className = 'bloco-editor-botoes';

    const btnSubir = document.createElement('button');
    btnSubir.className = 'botao-icone';
    btnSubir.textContent = '↑';
    btnSubir.addEventListener('click', function () {
      moverBloco(indice, -1);
    });

    const btnDescer = document.createElement('button');
    btnDescer.className = 'botao-icone';
    btnDescer.textContent = '↓';
    btnDescer.addEventListener('click', function () {
      moverBloco(indice, 1);
    });

    const btnRemover = document.createElement('button');
    btnRemover.className = 'botao-icone';
    btnRemover.textContent = '✕';
    btnRemover.addEventListener('click', function () {
      blocosAtuais.splice(indice, 1);
      renderizarBlocos();
    });

    botoesBloco.appendChild(btnSubir);
    botoesBloco.appendChild(btnDescer);
    botoesBloco.appendChild(btnRemover);

    cabecalhoBloco.appendChild(rotuloTipo);
    cabecalhoBloco.appendChild(botoesBloco);

    // Área de texto
    const areaTexto = document.createElement('textarea');
    areaTexto.value = bloco.texto;
    areaTexto.placeholder = 'Digite o texto aqui...';
    areaTexto.style.fontSize = bloco.tamanhoFonte + 'px';
    areaTexto.style.fontWeight = bloco.negrito ? 'bold' : 'normal';
    areaTexto.addEventListener('input', function () {
      bloco.texto = areaTexto.value;
    });

    // Opções: tamanho da fonte, negrito, link
    const opcoes = document.createElement('div');
    opcoes.className = 'bloco-editor-opcoes';

    const controleFonte = document.createElement('div');
    controleFonte.className = 'controle-fonte';

    const btnDiminuir = document.createElement('button');
    btnDiminuir.textContent = '-';
    btnDiminuir.addEventListener('click', function () {
      if (bloco.tamanhoFonte > 10) {
        bloco.tamanhoFonte -= 2;
        areaTexto.style.fontSize = bloco.tamanhoFonte + 'px';
        rotuloTamanho.textContent = bloco.tamanhoFonte + 'px';
      }
    });

    const rotuloTamanho = document.createElement('span');
    rotuloTamanho.textContent = bloco.tamanhoFonte + 'px';

    const btnAumentar = document.createElement('button');
    btnAumentar.textContent = '+';
    btnAumentar.addEventListener('click', function () {
      if (bloco.tamanhoFonte < 96) {
        bloco.tamanhoFonte += 2;
        areaTexto.style.fontSize = bloco.tamanhoFonte + 'px';
        rotuloTamanho.textContent = bloco.tamanhoFonte + 'px';
      }
    });

    controleFonte.appendChild(btnDiminuir);
    controleFonte.appendChild(rotuloTamanho);
    controleFonte.appendChild(btnAumentar);

    const opcaoNegrito = document.createElement('label');
    opcaoNegrito.className = 'opcao-negrito';
    const checkboxNegrito = document.createElement('input');
    checkboxNegrito.type = 'checkbox';
    checkboxNegrito.checked = bloco.negrito;
    checkboxNegrito.addEventListener('change', function () {
      bloco.negrito = checkboxNegrito.checked;
      areaTexto.style.fontWeight = bloco.negrito ? 'bold' : 'normal';
    });
    opcaoNegrito.appendChild(checkboxNegrito);
    opcaoNegrito.appendChild(document.createTextNode(' Negrito'));

    const opcaoLink = document.createElement('div');
    opcaoLink.className = 'opcao-link';
    const inputLink = document.createElement('input');
    inputLink.type = 'text';
    inputLink.placeholder = 'Link (opcional)';
    inputLink.value = bloco.link || '';
    inputLink.addEventListener('input', function () {
      bloco.link = inputLink.value;
    });
    opcaoLink.appendChild(inputLink);

    opcoes.appendChild(controleFonte);
    opcoes.appendChild(opcaoNegrito);
    opcoes.appendChild(opcaoLink);

    caixaBloco.appendChild(cabecalhoBloco);
    caixaBloco.appendChild(areaTexto);
    caixaBloco.appendChild(opcoes);

    listaBlocos.appendChild(caixaBloco);
  });
}

// ===== MOVER BLOCO PARA CIMA OU PARA BAIXO =====
function moverBloco(indice, direcao) {
  const novoIndice = indice + direcao;
  if (novoIndice < 0 || novoIndice >= blocosAtuais.length) return;

  const temp = blocosAtuais[indice];
  blocosAtuais[indice] = blocosAtuais[novoIndice];
  blocosAtuais[novoIndice] = temp;

  renderizarBlocos();
}

// ===== SALVAR PÁGINA (criar ou atualizar) =====
btnSalvarPagina.addEventListener('click', async function () {
  const nome = inputNomePagina.value.trim();

  if (!nome) {
    alert('Digite um nome para a página.');
    return;
  }

  if (paginaEmEdicaoId) {
    const { error } = await supabaseClient
      .from('paginas')
      .update({ nome: nome, conteudo: blocosAtuais })
      .eq('id', paginaEmEdicaoId);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
      return;
    }
  } else {
    const { data: paginasExistentes } = await supabaseClient
      .from('paginas')
      .select('ordem')
      .order('ordem', { ascending: false })
      .limit(1);

    const proximaOrdem = paginasExistentes && paginasExistentes.length > 0
      ? paginasExistentes[0].ordem + 1
      : 1;

    const { error } = await supabaseClient
      .from('paginas')
      .insert({ nome: nome, conteudo: blocosAtuais, ordem: proximaOrdem, fixa: false });

    if (error) {
      alert('Erro ao criar página: ' + error.message);
      return;
    }
  }

  editorPagina.classList.add('oculto');
  carregarListaPaginas();
});

// ===== INICIA VERIFICANDO SE JÁ ESTÁ LOGADO =====
verificarSessao();
