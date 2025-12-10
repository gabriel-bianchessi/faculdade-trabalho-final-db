import { CarrinhoToProductDto } from '../dto/carrinho-to-products.js';
import { CarrinhoService } from '../services/carrinho-service.js';
import { ProductsService } from '../services/products-service.js';
import { toast } from './toast.js';

(async () => {
    "use strict";

    const STORAGE_KEY_USER = '@fake-store-user';

    const productsService = new ProductsService();
    const carrinhoService = new CarrinhoService();
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const totalItems = document.getElementById('total-items');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const mensagem = document.getElementById('status-message');
    const cartCount = document.getElementById('cart-count');
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    const confirmCheckoutBtn = document.getElementById('confirm-checkout-btn');
    const customerEmail = document.getElementById('customer-email');
    const customerName = document.getElementById('customer-name');
    const modalTotal = document.getElementById('modal-total');
    const logoutButton = document.getElementById('logout-button');

    /**
     * @type { {id: number; titulo: string; preco: number; imagem_url: string; quantidade: number; categorias: string[]} }[]
    */
    let produtos = [];

    await loadProducts();
    renderizarCarrinho();
    atualizarBadgeCarrinho();
    configureEventListeners();

    async function loadProducts() {
        try {
            const data = await productsService.getAllProducts();
            produtos = data;
        } catch (error) {
            toast.error('Erro ao carregar produtos. Tente novamente mais tarde.');
            console.error('Erro ao carregar produtos:', error);
        }
    }

    function configureEventListeners() {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Deseja realmente limpar todo o carrinho?')) {
                carrinhoService.limparCarrinho();
                renderizarCarrinho();
                atualizarBadgeCarrinho();
                toast.info('Carrinho limpo com sucesso!');
            }
        });

        checkoutBtn.addEventListener('click', () => {
            abrirModalCheckout();
        });

        confirmCheckoutBtn.addEventListener('click', async () => {
            await confirmarPedido();
        });
    }

    function atualizarBadgeCarrinho() {
        const total = carrinhoService.totalItens;
        cartCount.textContent = total;
        cartCount.style.display = total > 0 ? 'inline' : 'none';
    }

    function renderizarCarrinho() {
        const itensCarrinho = carrinhoService.itensCarrinho;
        
        if (itensCarrinho.length === 0) {
            cartItemsContainer.classList.add('d-none');
            cartEmptyMessage.classList.remove('d-none');
            cartSubtotal.textContent = 'R$ 0,00';
            cartTotal.textContent = 'R$ 0,00';
            totalItems.textContent = '0';
            checkoutBtn.disabled = true;
            clearCartBtn.disabled = true;
            return;
        }

        cartItemsContainer.classList.remove('d-none');
        cartEmptyMessage.classList.add('d-none');
        checkoutBtn.disabled = false;
        clearCartBtn.disabled = false;
        
        let total = 0;
        let totalQtd = 0;
        cartItemsContainer.innerHTML = '';

        itensCarrinho.forEach(item => {
            const produto = produtos.find(p => p.id === parseInt(item.id));
            if (!produto) return;

            const preco = parseFloat(produto.preco);
            const subtotal = preco * item.quantidade;
            total += subtotal;
            totalQtd += item.quantidade;

            const itemCard = document.createElement('div');
            itemCard.className = 'card mb-3';
            itemCard.innerHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 text-center">
                            <img src="${produto.imagem_url}" class="img-fluid rounded" alt="${produto.titulo}" style="max-height: 100px; object-fit: contain;">
                        </div>
                        <div class="col-md-4">
                            <h5 class="card-title mb-1">${produto.titulo}</h5>
                            <p class="text-muted mb-1"><small>${produto.categorias[0] || 'Sem categoria'}</small></p>
                            <p class="text-muted mb-0"><small>Preço unitário: <strong>R$ ${preco.toFixed(2)}</strong></small></p>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label mb-1"><small>Quantidade:</small></label>
                            <div class="input-group">
                                <button class="btn btn-outline-secondary btn-sm" type="button" data-action="decrement" data-id="${item.id}">
                                    <strong>−</strong>
                                </button>
                                <input type="number" class="form-control form-control-sm text-center" value="${item.quantidade}" min="1" max="99" readonly>
                                <button class="btn btn-outline-secondary btn-sm" type="button" data-action="increment" data-id="${item.id}">
                                    <strong>+</strong>
                                </button>
                            </div>
                            <small class="text-muted">Estoque: ${produto.estoque_atual}</small>
                        </div>
                        <div class="col-md-2 text-center">
                            <p class="mb-0"><small class="text-muted">Subtotal:</small></p>
                            <h5 class="text-success mb-0">R$ ${subtotal.toFixed(2)}</h5>
                        </div>
                        <div class="col-md-1 text-center">
                            <button class="btn btn-danger btn-sm" data-action="remove" data-id="${item.id}" title="Remover do carrinho">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemCard);
        });

        // Adicionar event listeners aos botões
        document.querySelectorAll('[data-action="increment"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                incrementarQuantidade(id);
            });
        });

        document.querySelectorAll('[data-action="decrement"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                decrementarQuantidade(id);
            });
        });

        document.querySelectorAll('[data-action="remove"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                removerDoCarrinho(id);
            });
        });

        cartSubtotal.textContent = `R$ ${total.toFixed(2)}`;
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        totalItems.textContent = totalQtd;
    }

    function incrementarQuantidade(id) {
        const item = carrinhoService.itensCarrinho.find(i => i.id === id);
        const produto = produtos.find(p => p.id === parseInt(id));
        
        if (item && produto) {
            if (item.quantidade >= produto.estoque_atual) {
                toast.warning('Quantidade máxima disponível em estoque atingida!');
                return;
            }
            carrinhoService.atualizarQuantidade(id, item.quantidade + 1);
            renderizarCarrinho();
            atualizarBadgeCarrinho();
        }
    }

    function decrementarQuantidade(id) {
        const item = carrinhoService.itensCarrinho.find(i => i.id === id);
        if (item && item.quantidade > 1) {
            carrinhoService.atualizarQuantidade(id, item.quantidade - 1);
            renderizarCarrinho();
            atualizarBadgeCarrinho();
        } else if (item && item.quantidade === 1) {
            if (confirm('Deseja remover este item do carrinho?')) {
                removerDoCarrinho(id);
            }
        }
    }

    function removerDoCarrinho(id) {
        carrinhoService.removerItem(id);
        renderizarCarrinho();
        atualizarBadgeCarrinho();
        toast.info('Produto removido do carrinho!');
    }

    function abrirModalCheckout() {
        const itensCarrinho = carrinhoService.itensCarrinho;
        
        if (itensCarrinho.length === 0) {
            toast.warning('Seu carrinho está vazio!');
            return;
        }

        let total = 0;
        itensCarrinho.forEach(item => {
            const produto = produtos.find(p => p.id === parseInt(item.id));
            if (produto) {
                const preco = parseFloat(produto.preco);
                total += preco * item.quantidade;
            }
        });

        modalTotal.textContent = `R$ ${total.toFixed(2)}`;

        const savedEmail = localStorage.getItem('customer-email');
        const savedName = localStorage.getItem('customer-name');
        if (savedEmail) customerEmail.value = savedEmail;
        if (savedName) customerName.value = savedName;

        checkoutModal.show();
    }

    async function confirmarPedido() {
        const form = document.getElementById('checkout-form');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const email = customerEmail.value.trim();
        const name = customerName.value.trim();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        localStorage.setItem('customer-email', email);
        localStorage.setItem('customer-name', name);

        const itensCarrinho = carrinhoService.itensCarrinho;
        const produtosParaCompra = CarrinhoToProductDto.parse(itensCarrinho);

        try {
            confirmCheckoutBtn.disabled = true;
            confirmCheckoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';

            const clienteResponse = await fetch('http://localhost:3000/api/clientes/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: name,
                    email: email,
                    documento: `DEMO${Date.now()}`,
                    data_nasc: '2000-01-01',
                    senha: 'demo123'
                })
            });

            if (!clienteResponse.ok) {
                const errorData = await clienteResponse.json();
                throw new Error(errorData.message || 'Erro ao registrar cliente');
            }

            const clienteData = await clienteResponse.json();

            const pedidoResponse = await fetch('http://localhost:3000/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    id_cliente: clienteData.id,
                    produtos: produtosParaCompra,
                    metodo_pagamento: paymentMethod
                })
            });

            if (!pedidoResponse.ok) {
                const error = await pedidoResponse.json();
                throw new Error(error.message || 'Erro ao finalizar compra');
            }

            const pedido = await pedidoResponse.json();
            
            carrinhoService.limparCarrinho();
            renderizarCarrinho();
            atualizarBadgeCarrinho();
            checkoutModal.hide();
            
            toast.success(`Pedido #${pedido.id} realizado com sucesso! Pagamento: ${paymentMethod}`, 5000);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
            
        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            toast.error(`Erro ao finalizar compra: ${error.message}`);
        } finally {
            confirmCheckoutBtn.disabled = false;
            confirmCheckoutBtn.textContent = 'Confirmar Pedido';
        }
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (confirm('Deseja realmente sair?')) {
                localStorage.removeItem(STORAGE_KEY_USER);
                toast.info('Você saiu da sua conta');
            }
        });
    }

})();
