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
        
        //Inicializa o contexto do canvas
        init() {
            this.ctx = this.canvas.getContext("2d");
        },
        
        // Parâmetros do jogo
        tamanhoDaPeca: 10,
        quantidadeDePeca: 35,
        velocidade: 1,
        tempoVelocidade: 105,
        tempoVelocidadeInimiga: 300,
        pos: { x: 5, y: 5 },
        vel: { x: 1, y: 0 },
        velAnterior: { x: null, y: null },
        maca: { x: 10, y: 10 },
        poder: { x: 20, y: 20},
        rastro: [],
        tail: 1,
        temPoder: false,
        pontuacao: 0,
        ultimaPontuacaoVerificada: 0,
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
        },
        
        // atualiza o tempo na interface
        contarTempo() {
            if (this.contagem !== null) clearInterval(this.contagem);
            this.contagem = setInterval(this.contarTempo, 1000)
            this.tempo += 1;
            document.getElementById("tempo").textContent = this.tempo;
        },
                
       atualizarPontuacao() {
            const bits = this.pontuacao;
            const bytes = Math.floor(bits / 8);
            const extra = bits % 8;
            
            let texto = `${bytes}B`;
            if (extra > 0) texto += ` +${extra}b`;
            
            document.getElementById("pontuacao").textContent = texto;
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
    
    let alvo;
    let delayInimiga = 0;
    const intervaloIA = 5;
    let tempoUltimoMovInimiga = 0;
    let cobraInimigaRespawnTimer = null;
    
    
   //estado da cobra inimiga
   let cobraInimiga = {
        pos: { x: Math.floor(Math.random() * quantidadeDePeca), y: Math.floor(Math.random() * quantidadeDePeca) },
        vel: { x: 0, y: 0 },
        velAnterior: { x: null, y: null },
        rastro: [],
        tail: 5,
        cor: "#ff0033",
        ativa: true,
    };
    
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
            
            cobraInimiga.pos.x = Math.max(0, Math.min(quantidadeDePeca - 1, cobraInimiga.pos.x));
                cobraInimiga.pos.y = Math.max(0, Math.min(quantidadeDePeca - 1, cobraInimiga.pos.y));
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
        function desenhaMaca() {
            const x = maca.x * tamanhoDaPeca;
            const y = maca.y * tamanhoDaPeca;
            
            ctx.fillStyle = "#00ff88";
            ctx.font = "bold 14px monospace";
            const bit = Math.random() > 0.5 ? "1" : "0";
            ctx.fillText(bit, x + 3, y + 9);
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
            for (let i = 0; i < 10; i++) {
                gameState.particulas.push({
                    x: x,
                    y: y,
                    dx: (Math.random() - 0.5) * 6,
                    dy: (Math.random() - 0.5) * 6,
                    alpha: 1,
                    size: Math.random() * 0.8 + 0.2,
                    cor: cor,
                    vida: Math.random() * 40 + 60
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
            ctx.globalAlpha = 1.0;
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
            const x = poder.x * tamanhoDaPeca;
            const y = poder.y * tamanhoDaPeca;
            
            if (poderVisivel) {
                ctx.save();
                
                // Efeito de brilho
                ctx.shadowColor = "#6C5CE7";
                ctx.shadowBlur = 20;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            
                
                ctx.fillStyle = "#9B59FF";
                ctx.font = "bold 14px monospace";
                const bit = Math.random() > 0.5 ? "1" : "0";
                ctx.fillText(bit, x + 3, y + 9);
                
                ctx.restore();
            }
        }
        
        // desenha a cobrinha
        function desenhaCobra(){
            for (var i = 0; i < rastro.length; i++){

                const x = rastro[i].x * tamanhoDaPeca;
                const y = rastro[i].y * tamanhoDaPeca;
                
                const isCabeca = i === rastro.length - 1;
            
                ctx.fillStyle = isCabeca ? "#00ffaa" : "#002a1e";
                ctx.fillRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
                
                ctx.strokeStyle = isCabeca ? "#00ffcc" : "#003322";
                ctx.strokeRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
                
                // bit binario estilo terminal
                if (!isCabeca) {
                    ctx.fillStyle = "rgba(0,255,140,0.5)";
                    ctx.font = "bold 10px monospace";
                    const bit = Math.random() > 0.5 ? "1" : "0";
                    ctx.fillText(bit, x + 3, y + 8);
                }
                
                //verifica colisao da cobra com ela mesma
                if (!temPoder && rastro[i].x == pos.x && rastro[i].y == pos.y) {
                    gameState.gameOver();
                }
            }
        }
        
        //desenha cobrinha inimiga
        function desenhaCobraInimiga() {
            if (!cobraInimiga.ativa) return;
            
            for (let i = 0; i < cobraInimiga.rastro.length; i++) {
                const x = cobraInimiga.rastro[i].x * tamanhoDaPeca;
                const y = cobraInimiga.rastro[i].y * tamanhoDaPeca;
                
                const isCabeca = i === cobraInimiga.rastro.length - 1;
                
                ctx.fillStyle = isCabeca ? "#ff0033" : "#2a0000";
                ctx.fillRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
                
                if (!isCabeca) {
                    ctx.fillStyle = "red";
                    ctx.font = "bold 10px monospace";
                    const bit = Math.random() > 0.5 ? "1" : "0";
                    ctx.fillText(bit, x + 3, y + 8);
                }
            }
        }
        
        //atualiza cobrinha inimiga
        function atualizarCobraInimiga() {
            if (!cobraInimiga.ativa) return;
            
            const agora = Date.now();
            if (agora - tempoUltimoMovInimiga < gameState.tempoVelocidadeInimiga) return;
            tempoUltimoMovInimiga = agora;
            
            // Atualiza estado com base no tamanho
            cobraInimiga.estado = cobraInimiga.tail < 5 ? "fugindo" : "atacando";
            
            let alvo;
            
            if (cobraInimiga.estado === "fugindo") {
                //foge indo para a maçã
                alvo = maca;
            } else {
                // Decide entre a maçã ou o jogador mais proximo
                const distMaca = Math.abs(cobraInimiga.pos.x - maca.x) + Math.abs(cobraInimiga.pos.y - maca.y);
                
                let alvoJogadorMaisPerto = null;
                let distJogadorMaisPerto = Infinity;
                
                for (let i = 0; i < rastro.length; i++) {
                    const p = rastro[i];
                    const dist = Math.abs(cobraInimiga.pos.x - p.x) + Math.abs(cobraInimiga.pos.y - p.y);
                    if (dist < distJogadorMaisPerto) {
                        distJogadorMaisPerto = dist;
                        alvoJogadorMaisPerto = p;
                    }
                }
                
                alvo = distMaca < distJogadorMaisPerto ? maca : alvoJogadorMaisPerto;
            }
            
            // Movimento em direção ao alvo
            const dx = alvo.x - cobraInimiga.pos.x;
            const dy = alvo.y - cobraInimiga.pos.y;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                cobraInimiga.vel.x = dx > 0 ? 1 : -1;
                cobraInimiga.vel.y = 0;
            } else {
                cobraInimiga.vel.x = 0;
                cobraInimiga.vel.y = dy > 0 ? 1 : -1;
            }
            
            cobraInimiga.pos.x += cobraInimiga.vel.x;
            cobraInimiga.pos.y += cobraInimiga.vel.y;
            
            cobraInimiga.rastro.push({ x: cobraInimiga.pos.x, y: cobraInimiga.pos.y });
            while (cobraInimiga.rastro.length > cobraInimiga.tail) {
                cobraInimiga.rastro.shift();
            }
            
            // Se morrer
            if (cobraInimiga.tail <= 3) {
                cobraInimiga.ativa = false;
                cobraInimigaRespawnTimer = Date.now() + 60000;
                
                //recria a cobrinha inimiga em 1 minuto após a morte
                setTimeout(() => {
                    Object.assign(cobraInimiga, {
                        pos: {
                            x: Math.floor(Math.random() * quantidadeDePeca),
                            y: Math.floor(Math.random() * quantidadeDePeca)
                        },
                        vel: { x: 0, y: 0 },
                        rastro: [],
                        tail: 5,
                        estado: "fugindo",
                        ativa: true
                    });
                    cobraInimigaRespawnTimer = null;
                }, 60000);
            }
            
            // Mensagem de respawn
            if (!cobraInimiga.ativa && cobraInimigaRespawnTimer) {
                const tempoRestante = Math.ceil((cobraInimigaRespawnTimer - Date.now()) / 1000);
                if (tempoRestante > 0) {
                    ctx.fillStyle = "red";
                    ctx.font = "bold 14px monospace";
                    ctx.fillText(`⚠ Inimiga volta em ${tempoRestante}s`, 10, 20);
                }
            }
        }
                
        //colisao da cobrinha inimiga com jogador
        function checarColisaoComCobraInimiga() {
            const cabecaInimiga = cobraInimiga.rastro[cobraInimiga.rastro.length - 1];
            const cabecaJogador = rastro[rastro.length - 1];
            
            // Se jogador colidir com o corpo da inimiga
            for (let i = 0; i < cobraInimiga.rastro.length - 1; i++) {
                if (rastro.length > 0 &&
                    cobraInimiga.rastro[i].x === cabecaJogador.x &&
                    cobraInimiga.rastro[i].y === cabecaJogador.y) {
                    
                    //Ganha 1, ela perde 1
                    tail++;
                    gameState.pontuacao += 1;
                    gameState.atualizarPontuacao();
                    
                    if (cobraInimiga.tail > 1) cobraInimiga.tail--;
                }
            }
            
            //Se a cabeça da inimiga colidir com o corpo do jogador
            for (let i = 0; i < rastro.length - 1; i++) {
                if (rastro[i].x === cabecaInimiga.x && rastro[i].y === cabecaInimiga.y) {
                    
                    //Jogador perde 1, ela ganha 1
                    if (tail > 1) tail--;
                    cobraInimiga.tail++;
                }
            }
        }
        
        //verifica se a cobra inimiga pegou a maça
        function checarColisaoCobraInimigaEMaca() {
            const colidiuComCobra = (
                maca.x === cobraInimiga.pos.x &&
                maca.y === cobraInimiga.pos.y
            );
            
            if (colidiuComCobra) {
                cobraInimiga.tail++;
                posicaoMaca();
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
        
        //desenha olhos da cobrinha inimga
        function desenhaOlhosInimiga() {
            if (!cobraInimiga.ativa) return;
            
            const cabeca = cobraInimiga.rastro[cobraInimiga.rastro.length - 1];
            if (!cabeca) return;
            
            ctx.fillStyle = 'black';
            ctx.fillRect(
                (cabeca.x + 0.25) * tamanhoDaPeca,
                (cabeca.y + 0.25) * tamanhoDaPeca,
                tamanhoDaPeca / 4,
                tamanhoDaPeca / 4
            );
            
            ctx.fillRect(
                (cabeca.x + 0.75) * tamanhoDaPeca,
                (cabeca.y + 0.25) * tamanhoDaPeca,
                tamanhoDaPeca / 4,
                tamanhoDaPeca / 4
            );
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
        
        
        //verifica colisao da cobra e aura com a maca
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
                        "#00ff88"
                    );
                }
                tail++;
                posicaoMaca();
                
                gameState.pontuacao += 1;
                
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
        desenhaCobraInimiga();
        desenhaOlhosInimiga();
        desenhaLingua();
        desenhaRastro();
        desenhaMaca();
        desenharParticulas();
        desenharPoder();
        
        // === DETECÇÃO DE COLISÕES ===
        verificaColisaoCobraOuAuraComMaca();
        verificaColisaoCobraEPoder();
        atualizarCobraInimiga();
        checarColisaoComCobraInimiga();
        checarColisaoCobraInimigaEMaca();
        
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
                
                gameState.tempoVelocidade -= 5;
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