limport { controlePc, controleSwipeMobile } from "./controles.js";

window.addEventListener('touchmove', e => {
    e.preventDefault();
}, { passive: false });

const gameState = {
    canvas: document.querySelector("#gameCanvas"),
    
    //Elementos da interface
    container: document.querySelector(".container"),
    mensagem_final: document.getElementById("mensagem-final"),
    pausar: document.getElementById("pausar"),
    continuar: document.getElementById("continuar"),
    jogarNovamente: document.getElementById("jogar-novamente"),
    sair: document.getElementById("sair"),
    
    // Parâmetros do jogo
    jogoFinalizado: false,
    bitsEntregues: 0,
    bitsNecessarios: 5,
    
    tamanhoDaPeca: 10,
    quantidadeDePeca: 35,
    velocidade: 1,
    tempoVelocidade: 105,
    tempoVelocidadeInimiga: 108,
    pos: { x: 5, y: 5 },
    vel: { x: 1, y: 0 },
    ultimaDirecao: { x: 0, y: 0 },
    velAnterior: { x: null, y: null },
    maca: { x: 10, y: 10 },
    poder: { x: 20, y: 20 },
    rastro: [],
    tail: 1,
    temPoder: false,
    pontuacao: 0,
    ultimaPontuacaoVerificada: 0,
    dificuldadeAtual: 0,
    cobraVerde: true,
    tempo: 300,
    tempoAtual: 0,
    poderTempo: 0,
    jogoPausado: false,
    ultimoFrame: 0,
    particulas: [],
    contagem: null,
    movimenta: null,
    poderVisivel: true,
    tongueVisible: true,
    perdeu: false,
    ganhou: false,
    feedbackBits: [],
    
    
    //sistemas que precisam de bits no jogo
    sistemas: [
    { x: 0, y: 0, largura: 60, altura: 40, bits: 0, meta: 16, completo: false },
    { x: 350 - 60, y: 0, largura: 60, altura: 40, bits: 0, meta: 16, completo: false },
    { x: 0, y: 350 - 40, largura: 60, altura: 40, bits: 0, meta: 16, completo: false },
    { x: 350 - 60, y: 350 - 40, largura: 60, altura: 40, bits: 0, meta: 16, completo: false }
    ],
    sistemaAtual: 0,
    
    feedbackJogador: { ativo: false, texto: "-1", x: 0, y: 0, cor: "#00ff88" },

    
    // COBRINHA INIMIGA
    
    
    //funções relacionadas a interface
    initUI() {
        this.container = document.querySelector(".container"),
            this.mensagem_final = document.getElementById("mensagem-final");
        this.pausar = document.getElementById("pausar");
        this.continuar = document.getElementById("continuar");
        this.sair = document.getElementById("sair");
        this.jogarNovamente = document.getElementById("jogarNovamente");
        this.voltar = document.getElementById("voltar");
    },
    
    // Atualiza o tempo na interface com contagem regressiva
    contarTempo() {
        console.log("iniciou");
        
        // Limpa qualquer intervalo anterior
        if (this.contagem) {
            clearInterval(this.contagem);
        }
        
        this.contagem = setInterval(() => {
            try {
                console.log("setInterval rodando...");
                this.tempo--;
                
                const minutos = Math.floor(this.tempo / 60);
                const segundos = this.tempo % 60;
                
                document.getElementById("tempo").textContent =
                    `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
                
                if (this.tempo <= 0) {
                    clearInterval(this.contagem);
                    this.contagem = null; // Limpa referência
                    this.gameOver();
                }
            } catch (e) {
                console.error("Erro dentro do setInterval:", e);
            }
        }, 1000);
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
        
        this.ultimaDirecao.x = this.vel.x;
        this.ultimaDirecao.y = this.vel.y;
        
        clearInterval(this.movimenta);
        clearInterval(this.contagem);
        
        continuar.style.display = "block";
        sair.style.display = "block";
        pausar.style.display = "none";
        this.mensagem_final.style.display = "none";
    },
    
    continuarJogo() {
        if (!this.jogoPausado) return;
        
        console.log('Antes de continuar:', {
            vel: { x: this.vel.x, y: this.vel.y },
            velAnterior: { x: this.velAnterior.x, y: this.velAnterior.y },
            ultimaDirecao: { x: this.ultimaDirecao.x, y: this.ultimaDirecao.y }
        });
        
        this.jogoPausado = false;
        
        this.configurarControles();
        
        this.vel.x = this.velAnterior.x;
        this.vel.y = this.velAnterior.y;
        
        console.log('velXAnterior:', this.velAnterior.x, 'velYAnterior:', this.velAnterior.y);
        
        this.movimenta = setInterval(meuGame, this.tempoVelocidade);
        this.contarTempo();
        pausar.style.display = "block";
        continuar.style.display = "none";
        sair.style.display = "none";
        pausar.style.paddingLeft = "8px";
        pausar.style.paddingTop = "4px";
        jogarNovamente.style.display = "none";
        voltar.style.display = "none";
        this.mensagem_final.style.display = "none";
    },
    
    vitoria() {
        if (this.perdeu) return;
        if (this.ganhou) return;
         
        this.vel.x = 0;
        this.vel.y = 0;
        this.tail = 5;
        this.ganhou = true;
        this.mensagem_final.style.display = "block";
        this.mensagem_final.style.color = "green";
        document.getElementById("mensagem-final").innerText = "DADOS ENTREGUES!";
        this.pausar.style.display = "none";
        this.jogarNovamente.style.display = "block";
        this.voltar.style.display = "block";
        
        clearInterval(this.contagem);
        console.log("✅ Vitória chamada");
        
        this.jogoFinalizado = true;
    },
    
    //game over
    gameOver() {
        if (this.ganhou) return;
        if (this.perdeu) return;
        
        this.vel.x = 0;
        this.vel.y = 0;
        this.tail = 5;
        this.perdeu = true;
        this.mensagem_final.style.display = "block";
        document.getElementById("mensagem-final").innerText = "ERRO FATAL!";
        this.pausar.style.display = "none";
        this.jogarNovamente.style.display = "block";
        this.voltar.style.display = "block";
        
        clearInterval(this.contagem);
        console.log("❌ Game over chamado");
        
        this.jogoFinalizado = true;
    },
    
    //configuração dos botões
    configurarBotoes() {
        this.pausar.addEventListener("click", () => {
            this.pausarJogo();
        });
        
        this.continuar.addEventListener("click", () => {
            this.continuarJogo();
        });
        
        this.jogarNovamente.innerText = this.ganhou ? "Reiniciar missão" : "Tentar novamente";
        
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
        if (this.controlesConfigurados) return;
        this.controlesConfigurados = true;
        
        document.addEventListener("keydown", (event) => controlePc(event, this));
        controleSwipeMobile(this);
    }
};


//evitar verbosidade e acessar o gameState
const gs = gameState;
const bordaParticulas = [];

let pulsar = 0;

let alvo;
let delayInimiga = 0;
const intervaloIA = 5;
let tempoUltimoMovInimiga = 0;
let cobraInimigaRespawnTimer = null;
let ultimaPosicao = null;

let feedbackInimiga = { ativo: false, texto: "+1", x: 0, y: 0, cor: "red" };


//estado da cobra inimiga
let cobraInimiga = {
    pos: { x: Math.floor(Math.random() * gs.quantidadeDePeca), y: Math.floor(Math.random() * gs.quantidadeDePeca) },
    vel: { x: 0, y: 0 },
    velAnterior: { x: null, y: null },
    rastro: [],
    tail: 16,
    cor: "#ff0033",
    ativa: true,
    morta: false,
    
    modoCamuflagem: false,
    tempoCamuflagem: 0,
    usouCamuflagem: false,
};

const ci = cobraInimiga;

//Inicializa o contexto do canvas
const ctx = gs.canvas.getContext("2d");


//funcao do jogo
var meuGame = () => {
    if (gs.jogoPausado) return;
    console.log("Game rodando", gs.vel.x, gs.vel.y);
    inicializaParticulasBorda(30, gs.canvas.width);
    
    gs.tempoAtual = performance.now();
    
    //garante que a última direção registrada seja igual à velocidade atual,
    // evitando que o jogador faça movimentos reversos
    gs.ultimaDirecao.x = gs.vel.x;
    gs.ultimaDirecao.y = gs.vel.y;

    
    // === ANBIENTE DO JOGO ===
    
    // Partículas de dados
    let particulas = Array.from({ length: 30 }, () => ({
        x: Math.random() * 350,
        y: Math.random() * 350,
        r: Math.random() * 2 + 0.5,
        dy: Math.random() * 0.5 + 0.2
    }));
    
    function inicializaParticulasBorda(qtde, tamanhoCanvas) {
        bordaParticulas.length = 0;
        for (let i = 0; i < qtde; i++) {
            // sorteia posicao aleatoria em cima, baixo, esquerda ou direita
            const lado = Math.floor(Math.random() * 4);
            let x, y;
            switch (lado) {
                case 0: // topo
                    x = Math.random() * tamanhoCanvas;
                    y = 0;
                    break;
                case 1: // direita
                    x = tamanhoCanvas;
                    y = Math.random() * tamanhoCanvas;
                    break;
                case 2: // base
                    x = Math.random() * tamanhoCanvas;
                    y = tamanhoCanvas;
                    break;
                case 3: // esquerda
                    x = 0;
                    y = Math.random() * tamanhoCanvas;
                    break;
            }
            bordaParticulas.push({
                x,
                y,
                size: 2 + Math.random() * 3,
                alpha: Math.random(),
                alphaDir: Math.random() < 0.5 ? 1 : -1,
                speed: 0.02 + Math.random() * 0.05
            });
        }
    }
    
    function desenhaParticulasBorda(ctx) {
        const tamanhoCanvas = gs.canvas.width;
        
        bordaParticulas.forEach(p => {
            // Atualiza alfa pra piscar
            p.alpha += p.alphaDir * p.speed;
            if (p.alpha <= 0) {
                p.alpha = 0;
                p.alphaDir *= -1;
            } else if (p.alpha >= 1) {
                p.alpha = 1;
                p.alphaDir *= -1;
            }
            
            ctx.save();
            ctx.fillStyle = `rgba(255, 50, 0, ${p.alpha})`; // vermelho queimando
            ctx.shadowColor = `rgba(255, 100, 0, ${p.alpha})`;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
        
    // desenha passagens para cobrinha
    function desenharPassagens() {
        const passageSize = 20; // tamanho da passagem
        const passageHalf = passageSize / 2;
        const canvasSize = gameState.canvas.width;
        const center = canvasSize / 2;
        
        const alpha = 0.5 + 0.5 * Math.sin(pulsar);
        
        ctx.save();
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = `rgba(0, 200, 255, ${alpha})`;
        ctx.shadowColor = `rgba(0, 200, 255, ${alpha})`;
        ctx.shadowBlur = 10;
        
        // Passagem superior
        ctx.beginPath();
        ctx.moveTo(center - passageHalf, 0);
        ctx.lineTo(center + passageHalf, 0);
        ctx.lineTo(center + passageHalf, passageSize);
        ctx.lineTo(center - passageHalf, passageSize);
        ctx.closePath();
        ctx.stroke();
        
        // Passagem inferior
        ctx.beginPath();
        ctx.moveTo(center - passageHalf, canvasSize);
        ctx.lineTo(center + passageHalf, canvasSize);
        ctx.lineTo(center + passageHalf, canvasSize - passageSize);
        ctx.lineTo(center - passageHalf, canvasSize - passageSize);
        ctx.closePath();
        ctx.stroke();
        
        // Passagem esquerda
        ctx.beginPath();
        ctx.moveTo(0, center - passageHalf);
        ctx.lineTo(passageSize, center - passageHalf);
        ctx.lineTo(passageSize, center + passageHalf);
        ctx.lineTo(0, center + passageHalf);
        ctx.closePath();
        ctx.stroke();
        
        // passagem direita
        ctx.beginPath();
        ctx.moveTo(canvasSize, center - passageHalf);
        ctx.lineTo(canvasSize - passageSize, center - passageHalf);
        ctx.lineTo(canvasSize - passageSize, center + passageHalf);
        ctx.lineTo(canvasSize, center + passageHalf);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    
    //desenha tanbuleiro do jogo
    function desenhaTabuleiro() {
        ctx.clearRect(0, 0, gs.canvas.width, gs.canvas.height);
        gs.mensagem_final.style.display = "none";
        
        gs.canvas.width = 350;
        gs.canvas.height = 350;
        
        desenhaParticulasBorda(ctx);
        desenharPixelsVivos();
        desenharPassagens();
        
        // movimentacao
        gs.pos.x += gs.vel.x;
        gs.pos.y += gs.vel.y;
        
        // define meio do tabuleiro para as passagens
        const meio = Math.floor(gs.quantidadeDePeca / 2);
        const max = gs.quantidadeDePeca - 1;
        
        // funcao que verifica se esta na passagem da borda
        function estaNaPassagem(x, y) {
            // passagens no meio das 4 bordas
            return (
                (y === 0 && x === meio) || // topo
                (y === max && x === meio) || // base
                (x === 0 && y === meio) || // esquerda
                (x === max && y === meio) // direita
            );
        }
        
        // verifica colisão nas bordas
        if (gs.pos.x < 0) {
            if (estaNaPassagem(gs.quantidadeDePeca - 1, gs.pos.y)) {
                gs.pos.x = max; // atravessa para a direita
            } else {
                gs.gameOver();
            }
        } else if (gs.pos.x > max) {
            if (estaNaPassagem(0, gs.pos.y)) {
                gs.pos.x = 0; // atravessa para a esquerda
            } else {
                gs.gameOver();
            }
        }
        
        if (gs.pos.y < 0) {
            if (estaNaPassagem(gs.pos.x, max)) {
                gs.pos.y = max; // atravessa para baixo
            } else {
                gs.gameOver();
            }
        } else if (gs.pos.y > max) {
            if (estaNaPassagem(gs.pos.x, 0)) {
                gs.pos.y = 0; // atravessa para cima
            } else {
                gs.gameOver();
            }
        }
        
        // corrige a posicao da cobra inimiga
        ci.pos.x = Math.max(0, Math.min(max, ci.pos.x));
        ci.pos.y = Math.max(0, Math.min(max, ci.pos.y));
    }
        
    // desenha visualmente o terminal/sistema no tabuleiro
    function desenharTerminais(ctx) {
        gs.sistemas.forEach((sistema, i) => {
            let cor = '#555'; // desativado
            if (sistema.completo) cor = '#00ff00';
            else if (i === gs.sistemaAtual) {
                const pisca = Math.floor(gs.tempoAtual / 300) % 2 === 0;
                cor = pisca ? '#ff0033' : '#7a0000';
            }
            
            const gradiente = ctx.createLinearGradient(sistema.x, sistema.y, sistema.x + sistema.largura, sistema.y + sistema.altura);
            gradiente.addColorStop(0, '#1e1e1e');
            gradiente.addColorStop(1, '#2c2c2c');
            ctx.fillStyle = gradiente;
            ctx.fillRect(sistema.x, sistema.y, sistema.largura, sistema.altura);
            
            const brilho = (i === gs.sistemaAtual) ? Math.sin(gs.tempoAtual / 300) * 2 + 2 : 1;
            ctx.lineWidth = brilho;
            ctx.strokeStyle = cor;
            ctx.strokeRect(sistema.x, sistema.y, sistema.largura, sistema.altura);
            
            //Texto SYSTEM
            ctx.fillStyle = cor;
            ctx.font = 'bold 10px monospace';
            ctx.fillText(
                sistema.completo ? 'SUCCESS' :
                i === gs.sistemaAtual ? 'ERROR' : 'INACTIVE',
                sistema.x + 5,
                sistema.y + 15
            );
            
            //bits, barra e texto
            const progresso = sistema.bits / sistema.meta;
            ctx.fillStyle = '#888';
            ctx.fillRect(sistema.x + 5, sistema.y + 25, 50, 8);
            
            ctx.fillStyle = sistema.completo ? '#00ff00' : '#00ff99';
            ctx.fillRect(sistema.x + 5, sistema.y + 25, 50 * progresso, 8);
            
            ctx.fillStyle = '#ccc';
            ctx.font = '8px monospace';
            ctx.fillText(`${sistema.bits}b/${sistema.meta}b`, sistema.x + 10, sistema.y + 38);
        });
    }
    
    //desenha efeitos de chuvisco
    function desenharPixelsVivos() {
        for (let i = 0; i < 25; i++) {
            const x = Math.floor(Math.random() * gs.canvas.width);
            const y = Math.floor(Math.random() * gs.canvas.height);
            const brilho = Math.random() * 0.4 + 0.1;
            ctx.fillStyle = `rgba(155, 89, 255, ${brilho})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    
    
    // === COBRINHA JOGADOR  ===
    
    
    // Desenha os olhos
    function desenhaOlhos() {
        if (gs.rastro.length > 0) {
            const cabeca = gs.rastro[gs.rastro.length - 1];
            // Aura ao redor da cabeça
            if (gs.temPoder) {
                const corAura = gs.cobraVerde ? "#6C5CE7" : "#00D26A";
                desenharAuraDaCabeca(cabeca, corAura);
            }
            
            const corOriginal = ctx.fillStyle;
            
            // Desenha os olhos
            ctx.fillStyle = 'black';
            ctx.fillRect(
                (cabeca.x + 0.25) * gs.tamanhoDaPeca,
                (cabeca.y + 0.25) * gs.tamanhoDaPeca,
                
                gs.tamanhoDaPeca / 4,
                gs.tamanhoDaPeca / 4
            ); // Olho esquerdo
            
            ctx.fillRect(
                (cabeca.x + 0.75) * gs.tamanhoDaPeca,
                (cabeca.y + 0.25) * gs.tamanhoDaPeca,
                gs.tamanhoDaPeca / 4,
                gs.tamanhoDaPeca / 4
            ); // Olho direito
            
            ctx.fillStyle = corOriginal;
        }
    }
    
    
    //desenha lingua
    function desenhaLingua() {
        if (gs.rastro.length > 0 && gs.tongueVisible) {
            const cabeca = gs.rastro[gs.rastro.length - 1];
            
            ctx.fillStyle = 'red';
            ctx.fillRect(
                (cabeca.x + 0.5) * gs.tamanhoDaPeca,
                (cabeca.y + 0.9) * gs.tamanhoDaPeca,
                gs.tamanhoDaPeca / 2,
                gs.tamanhoDaPeca / 4
            );
        }
        //Anima a língua
        setInterval(() => {
            gs.tongueVisible = !gs.tongueVisible;
        }, 500);
    }
    
    
    // desenha a cobrinha
    function desenhaCobra() {
        for (var i = 0; i < gs.rastro.length; i++) {
            const x = gs.rastro[i].x * gs.tamanhoDaPeca;
            const y = gs.rastro[i].y * gs.tamanhoDaPeca;
            const isCabeca = i === gs.rastro.length - 1;
            
            if (isCabeca) {
                ctx.fillStyle = "#00ffaa";
                ctx.fillRect(x, y, gs.tamanhoDaPeca - 1, gs.tamanhoDaPeca - 1);
            } else {
                ctx.fillStyle = "#00261a";
                ctx.fillRect(x, y, gs.tamanhoDaPeca - 1, gs.tamanhoDaPeca - 1);
    
                // bits verdes
                ctx.fillStyle = "rgba(0,255,140,0.5)";
                ctx.font = "bold 10px monospace";
                const bit = Math.random() > 0.5 ? "1" : "0";
                ctx.fillText(bit, x + 3, y + 8);
            }
            
            // Colisão com o próprio corpo
            if (!gs.temPoder && gs.rastro[i].x === gs.pos.x && gs.rastro[i].y === gs.pos.y) {
                gs.gameOver();
                gs.perdeu = true;
                
                //para a cobrinha inimiga
                ci.vel.x = 0;
                ci.vel.t = 0;
            }
        }
    }
    
    //desenha rastro
    function desenhaRastro() {
        gs.rastro.push({
            x: gs.pos.x,
            y: gs.pos.y
        });
        
        while (gs.rastro.length > gs.tail) {
            gs.rastro.shift();
        }
    }
    
    
    // === COBRINHA INIMIGA  ===
    
    
    //desenha olhos da cobrinha inimga
    function desenhaOlhosInimiga() {
        if (!ci.ativa) return;
        
        const cabeca = ci.rastro[ci.rastro.length - 1];
        if (!cabeca) return;
        
        ctx.fillStyle = 'black';
        ctx.fillRect(
            (cabeca.x + 0.25) * gs.tamanhoDaPeca,
            (cabeca.y + 0.25) * gs.tamanhoDaPeca,
            gs.tamanhoDaPeca / 4,
            gs.tamanhoDaPeca / 4
        );
        
        ctx.fillRect(
            (cabeca.x + 0.75) * gs.tamanhoDaPeca,
            (cabeca.y + 0.25) * gs.tamanhoDaPeca,
            gs.tamanhoDaPeca / 4,
            gs.tamanhoDaPeca / 4
        );
    }
    
    
    //desenha cobrinha inimiga
    function desenhaCobraInimiga() {
        if (ci.ativa) {
            ctx.save();
            
            if (ci.modoCamuflagem) {
                ctx.globalAlpha = 0.15;
            } else {
                ctx.globalAlpha = 1;
            }
            
            for (let i = 0; i < ci.rastro.length; i++) {
                const x = ci.rastro[i].x * gs.tamanhoDaPeca;
                const y = ci.rastro[i].y * gs.tamanhoDaPeca;
                
                const isCabeca = i === ci.rastro.length - 1;
                
                ctx.fillStyle = isCabeca ? "#ff0033" : "#4a0000";
                ctx.fillRect(x, y, gs.tamanhoDaPeca - 1, gs.tamanhoDaPeca - 1);
                
                //desenha barrinha de vida
                if (isCabeca) {
                    const vidaMaxima = 15;
                    const larguraMax = gs.tamanhoDaPeca + 5;
                    const alturaBarra = 3;
                    
                    const vidaAtual = ci.tail;
                    const larguraAtual = (vidaAtual / vidaMaxima) * larguraMax;
                    
                    // Cor da barra de vida
                    let corVida = "#00ff66"; //verde
                    if (vidaAtual <= 10) corVida = "#ffcc00"; //amarelo
                    if (vidaAtual <= 5) corVida = "#ff3300"; //vermelho
                    
                    // Desenhar fundo da barra
                    ctx.fillStyle = "#7a7a7a";
                    ctx.fillRect(x, y - 6, larguraMax, alturaBarra);
                    
                    // Desenhar vida atual
                    ctx.fillStyle = corVida;
                    ctx.fillRect(x, y - 6, larguraAtual, alturaBarra);
                    
                    // Bordas
                    ctx.strokeStyle = "#000";
                    ctx.strokeRect(x, y - 6, larguraMax, alturaBarra);
                }
                
                if (!isCabeca) {
                    ctx.fillStyle = "red";
                    ctx.font = "bold 10px monospace";
                    const bit = Math.random() > 0.5 ? "1" : "0";
                    ctx.fillText(bit, x + 3, y + 8);
                }
            }
            
            ctx.restore();//garante que o alpha volte ao normal
            
        } else if (ultimaPosicao) {
            //desenha o X no local da última posição
            const x = ultimaPosicao.x * gs.tamanhoDaPeca + 6;
            const y = ultimaPosicao.y * gs.tamanhoDaPeca + 14;
            ctx.fillStyle = "red";
            ctx.font = "bold 14px monospace";
            ctx.fillText("X", x, y);
        }
    }
    
    
    //desenha rastro cobra inimiga
    function atualizaRastroInimiga() {
        if (!ci.ativa) return;
        
        const ultimaPos = ci.rastro.at(-1);
        const atual = { x: ci.pos.x, y: ci.pos.y };
        
        // Adiciona somente se mudou
        if (!ultimaPos || ultimaPos.x !== atual.x || ultimaPos.y !== atual.y) {
            ci.rastro.push(atual);
        }
        
        while (ci.rastro.length > ci.tail) {
            ci.rastro.shift();
        }
    }
    
    
    // === MAÇA(bits)  ===
    
    
    //desenha a maça
    function desenhaMaca() {
        const x = gs.maca.x * gs.tamanhoDaPeca;
        const y = gs.maca.y * gs.tamanhoDaPeca;
        
        ctx.fillStyle = "#00ff88";
        ctx.font = "bold 14px monospace";
        const bit = Math.random() > 0.5 ? "1" : "0";
        ctx.fillText(bit, x + 3, y + 9);
    }
    
    
    // === ANIMACAO DE PARTICULAS  ===
    
    
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
            gs.particulas.push({
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
        for (let i = gs.particulas.length - 1; i >= 0; i--) {
            const p = gs.particulas[i];
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
                gs.particulas.splice(i, 1);
            }
        }
        ctx.globalAlpha = 1.0;
    }
    
    
    // === EFEITO DE PODER ===
    
    
    //cria efeito animacao poder
    function desenharAuraDaCabeca(cabeca, cor) {
        const centerX = (cabeca.x + 0.5) * gs.tamanhoDaPeca;
        const centerY = (cabeca.y + 0.5) * gs.tamanhoDaPeca;
        const raio = gs.tamanhoDaPeca * 2.2;
        
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
        if (!gs.poderVisivel) return;
        
        const centerX = (gs.poder.x + 0.5) * gs.tamanhoDaPeca;
        const centerY = (gs.poder.y + 0.5) * gs.tamanhoDaPeca;
        const raio = gs.tamanhoDaPeca * 2.2;
        
        // Desenha a aura roxa
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, raio, 0, Math.PI * 2);
        ctx.fillStyle = "#9B59FF33";
        
        ctx.fill();
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = "#9B59FF";
        ctx.stroke();
        ctx.restore();
        
        //desenha o bit com brilho
        ctx.save();
        const x = gs.poder.x * gs.tamanhoDaPeca;
        const y = gs.poder.y * gs.tamanhoDaPeca;
        
        ctx.shadowColor = "#6C5CE7";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.fillStyle = "#9B59FF";
        ctx.font = "bold 14px monospace";
        const bit = Math.random() > 0.5 ? "1" : "0";
        ctx.fillText(bit, x + 1, y + 9);
        ctx.restore();
    }
    
    
    //controla o comportamento da cobrinha inimiga: decide o alvo, move, verifica morte e desenha o timer de respawn
    function atualizarCobraInimiga() {
        if (!ci.ativa) return;
        
        const agora = Date.now();
        if (agora - tempoUltimoMovInimiga < gs.tempoVelocidadeInimiga) return;
        tempoUltimoMovInimiga = agora;
        
        decidirEstado();
        
        if (!gs.perdeu) {
            const alvo = escolherAlvo();
            moverCobraInimiga(alvo);
            verificarMorte();
        }
        
        // Ativa o modo camuflagem quando a vida chega a 5 ou menos
        if (ci.tail <= 8 && (!ci.fimCamuflagem || Date.now() >= ci.proximaCamuflagem)) {
            ci.modoCamuflagem = true;
            ci.fimCamuflagem = Date.now() + 3000;
            ci.proximaCamuflagem = Date.now() + 10000; //10 segundos de recarga para evitar spam
        }
        
        // verifica se o tempo de camuflagem acabou
        if (ci.modoCamuflagem && Date.now() >= ci.fimCamuflagem) {
            ci.modoCamuflagem = false;
        }
        
        desenharTimerRespawn();
    }
    
    // === SUBFUNÇÕES ===
    
    
    function decidirEstado() {
        if (gs.temPoder) {
            ci.estado = "fugindo";
        } else {
            ci.estado = ci.tail < 5 ? "fugindo" : "atacando";
        }
    }
    
    
    //cobra inimiga escolhe o alvo mais proximo
    function escolherAlvo() {
        if (ci.estado === "fugindo") return gs.maca;
        
        //ataca a cauda do jogador se for longa
        const caudaJogador = gs.rastro.slice(0, -1);
        const temCaudaAlvo = gs.tail > 3 && caudaJogador.length > 0;
        
        let alvo = gs.maca;
        let distAlvo = Math.abs(ci.pos.x - gs.maca.x) + Math.abs(ci.pos.y - gs.maca.y);
        
        if (temCaudaAlvo) {
            for (let i = 0; i < caudaJogador.length; i++) {
                const p = caudaJogador[i];
                const d = Math.abs(ci.pos.x - p.x) + Math.abs(ci.pos.y - p.y);
                if (d < distAlvo) {
                    distAlvo = d;
                    alvo = p;
                }
            }
        }
        
        return alvo;
    }
    
    
    // Move a cobra inimiga em direção ao alvo (prioriza o eixo com maior distância)
    function moverCobraInimiga(alvo) {
        const dx = alvo.x - ci.pos.x;
        const dy = alvo.y - ci.pos.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            ci.vel.x = dx > 0 ? 1 : -1;
            ci.vel.y = 0;
        } else {
            ci.vel.x = 0;
            ci.vel.y = dy > 0 ? 1 : -1;
        }
        
        ci.pos.x += ci.vel.x;
        ci.pos.y += ci.vel.y;
    }
    
    
    // Verifica se a cobrinha inimiga morreu e inicia o tempo de respawn caso necessário
    function verificarMorte() {
        if (ci.tail <= 3) {
            ci.ativa = false;
            ci.morta = true;
            
            ultimaPosicao = { x: ci.pos.x, y: ci.pos.y };
            cobraInimigaRespawnTimer = Date.now() + 60000;
            
            setTimeout(() => {
                Object.assign(ci, {
                    pos: { x: ultimaPosicao.x, y: ultimaPosicao.y },
                    vel: { x: 0, y: 0 },
                    rastro: [],
                    tail: 5,
                    estado: "fugindo",
                    ativa: true,
                    morta: false
                });
                cobraInimigaRespawnTimer = null;
            }, 60000);
        }
    }
    
    
    //renderiza um indicador visual de contagem regressiva volta da cobrinha inimiga
        function desenharTimerRespawn() {
        if (!ci.ativa && cobraInimigaRespawnTimer) {
            const diff = cobraInimigaRespawnTimer - Date.now();
            const tempoRestante = Math.max(0, Math.ceil(diff / 1000));
            
            ctx.fillStyle = "red";
            ctx.font = "bold 14px monospace";
            
            if (diff > 0) {
                ctx.fillText(`⚠ Inimiga volta em ${tempoRestante}s`, 10, 20);
            } else {
                ctx.fillText(`⚠ Inimiga voltou!`, 10, 20);
            }
        }
    }
    
    
    // desenha o feedback visual de ganho e perda
    function desenharFeedback() {
        if (gs.feedbackJogador.ativo) {
            ctx.fillStyle = gs.feedbackJogador.cor;
            ctx.font = "bold 12px monospace";
            ctx.fillText(gs.feedbackJogador.texto, gs.feedbackJogador.x, gs.feedbackJogador.y);
        }
        
        if (feedbackInimiga.ativo) {
            ctx.fillStyle = feedbackInimiga.cor;
            ctx.font = "bold 12px monospace";
            ctx.fillText(feedbackInimiga.texto, feedbackInimiga.x, feedbackInimiga.y);
        }
    }
    
    
    //colisao da cobrinha inimiga com jogador e feedback visual
    function checarColisaoComCobraInimiga() {
        const cabecaInimiga = ci.rastro[ci.rastro.length - 1];
        const cabecaJogador = gs.rastro[gs.rastro.length - 1];
        
        //se jogador colidir com rastro da cobrinha inimiga +1 e jogador -1
        if (!ci.morta) {
            for (let i = 0; i < ci.rastro.length - 1; i++) {
                if (
                    gs.rastro.length > 0 &&
                    ci.rastro[i].x === cabecaJogador.x &&
                    ci.rastro[i].y === cabecaJogador.y
                ) {
                    // Jogador ganha 1, inimiga perde 1
                    gs.tail++;
                    gs.pontuacao += 1;
                    gs.atualizarPontuacao();
                    
                    if (ci.tail > 1) ci.tail--;
                    
                    // feedback jogador +1
                    gs.feedbackJogador.ativo = true;
                    gs.feedbackJogador.texto = "+1";
                    gs.feedbackJogador.x = cabecaJogador.x * gs.tamanhoDaPeca + 10;
                    gs.feedbackJogador.y = cabecaJogador.y * gs.tamanhoDaPeca - 4;
                    
                    //feedback inimiga -1
                    feedbackInimiga.ativo = true;
                    feedbackInimiga.texto = "-1";
                    feedbackInimiga.x = cabecaInimiga.x * gs.tamanhoDaPeca + 10;
                    feedbackInimiga.y = cabecaInimiga.y * gs.tamanhoDaPeca - 4;
                    
                    setTimeout(() => {
                        gs.feedbackJogador.ativo = false;
                        feedbackInimiga.ativo = false;
                    }, 500);
                }
            }
        }
        
        //se cobrinha inimiga colidir com rastro do jogador, ela anha +1 e jogador -1
        if (!gs.temPoder) {
            for (let i = 0; i < gs.rastro.length - 1; i++) {
                if (
                    gs.rastro[i].x === cabecaInimiga.x &&
                    gs.rastro[i].y === cabecaInimiga.y
                ) {
                    if (!ci.morta) {
                        if (gs.tail > 1) gs.tail--;
                        ci.tail++;
                        gs.pontuacao -= 1;
                        gs.atualizarPontuacao();
                        
                        // Feedback jogador -1
                        gs.feedbackJogador.ativo = true;
                        gs.feedbackJogador.texto = "-1";
                        gs.feedbackJogador.x = cabecaJogador.x * gs.tamanhoDaPeca + 10;
                        gs.feedbackJogador.y = cabecaJogador.y * gs.tamanhoDaPeca - 4;
                        
                        // Feedback inimiga +1
                        feedbackInimiga.ativo = true;
                        feedbackInimiga.texto = "+1";
                        feedbackInimiga.x = cabecaInimiga.x * gs.tamanhoDaPeca + 10;
                        feedbackInimiga.y = cabecaInimiga.y * gs.tamanhoDaPeca - 4;
                        
                        setTimeout(() => {
                            gs.feedbackJogador.ativo = false;
                            feedbackInimiga.ativo = false;
                        }, 500);
                    }
                }
            }
        }
    }
    
    
    //verifica se o inimigo pegou a maca
    function verificarColisaoInimigoComMaca() {
        const cabecaInimiga = ci.rastro[ci.rastro.length - 1];
        
        if (ci.pos.x === gs.maca.x && ci.pos.y === gs.maca.y) {
            ci.tail++;
            posicaoMaca();
            
            //feedback +1
            feedbackInimiga.ativo = true;
            feedbackInimiga.texto = "+1";
            feedbackInimiga.x = cabecaInimiga.x * gs.tamanhoDaPeca + 10;
            feedbackInimiga.y = cabecaInimiga.y * gs.tamanhoDaPeca - 4;
            
            setTimeout(() => {
                gs.feedbackJogador.ativo = false;
                feedbackInimiga.ativo = false;
            }, 500);
            
            console.log("Inimigo pegou a maçã");
        }
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
        // colisao cobra e maça sem poder
        const colidiuComCobra = (gs.maca.x === gs.pos.x && gs.maca.y === gs.pos.y);
        
        let colidiuComAura = false;
        if (gs.temPoder) {
            const cx = (gs.pos.x + 0.5) * gs.tamanhoDaPeca;
            const cy = (gs.pos.y + 0.5) * gs.tamanhoDaPeca;
            const raioAura = gs.tamanhoDaPeca * 2.2;
            
            const rx = gs.maca.x * gs.tamanhoDaPeca;
            const ry = gs.maca.y * gs.tamanhoDaPeca;
            
            if (colisaoCirculoRetangulo(cx, cy, raioAura, rx, ry, gs.tamanhoDaPeca, gs.tamanhoDaPeca)) {
                colidiuComAura = true;
            }
        }
        
        // verifica colisao cobrinha normal e cobrinha com aura
        if (colidiuComCobra || colidiuComAura) {
            if (colidiuComAura) {
                explodirParticulas(
                    gs.maca.x * gs.tamanhoDaPeca + gs.tamanhoDaPeca / 2,
                    gs.maca.y * gs.tamanhoDaPeca + gs.tamanhoDaPeca / 2,
                    "#00ff88"
                );
            }
            
            gs.tail++;
            posicaoMaca();
            
            gs.pontuacao += 1;
            gs.atualizarPontuacao();
            
            // mostrar +1 verde com feedback Jogador, só se NÃO estiver com poder
            if (!gs.temPoder) {
                gs.feedbackJogador.ativo = true;
                gs.feedbackJogador.texto = "+1";
                gs.feedbackJogador.cor = "#00ff88";
                
                gs.feedbackJogador.x = gs.pos.x * gs.tamanhoDaPeca + 10;
                gs.feedbackJogador.y = gs.pos.y * gs.tamanhoDaPeca - 4;
                
                setTimeout(() => gs.feedbackJogador.ativo = false, 800);
            }
            gs.atualizarPontuacao();
        }
    }
    
    
    //verifica colisao da cobra com o poder
    function verificaColisaoCobraEPoder() {
        if (gs.poder.x == gs.pos.x && gs.poder.y == gs.pos.y) {
            gs.poderVisivel = false;

            //ativa e remove poder
            if (!gs.temPoder) {
                gs.temPoder = true;

                setTimeout(function() {
                    gs.temPoder = false;
                }, 7000);
                
                //mostr o tempo  restante do poder
                gs.poderTempo = 7;
                
                for (let i = 0; i <= gs.poderTempo; i++) {
                    setTimeout(() => {
                        if (gs.poderTempo - i === 0) {
                            document.getElementById("tempo-poder").innerHTML = " ";
                        } else {
                            document.getElementById("tempo-poder").innerHTML = `${gs.poderTempo - i}`
                        }
                    }, 1000 * i);
                }
            }
            
            // espera para atualizar a nova posiçao da maça
            setTimeout(() => {
                posicaoPoder();
                gs.poderVisivel = true;
            }, 15000);
        }
    }
    
    
    //desenha rastro
    function desenhaRastro() {
        gs.rastro.push({
            x: gs.pos.x,
            y: gs.pos.y
        });
        
        while (gs.rastro.length > gs.tail) {
            gs.rastro.shift();
        }
    }
    
    
    function desenharFeedbackBits() {
        gs.feedbackBits.forEach((f, i) => {
            ctx.fillStyle = "#00ff88";
            ctx.font = "bold 12px monospace";
            ctx.fillText(f.texto, f.x, f.y);
            
            f.y -= 0.5; //sobe lentamente
            f.tempo--;
            
            if (f.tempo <= 0) {
                gs.feedbackBits.splice(i, 1); // remove quando tempo acabar
            }
        });
    }
    
    
    // Verifica se a cobra colidiu com algum sistema e entrega os bits necessários
    function verificarEntregaDeBits() {
        const cobraX = gs.pos.x * gs.tamanhoDaPeca;
        const cobraY = gs.pos.y * gs.tamanhoDaPeca;
        
        gs.sistemas.forEach((sistema, i) => {
            if (sistema.completo || i !== gs.sistemaAtual) return;
            
            const colisao = cobraX < sistema.x + sistema.largura &&
                cobraX + gs.tamanhoDaPeca > sistema.x &&
                cobraY < sistema.y + sistema.altura &&
                cobraY + gs.tamanhoDaPeca > sistema.y;
            
            if (colisao && gs.pontuacao > 0) {
                const falta = sistema.meta - sistema.bits;
                const entregue = Math.min(falta, gs.pontuacao);
                
                sistema.bits += entregue;
                gs.pontuacao -= entregue;
                gs.atualizarPontuacao();
                gs.tail = Math.max(1, gs.tail - entregue);
                
                //feedback visual
                gs.feedbackBits.push({
                    x: sistema.x + sistema.largura / 2,
                    y: sistema.y - 10,
                    texto: `+${entregue} bits`,
                    tempo: 60 //frames para desaparecer
                });
                
                while (gs.rastro.length > gs.tail) {
                    gs.rastro.shift();
                }
                
                if (sistema.bits >= sistema.meta) {
                    sistema.completo = true;
                    gs.sistemaAtual++;
                }
            
                const todosCompletos = gs.sistemas.every(s => s.completo);
                if (todosCompletos && !gs.ganhou) {
                    gs.vitoria();
                }
            }
        });
    }
    
    
    // === ATUALIZA POSICOES  ===
    
    
    //funcao para  atualizar a nova posiçao do poder
    function posicaoPoder() {
        gs.poder.x = Math.floor(Math.random() * gs.quantidadeDePeca);
        gs.poder.y = Math.floor(Math.random() * gs.quantidadeDePeca);
        
        gs.poderVisivel = true;
        desenharPoder();
    }
    
    
    //funcao para  atualizar a nova posiçao da maça
    function posicaoMaca() {
        gs.maca.x = Math.floor(Math.random() * gs.quantidadeDePeca);
        gs.maca.y = Math.floor(Math.random() * gs.quantidadeDePeca);
    }
    
    
    // === INICIA AUTOMATICAMENTE ===
    gs.initUI();
    
    
    // === RENDERIZAÇÃO ===
    desenhaTabuleiro();
    desenharTerminais(ctx, 1000);
    desenhaCobra();
    desenhaOlhos();
    desenhaCobraInimiga();
    desenhaOlhosInimiga();
    atualizaRastroInimiga();
    desenhaLingua();
    desenhaRastro();
    desenhaMaca();
    desenharParticulas();
    desenharPoder();
    desenharFeedback();
    desenharFeedbackBits();
    
    
    // === DETECÇÃO DE COLISÕES ===
    verificarEntregaDeBits();
    verificaColisaoCobraOuAuraComMaca();
    verificaColisaoCobraEPoder();
    atualizarCobraInimiga();
    checarColisaoComCobraInimiga();
    verificarColisaoInimigoComMaca();
    
    
    // === CONFIGURACOES ===
    gs.configurarBotoes();
    gs.configurarControles();
};


// === GAME LOOP ===
function gameLoop(agora) {
    if (gs.jogoPausado || gs.jogoFinalizado) return;
    
    const delta = agora - gs.ultimoFrame;
    
    if (delta >= gs.tempoVelocidade) {
        gs.ultimoFrame = agora;
        
        if (gs.temPoder) {
            gs.tempoVelocidade = 90;
            console.log("velocidade aumentada com o poder: ", gs.tempoVelocidade);
        } else {
            gs.tempoVelocidade = 105;
            console.log("velocidade normal restaurada: ", gs.tempoVelocidade);
        }
        
        meuGame();
    }
    
    requestAnimationFrame(gameLoop);
}

window.onload = () => {
    gs.initUI();
    gs.ultimoFrame = performance.now();
    
    gs.tempo = 300;
    gs.contarTempo();
    requestAnimationFrame(gameLoop);
};