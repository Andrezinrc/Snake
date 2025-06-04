import { controlePc, controleMobile } from "./controles.js";

<<<<<<< HEAD
const gameState = {
    canvas: document.querySelector("#gameCanvas"),
    ctx: null,
=======
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
        tempoVelocidadeInimiga: 120,
        pos: { x: 5, y: 5 },
        vel: { x: 1, y: 0 },
        ultimaDirecao: { x: 0, y: 0 },
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
>>>>>>> e7f93f05f9992080fab26339d69517969ceae4ab
    
    //Elementos da interface
    container: document.querySelector(".container"),
    mensagem_final: document.getElementById("mensagem-final"),
    botoes: document.getElementById("botoes"),
    pausar: document.getElementById("pausar"),
    continuar: document.getElementById("continuar"),
    jogarNovamente: document.getElementById("jogar-novamente"),
    sair: document.getElementById("sair"),
    
    //Inicializa o contexto do canvas
<<<<<<< HEAD
    init() {
        this.ctx = this.canvas.getContext("2d");
    },
    
    // Parâmetros do jogo
    jogoFinalizado: false,
    bitsEntregues: 0,
    bitsNecessarios: 5,
    
    tamanhoDaPeca: 10,
    quantidadeDePeca: 35,
    velocidade: 1,
    tempoVelocidade: 105,
    tempoVelocidadeInimiga: 150,
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
=======
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
        poderVisivel,
        perdeu
    } = gameState;
    
    let alvo;
    let delayInimiga = 0;
    const intervaloIA = 5;
    let tempoUltimoMovInimiga = 0;
    let cobraInimigaRespawnTimer = null;
    let ultimaPosicao = null;
    let feedbackInimiga = { ativo: false, texto: "+1", x: 0, y: 0, cor: "red" };
    let feedbackJogador = { ativo: false, texto: "-1", x: 0, y: 0, cor: "#00ff88" };
    
   //estado da cobra inimiga
   let cobraInimiga = {
        pos: { x: Math.floor(Math.random() * quantidadeDePeca), y: Math.floor(Math.random() * quantidadeDePeca) },
        vel: { x: 0, y: 0 },
        velAnterior: { x: null, y: null },
        rastro: [],
        tail: 5,
        cor: "#ff0033",
        ativa: true,
        morta: false
    };
    
    
    //funcao do jogo
    var meuGame = () => {
        if (jogoPausado) return;
        console.log("Game rodando", vel.x,vel.y);
        
        
        // === ANBIENTE DO JOGO ===
        
        //desenha tanbuleiro do jogo
        function desenhaTabuleiro() {
            ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
            gameState.mensagem_perdeu.style.display = "none";
            
            gameState.canvas.width = 350;
            gameState.canvas.height = 350;
        
            ctx.fillStyle = "#0f0f1a";
            ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
            gameState.canvas.style.opacity = 0.9;
            
            desenharGrade();
            desenharPixelsVivos();
            
            // movimentação e teletransporte
            pos.x += vel.x;
            pos.y += vel.y;
            
            if (pos.x < 0) pos.x = quantidadeDePeca - 1;
            if (pos.x > quantidadeDePeca - 1) pos.x = 0;
            if (pos.y < 0) pos.y = quantidadeDePeca - 1;
            if (pos.y > quantidadeDePeca - 1) pos.y = 0;
            
            cobraInimiga.pos.x = Math.max(0, Math.min(quantidadeDePeca - 1, cobraInimiga.pos.x));
            cobraInimiga.pos.y = Math.max(0, Math.min(quantidadeDePeca - 1, cobraInimiga.pos.y));
        }
>>>>>>> e7f93f05f9992080fab26339d69517969ceae4ab
        
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
        clearInterval(this.movimenta);
        clearInterval(this.contagem);
        botoes.style.display = "none";
        continuar.style.display = "block";
        sair.style.display = "block";
        pausar.style.display = "none";
        this.mensagem_final.style.display = "none";
    },
    
    continuarJogo() {
        if (!this.jogoPausado) return;
        
        this.jogoPausado = false;
        
        this.configurarControles();
        
        this.vel.x = this.velAnterior.x;
        this.vel.y = this.velAnterior.y;
        
        console.log('velXAnterior:', this.velAnterior.x, 'velYAnterior:', this.velAnterior.y);
        
        this.movimenta = setInterval(meuGame, this.tempoVelocidade);
        this.contarTempo();
        botoes.style.display = "block";
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
        
        this.vel.x = 0;
        this.vel.y = 0;
        this.tail = 5;
        this.ganhou = true;
        this.mensagem_final.style.display = "block";
        this.mensagem_final.style.color = "green";
        document.getElementById("mensagem-final").innerText = "Voce Ganhou!";
        this.pausar.style.display = "none";
        this.botoes.style.display = "none";
        this.jogarNovamente.style.display = "block";
        this.voltar.style.display = "block";
        
        clearInterval(this.contagem);
        console.log("✅ Vitória chamada");
    },
    
    //game over
    gameOver() {
        
        this.jogoFinalizado = true;
        
        this.vel.x = 0;
        this.vel.y = 0;
        this.tail = 5;
        this.perdeu = true;
        this.mensagem_final.style.display = "block";
        document.getElementById("mensagem-final").innerText = "Voce Perdeu";
        this.pausar.style.display = "none";
        this.botoes.style.display = "none";
        this.jogarNovamente.style.display = "block";
        this.voltar.style.display = "block";
        
        clearInterval(this.contagem);
        console.log("❌ Game over chamado");
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
    jogoPausado,
    ultimoFrame,
    particulas,
    movdimenta,
    poderVisivel,
    perdeu
} = gameState;


