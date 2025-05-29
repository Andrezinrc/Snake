document.addEventListener("DOMContentLoaded", function() {
    let btnMenu = document.getElementById("btn-menu");
    let menu = document.getElementById("menu");
    let alerta = document.getElementById("alert-input");
    let overlay = document.querySelector(".overlay");
    const body = document.body;
    const colorSelect = document.getElementById("colorSelect");
    
    // Atualiza a cor ao carregar
    if (colorSelect) {
        function atualizaCor() {
            const corSelecionada = colorSelect.value;
            body.style.backgroundColor = corSelecionada;
        }
        
        colorSelect.addEventListener("change", atualizaCor);
        atualizaCor();
    }
    
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
        if (colorSelect) {
            let corSelecionada = colorSelect.value;
            localStorage.setItem("backgroundColor", corSelecionada);
        }
        window.location.href = "game.html";
    }
});