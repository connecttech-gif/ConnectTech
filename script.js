// ===== MENU LATERAL =====
const btnMenu = document.getElementById('btn-menu');
const menuLateral = document.getElementById('menu-lateral');
const corpo = document.body;

btnMenu.addEventListener('click', function () {
  menuLateral.classList.toggle('aberto');
  corpo.classList.toggle('menu-aberto');
});

// Fecha o menu se a pessoa clicar fora dele
document.addEventListener('click', function (evento) {
  const cliqueDentroDoMenu = menuLateral.contains(evento.target);
  const cliqueNoBotao = btnMenu.contains(evento.target);

  if (!cliqueDentroDoMenu && !cliqueNoBotao && menuLateral.classList.contains('aberto')) {
    menuLateral.classList.remove('aberto');
    corpo.classList.remove('menu-aberto');
  }
});

// ===== LISTA DE PÁGINAS DO MENU =====
// Por enquanto os nomes são fixos. Depois, no dashboard, isso virá do Supabase.
const paginas = [
  'Configurações do site',
  'Página 1',
  'Página 2',
  'Página 3',
  'Página 4',
  'Página 5',
  'Contato',
  'Mapa do site',
  'Política de privacidade',
  'Política de cookies'
];

const listaPaginas = document.getElementById('lista-paginas');

paginas.forEach(function (nomePagina) {
  const item = document.createElement('li');
  item.textContent = nomePagina;
  listaPaginas.appendChild(item);
});

// ===== CARROSSEL DE BANNERS =====
const listaBanners = document.querySelector('.banners-lista');
const itensBanners = document.querySelectorAll('.banner-item');
const containerPontos = document.getElementById('banners-pontos');
let indiceAtual = 0;

itensBanners.forEach(function (item, indice) {
  const ponto = document.createElement('span');
  if (indice === 0) ponto.classList.add('ativo');
  ponto.addEventListener('click', function () {
    indiceAtual = indice;
    atualizarCarrossel();
  });
  containerPontos.appendChild(ponto);
});

const pontos = containerPontos.querySelectorAll('span');

function atualizarCarrossel() {
  listaBanners.style.transform = 'translateX(-' + (indiceAtual * 100) + '%)';
  pontos.forEach(function (ponto, indice) {
    ponto.classList.toggle('ativo', indice === indiceAtual);
  });
}

function proximoBanner() {
  indiceAtual = (indiceAtual + 1) % itensBanners.length;
  atualizarCarrossel();
}

setInterval(proximoBanner, 4000);
