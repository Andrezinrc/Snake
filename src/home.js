document.addEventListener("DOMContentLoaded", function() {
    let btnMenu = document.getElementById("btn-menu");
    let menu = document.getElementById("menu");
    let overlay = document.querySelector(".overlay");
    const body = document.body;
    const canvas = document.getElementById("homeCanvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = .9;
    
    
    function desenharPixelsVivos() {
        for (let i = 0; i < 25; i++) {
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            const brilho = Math.random() * 0.4 + 0.1;
            ctx.fillStyle = `rgba(155, 89, 255, ${brilho})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    desenharPixelsVivos();
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
