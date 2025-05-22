import { controlePc, controleMobile } from "./controles.js";

function Carregar() {
    if (window.location.href.indexOf("file:///") !== 0) {
        
        var corDeFundo = document.body.style.backgroundColor;
        
        window.location.href = "game.html?color=" + corDeFundo;
    }
}

var sobre = document.getElementById("sobre");
var fecharSobre = document.getElementById("fechar-sobre");
var params = new URLSearchParams(window.location.search);
var selectedColor = params.get("color");

document.addEventListener("DOMContentLoaded", function () {
    var corDeFundo = localStorage.getItem("backgroundColor");

    if (corDeFundo) {
        document.body.style.backgroundColor = corDeFundo;
    }
});


window.onload = function () {
    let canvas = document.querySelector("#gameCanvas");
    let ctx = canvas.getContext("2d");
    let piscaPisca = document.querySelector(".pisca-pisca");
    let velocidade = 1;
    let posX = 5;
    let posY = 5;
    let velX = velocidade;
    let velY = 0;
    let macaX = 10;
    let macaY = 10;
    let poderX = 20;
    let poderY = 20;
    let velXAnterior;
    let velYAnterior;
    let tamanhoDaPeca = 10;
    let quantidadeDePeca = 35;
    let peca = 5;
    let rastro = [];
    let tail = 5;
    let temPoder = false;
    let poderVisivel = true;
    let pontuacao = 0;
    let tempoVelocidade = 100;
    let movimenta = setInterval(meuGame, tempoVelocidade);
    var contagem = null;
    let mensagem_perdeu = document.getElementById("voce-perdeu");
    let jogarNovamente = document.getElementById("jogar-novamente");
    let botoes = document.getElementById("botoes");
    let voltar = document.getElementById("voltar");
    let cobraVerde = true;
    let pausar = document.getElementById("pausar");
    let continuar = document.getElementById("continuar");
    let sair = document.getElementById("sair")
    let tempo = 0;
    let container = document.querySelector(".container");
    
    const estado = {
        velX: velX,
        velY: velY,
        velocidade: velocidade
    };

    document.addEventListener("keydown", (event) => controlePc(event, estado));
    controleMobile(estado);

    piscaPisca.style.left = "150px";
    piscaPisca.style.top = "80px";

    if (selectedColor) {
        document.body.style.backgroundColor = selectedColor;
    }

    //pontucaco
    function atualizarPontuacao() {
        document.getElementById("pontuacao").textContent = "Pontuação: " + pontuacao;
    }

    //tempo do jogo
    function contarTempo() {
        tempo += 10;
        document.getElementById("tempo").textContent = tempo;
    }


    //botao que fecha a explicaçao
    fecharSobre.addEventListener("click", () => {
        const computedStyle = window.getComputedStyle(sobre);
    
        if (computedStyle.display === "block") {
            contagem = setInterval(contarTempo, 200);
            sobre.style.display = "none";
            container.style.display = "block";
        } else {
            sobre.style.display = "block";
            container.style.display = "none";
        }
    });
    
    
    //botao pausar
    pausar.addEventListener("click", () => {
        velXAnterior = estado.velX;
        velYAnterior = estado.velY;
        clearInterval(movimenta);
        clearInterval(contagem);
        botoes.style.display = "none";
        continuar.style.display = "block";
        sair.style.display = "block";
        pausar.style.display = "none";
        mensagem_perdeu.style.display = "none";
    }, false);


    //botao continuar
    continuar.addEventListener("click", () => {
        estado.velX = velXAnterior;
        estado.velY = velYAnterior;
        movimenta = setInterval(meuGame, tempoVelocidade);
        contagem = setInterval(contarTempo, 200);
        botoes.style.display = "block";
        pausar.style.display = "block";
        continuar.style.display = "none";
        sair.style.display = "none";
        pausar.style.paddingLeft = "8px";
        pausar.style.paddingTop = "4px";
        jogarNovamente.style.display = "none";
        voltar.style.display = "none";
        mensagem_perdeu.style.display = "none";
        sobre.style.display = "none";
    });

    jogarNovamente.addEventListener("click", () => {
        Carregar();
    });

    //funcao do jogo
    var meuGame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        mensagem_perdeu.style.display = "none";
        
        canvas.width = 350;
        canvas.height = 350;
        
        
        //background tabuleiro
        ctx.fillStyle = "#1c1c1c";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        canvas.style.opacity = 0.8;

        posX += estado.velX;
        posY += estado.velY;

        if (posX < 0) {
            posX = quantidadeDePeca - 1;
        }
        if (posX > quantidadeDePeca - 1) {
            posX = 0;
        }
        if (posY < 0) {
            posY = quantidadeDePeca - 1;
        }
        if (posY > quantidadeDePeca - 1) {
            posY = 0;
        }

        //linhas da grades
        ctx.shadowColor = "#2b2b2b";
        ctx.shadowBlur = 10;
        for (var x = 0; x < canvas.width; x += tamanhoDaPeca) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (var y = 0; y < canvas.height; y += tamanhoDaPeca) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        //desenha a maça
        ctx.fillStyle = "#F76C5E";
        ctx.fillRect(macaX * tamanhoDaPeca, macaY * tamanhoDaPeca, tamanhoDaPeca, tamanhoDaPeca);

        // Função que desenha o poder se estiver visível
        function desenharPoder() {
            if (poderVisivel) {
                ctx.fillStyle = "#FFD700";
                ctx.fillRect(poderX * tamanhoDaPeca, poderY * tamanhoDaPeca, tamanhoDaPeca, tamanhoDaPeca);
            }
        }
        desenharPoder();

        //ativa efeito do poder
        if (temPoder) {
            if (cobraVerde) {
                ctx.fillStyle = "#FFD700";
            } else {
                ctx.fillStyle = "#6ECB63";
            }
            cobraVerde = !cobraVerde;
        } else {
            ctx.fillStyle = "#6ECB63";
        }

        
        // desenha a cobrinha
        for (var i = 0; i < rastro.length; i++) {
            ctx.stroke();
            ctx.fillRect(rastro[i].x * tamanhoDaPeca, rastro[i].y * tamanhoDaPeca, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
            
            //verifica colisao da cobra com ela mesma
            if (!temPoder && rastro[i].x == posX && rastro[i].y == posY) {
                estado.velX = 0;
                estado.velY = 0;
                tail = 5;
                mensagem_perdeu.style.display = "block";
                pausar.style.display = "none";
                botoes.style.display = "none";
                jogarNovamente.style.display = "block";
                voltar.style.display = "block";
                localStorage.setItem("pontuacao", pontuacao);
                clearInterval(contagem);
            }
        }
        
        // Desenha os olhos
        if (rastro.length > 0) {
            const cabeca = rastro[rastro.length - 1];
            const corOriginal = ctx.fillStyle;
            
            // Desenha os olhos
            ctx.fillStyle = 'black';
            ctx.fillRect(
                (cabeca.x + 0.25) * tamanhoDaPeca,
                (cabeca.y + 0.25) * tamanhoDaPeca,
                tamanhoDaPeca / 4,
                tamanhoDaPeca / 4
            ); // Olho esquerdo
            
            ctx.fillRect(
                (cabeca.x + 0.75) * tamanhoDaPeca,
                (cabeca.y + 0.25) * tamanhoDaPeca,
                tamanhoDaPeca / 4,
                tamanhoDaPeca / 4
            ); // Olho direito
            
            ctx.fillStyle = corOriginal;
        }
        
        rastro.push({
            x: posX,
            y: posY
        });
        
        while (rastro.length > tail) {
            rastro.shift();
        }
        
        //funcao para  atualizar a nova posiçao do poder
        function posicaoPoder(){
            poderX = Math.floor(Math.random() * quantidadeDePeca);
            poderY = Math.floor(Math.random() * quantidadeDePeca);

            poderVisivel = true;
            desenharPoder();
        }

        //funcao para  atualizar a nova posiçao da maça
        function posicaoMaca(){
            macaX = Math.floor(Math.random() * quantidadeDePeca);
            macaY = Math.floor(Math.random() * quantidadeDePeca);
        }

        //verifica colisao da cobra com a maça
        if (macaX == posX && macaY == posY) {

            //adiciona mais um gomo na cobrinha e atualiza a posiçao da maça
            tail++;
            posicaoMaca();

            pontuacao += 10;

            if (pontuacao % 100 === 0) {
                tempoVelocidade -= 10;

                // Limita para não ficar rápido demais -> NAO TOCAR NISSO
                if (tempoVelocidade < 50) {
                    tempoVelocidade = 50;
                }

                // Atualiza o intervalo do jogo
                clearInterval(movimenta);
                movimenta = setInterval(meuGame, tempoVelocidade);

                console.log("Atualizou velocidade: ", tempoVelocidade);
            }
            document.getElementById("pontuacao").innerHTML = "Pontuação: " + pontuacao;
            atualizarPontuacao();
        }

        //verifica colisao da cobra com o poder
        if (poderX == posX && poderY == posY) {
            poderVisivel = false;
            //ativa e remove poder
            if (!temPoder) {
                temPoder = true;
                
                setTimeout(function () {
                    temPoder = false;
                }, 7000);


                //mostr o tempo  restante do poder
                var poderTempo = 7;

                for (let i = 0; i <= poderTempo; i++) {
                    setTimeout(() => {
                        if (poderTempo - i === 0) {
                            document.getElementById("tempo-poder").innerHTML = " ";
                        } else {
                            document.getElementById("tempo-poder").innerHTML = poderTempo - i;
                        }
                    }, 1000 * i);
                }
            } 

            // espera para atualizar a nova posiçao da maça
            setTimeout(() => {
                posicaoPoder();
                poderVisivel = true;
            }, 15000);
        }
    };
    
    movimenta = setInterval(meuGame, tempoVelocidade);
};