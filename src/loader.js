function Carregar() {
    if (window.location.href.indexOf("file:///") !== 0) {
        
        var corDeFundo = document.body.style.backgroundColor;
        
        window.location.href = "game.html?color=" + corDeFundo;
    }
}