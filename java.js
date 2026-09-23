// ==========================================
// CARRINHO
// ==========================================

let carrinho = [];

const botoesAdicionar = document.querySelectorAll(".btn-adicionar");
const itensCarrinho = document.getElementById("itens-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");
const botaoFinalizar = document.getElementById("finalizar-compra");


// ==========================================
// ADICIONAR PRODUTO AO CARRINHO
// ==========================================

botoesAdicionar.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const produto = botao.getAttribute("data-produto");
        const preco = parseFloat(botao.getAttribute("data-preco"));

        // Verifica se o produto já está no carrinho
        const produtoExistente = carrinho.find(
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

        const subtotal = item.preco * item.quantidade;

        total += subtotal;


        const div = document.createElement("div");

        div.classList.add("item-carrinho", "mb-3");


        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">

                <div>
                    <strong>${item.nome}</strong>

                    <br>

                    <small>
                        R$ ${item.preco.toFixed(2).replace(".", ",")}
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
                    R$ ${subtotal.toFixed(2).replace(".", ",")}
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

    carrinho[index].quantidade++;

    atualizarCarrinho();

}


// ==========================================
// DIMINUIR QUANTIDADE
// ==========================================

function diminuirQuantidade(index) {

    if (carrinho[index].quantidade > 1) {

        carrinho[index].quantidade--;

    } else {

        carrinho.splice(index, 1);

    }

    atualizarCarrinho();

}


// ==========================================
// REMOVER PRODUTO
// ==========================================

function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();

}


// ==========================================
// FINALIZAR COMPRA
// ==========================================

botaoFinalizar.addEventListener("click", function () {

    // Verifica se o carrinho está vazio

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }


    // Gera o código PIX

    gerarQRCode();


    // Abre o modal

    const modalPix =
        new bootstrap.Modal(
            document.getElementById("modalPix")
        );

    modalPix.show();

});


// ==========================================
// GERAR QR CODE
// ==========================================

function gerarQRCode() {

    // Gera números aleatórios

    const numeroAleatorio =
        Math.floor(
            Math.random() * 1000000000
        );


    // Cria o código PIX fictício

    const codigoPix =
        "PIX-REI-GELADA-" +
        numeroAleatorio;


    // Coloca o código no campo

    document.getElementById("codigoPix").value =
        codigoPix;


    // Limpa o QR Code anterior

    const areaQRCode =
        document.getElementById("qrcode");

    areaQRCode.innerHTML = "";


    // Cria o novo QR Code

    new QRCode(areaQRCode, {

        text: codigoPix,

        width: 200,

        height: 200

    });

}


// ==========================================
// INICIALIZA O CARRINHO
// ==========================================

atualizarCarrinho();