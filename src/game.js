import { controlePc, controleMobile } from "./controles.js";

window.onload = function () {
    let canvas = document.querySelector("#gameCanvas");
    let ctx = canvas.getContext("2d");
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
    let particulas = [];
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
    let ultimoFrame = 0;
    let jogoPausado = false;
    
    //estado dos controle
    const estado = {
        velX: velX,
        velY: velY,
        velocidade: velocidade
    };
    
    //incia jogo automaticamente
    if (typeof container === "undefined") {
        const container = document.getElementById("container");
        container.style.display = "block";
    } else {
        container.style.display = "block";
    }
    contagem = setInterval(contarTempo, 200);
    console.log("Iniciado automático");
    
    
    //funcao para configurar controles
    function configurarControles() {
        document.addEventListener("keydown", (event) => controlePc(event, estado));
        controleMobile(estado);
    }
    
    //pontucaco
    function atualizarPontuacao() {
        document.getElementById("pontuacao").textContent = "Pontuação: " + pontuacao;
    }

    //tempo do jogo
    function contarTempo() {
        if (contagem !== null) clearInterval(contagem);
        contagem = setInterval(contarTempo, 200)
        tempo += 10;
        document.getElementById("tempo").textContent = tempo;
    }

    function pausarJogo(){
        jogoPausado = true;
        velXAnterior = estado.velX;
        velYAnterior = estado.velY;
        clearInterval(movimenta);
        clearInterval(contagem);
        botoes.style.display = "none";
        continuar.style.display = "block";
        sair.style.display = "block";
        pausar.style.display = "none";
        mensagem_perdeu.style.display = "none";
    }
    
    function continuarJogo(){
        if (!jogoPausado) return;
        jogoPausado = false;
        
        ultimoFrame = performance.now();
        
        estado.velX = velXAnterior;
        estado.velY = velYAnterior;
        
        contagem = setInterval(contarTempo, 200);
        
        console.log('velXAnterior:', velXAnterior, 'velYAnterior:', velYAnterior);
        
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
    }

    //botao pausar
    pausar.addEventListener("click", () => {
       pausarJogo();
    });
    
    // botão continuar
    continuar.addEventListener("click", () => {
       continuarJogo();
    });
    
    // botão jogar novamente
    jogarNovamente.addEventListener("click", () => {
       Carregar();
    });
    
    //funcao do jogo
    var meuGame = () => {
        if (jogoPausado) return;
        
        console.log("Game rodando", estado.velX, estado.velY);
        
        function desenhaTabuleiro() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            mensagem_perdeu.style.display = "none";
            
            canvas.width = 350;
            canvas.height = 350;
            
            // background tabuleiro
            ctx.fillStyle = "#121212";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            canvas.style.opacity = 0.8;
            
            // movimentacao e teletransporte
            posX += estado.velX;
            posY += estado.velY;
            
            if (posX < 0) posX = quantidadeDePeca - 1;
            if (posX > quantidadeDePeca - 1) posX = 0;
            if (posY < 0) posY = quantidadeDePeca - 1;
            if (posY > quantidadeDePeca - 1) posY = 0;
        }
        
        // desenha grade do tabuleiro
        function desenhaGrade() {
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
            
            // Linhas da grade
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
        }
        
        //desenha a maça
        function desenhaMaca(){
            ctx.fillStyle = "#E74C3C";
            ctx.fillRect(macaX * tamanhoDaPeca, macaY * tamanhoDaPeca, tamanhoDaPeca, tamanhoDaPeca);
        }
        
        //gera a cor rbg das partículas a partir de um código hexadecimal
        function hexToRgb(hex) {
            hex = hex.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `${r}, ${g}, ${b}`;
        }
        
        //particulas de efeito de colisao
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
                ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
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
            const raio = tamanhoDaPeca * 2.2;
            
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
        
        // desenha a cobrinha
        function desenhaCobra(){
            for (var i = 0; i < rastro.length; i++) {
    
                const alpha = (i + 1) / rastro.length;
                ctx.fillStyle = `rgba(0, 210, 106, ${alpha})`;
                
                //ativa efeito do poder
                if (temPoder) {
                    ctx.fillStyle = "#00D26A";
                    
                    if (cobraVerde) {
                        ctx.fillStyle = "#6C5CE7";
                    } else {
                        ctx.fillStyle = "#00D26A";
                    }
                    cobraVerde = !cobraVerde;
                    
                } else {
                    const alpha = (i + 1) / rastro.length;
                    ctx.shadowColor = "transparent";
                }
                
                ctx.fillRect(
                    rastro[i].x * tamanhoDaPeca,
                    rastro[i].y * tamanhoDaPeca,
                    tamanhoDaPeca - 1,
                    tamanhoDaPeca - 1
                )
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
        }
        
        // Desenha os olhos
        function desenhaOlhos(){
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
        }
        
        //desenha rastro
        function desenhaRastro(){
            rastro.push({
                x: posX,
                y: posY
            });
            
            while (rastro.length > tail) {
                rastro.shift();
            }
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
        
        // Verifica se um círculo colidiu com um retângulo
        function colisaoCirculoRetangulo(cx, cy, raio, rx, ry, largura, altura) {
            const testeX = Math.max(rx, Math.min(cx, rx + largura));
            const testeY = Math.max(ry, Math.min(cy, ry + altura));
            const distancia = Math.hypot(cx - testeX, cy - testeY);
            
            // Retorna true se a distância for menor que o raio
            return distancia < raio;
        }
        
        //
        function verificaColisaoCobraOuAuraComMaca() {
            //colisao cobra e maça sem poder
            const colidiuComCobra = (macaX === posX && macaY === posY);
            
            let colidiuComAura = false;
            if (temPoder) {
                const cx = (posX + 0.5) * tamanhoDaPeca;
                const cy = (posY + 0.5) * tamanhoDaPeca;
                const raioAura = tamanhoDaPeca * 2.2;
                
                const rx = macaX * tamanhoDaPeca;
                const ry = macaY * tamanhoDaPeca;
                
                if (colisaoCirculoRetangulo(cx, cy, raioAura, rx, ry, tamanhoDaPeca, tamanhoDaPeca)) {
                    colidiuComAura = true;
                }
            }
            
            //verifica colisao cobrinha normal e cobrinha com aura
            if (colidiuComCobra || colidiuComAura) {
                //aplica colisao especial
                if(colidiuComAura){
                    explodirParticulas(
                        macaX * tamanhoDaPeca + tamanhoDaPeca / 2,
                        macaY * tamanhoDaPeca + tamanhoDaPeca / 2,
                        "#E74C3C"
                    );
                }
                tail++;
                posicaoMaca();
                
                pontuacao += 10;
                
                if (pontuacao % 100 === 0) {
                    tempoVelocidade -= 10;
                    if (tempoVelocidade < 50) tempoVelocidade = 50;
                    
                    clearInterval(movimenta);
                    movimenta = setInterval(meuGame, tempoVelocidade);
                    
                    console.log("Atualizou velocidade: ", tempoVelocidade);
                }
                
                document.getElementById("pontuacao").innerHTML = "Pontuação: " + pontuacao;
                atualizarPontuacao();
            }
        }
    
        //verifica colisao da cobra com o poder
        function verificaColisaoCobraEPoder(){
            if (poderX == posX && poderY == posY) {
                poderVisivel = false;
                //ativa e remove poder
                if (!temPoder) {
                    temPoder = true;
                    
                    setTimeout(function() {
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
        }
        
        // === RENDERIZAÇÃO ===
        desenhaTabuleiro();
        desenhaGrade();
        desenhaCobra();
        desenhaOlhos();
        desenhaRastro();
        desenhaMaca();
        desenharParticulas();
        desenharPoder();
        
        // === DETECÇÃO DE COLISÕES ===
        verificaColisaoCobraOuAuraComMaca();
        verificaColisaoCobraEPoder();
        
        // === CONFIGURACOES ===
        configurarControles();
    };

    //MOTOR - nao é o ideal, mas funciona!
    movimenta = setInterval(
        meuGame,
        tempoVelocidade
    );
};
