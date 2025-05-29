import { controlePc, controleMobile } from "./controles.js";

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
    //pontucaco
    function atualizarPontuacao() {
        document.getElementById("pontuacao").textContent = "Pontuação: " + pontuacao;
    }

    //tempo do jogo
    function contarTempo() {
        tempo += 10;
        document.getElementById("tempo").textContent = tempo;
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        contagem = setInterval(contarTempo, 200);
    });
    
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

    // botão pausar
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
    });
    
    // botão continuar
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
    
    // botão jogar novamente
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
        ctx.fillStyle = "#121212";
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
        ctx.strokeStyle = "#2b2b2b";
        ctx.lineWidth = 1;
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
        ctx.fillStyle = "#E74C3C";
        ctx.fillRect(macaX * tamanhoDaPeca, macaY * tamanhoDaPeca, tamanhoDaPeca, tamanhoDaPeca);
        
        let particulas = [];
        
        function hexToRgb(hex) {
            hex = hex.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `${r}, ${g}, ${b}`;
        }
        

        function explodirParticulas(x, y, cor) {
            for (let i = 0; i < 30; i++) {
                particulas.push({
                    x: x,
                    y: y,
                    dx: (Math.random() - 0.5) * 6,
                    dy: (Math.random() - 0.5) * 6,
                    alpha: 1,
                    size: Math.random() * 2 + 1,
                    cor: cor,
                    life: Math.random() * 40 + 60
                });
            }
        }
        
        //desenha particulas da maça
        function desenharParticulas() {
            for (let i = particulas.length - 1; i >= 0; i--) {
                const p = particulas[i];
                ctx.shadowColor = p.cor;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                p.alpha -= 0.01;
                p.life--;
                
                if (p.life <= 0 || p.alpha <= 0) {
                    particulas.splice(i, 1);
                }
            }
        }
        
        //cria efeito animacao poder
        function desenharAuraDaCabeca(cabeca, cor) {
            const centerX = (cabeca.x + 0.5) * tamanhoDaPeca;
            const centerY = (cabeca.y + 0.5) * tamanhoDaPeca;
            const raio = tamanhoDaPeca * 1.5;
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, raio, 0, Math.PI * 2);
            
            ctx.fillStyle = cor + "33"; // transparência
            ctx.fill();
            
            ctx.lineWidth = 0.1;
            ctx.strokeStyle = cor;
            ctx.stroke();
            ctx.restore();
        }
        
        // Função que desenha o poder se estiver visível
        function desenharPoder() {
            if (poderVisivel) {
                ctx.save();
                
                // Efeito de brilho
                ctx.shadowColor = "#6C5CE7";
                ctx.shadowBlur = 20;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                
                ctx.fillStyle = "#6C5CE7";
                ctx.fillRect(
                    poderX * tamanhoDaPeca,
                    poderY * tamanhoDaPeca,
                    tamanhoDaPeca,
                    tamanhoDaPeca
                );
                
                ctx.restore();
            }
        }
        desenharPoder();

        //ativa efeito do poder
        if (temPoder) {
            if (cobraVerde) {
                ctx.fillStyle = "#6C5CE7";
            } else {
                ctx.fillStyle = "#00D26A";
            }
            cobraVerde = !cobraVerde;
        } else {
            ctx.fillStyle = "#00D26A";
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
            // Aura ao redor da cabeça
            if (temPoder) {
                const corAura = cobraVerde ? "#6C5CE7" : "#00D26A";
                desenharAuraDaCabeca(cabeca, corAura);
            }

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
            //efeito de explosao
            explodirParticulas(
                macaX * tamanhoDaPeca + tamanhoDaPeca / 2,
                macaY * tamanhoDaPeca + tamanhoDaPeca / 2,
                "#E74C3C"
            );
            
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
                            document.getElementById("tempo-poder").innerHTML = `${poderTempo - i}`
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
        desenharParticulas();
    };
    
    movimenta = setInterval(
        meuGame, 
        tempoVelocidade
    );
};
