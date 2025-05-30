document.addEventListener("DOMContentLoaded", function() {
    let btnMenu = document.getElementById("btn-menu");
    let menu = document.getElementById("menu");
    let overlay = document.querySelector(".overlay");
    const body = document.body;
    
    // Botão menu
    if (btnMenu) {
        btnMenu.addEventListener("click", () => {
            btnMenu.classList.toggle('ativar');
            overlay.classList.toggle('ativo');
            menu.classList.toggle('abrirMenu');
        });
    }
    
    // Função para iniciar o jogo
    window.iniciarJogo = function() {
        window.location.href = "game.html";
    }
});
