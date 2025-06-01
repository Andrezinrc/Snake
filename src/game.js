import { controlePc, controleMobile } from "./controles.js";

//inicia o jogo
window.onload = function () {
    
    const gameState = {
        canvas: document.querySelector("#gameCanvas"),
        ctx: null,
        
        //Elementos da interface
        container: document.querySelector(".container"),
        mensagem_perdeu: document.getElementById("voce-perdeu"),
        botoes: document.getElementById("botoes"),
        pausar: document.getElementById("pausar"),
        continuar: document.getElementById("continuar"),
        jogarNovamente: document.getElementById("jogar-novamente"),
        sair: document.getElementById("sair"),
        feedbackFinal: document.getElementById("feedback-final"),
        pontuacaoFinal: document.getElementById("pontuacao-final"),
        recordeFinal: document.getElementById("recorde-final"),
        
        //Inicializa o contexto do canvas
        init() {
            this.ctx = this.canvas.getContext("2d");
        },
        
        // Parâmetros do jogo
        tamanhoDaPeca: 10,
        quantidadeDePeca: 35,
        velocidade: 1,
        tempoVelocidade: 100,
        pos: { x: 5, y: 5 },
        vel: { x: 1, y: 0 },
        velAnterior: { x: null, y: null },
        maca: { x: 10, y: 10 },
        poder: { x: 20, y: 20},
        rastro: [],
        tail: 5,
        temPoder: false,
        pontuacao: 0,
        ultimaPontuacaoVerificada: 0,
        recordeSalvo: localStorage.getItem("recorde") || 0,
        dificuldadeAtual: 0,
        cobraVerde: true,
        tempo: 0,
        poderTempo: 0,
        jogoPausado: false,
        ultimoFrame: 0,
        particulas: [],
        contagem: null,
        movimenta: null,
        poderVisivel: true,
        tongueVisible: true,
        perdeu: false,
        
        //funções relacionadas a interface
        initUI() {
            this.container = document.querySelector(".container"),
            this.mensagem_perdeu = document.getElementById("voce-perdeu");
            this.pausar = document.getElementById("pausar");
            this.continuar = document.getElementById("continuar");
            this.sair = document.getElementById("sair");
            this.jogarNovamente = document.getElementById("jogarNovamente");
            this.voltar = document.getElementById("voltar");
            this.feedbackFinal = document.getElementById("feedback-final");
            this.pontuacaoFinal = document.getElementById("pontuacao-final");
            this.recordeFinal = document.getElementById("recorde-final");
        },
        
        // atualiza o tempo na interface
        contarTempo() {
            if (this.contagem !== null) clearInterval(this.contagem);
            this.contagem = setInterval(this.contarTempo, 200)
            this.tempo += 10;
            document.getElementById("tempo").textContent = this.tempo;
        },
        
        // atualiza a pontuação na interface
        atualizarPontuacao() {
            document.getElementById("pontuacao").textContent = "Pontuação: " + this.pontuacao;
        },
        
        // controle de pausa e continuação
        pausarJogo() {
            this.jogoPausado = true;
            this.velAnterior.x = this.vel.x;
            this.velAnterior.y = this.vel.y;
            clearInterval(this.movimenta);
            clearInterval(this.contagem);
            botoes.style.display = "none";
            continuar.style.display = "block";
            sair.style.display = "block";
            pausar.style.display = "none";
            this.mensagem_perdeu.style.display = "none";
        },
        
        continuarJogo() {
            if (!this.jogoPausado) return;
            this.jogoPausado = false;
            
            this.ultimoFrame = performance.now();
            
            this.vel.x = this.velAnterior.x;
            this.vel.y = this.velAnterior.y;
            
            console.log('velXAnterior:', this.velAnterior.x, 'velYAnterior:', this.velAnterior.y);
            
            this.movimenta = setInterval(meuGame, this.tempoVelocidade);
            this.contagem = setInterval(this.contarTempo.bind(this), 200);
            botoes.style.display = "block";
            pausar.style.display = "block";
            continuar.style.display = "none";
            sair.style.display = "none";
            pausar.style.paddingLeft = "8px";
            pausar.style.paddingTop = "4px";
            jogarNovamente.style.display = "none";
            voltar.style.display = "none";
            this.mensagem_perdeu.style.display = "none";
        },
        
        //game over
        gameOver() {
            this.vel.x = 0;
            this.vel.y = 0;
            this.tail = 5;
            this.perdeu = true;
            this.mensagem_perdeu.style.display = "block";
            this.pausar.style.display = "none";
            this.botoes.style.display = "none";
            this.jogarNovamente.style.display = "block";
            this.voltar.style.display = "block";
            
            if(this.recordeSalvo < 1){
                document.getElementById("mensagem-final").textContent = "Primeiro passo rumo ao topo!";
            } else if (this.pontuacao > this.recordeSalvo) {
                localStorage.setItem("recorde", this.pontuacao);
                document.getElementById("mensagem-final").textContent = "Novo recorde! Você mandou muito bem!";
            } else if (this.pontuacao >= this.recordeSalvo * 0.8) {
                document.getElementById("mensagem-final").textContent = "Você quase bateu o recorde!";
            } else {
                document.getElementById("mensagem-final").textContent = "Ainda dá pra melhorar!";
            }
    
            document.getElementById("pontuacao-final").textContent = this.pontuacao;
            document.getElementById("recorde-final").textContent = Math.max(this.pontuacao, this.recordeSalvo);
            
            document.getElementById("feedback-final").style.display = "block";
        
            clearInterval(this.contagem);
        },
        
        //configuração dos botões
        configurarBotoes() {
            this.pausar.addEventListener("click", () => {
                this.pausarJogo();
            });
            
            this.continuar.addEventListener("click", () => {
                this.continuarJogo();
            });
    
            this.jogarNovamente.addEventListener("click", () => {
                Carregar();
            });
            
            this.voltar.addEventListener("click", () => {
                window.location.href = "home.html";
            });
            
            this.sair.addEventListener("click", () => {
                window.location.href = "https://www.google.com.br";
            });
        },
        
        // configuração dos controles teclado e mobile
        configurarControles() {
            document.addEventListener("keydown", (event) => controlePc(event, this));
            controleMobile(this);
        }
    };
    
    
    //Inicializa o contexto do canvas
    gameState.init();
    
    
    // desestruturação de variáveis para leitura fácil
    let {
        ctx,
        tamanhoDaPeca,
        quantidadeDePeca,
        velocidade,
        pos,
        vel,
        velAnterior,
        maca,
        poder,
        rastro,
        tail,
        temPoder,
        cobraVerde,
        tempo,
        jogoPausado,
        ultimoFrame,
        particulas,
        movdimenta,
        poderVisivel
    } = gameState;
    
    
    //funcao do jogo
    var meuGame = () => {
        if (jogoPausado) return;
        
        console.log("Game rodando", vel.x,vel.y);
        
        function desenhaTabuleiro() {
            ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
            gameState.mensagem_perdeu.style.display = "none";
            
            gameState.canvas.width = 350;
            gameState.canvas.height = 350;
            
            // background tabuleiro
            ctx.fillStyle = "#121212";
            ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
            gameState.canvas.style.opacity = 0.8;
            
            // movimentacao e teletransporte
            pos.x += vel.x;
            pos.y += vel.y;
            
            if (pos.x < 0) pos.x = quantidadeDePeca - 1;
            if (pos.x > quantidadeDePeca - 1) pos.x = 0;
            if (pos.y < 0) pos.y = quantidadeDePeca - 1;
            if (pos.y > quantidadeDePeca - 1) pos.y = 0;
        }
        
        // desenha grade do tabuleiro
        function desenhaGrade() {
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
            
            // Linhas da grade
            ctx.strokeStyle = "#2b2b2b";
            ctx.lineWidth = 1;
            
            for (var x = 0; x < gameState.canvas.width; x += tamanhoDaPeca) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, gameState.canvas.height);
                ctx.stroke();
            }
            
            for (var y = 0; y < gameState.canvas.height; y += tamanhoDaPeca) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(gameState.canvas.width, y);
                ctx.stroke();
            }
        }
        
        //desenha a maça
        function desenhaMaca(){
            ctx.fillStyle = "#E74C3C";
            ctx.fillRect(maca.x * tamanhoDaPeca, maca.y * tamanhoDaPeca, tamanhoDaPeca, tamanhoDaPeca);
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
                    poder.x * tamanhoDaPeca,
                    poder.y * tamanhoDaPeca,
                    tamanhoDaPeca,
                    tamanhoDaPeca
                );
                
                ctx.restore();
            }
        }
        
        // desenha a cobrinha
        function desenhaCobra(){
            for (var i = 0; i < rastro.length; i++){

                //ativa efeito do poder
                if (temPoder) {
                    ctx.fillStyle = "#00D26A";
                    
                    if (cobraVerde) {
                        ctx.fillStyle = "#6C5CE7";
                    } else {
                        ctx.fillStyle = "#00D26A";
                    }
                    cobraVerde = !cobraVerde;
                    
                }

                const x = rastro[i].x * tamanhoDaPeca;
                const y = rastro[i].y * tamanhoDaPeca;

                ctx.fillStyle = "#00ff88";
                ctx.fillRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
            
                ctx.strokeStyle = "#003322";
                ctx.strokeRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
                
                //binario estilo Matrix
                if (i < rastro.length - 1) {
                    ctx.fillStyle = "black";
                    ctx.font = "11px monospace";
                    const bit = Math.random() > 0.5 ? "1" : "0";
                    ctx.fillText(bit, x + 3, y + 8);
                }
                
                //verifica colisao da cobra com ela mesma
                if (!temPoder && rastro[i].x == pos.x && rastro[i].y == pos.y) {
                    gameState.gameOver();
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
        
        //desenha lingua
        function desenhaLingua(){
            if (rastro.length > 0) {
                const cabeca = rastro[rastro.length - 1];
                if (gameState.tongueVisible) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect((cabeca.x + 0.5) * tamanhoDaPeca, (cabeca.y + 
                    0.9) * tamanhoDaPeca, tamanhoDaPeca / 2, tamanhoDaPeca / 4);
                }
            }
            
            setInterval(() => {
                gameState.tongueVisible = !gameState.tongueVisible;
            }, 500);
        }
        
        //desenha rastro
        function desenhaRastro(){
            gameState.rastro.push({
                x: pos.x,
                y: pos.y
            });
            
            while (rastro.length > tail) {
                rastro.shift();
            }
        }
        
        //funcao para  atualizar a nova posiçao do poder
        function posicaoPoder(){
            poder.x = Math.floor(Math.random() * quantidadeDePeca);
            poder.y = Math.floor(Math.random() * quantidadeDePeca);

            poderVisivel = true;
            desenharPoder();
        }

        //funcao para  atualizar a nova posiçao da maça
        function posicaoMaca(){
            maca.x = Math.floor(Math.random() * quantidadeDePeca);
            maca.y = Math.floor(Math.random() * quantidadeDePeca);
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
            const colidiuComCobra = (maca.x === pos.x  && maca.y  === pos.y);
            
            let colidiuComAura = false;
            if (temPoder) {
                const cx = (pos.x + 0.5) * tamanhoDaPeca;
                const cy = (pos.y + 0.5) * tamanhoDaPeca;
                const raioAura = tamanhoDaPeca * 2.2;
                
                const rx = maca.x * tamanhoDaPeca;
                const ry = maca.y * tamanhoDaPeca;
                
                if (colisaoCirculoRetangulo(cx, cy, raioAura, rx, ry, tamanhoDaPeca, tamanhoDaPeca)) {
                    colidiuComAura = true;
                }
            }
            
            //verifica colisao cobrinha normal e cobrinha com aura
            if (colidiuComCobra || colidiuComAura) {
                //aplica colisao especial
                if(colidiuComAura){
                    explodirParticulas(
                        maca.x * tamanhoDaPeca +     tamanhoDaPeca / 2,
                        maca.y * tamanhoDaPeca + tamanhoDaPeca / 2,
                        "#E74C3C"
                    );
                }
                tail++;
                posicaoMaca();
                
                gameState.pontuacao += 10;
                
                document.getElementById("pontuacao").innerHTML = "Pontuação: " + 
                gameState.pontuacao;
                gameState.atualizarPontuacao();
            }
        }
    
        //verifica colisao da cobra com o poder
        function verificaColisaoCobraEPoder(){
            if (poder.x == pos.x && poder.y == pos.y) {
                poderVisivel = false;
                //ativa e remove poder
                if (!temPoder) {
                    temPoder = true;
                    
                    setTimeout(function() {
                        temPoder = false;
                    }, 7000);
                    
                    //mostr o tempo  restante do poder
                    gameState.poderTempo = 7;
                    
                    for (let i = 0; i <= gameState.poderTempo; i++) {
                        setTimeout(() => {
                            if (gameState.poderTempo - i === 0) {
                                document.getElementById("tempo-poder").innerHTML = " ";
                            } else {
                                document.getElementById("tempo-poder").innerHTML = `${gameState.poderTempo - i}`
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
        // === INICIA AUTOMATICAMENTE ===
        gameState.initUI();
        if(!gameState.perdeu){
            gameState.contarTempo();
        }
        
        // === RENDERIZAÇÃO ===
        desenhaTabuleiro();
        desenhaGrade();
        desenhaCobra();
        desenhaOlhos();
        desenhaLingua();
        desenhaRastro();
        desenhaMaca();
        desenharParticulas();
        desenharPoder();
        
        // === DETECÇÃO DE COLISÕES ===
        verificaColisaoCobraOuAuraComMaca();
        verificaColisaoCobraEPoder();
        
        // === CONFIGURACOES ===
        gameState.configurarBotoes();
        gameState.configurarControles();
    };

    // === GAME LOOP ===
    function gameLoop(agora) {
        if (gameState.jogoPausado) return;
        
        const delta = agora - gameState.ultimoFrame;
        
        if (delta >= gameState.tempoVelocidade) {
            gameState.ultimoFrame = agora;
            meuGame();
            
            const dificuldadeCalculada = Math.floor(gameState.pontuacao / 100);
            
            if (dificuldadeCalculada > gameState.dificuldadeAtual) {
                gameState.dificuldadeAtual = dificuldadeCalculada;
                
                gameState.tempoVelocidade -= 10;
                if (gameState.tempoVelocidade < 50) {
                    gameState.tempoVelocidade = 50;
                    console.log("Velocidade maxima atingida: ", gameState.tempoVelocidade);
                }
                
                console.log("Velocidade aumentada: ", gameState.tempoVelocidade);
            }
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    gameState.ultimoFrame = performance.now();
    requestAnimationFrame(gameLoop);
};
