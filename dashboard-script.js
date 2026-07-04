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
