const urlBase = "https://botafogo-atletas.mange.li/2024-1/";

const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
};

const container = document.getElementById("container");
const campoPesquisa = document.getElementById('campoPesquisa');

let filtroAtuais = '';  // Filtro inicial padrão
let dadosAtuais = {};  // Armazena os dados carregados para evitar duplicação
let carregando = false;  // Indicador de carregamento

campoPesquisa.addEventListener('input', () => {
    carregarDados(filtroAtuais);  // Atualiza os dados conforme o filtro e o texto da pesquisa
});

document.getElementById('selecionaGenero').addEventListener('change', (event) => {
    const filtro = event.target.value;
    carregarDados(filtro);
});


const manipulaClick = (e) => {
    const id = e.currentTarget.dataset.id;
    const url = `detalhes.html?id=${id}`;

    document.cookie = `id=${id}`;
    localStorage.setItem('id', id);
    localStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset));
    sessionStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset));

    window.location = url;
};

const montaCard = (atleta) => {
    const cartao = document.createElement('article');
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");
    const descri = document.createElement("p");

    nome.innerHTML = atleta.nome;
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    cartao.appendChild(imagem);

    descri.innerHTML = atleta.detalhes;
    cartao.appendChild(descri);

    
    cartao.onclick = manipulaClick;

    cartao.dataset.id = atleta.id;
    cartao.dataset.nJogos = atleta.n_jogos;
    cartao.dataset.altura = atleta.altura;

    return cartao;
};

// Função para carregar dados com base no filtro e texto de pesquisa
const carregarDados = (filtro) => {
    if (carregando) return;  // Impede múltiplos carregamentos simultâneos

    // Limpa o container ANTES de adicionar os novos cards
    container.innerHTML = ""; 

    const textoPesquisa = campoPesquisa.value.toLowerCase(); // Pega o texto da pesquisa

    // Verifica se já temos os dados carregados para o filtro atual
    if (dadosAtuais[filtro]) {
        // Se os dados já estão carregados, filtra os dados conforme a pesquisa
        const dadosFiltrados = dadosAtuais[filtro].filter((atleta) =>
            atleta.nome.toLowerCase().includes(textoPesquisa)  // Verifica se o texto está em qualquer parte do nome
        );
        
        // Adiciona os cards ao container
        dadosFiltrados.forEach((atleta) => {
            container.appendChild(montaCard(atleta));
        });
    } else {
        // Caso contrário, faça a requisição para a API
        carregando = true; // Marca como carregando

        pega_json(`${urlBase}${filtro}`).then((r) => {
            // Armazena os dados carregados para o filtro atual
            dadosAtuais[filtro] = r;

            // Filtra os dados conforme a pesquisa
            const dadosFiltrados = r.filter((atleta) =>
                atleta.nome.toLowerCase().includes(textoPesquisa)  // Verifica se o texto está em qualquer parte do nome
            );
            
            // Adiciona os cards ao container
            dadosFiltrados.forEach((atleta) => {
                container.appendChild(montaCard(atleta));
            });

            carregando = false; // Marca como não carregando após a requisição
        }).catch((err) => {
            console.error("Erro ao carregar dados:", err);
            carregando = false; // Garante que o carregamento seja finalizado mesmo em caso de erro
        });
    }
};

// Filtros de gênero
document.querySelectorAll('#filtros button').forEach(button => {
    button.addEventListener('click', () => {
        // Quando o filtro "Todos" é clicado, fazemos a requisição com "all"
        const filtro = button.textContent.toLowerCase();

        // Ajusta o filtro com base no texto do botão
        filtroAtuais = filtro === 'todos' ? 'all' : filtro;

        // Carrega os dados para o filtro selecionado
        carregarDados(filtroAtuais); 
    });
});

// Logout: limpa o sessionStorage e redireciona para a página de login
document.getElementById('logout').onclick = () => {
    sessionStorage.removeItem('logado');
    window.location.href = "index.html";
};


