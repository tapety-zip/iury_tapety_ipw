// Carrinho
let carrinho = [];

const botoesAdicionar = document.querySelectorAll(".btn-adicionar");
const itensCarrinho = document.getElementById("itens-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");

botoesAdicionar.forEach(botao => {

    botao.addEventListener("click", () => {

        const nome = botao.dataset.produto;
        const preco = parseFloat(botao.dataset.preco);

        const produtoExistente = carrinho.find(
            produto => produto.nome === nome
        );

        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            carrinho.push({
                nome: nome,
                preco: preco,
                quantidade: 1
            });
        }

        atualizarCarrinho();
    });

});

function atualizarCarrinho() {

    itensCarrinho.innerHTML = "";

    let total = 0;

    if (carrinho.length === 0) {

        itensCarrinho.innerHTML = `
            <p>Nenhum produto adicionado.</p>
        `;

    } else {

        carrinho.forEach((produto, index) => {

            const subtotal = produto.preco * produto.quantidade;

            total += subtotal;

            itensCarrinho.innerHTML += `
                <div class="item-carrinho">

                    <div>
                        <strong>${produto.nome}</strong>

                        <p>
                            ${produto.quantidade}x 
                            R$ ${produto.preco.toFixed(2).replace(".", ",")}
                        </p>
                    </div>

                    <span>
                        R$ ${subtotal.toFixed(2).replace(".", ",")}
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

    totalCarrinho.textContent = total
        .toFixed(2)
        .replace(".", ",");
}

function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();
}
// AVISO COMPRA
const finalizarCompra = document.getElementById("finalizar-compra");
const avisoCompra = document.getElementById("aviso-compra");

finalizarCompra.addEventListener("click", () => {

    if (carrinho.length === 0) {
        alert("Adicione algum produto ao carrinho antes de finalizar a compra.");
        return;
    }

    avisoCompra.style.display = "block";

    carrinho = [];
    atualizarCarrinho();

    setTimeout(() => {
        avisoCompra.style.display = "none";
    }, 4000);
});