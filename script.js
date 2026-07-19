// ======================================================
// 1. Mensagens Flutuantes Controladas por Você
// ======================================================
const muralContainer = document.getElementById('mural-container');

// ✍️ EDITE OU ADICIONE MAIS FRASES AQUI PARA O LOOP FLUTUANTE
const mensagensFixas = [
    { nome: "Lauro", texto: "Feliz aniversário lindo" },
    { nome: "Liniker", texto: "Parabéns xuxuzinho" },
    { nome: "Zé", texto: "Parabéns, Matheus! Muitas felicidades!" },
    { nome: "Denilson", texto: "Feliz aniversário, te amo" },
    { nome: "Pudim", texto: "Feliz aniversário! Aproveita muito seu dia!" },
    { nome: "Aruan", texto: "Que você tenha tantos verdes quanto tem de green flags" }
];

let alternarLado = true;
let ultimaPosicaoX = 0;

function criarBalaoFlutuante(nome, texto) {
    if (!muralContainer) return;

    const novoRecado = document.createElement('div');
    novoRecado.classList.add('card-recado');
    novoRecado.innerHTML = `<h3> ${nome} enviou:</h3><p>"${texto}"</p>`;

    let posicaoX;
    if (alternarLado) {
        posicaoX = 3 + (Math.random() * 22);
    } else {
        posicaoX = 65 + (Math.random() * 22);
    }

    if (Math.abs(posicaoX - ultimaPosicaoX) < 10) {
        posicaoX = alternarLado ? posicaoX + 8 : posicaoX - 8;
    }

    ultimaPosicaoX = posicaoX;
    alternarLado = !alternarLado;

    novoRecado.style.left = `${posicaoX}%`;
    const alturaPartidaAleatoria = Math.floor(Math.random() * 60);
    novoRecado.style.bottom = `${alturaPartidaAleatoria}px`;

    const atrasoAnimacao = (Math.random() * 0.4).toFixed(2);
    novoRecado.style.animationDelay = `${atrasoAnimacao}s`;

    muralContainer.appendChild(novoRecado);

    setTimeout(() => { novoRecado.remove(); }, 6000);
}

function iniciarLoopDeRecados() {
    let index = 0;
    if (mensagensFixas.length === 0) return;

    criarBalaoFlutuante(mensagensFixas[index].nome, mensagensFixas[index].texto);
    index = (index + 1) % mensagensFixas.length;

    setInterval(() => {
        const recadoDaVez = mensagensFixas[index];
        criarBalaoFlutuante(recadoDaVez.nome, recadoDaVez.texto);
        index = (index + 1) % mensagensFixas.length;
    }, 4000);
}
setTimeout(iniciarLoopDeRecados, 1000);

// ======================================================
// 2. Banco de Fotos dos Álbuns
// ======================================================
const bancoDeFotos = {
    Laura: ["fotos/lauro1.png"],
    Linka: ["fotos/liniker1.jpg"],
    Josie: ["fotos/jose1.jpg"],
    Dani: ["fotos/deni1.jpg"],
    amigo5: ["fotos/pudim1.png"]
};

// ======================================================
// 3. Mecânica dos Envelopes e Gatilho do Vídeo Final
// ======================================================
const modal = document.getElementById('modal-album');
const modalTitulo = document.getElementById('modal-titulo-amigo');
const modalFotosContainer = document.getElementById('modal-fotos-container');
const cardsAmigos = document.querySelectorAll('.card-amigo');
const botaoFechar = document.querySelector('.fechar-modal');

const modalJackpot = document.getElementById('modal-jackpot');
const videoPremio = document.getElementById('video-premio');
const btnFecharJackpot = document.getElementById('btn-fechar-jackpot');

const envelopesAbertos = new Set();

if (cardsAmigos) {
    cardsAmigos.forEach(card => {
        card.addEventListener('click', function() {
            const chaveAmigo = this.getAttribute('data-amigo');

            if (this.classList.contains('aberto')) {
                abrirModalDoAmigo(this);
                return;
            }

            this.classList.add('aberto');
            const nomeReal = this.getAttribute('data-nome');
            this.querySelector('h3').innerText = nomeReal;

            envelopesAbertos.add(chaveAmigo);

            setTimeout(() => {
                abrirModalDoAmigo(this);
            }, 800);
        });
    });
}

function abrirModalDoAmigo(cardElemento) {
    if (!modal || !modalTitulo || !modalFotosContainer) return;

    const chaveAmigo = cardElemento.getAttribute('data-amigo');
    const nomeReal = cardElemento.getAttribute('data-nome');
    const fotoPerfilDoEnvelope = cardElemento.querySelector('.foto-perfil').src;

    modalTitulo.innerText = `Álbum Premiado: ${nomeReal}`;
    modalFotosContainer.innerHTML = "";

    if (bancoDeFotos[chaveAmigo] && bancoDeFotos[chaveAmigo].length > 0) {
        bancoDeFotos[chaveAmigo].forEach(caminhoFoto => {
            const img = document.createElement('img');
            img.src = caminhoFoto;
            modalFotosContainer.appendChild(img);
        });
    } else {
        const img = document.createElement('img');
        img.src = fotoPerfilDoEnvelope;
        modalFotosContainer.appendChild(img);
    }

    modal.style.display = "block";
}

if (botaoFechar) {
    botaoFechar.addEventListener('click', () => {
        modal.style.display = "none";
        verificarFimDoJogo();
    });
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        verificarFimDoJogo();
    }
});

function verificarFimDoJogo() {
    if (envelopesAbertos.size === cardsAmigos.length) {
        setTimeout(() => {
            if (modalJackpot) {
                modalJackpot.style.display = "flex";
                if (videoPremio) {
                    videoPremio.play();
                }
            }
        }, 600);
    }
}

if (btnFecharJackpot) {
    btnFecharJackpot.addEventListener('click', () => {
        if (videoPremio) {
            videoPremio.pause();
        }
        if (modalJackpot) {
            modalJackpot.style.display = "none";
        }
    });
}