const sistemas = [
    { x: 0, y: 0, largura: 60, altura: 40, bits: 0, meta: 16, completo: false },
    { x: 350 - 60, y: 0, largura: 60, altura: 40, bits: 0, meta: 16, completo: false },
    { x: 0, y: 350 - 40, largura: 60, altura: 40, bits: 0, meta: 16, completo: false },
    { x: 350 - 60, y: 350 - 40, largura: 60, altura: 40, bits: 0, meta: 16, completo: false }
];


let alvo;
let delayInimiga = 0;
const intervaloIA = 5;
let tempoUltimoMovInimiga = 0;
let cobraInimigaRespawnTimer = null;
let ultimaPosicao = null;
let feedbackInimiga = { ativo: false, texto: "+1", x: 0, y: 0, cor: "red" };
let feedbackJogador = { ativo: false, texto: "-1", x: 0, y: 0, cor: "#00ff88" };


//estado da cobra inimiga
let cobraInimiga = {
    pos: { x: Math.floor(Math.random() * quantidadeDePeca), y: Math.floor(Math.random() * quantidadeDePeca) },
    vel: { x: 0, y: 0 },
    velAnterior: { x: null, y: null },
    rastro: [],
    tail: 5,
    cor: "#ff0033",
    ativa: true,
    morta: false
};


