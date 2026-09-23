// ==========================================
// ESTOQUE
// ==========================================

const estoqueInicial = {
    "Heineken": 20,
    "Skol": 30,
    "Coca Cola": 25,
    "Guaraná Antarctica": 15
};


// Recupera o estoque salvo
let estoque = JSON.parse(
    localStorage.getItem("estoqueReiGelada")
);


// Se ainda não existir estoque salvo,
// começa com o estoque inicial
if (!estoque) {
    estoque = { ...estoqueInicial };

    localStorage.setItem(
        "estoqueReiGelada",
        JSON.stringify(estoque)
    );
}


// ==========================================
// CARRINHO
// ==========================================

let carrinho = [];

const botoesAdicionar =
    document.querySelectorAll(".btn-adicionar");

const itensCarrinho =
    document.getElementById("itens-carrinho");

const totalCarrinho =
    document.getElementById("total-carrinho");

const botaoFinalizar =
    document.getElementById("finalizar-compra");


// ==========================================
// MOSTRAR ESTOQUE
// ==========================================

function atualizarEstoqueNaTela() {

    botoesAdicionar.forEach(function (botao) {

        const produto =
            botao.getAttribute("data-produto");

        const quantidade =
            estoque[produto];


        // Procura o número do estoque
        // dentro do card
        const card =
            botao.closest(".card-body");

        const textoEstoque =
            card.querySelector(".quantidade-estoque");


        if (textoEstoque) {

            textoEstoque.textContent = quantidade;

        }


        // Se acabar o estoque
        if (quantidade <= 0) {

            botao.disabled = true;

            botao.textContent = "Esgotado";

        } else {

            botao.disabled = false;

            botao.textContent = "Adicionar";

        }

    });

}


// ==========================================
// SALVAR ESTOQUE
// ==========================================

function salvarEstoque() {

    localStorage.setItem(
        "estoqueReiGelada",
        JSON.stringify(estoque)
    );

}


// ==========================================
// ADICIONAR PRODUTO
// ==========================================

botoesAdicionar.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const produto =
            botao.getAttribute("data-produto");

        const preco =
            parseFloat(
                botao.getAttribute("data-preco")
            );


        // Verifica estoque
        if (estoque[produto] <= 0) {

            alert("Produto esgotado!");

            return;

        }


        // Diminui o estoque
        estoque[produto]--;


        // Procura o produto no carrinho
        const produtoExistente =
            carrinho.find(
                item => item.nome === produto
            );


        if (produtoExistente) {

            produtoExistente.quantidade++;

        } else {

            carrinho.push({

                nome: produto,

                preco: preco,

                quantidade: 1

            });

        }


        salvarEstoque();

        atualizarEstoqueNaTela();

        atualizarCarrinho();

    });

});


// ==========================================
// ATUALIZAR CARRINHO
// ==========================================

function atualizarCarrinho() {

    itensCarrinho.innerHTML = "";


    if (carrinho.length === 0) {

        itensCarrinho.innerHTML =
            "<p>Nenhum produto adicionado.</p>";

        totalCarrinho.textContent = "0,00";

        return;

    }


    let total = 0;


    carrinho.forEach(function (item, index) {

        const subtotal =
            item.preco * item.quantidade;

        total += subtotal;


        const div =
            document.createElement("div");


        div.classList.add(
            "item-carrinho",
            "mb-3"
        );


        div.innerHTML = `

            <div class="d-flex justify-content-between align-items-center">

                <div>

                    <strong>
                        ${item.nome}
                    </strong>

                    <br>

                    <small>
                        R$ ${item.preco
                            .toFixed(2)
                            .replace(".", ",")}
                    </small>

                </div>


                <div class="d-flex align-items-center gap-2">

                    <button
                        class="btn btn-sm btn-outline-secondary"
                        onclick="diminuirQuantidade(${index})">
                        -
                    </button>


                    <span>
                        ${item.quantidade}
                    </span>


                    <button
                        class="btn btn-sm btn-outline-secondary"
                        onclick="aumentarQuantidade(${index})">
                        +
                    </button>


                    <button
                        class="btn btn-sm btn-danger"
                        onclick="removerProduto(${index})">
                        🗑️
                    </button>

                </div>

            </div>


            <div class="text-end">

                Subtotal:

                <strong>
                    R$ ${subtotal
                        .toFixed(2)
                        .replace(".", ",")}
                </strong>

            </div>

        `;


        itensCarrinho.appendChild(div);

    });


    totalCarrinho.textContent =
        total.toFixed(2).replace(".", ",");

}


// ==========================================
// AUMENTAR QUANTIDADE
// ==========================================

function aumentarQuantidade(index) {

    const produto =
        carrinho[index].nome;


    // Verifica estoque
    if (estoque[produto] <= 0) {

        alert(
            "Não há mais unidades desse produto no estoque!"
        );

        return;

    }


    carrinho[index].quantidade++;

    estoque[produto]--;


    salvarEstoque();

    atualizarEstoqueNaTela();

    atualizarCarrinho();

}


// ==========================================
// DIMINUIR QUANTIDADE
// ==========================================

function diminuirQuantidade(index) {

    const produto =
        carrinho[index].nome;


    if (carrinho[index].quantidade > 1) {

        carrinho[index].quantidade--;

    } else {

        carrinho.splice(index, 1);

    }


    // Devolve o produto ao estoque
    estoque[produto]++;


    salvarEstoque();

    atualizarEstoqueNaTela();

    atualizarCarrinho();

}


// ==========================================
// REMOVER PRODUTO
// ==========================================

function removerProduto(index) {

    const produto =
        carrinho[index].nome;

    const quantidade =
        carrinho[index].quantidade;


    // Devolve todas as unidades
    // para o estoque
    estoque[produto] += quantidade;


    carrinho.splice(index, 1);


    salvarEstoque();

    atualizarEstoqueNaTela();

    atualizarCarrinho();

}


// ==========================================
// FINALIZAR COMPRA
// ==========================================

botaoFinalizar.addEventListener(
    "click",
    function () {

        if (carrinho.length === 0) {

            alert(
                "Seu carrinho está vazio!"
            );

            return;

        }


        gerarQRCode();


        const modalPix =
            new bootstrap.Modal(
                document.getElementById("modalPix")
            );


        modalPix.show();

    }
);


// ==========================================
// GERAR QR CODE
// ==========================================

function gerarQRCode() {

    const numeroAleatorio =
        Math.floor(
            Math.random() * 1000000000
        );


    const codigoPix =
        "PIX-REI-GELADA-" +
        numeroAleatorio;


    document.getElementById(
        "codigoPix"
    ).value = codigoPix;


    const areaQRCode =
        document.getElementById("qrcode");


    areaQRCode.innerHTML = "";


    new QRCode(
        areaQRCode,
        {
            text: codigoPix,
            width: 200,
            height: 200
        }
    );

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarEstoqueNaTela();

atualizarCarrinho();