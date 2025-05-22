let btnMenu = document.getElementById("btn-menu");
let menu = document.getElementById("menu");
let alerta = document.getElementById("alert-input");
const body = document.body;

function atualizaCor() {
    const corSelecionada = document.getElementById("colorSelect").value;
    body.style.backgroundColor = corSelecionada;
}

// Atualiza ao mudar o valor no select
document.getElementById("colorSelect").addEventListener("change", atualizaCor);

atualizaCor();

btnMenu.addEventListener("click", () => {
    btnMenu.classList.toggle('ativar');
    menu.classList.toggle('abrirMenu');
});

// Função para iniciar o jogo
function iniciarJogo() {
    let corSelecionada = document.getElementById("colorSelect").value;
    localStorage.setItem("backgroundColor", corSelecionada);
    window.location.href = "game.html";
}

//carregar jogo
function carregarJogo() {
    const corDeFundo = document.body.style.backgroundColor;
    salvarCorDeFundo(corDeFundo);
    
    if (!window.location.href.startsWith("file:///")) {
        window.location.href = "game.html?color=" + encodeURIComponent(corDeFundo);
    }
}
