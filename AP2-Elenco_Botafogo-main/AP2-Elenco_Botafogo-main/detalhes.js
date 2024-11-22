if (sessionStorage.getItem('logado')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const pega_json = async (caminho) => {
        const resposta = await fetch(caminho);
        const dados = await resposta.json();
        return dados;
    }

    const montaPagina = (dados) => {
        const body = document.body;
    
        // Imagem
        const imagem = document.createElement('img');
        imagem.src = dados.imagem;
        imagem.classList.add('jogador-imagem');
        body.appendChild(imagem);
    
        // Nome
        const nome = document.createElement('h1');
        nome.innerHTML = dados.nome;
        nome.classList.add('jogador-nome'); // Classe para estilos adicionais
        body.appendChild(nome);
    
        // Estatísticas (posição, altura, etc.)
        const stats = document.createElement('div'); // Contêiner para as estatísticas
        stats.classList.add('jogador-stats-container');
    
        const posicao = document.createElement('h3');
        posicao.innerHTML = "POSIÇÃO: " + dados.posicao;
        posicao.classList.add('jogador-stats');
        stats.appendChild(posicao);
    
        const altura = document.createElement('h3');
        altura.innerHTML = "ALTURA: " + dados.altura + "m";
        altura.classList.add('jogador-stats');
        stats.appendChild(altura);
    
        const nascimento = document.createElement('h3');
        nascimento.innerHTML = "DATA DE NASCIMENTO: " + dados.nascimento;
        nascimento.classList.add('jogador-stats');
        stats.appendChild(nascimento);
    
        const n_jogos = document.createElement('h3');
        n_jogos.innerHTML = "JOGOS: " + dados.n_jogos;
        n_jogos.classList.add('jogador-stats');
        stats.appendChild(n_jogos);
    
        const naturalidade = document.createElement('h3');
        naturalidade.innerHTML = "NATURALIDADE: " + dados.naturalidade;
        naturalidade.classList.add('jogador-stats');
        stats.appendChild(naturalidade);

        const voltar = document.createElement('a');
        voltar.textContent = 'Voltar';
        voltar.href = 'index.html';
        

    
        body.appendChild(stats); // Adiciona o contêiner de estatísticas ao body
        document.body.appendChild(voltar);
    };

    pega_json(`https://botafogo-atletas.mange.li/2024-1/${id}`).then(
        (r) => montaPagina(r)
    );
} else {
    document.body.innerHTML = "<h1>Você precisa estar logado para acessar esse conteúdo</h1>";
}