//funcao do jogo
var meuGame = () => {
    if (jogoPausado) return;
    console.log("Game rodando", vel.x, vel.y);
    
    
    // === ANBIENTE DO JOGO ===
    
    //desenha tanbuleiro do jogo
    function desenhaTabuleiro() {
        ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
        gameState.mensagem_final.style.display = "none";
        
        gameState.canvas.width = 350;
        gameState.canvas.height = 350;
        
        ctx.fillStyle = "#0f0f1a";
        ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
        gameState.canvas.style.opacity = 0.9;
        
        desenharGrade();
        desenharPixelsVivos();
        
        // movimentação e teletransporte
        pos.x += vel.x;
        pos.y += vel.y;
        
        if (pos.x < 0) pos.x = quantidadeDePeca - 1;
        if (pos.x > quantidadeDePeca - 1) pos.x = 0;
        if (pos.y < 0) pos.y = quantidadeDePeca - 1;
        if (pos.y > quantidadeDePeca - 1) pos.y = 0;
        
        cobraInimiga.pos.x = Math.max(0, Math.min(quantidadeDePeca - 1, cobraInimiga.pos.x));
        cobraInimiga.pos.y = Math.max(0, Math.min(quantidadeDePeca - 1, cobraInimiga.pos.y));
    }
    
    
    // Desenha visualmente o terminal/sistema no tabuleiro
    function desenharTerminais(ctx, tempo) {
        sistemas.forEach((sistema, i) => {
            const gradiente = ctx.createLinearGradient(sistema.x, sistema.y, sistema.x + sistema.largura, sistema.y + sistema.altura);
            gradiente.addColorStop(0, '#1e1e1e');
            gradiente.addColorStop(1, '#2c2c2c');
            ctx.fillStyle = gradiente;
            ctx.fillRect(sistema.x, sistema.y, sistema.largura, sistema.altura);
            
            const brilho = Math.sin(tempo / 300) * 2 + 2;
            ctx.lineWidth = brilho;
            ctx.strokeStyle = sistema.completo ? '#00ff00' : '#ff0033';
            ctx.strokeRect(sistema.x, sistema.y, sistema.largura, sistema.altura);
            
            // Texto SYSTEM
            ctx.fillStyle = sistema.completo ? '#00ff00' : '#ff0033';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(sistema.completo ? 'SUCCESS' : 'ERROR', sistema.x + 5, sistema.y + 15);
            
            // Bits (barra e texto)
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
    
    
    // desenha grade do tabuleiro
    function desenharGrade() {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        
        for (let x = 0; x < gameState.canvas.width; x += tamanhoDaPeca) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, gameState.canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < gameState.canvas.height; y += tamanhoDaPeca) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(gameState.canvas.width, y);
            ctx.stroke();
        }
    }
    
    //desenha efeitos de chuvisco
    function desenharPixelsVivos() {
        for (let i = 0; i < 25; i++) {
            const x = Math.floor(Math.random() * gameState.canvas.width);
            const y = Math.floor(Math.random() * gameState.canvas.height);
            const brilho = Math.random() * 0.4 + 0.1;
            ctx.fillStyle = `rgba(155, 89, 255, ${brilho})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    
    
    // === COBRINHA JOGADOR  ===
    
    
    // Desenha os olhos
    function desenhaOlhos() {
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
<<<<<<< HEAD
    }
    
    
    //desenha lingua
    function desenhaLingua() {
        if (rastro.length > 0 && gameState.tongueVisible) {
            const cabeca = rastro[rastro.length - 1];
            
            ctx.fillStyle = 'red';
            ctx.fillRect(
                (cabeca.x + 0.5) * tamanhoDaPeca,
                (cabeca.y + 0.9) * tamanhoDaPeca,
                tamanhoDaPeca / 2,
                tamanhoDaPeca / 4
            );
        }
        //Anima a língua
        setInterval(() => {
            gameState.tongueVisible = !gameState.tongueVisible;
        }, 500);
    }
    
    
    // desenha a cobrinha
    function desenhaCobra() {
        for (var i = 0; i < rastro.length; i++) {
            const x = rastro[i].x * tamanhoDaPeca;
            const y = rastro[i].y * tamanhoDaPeca;
            const isCabeca = i === rastro.length - 1;
            
            if (temPoder) {
                if (isCabeca) {
                    ctx.fillStyle = "#9B59FF";
                    ctx.fillRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
                } else {
                    ctx.fillStyle = "rgba(108, 92, 231, 0.5)";
                    ctx.fillRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
                }
                
                // Bits roxos
                if (!isCabeca) {
                    ctx.fillStyle = "#9B59FF";
                    ctx.font = "bold 10px monospace";
=======
        
        //desenha cobrinha inimiga
        function desenhaCobraInimiga() {
            if (cobraInimiga.ativa) {
                for (let i = 0; i < cobraInimiga.rastro.length; i++) {
                    const x = cobraInimiga.rastro[i].x * tamanhoDaPeca;
                    const y = cobraInimiga.rastro[i].y * tamanhoDaPeca;
>>>>>>> e7f93f05f9992080fab26339d69517969ceae4ab
                    
                    const bit = Math.random() > 0.5 ? "1" : "0";
                    
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
                    ctx.strokeText(bit, x + 3, y + 8);
                    ctx.fillText(bit, x + 3, y + 8);
                    ctx.lineWidth = 1
                }
            } else {
                if (isCabeca) {
                    ctx.fillStyle = "#00ffaa";
                    ctx.fillRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
                } else {
                    ctx.fillStyle = "#002a1e";
                    ctx.fillRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
                    
                    ctx.strokeStyle = "#003322";
                    ctx.strokeRect(x, y, tamanhoDaPeca - 1, tamanhoDaPeca - 1);
                    
                    // bits verdes
                    ctx.fillStyle = "rgba(0,255,140,0.5)";
                    ctx.font = "bold 10px monospace";
                    const bit = Math.random() > 0.5 ? "1" : "0";
                    ctx.fillText(bit, x + 3, y + 8);
                }
            }
            
            // Colisão com o próprio corpo
            if (!temPoder && rastro[i].x === pos.x && rastro[i].y === pos.y) {
                gameState.gameOver();
                perdeu = true;
                
                //para a cobrinha inimiga
                cobraInimiga.vel.x = 0;
                cobraInimiga.vel.t = 0;
            }
        }
    }
    
    //desenha rastro
    function desenhaRastro() {
        gameState.rastro.push({
            x: pos.x,
            y: pos.y
        });
        
        while (rastro.length > tail) {
            rastro.shift();
        }
    }
    
    
    // === COBRINHA INIMIGA  ===
    
    
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
    
    
    //desenha cobrinha inimiga
    function desenhaCobraInimiga() {
        if (cobraInimiga.ativa) {
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
        } else if (ultimaPosicao) {
            // Cobra morta: desenha o X no local da última posição
            const x = ultimaPosicao.x * tamanhoDaPeca + 6;
            const y = ultimaPosicao.y * tamanhoDaPeca + 14;
            ctx.fillStyle = "red";
            ctx.font = "bold 14px monospace";
            ctx.fillText("X", x, y);
        }
    }
    
    
    //desenha rastro cobra inimiga
    function atualizaRastroInimiga() {
        if (!cobraInimiga.ativa) return;
        
        const ultimaPos = cobraInimiga.rastro.at(-1);
        const atual = { x: cobraInimiga.pos.x, y: cobraInimiga.pos.y };
        
        // Adiciona somente se mudou
        if (!ultimaPos || ultimaPos.x !== atual.x || ultimaPos.y !== atual.y) {
            cobraInimiga.rastro.push(atual);
        }
        
        while (cobraInimiga.rastro.length > cobraInimiga.tail) {
            cobraInimiga.rastro.shift();
        }
    }
    
    
    // === MAÇA(bits)  ===
    
    
    //desenha a maça
    function desenhaMaca() {
        const x = maca.x * tamanhoDaPeca;
        const y = maca.y * tamanhoDaPeca;
        
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
    
    
    // === EFEITO DE PODER ===
    
    
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
        if (!poderVisivel) return;
        
        const centerX = (poder.x + 0.5) * tamanhoDaPeca;
        const centerY = (poder.y + 0.5) * tamanhoDaPeca;
        const raio = tamanhoDaPeca * 2.2;
        
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
        const x = poder.x * tamanhoDaPeca;
        const y = poder.y * tamanhoDaPeca;
        
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
        if (!cobraInimiga.ativa) return;
        
        const agora = Date.now();
        if (agora - tempoUltimoMovInimiga < gameState.tempoVelocidadeInimiga) return;
        tempoUltimoMovInimiga = agora;
        
        decidirEstado();
        if (!perdeu) {
            const alvo = escolherAlvo();
            moverCobraInimiga(alvo);
            verificarMorte();
        }
        
        desenharTimerRespawn();
    }
    
    
    // === SUBFUNÇÕES ===
    
    
    function decidirEstado() {
        if (temPoder) {
            cobraInimiga.estado = "fugindo";
        } else {
            cobraInimiga.estado = cobraInimiga.tail < 5 ? "fugindo" : "atacando";
        }
    }
    
    
    //cobra inimiga escolhe o alvo mais proximo
    function escolherAlvo() {
        if (cobraInimiga.estado === "fugindo") return maca;
        
        //ataca a cauda do jogador se for longa
        const caudaJogador = rastro.slice(0, -1);
        const temCaudaAlvo = tail > 3 && caudaJogador.length > 0;
        
        let alvo = maca;
        let distAlvo = Math.abs(cobraInimiga.pos.x - maca.x) + Math.abs(cobraInimiga.pos.y - maca.y);
        
        if (temCaudaAlvo) {
            for (let i = 0; i < caudaJogador.length; i++) {
                const p = caudaJogador[i];
                const d = Math.abs(cobraInimiga.pos.x - p.x) + Math.abs(cobraInimiga.pos.y - p.y);
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
    }
    
    
    // Verifica se a cobrinha inimiga morreu e inicia o tempo de respawn caso necessário
    function verificarMorte() {
        if (cobraInimiga.tail <= 3) {
            cobraInimiga.ativa = false;
            cobraInimiga.morta = true;
            
            ultimaPosicao = { x: cobraInimiga.pos.x, y: cobraInimiga.pos.y };
            cobraInimigaRespawnTimer = Date.now() + 60000;
            
            setTimeout(() => {
                Object.assign(cobraInimiga, {
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
        if (!cobraInimiga.ativa && cobraInimigaRespawnTimer) {
            const tempoRestante = Math.ceil((cobraInimigaRespawnTimer - Date.now()) / 1000);
            if (tempoRestante > 0) {
                ctx.fillStyle = "red";
                ctx.font = "bold 14px monospace";
                ctx.fillText(`⚠ Inimiga volta em ${tempoRestante}s`, 10, 20);
            }
        }
    }
    
    
    // desenha o feedback visual de ganho e perda
    function desenharFeedback() {
        if (feedbackJogador.ativo) {
            ctx.fillStyle = feedbackJogador.cor;
            ctx.font = "bold 12px monospace";
            ctx.fillText(feedbackJogador.texto, feedbackJogador.x, feedbackJogador.y);
        }
        
<<<<<<< HEAD
        if (feedbackInimiga.ativo) {
            ctx.fillStyle = feedbackInimiga.cor;
            ctx.font = "bold 12px monospace";
            ctx.fillText(feedbackInimiga.texto, feedbackInimiga.x, feedbackInimiga.y);
        }
    }
    
    
    //colisao da cobrinha inimiga com jogador e feedback visual
    function checarColisaoComCobraInimiga() {
        const cabecaInimiga = cobraInimiga.rastro[cobraInimiga.rastro.length - 1];
        const cabecaJogador = rastro[rastro.length - 1];
        
        //se jogador colidir com rastro da cobrinha inimiga +1 e jogador -1
        if (!cobraInimiga.morta) {
            for (let i = 0; i < cobraInimiga.rastro.length - 1; i++) {
                if (
                    rastro.length > 0 &&
                    cobraInimiga.rastro[i].x === cabecaJogador.x &&
                    cobraInimiga.rastro[i].y === cabecaJogador.y
                ) {
                    // Jogador ganha 1, inimiga perde 1
                    tail++;
                    gameState.pontuacao += 1;
                    gameState.atualizarPontuacao();
                    
                    if (cobraInimiga.tail > 1) cobraInimiga.tail--;
                    
                    // feedback jogador +1
                    feedbackJogador.ativo = true;
                    feedbackJogador.texto = "+1";
                    feedbackJogador.x = cabecaJogador.x * tamanhoDaPeca + 10;
                    feedbackJogador.y = cabecaJogador.y * tamanhoDaPeca - 4;
                    
                    //feedback inimiga -1
                    feedbackInimiga.ativo = true;
                    feedbackInimiga.texto = "-1";
                    feedbackInimiga.x = cabecaInimiga.x * tamanhoDaPeca + 10;
                    feedbackInimiga.y = cabecaInimiga.y * tamanhoDaPeca - 4;
                    
                    setTimeout(() => {
                        feedbackJogador.ativo = false;
                        feedbackInimiga.ativo = false;
                    }, 500);
                }
            }
        }
        
        //se cobrinha inimiga colidir com rastro do jogador, ela anha +1 e jogador -1
        if (!temPoder) {
            for (let i = 0; i < rastro.length - 1; i++) {
                if (
                    rastro[i].x === cabecaInimiga.x &&
                    rastro[i].y === cabecaInimiga.y
                ) {
                    if (!cobraInimiga.morta) {
                        if (tail > 1) tail--;
                        cobraInimiga.tail++;
                        gameState.pontuacao -= 1;
                        gameState.atualizarPontuacao();
                        
                        // Feedback jogador -1
                        feedbackJogador.ativo = true;
                        feedbackJogador.texto = "-1";
                        feedbackJogador.x = cabecaJogador.x * tamanhoDaPeca + 10;
                        feedbackJogador.y = cabecaJogador.y * tamanhoDaPeca - 4;
                        
                        // Feedback inimiga +1
                        feedbackInimiga.ativo = true;
                        feedbackInimiga.texto = "+1";
                        feedbackInimiga.x = cabecaInimiga.x * tamanhoDaPeca + 10;
                        feedbackInimiga.y = cabecaInimiga.y * tamanhoDaPeca - 4;
                        
                        setTimeout(() => {
                            feedbackJogador.ativo = false;
                            feedbackInimiga.ativo = false;
                        }, 500);
=======
    
        function desenharTimerRespawn() {
            if (!cobraInimiga.ativa && cobraInimigaRespawnTimer) {
                const tempoRestante = Math.ceil((cobraInimigaRespawnTimer - Date.now()) / 1000);
                if (tempoRestante > 0) {
                    ctx.fillStyle = "red";
                    ctx.font = "bold 14px monospace";
                    ctx.fillText(`⚠ Inimiga volta em ${tempoRestante}s`, 10, 20);
                }
            }
        }
        
        // desenha o feedback visual de ganho e perda
        function desenharFeedback() {
            if (feedbackJogador.ativo) {
                ctx.fillStyle = feedbackJogador.cor;
                ctx.font = "bold 12px monospace";
                ctx.fillText(feedbackJogador.texto, feedbackJogador.x, feedbackJogador.y);
            }
            
            if (feedbackInimiga.ativo) {
                ctx.fillStyle = feedbackInimiga.cor;
                ctx.font = "bold 12px monospace";
                ctx.fillText(feedbackInimiga.texto, feedbackInimiga.x, feedbackInimiga.y);
            }
        }
                        
        //colisao da cobrinha inimiga com jogador e feedback visual
        function checarColisaoComCobraInimiga() {
            const cabecaInimiga = cobraInimiga.rastro[cobraInimiga.rastro.length - 1];
            const cabecaJogador = rastro[rastro.length - 1];
            
            //se jogador colidir com rastro da cobrinha inimiga +1 e jogador -1
            if (!cobraInimiga.morta) {
                for (let i = 0; i < cobraInimiga.rastro.length - 1; i++) {
                    if (
                        rastro.length > 0 &&
                        cobraInimiga.rastro[i].x === cabecaJogador.x &&
                        cobraInimiga.rastro[i].y === cabecaJogador.y
                    ) {
                        // Jogador ganha 1, inimiga perde 1
                        tail++;
                        gameState.pontuacao += 1;
                        gameState.atualizarPontuacao();
                        
                        if (cobraInimiga.tail > 1) cobraInimiga.tail--;
                        
                        // feedback jogador +1
                        feedbackJogador.ativo = true;
                        feedbackJogador.texto = "+1";
                        feedbackJogador.x = cabecaJogador.x * tamanhoDaPeca + 10;
                        feedbackJogador.y = cabecaJogador.y * tamanhoDaPeca - 4;
                        
                        //feedback inimiga -1
                        feedbackInimiga.ativo = true;
                        feedbackInimiga.texto = "-1";
                        feedbackInimiga.x = cabecaInimiga.x * tamanhoDaPeca + 10;
                        feedbackInimiga.y = cabecaInimiga.y * tamanhoDaPeca - 4;
                        
                        setTimeout(() => {
                            feedbackJogador.ativo = false;
                            feedbackInimiga.ativo = false;
                        }, 500);
                    }
                }
            }
            
            //se cobrinha inimiga colidir com rastro do jogador ganha +1 e cobrinha inimiga  -1
            if (!temPoder) {
                for (let i = 0; i < rastro.length - 1; i++) {
                    if (
                        rastro[i].x === cabecaInimiga.x &&
                        rastro[i].y === cabecaInimiga.y
                    ) {
                        if (!cobraInimiga.morta) {
                            if (tail > 1) tail--;
                            cobraInimiga.tail++;
                            gameState.pontuacao -= 1;
                            gameState.atualizarPontuacao();
                            
                            // Feedback jogador -1
                            feedbackJogador.ativo = true;
                            feedbackJogador.texto = "-1";
                            feedbackJogador.x = cabecaJogador.x * tamanhoDaPeca + 10;
                            feedbackJogador.y = cabecaJogador.y * tamanhoDaPeca - 4;
                            
                            // Feedback inimiga +1
                            feedbackInimiga.ativo = true;
                            feedbackInimiga.texto = "+1";
                            feedbackInimiga.x = cabecaInimiga.x * tamanhoDaPeca + 10;
                            feedbackInimiga.y = cabecaInimiga.y * tamanhoDaPeca - 4;
                            
                            setTimeout(() => {
                                feedbackJogador.ativo = false;
                                feedbackInimiga.ativo = false;
                            }, 500);
                        }
>>>>>>> e7f93f05f9992080fab26339d69517969ceae4ab
                    }
                }
            }
        }
    }
    
    
    //verifica se o inimigo pegou a maca
    function verificarColisaoInimigoComMaca() {
        const cabecaInimiga = cobraInimiga.rastro[cobraInimiga.rastro.length - 1];
        
<<<<<<< HEAD
        if (cobraInimiga.pos.x === maca.x && cobraInimiga.pos.y === maca.y) {
            cobraInimiga.tail++;
            posicaoMaca();
            
            //feedback +1
            feedbackInimiga.ativo = true;
            feedbackInimiga.texto = "+1";
            feedbackInimiga.x = cabecaInimiga.x * tamanhoDaPeca + 10;
            feedbackInimiga.y = cabecaInimiga.y * tamanhoDaPeca - 4;
            
            setTimeout(() => {
                feedbackJogador.ativo = false;
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
        const colidiuComCobra = (maca.x === pos.x && maca.y === pos.y);
        
        let colidiuComAura = false;
        if (temPoder) {
            const cx = (pos.x + 0.5) * tamanhoDaPeca;
            const cy = (pos.y + 0.5) * tamanhoDaPeca;
            const raioAura = tamanhoDaPeca * 2.2;
            
            const rx = maca.x * tamanhoDaPeca;
            const ry = maca.y * tamanhoDaPeca;
=======
        //verifica se o inimigo pegou a maca
        function verificarColisaoInimigoComMaca() {
            const cabecaInimiga = cobraInimiga.rastro[cobraInimiga.rastro.length - 1];
            
            if (cobraInimiga.pos.x === maca.x && cobraInimiga.pos.y === maca.y) {
                cobraInimiga.tail++;
                posicaoMaca();
                
                //feedback +1
                feedbackInimiga.ativo = true;
                feedbackInimiga.texto = "+1";
                feedbackInimiga.x = cabecaInimiga.x * tamanhoDaPeca + 10;
                feedbackInimiga.y = cabecaInimiga.y * tamanhoDaPeca - 4;
                
                setTimeout(() => {
                    feedbackJogador.ativo = false;
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
>>>>>>> e7f93f05f9992080fab26339d69517969ceae4ab
            
            if (colisaoCirculoRetangulo(cx, cy, raioAura, rx, ry, tamanhoDaPeca, tamanhoDaPeca)) {
                colidiuComAura = true;
            }
        }
        
<<<<<<< HEAD
        // verifica colisao cobrinha normal e cobrinha com aura
        if (colidiuComCobra || colidiuComAura) {
            if (colidiuComAura) {
                explodirParticulas(
                    maca.x * tamanhoDaPeca + tamanhoDaPeca / 2,
                    maca.y * tamanhoDaPeca + tamanhoDaPeca / 2,
                    "#00ff88"
                );
            }
=======
        
        //verifica colisao da cobra e aura com a maca
        function verificaColisaoCobraOuAuraComMaca() {
            // colisao cobra e maça sem poder
            const colidiuComCobra = (maca.x === pos.x && maca.y === pos.y);
>>>>>>> e7f93f05f9992080fab26339d69517969ceae4ab
            
            tail++;
            posicaoMaca();
            
            gameState.pontuacao += 1;
            gameState.atualizarPontuacao();
            
            // mostrar +1 verde com feedback Jogador, só se NÃO estiver com poder
            if (!temPoder) {
                feedbackJogador.ativo = true;
                feedbackJogador.texto = "+1";
                feedbackJogador.cor = "#00ff88";
                
                feedbackJogador.x = pos.x * tamanhoDaPeca + 10;
                feedbackJogador.y = pos.y * tamanhoDaPeca - 4;
                
                setTimeout(() => feedbackJogador.ativo = false, 800);
            }
<<<<<<< HEAD
            gameState.atualizarPontuacao();
        }
    }
    
    
    //verifica colisao da cobra com o poder
    function verificaColisaoCobraEPoder() {
        if (poder.x == pos.x && poder.y == pos.y) {
            poderVisivel = false;
            //ativa e remove poder
            if (!temPoder) {
                temPoder = true;
=======
            
            // verifica colisao cobrinha normal e cobrinha com aura
            if (colidiuComCobra || colidiuComAura) {
                if (colidiuComAura) {
                    explodirParticulas(
                        maca.x * tamanhoDaPeca + tamanhoDaPeca / 2,
                        maca.y * tamanhoDaPeca + tamanhoDaPeca / 2,
                        "#00ff88"
                    );
                }
>>>>>>> e7f93f05f9992080fab26339d69517969ceae4ab
                
                setTimeout(function() {
                    temPoder = false;
                }, 7000);
                
<<<<<<< HEAD
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
=======
                gameState.pontuacao += 1;
                gameState.atualizarPontuacao();
                
                // mostrar +1 verde com feedback Jogador, só se NÃO estiver com poder
                if (!temPoder) {
                    feedbackJogador.ativo = true;
                    feedbackJogador.texto = "+1";
                    feedbackJogador.cor = "#00ff88";
                    
                    feedbackJogador.x = pos.x * tamanhoDaPeca + 10;
                    feedbackJogador.y = pos.y * tamanhoDaPeca - 4;
                    
                    setTimeout(() => feedbackJogador.ativo = false, 800);
                }
                gameState.atualizarPontuacao();
>>>>>>> e7f93f05f9992080fab26339d69517969ceae4ab
            }
            
            // espera para atualizar a nova posiçao da maça
            setTimeout(() => {
                posicaoPoder();
                poderVisivel = true;
            }, 15000);
        }
    }
    
    
    //desenha rastro
    function desenhaRastro() {
        gameState.rastro.push({
            x: pos.x,
            y: pos.y
        });
        
        while (rastro.length > tail) {
            rastro.shift();
        }
    }
    
    
    // Verifica se a cobra colidiu com algum sistema e entrega os bits necessários
    function verificarEntregaDeBits() {
        const cobraX = gameState.pos.x * gameState.tamanhoDaPeca;
        const cobraY = gameState.pos.y * gameState.tamanhoDaPeca;
        
        sistemas.forEach((sistema) => {
            if (sistema.completo) return;
            
            const colisao = cobraX < sistema.x + sistema.largura &&
                cobraX + gameState.tamanhoDaPeca > sistema.x &&
                cobraY < sistema.y + sistema.altura &&
                cobraY + gameState.tamanhoDaPeca > sistema.y;
            
            if (colisao && gameState.pontuacao > 0) {
                const falta = sistema.meta - sistema.bits;
                const entregue = Math.min(falta, gameState.pontuacao);
                
                sistema.bits += entregue;
                gameState.pontuacao -= entregue;
                gameState.atualizarPontuacao();
                tail = Math.max(1, tail - entregue); //reduz o rastro
                
                //atualiza o rastro visual
                while (rastro.length > tail) {
                    rastro.shift();
                }
                
                if (sistema.bits >= sistema.meta) {
                    sistema.completo = true;
                }
                
                //se todos sistemas estiver completo, chama vitoria
                const todosCompletos = sistemas.every(s => s.completo);
                if (todosCompletos && !gameState.ganhou) {
                    gameState.ganhou = true;
                    gameState.perdeu = false;
                    gameState.vitoria();
                }
            }
        });
    }
    
    
    // === ATUALIZA POSICOES  ===
    
    
    //funcao para  atualizar a nova posiçao do poder
    function posicaoPoder() {
        poder.x = Math.floor(Math.random() * quantidadeDePeca);
        poder.y = Math.floor(Math.random() * quantidadeDePeca);
        
        poderVisivel = true;
        desenharPoder();
<<<<<<< HEAD
    }
    
    
    //funcao para  atualizar a nova posiçao da maça
    function posicaoMaca() {
        maca.x = Math.floor(Math.random() * quantidadeDePeca);
        maca.y = Math.floor(Math.random() * quantidadeDePeca);
    }
    
    
    // === INICIA AUTOMATICAMENTE ===
    gameState.initUI();
    
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
    
    // === DETECÇÃO DE COLISÕES ===
    verificarEntregaDeBits();
    verificaColisaoCobraOuAuraComMaca();
    verificaColisaoCobraEPoder();
    atualizarCobraInimiga();
    checarColisaoComCobraInimiga();
    verificarColisaoInimigoComMaca();
    
    // === CONFIGURACOES ===
    gameState.configurarBotoes();
    gameState.configurarControles();
};
=======
        desenharFeedback();
        
        // === DETECÇÃO DE COLISÕES ===
        verificaColisaoCobraOuAuraComMaca();
        verificaColisaoCobraEPoder();
        atualizarCobraInimiga();
        checarColisaoComCobraInimiga();
        verificarColisaoInimigoComMaca();
        
        // === CONFIGURACOES ===
        gameState.configurarBotoes();
        gameState.configurarControles();
    };
>>>>>>> e7f93f05f9992080fab26339d69517969ceae4ab

// === GAME LOOP ===
function gameLoop(agora) {
    if (gameState.jogoPausado || gameState.jogoFinalizado) return;
    
    
    gameState.ultimaDirecao.x = gameState.vel.x;
    gameState.ultimaDirecao.y = gameState.vel.y;
    
    const delta = agora - gameState.ultimoFrame;
    
    if (delta >= gameState.tempoVelocidade) {
        gameState.ultimoFrame = agora;
        meuGame();
    }
    
    requestAnimationFrame(gameLoop);
}


window.onload = () => {
    gameState.initUI();
    gameState.ultimoFrame = performance.now();
    
    gameState.tempo = 300;
    gameState.contarTempo();
    requestAnimationFrame(gameLoop);
};