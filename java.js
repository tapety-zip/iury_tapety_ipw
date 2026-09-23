// ==========================
// CARRINHO
// ==========================

let carrinho = [];


// ==========================
// ESTOQUE DOS PRODUTOS
// ==========================

// Defina aqui quantas unidades existem de cada produto
let estoque = {
    "Heineken": 20,
    "Skol": 30,
    "Coca Cola": 25,
    "Guaraná Antarctica": 20
};


const botoesAdicionar = document.querySelectorAll(".btn-adicionar");
const itensCarrinho = document.getElementById("itens-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");


// ==========================
// MOSTRAR ESTOQUE NOS CARDS
// ==========================

botoesAdicionar.forEach(botao => {

    const nome = botao.dataset.produto;
    const quantidadeEstoque = estoque[nome];

    const cardBody = botao.closest(".card-body");

    // Cria o texto do estoque
    const estoqueTexto = document.createElement("p");

    estoqueTexto.classList.add("estoque-texto");

    estoqueTexto.innerHTML = `
        Estoque: <span class="quantidade-estoque">${quantidadeEstoque}</span> unidades
    `;

    // Coloca o estoque antes do botão
    cardBody.insertBefore(estoqueTexto, botao);


    // Se o produto já estiver sem estoque
    if (quantidadeEstoque === 0) {

        botao.disabled = true;
        botao.textContent = "Esgotado";

    }

});


// ==========================
// BOTÃO ADICIONAR
// ==========================

botoesAdicionar.forEach(botao => {

    botao.addEventListener("click", () => {

        const nome = botao.dataset.produto;
        const preco = parseFloat(botao.dataset.preco);

        // Procura o produto dentro do carrinho
        const produtoExistente = carrinho.find(
            produto => produto.nome === nome
        );


        // Descobre quantas unidades desse produto
        // já estão no carrinho
        const quantidadeNoCarrinho = produtoExistente
            ? produtoExistente.quantidade
            : 0;


        // Verifica se ainda há estoque disponível
        if (quantidadeNoCarrinho >= estoque[nome]) {

            alert("Não há mais unidades disponíveis desse produto.");
            return;

        }


        // Se o produto já estiver no carrinho
        if (produtoExistente) {

            produtoExistente.quantidade++;

        } else {

            // Se ainda não estiver, adiciona
            carrinho.push({
                nome: nome,
                preco: preco,
                quantidade: 1
            });

        }


        // Atualiza o carrinho
        atualizarCarrinho();

    });

});


// ==========================
// ATUALIZAR CARRINHO
// ==========================

function atualizarCarrinho() {

    itensCarrinho.innerHTML = "";

    let total = 0;


    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {

        itensCarrinho.innerHTML = `
            <p>Nenhum produto adicionado.</p>
        `;

    } else {

        // Percorre todos os produtos do carrinho
        carrinho.forEach((produto, index) => {

            // Calcula o subtotal
            const subtotal =
                produto.preco * produto.quantidade;

            // Soma ao total
            total += subtotal;


            // Mostra o produto na tela
            itensCarrinho.innerHTML += `
                <div class="item-carrinho">

                    <div>
                        <strong>${produto.nome}</strong>

                        <p>
                            ${produto.quantidade}x
                            R$ ${produto.preco
                                .toFixed(2)
                                .replace(".", ",")}
                        </p>
                    </div>

                    <span>
                        R$ ${subtotal
                            .toFixed(2)
                            .replace(".", ",")}
                    </span>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="removerProduto(${index})">
                        Remover
                    </button>

                </div>
            `;

        });

    }


    // Mostra o total
    totalCarrinho.textContent = total
        .toFixed(2)
        .replace(".", ",");

}


// ==========================
// REMOVER PRODUTO DO CARRINHO
// ==========================

function removerProduto(index) {

    // Remove o produto do array
    carrinho.splice(index, 1);

    // Atualiza a tela
    atualizarCarrinho();

}


// ==========================
// ATUALIZAR ESTOQUE NA TELA
// ==========================

function atualizarEstoqueNaTela(nome) {

    botoesAdicionar.forEach(botao => {

        if (botao.dataset.produto === nome) {

            const cardBody =
                botao.closest(".card-body");

            const quantidadeEstoque =
                cardBody.querySelector(".quantidade-estoque");


            // Atualiza o número mostrado
            quantidadeEstoque.textContent =
                estoque[nome];


            // Se acabar o estoque
            if (estoque[nome] === 0) {

                botao.disabled = true;
                botao.textContent = "Esgotado";

            } else {

                botao.disabled = false;
                botao.textContent = "Adicionar";

            }

        }

    });

}


// ==========================
// FINALIZAR COMPRA
// ==========================

const finalizarCompra =
    document.getElementById("finalizar-compra");

const avisoCompra =
    document.getElementById("aviso-compra");


finalizarCompra.addEventListener("click", () => {


    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {

        alert(
            "Adicione algum produto ao carrinho antes de finalizar a compra."
        );

        return;

    }


    // ==========================
    // DIMINUIR O ESTOQUE
    // ==========================

    carrinho.forEach(produto => {

        estoque[produto.nome] =
            estoque[produto.nome] - produto.quantidade;

        atualizarEstoqueNaTela(produto.nome);

    });


    // ==========================
    // MOSTRAR AVISO DE COMPRA
    // ==========================

    avisoCompra.style.display = "block";


    // ==========================
    // LIMPAR O CARRINHO
    // ==========================

    carrinho = [];

    atualizarCarrinho();


    // ==========================
    // ESCONDER AVISO APÓS 4 SEGUNDOS
    // ==========================

    setTimeout(() => {

        avisoCompra.style.display = "none";

    }, 4000);

});