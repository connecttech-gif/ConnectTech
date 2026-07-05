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

// ===== INICIA VERIFICANDO SE JÁ ESTÁ LOGADO =====
verificarSessao();

// ===== NAVEGAÇÃO ENTRE SEÇÕES DO DASHBOARD =====
const botoesMenu = document.querySelectorAll('.botao-menu-dashboard');
const secoesDashboard = document.querySelectorAll('.secao-dashboard');

botoesMenu.forEach(function (botao) {
  botao.addEventListener('click', function () {
    const secaoAlvo = botao.getAttribute('data-secao');

    // Remove a marcação "ativo" de todos os botões
    botoesMenu.forEach(function (b) {
      b.classList.remove('ativo');
    });

    // Marca o botão clicado como ativo
    botao.classList.add('ativo');

    // Esconde todas as seções
    secoesDashboard.forEach(function (secao) {
      secao.classList.add('oculto');
    });

    // Mostra apenas a seção correspondente ao botão clicado
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
