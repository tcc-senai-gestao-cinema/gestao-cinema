        document.addEventListener('DOMContentLoaded', () => {
            const gridContainer = document.getElementById('grid-container');
            const carrinho = [];
            const carrinhoItensContainer = document.getElementById('carrinho-itens');
            const totalPrecoEl = document.getElementById('total-preco');
            const btnFinalizar = document.getElementById('btn-finalizar-compra');
            
            const modal = document.getElementById('modal-mensagem');
            const modalTexto = document.getElementById('modal-texto');
            const modalFechar = document.getElementById('modal-fechar');
            modalFechar.addEventListener('click', () => modal.style.display = 'none');

            async function carregarProdutos() {
                try {
                    const response = await fetch('/lojinha/produtos');
                    if (!response.ok) throw new Error('Não foi possível carregar os produtos.');
                    
                    const produtos = await response.json();
                    gridContainer.innerHTML = '';

                    if (produtos.length === 0) {
                        gridContainer.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
                        return;
                    }

                    produtos.forEach(produto => {
                        const card = document.createElement('div');
                        card.className = 'produto-card';
                        const imageUrl = produto.imagem_url || '/img/lojinha/produto-sem-imagem.jpg';
                        
                        card.innerHTML = `
                            <img src="${imageUrl}" alt="Imagem de ${produto.nome}">
                            <div class="card-body">
                                <h3>${produto.nome}</h3>
                                <p class="preco">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p>
                                <p class="descricao">${produto.descricao}</p>
                                <button class="btn-adicionar"
                                        data-id="${produto.id_produto}"
                                        data-nome="${produto.nome}"
                                        data-preco="${produto.preco}">
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                        `;
                        gridContainer.appendChild(card);
                    });
                } catch (error) {
                    gridContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
                }
            }
            

            gridContainer.addEventListener('click', (evento) => {
                // Verifica se o elemento clicado é um botão de adicionar
                if (evento.target && evento.target.matches('.btn-adicionar')) {
                    // Se for, chama a função para adicionar ao carrinho
                    adicionarAoCarrinho(evento.target);
                }
            });


            function adicionarAoCarrinho(button) {
                const id = parseInt(button.dataset.id);
                const nome = button.dataset.nome;
                const preco = parseFloat(button.dataset.preco);

                const itemExistente = carrinho.find(item => item.id_produto === id);

                if (itemExistente) {
                    itemExistente.quantidade++;
                } else {
                    carrinho.push({ id_produto: id, nome: nome, preco: preco, quantidade: 1 });
                }
                atualizarCarrinhoUI();
            }

            function atualizarCarrinhoUI() {
                if (carrinho.length === 0) {
                    carrinhoItensContainer.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
                    btnFinalizar.disabled = true;
                } else {
                    carrinhoItensContainer.innerHTML = '';
                    let precoTotal = 0;
                    carrinho.forEach(item => {
                        const itemEl = document.createElement('div');
                        itemEl.classList.add('carrinho-item');
                        itemEl.innerHTML = `
                            <span>${item.nome} (x${item.quantidade})</span>
                            <span>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                        `;
                        carrinhoItensContainer.appendChild(itemEl);
                        precoTotal += item.preco * item.quantidade;
                    });
                    totalPrecoEl.textContent = `R$ ${precoTotal.toFixed(2).replace('.', ',')}`;
                    btnFinalizar.disabled = false;
                }
            }

            async function finalizarCompra() {
                btnFinalizar.disabled = true;
                btnFinalizar.textContent = 'Processando...';
                const dadosCompra = {
                    itens: carrinho.map(item => ({ id_produto: item.id_produto, quantidade: item.quantidade })),
                    forma_pagamento: 'Cartão Online'
                };
                try {
                    const response = await fetch('/lojinha/comprar', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dadosCompra)
                    });
                    const resultado = await response.json();
                    if (resultado.sucesso) {
                        mostrarMensagem(resultado.mensagem, true);
                        setTimeout(() => {
                           window.location.href = `/perfil/compras/${resultado.vendaId}`;
                        }, 2000);
                    } else {
                        throw new Error(resultado.mensagem);
                    }
                } catch (error) {
                    mostrarMensagem(error.message || 'Falha ao conectar com o servidor.', false);
                    btnFinalizar.disabled = false;
                    btnFinalizar.textContent = 'Finalizar Compra';
                }
            }
            
            function mostrarMensagem(texto, sucesso = true) {
                modalTexto.textContent = texto;
                modal.querySelector('.modal-content').className = sucesso ? 'modal-content sucesso' : 'modal-content erro';
                modal.style.display = 'flex';
            }

            btnFinalizar.addEventListener('click', finalizarCompra);

            carregarProdutos();
        });