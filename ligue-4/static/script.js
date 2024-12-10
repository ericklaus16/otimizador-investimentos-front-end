let tabuleiro = Array(6).fill().map(() => Array(7).fill(0));
let jogador = 1; // Jogador começa
let algoritmo = 'iterativo';
let podeJogar = true;

let metrics = [];

function iniciarJogo() {
    document.querySelectorAll("li").forEach(li => li.remove());
    podeJogar = true;
    tabuleiro = Array(6).fill().map(() => Array(7).fill(0));
    jogador = 1;
    document.getElementById('status').innerText = 'Sua vez!';
    desenharTabuleiro();
}

function desenharTabuleiro() {
    const tabuleiroElement = document.getElementById('tabuleiro');
    tabuleiroElement.innerHTML = '';
    for (let row = 0; row < 6; row++) {
        const linha = document.createElement('div');
        linha.classList.add('linha');
        for (let col = 0; col < 7; col++) {
            const celula = document.createElement('div');
            celula.classList.add('celula');
            celula.style.backgroundColor = tabuleiro[row][col] === 1 ? 'red' : tabuleiro[row][col] === 2 ? 'yellow' : 'white';
            celula.onclick = () => jogar(col);
            linha.appendChild(celula);
        }
        tabuleiroElement.appendChild(linha);
    }
}

function analisarMovimento(index) {
    let memoria = metrics[index].memoria_utilizada;
    let nos_gerados = metrics[index].nos_gerados;
    let nos_visitados = metrics[index].nos_visitados;
    let tempo_execucao = metrics[index].tempo_execucao;

    Swal.fire({
        title: "O que é isso?",
        text: "Aqui estão as métricas da jogada da IA:",
        html: `<ul>
            <li><b>Memória utilizada:</b>&nbsp;${memoria.toFixed(2)}KB</li>
            <li><b>Nós gerados:</b>&nbsp;${nos_gerados}</li>
            <li><b>Nós visitados:</b>&nbsp;${nos_visitados}</li>
            <li><b>Tempo de execução:</b>&nbsp;${tempo_execucao.toFixed(2)}s</li>
        `,
        icon: "question"
    });
}

function jogar(col) {
    if(podeJogar){
        if (tabuleiro[0][col] !== 0) return; // Coluna cheia

        if(jogador == 1){
            document.getElementById('jogadas-jogador').innerHTML += `<li>Você jogou Coluna ${col+1}</li>`;
        }

        fetch('/jogar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tabuleiro: tabuleiro,
                jogador: jogador,
                col: col,
                algoritmo: algoritmo,
                profundidade: 3
            })
        })
        .then(response => response.json())
        .then(data => {
            tabuleiro = data.tabuleiro;
            metrics.push(data.metrics);

            if(data.jogadaIA !== undefined){
                document.getElementById('jogadas-ia').innerHTML += `<li onclick="analisarMovimento(${metrics.length - 1})">IA jogou Coluna ${data.jogadaIA+1}</li>`;
            }

            if (data.vitoria) {
                if(data.vitoria == 2){
                    document.getElementById('status').innerText = `A IA venceu!`;
                    podeJogar = false;
                } else if(data.vitoria == 1){
                    document.getElementById('status').innerText = `Você venceu!`;
                    podeJogar = false;
                } else {
                    document.getElementById('status').innerText = `Empate!`;
                    podeJogar = false;
                }
            } else {
                desenharTabuleiro();
            }
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "O jogo já acabou! Você precisa reiniciar o jogo."
        });
    }
}

document.getElementById('algoritmo').addEventListener('change', function() {
    algoritmo = this.value;
});