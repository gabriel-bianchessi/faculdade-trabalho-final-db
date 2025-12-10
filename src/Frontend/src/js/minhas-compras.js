import { toast } from './toast.js';
import { CarrinhoService } from '../services/carrinho-service.js';

(function() {
    'use strict';

    const STORAGE_KEY_USER = '@fake-store-user';

    // Elementos do DOM
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const emailInput = document.getElementById('email-input');
    const confirmEmailBtn = document.getElementById('confirm-email-btn');
    const userInfo = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const loadingElement = document.getElementById('loading');
    const pedidosContainer = document.getElementById('pedidos-container');
    const emptyMessage = document.getElementById('empty-message');
    const logoutButton = document.getElementById('logout-button');
    const cartBadge = document.getElementById('cart-count');
    
    const carrinhoService = new CarrinhoService();

    // Estado
    let currentUserEmail = null;
    let currentUserId = null;

    // Inicialização
    init();

    function init() {
        // Verificar se há usuário salvo
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            currentUserEmail = userData.email;
            currentUserId = userData.id;
            showUserInfo();
            loadPedidos();
        } else {
            loginModal.show();
        }

        // Event listeners
        confirmEmailBtn.addEventListener('click', handleEmailConfirm);
        logoutButton.addEventListener('click', handleLogout);
        
        // Atualizar badge do carrinho
        atualizarBadgeCarrinho();
    }

    function atualizarBadgeCarrinho() {
        const totalItens = carrinhoService.itensCarrinho.reduce((total, item) => total + item.quantidade, 0);
        cartBadge.textContent = totalItens;
    }

    async function handleEmailConfirm() {
        const email = emailInput.value.trim();

        if (!email) {
            toast.warning('Por favor, digite seu e-mail');
            return;
        }

        if (!isValidEmail(email)) {
            toast.error('Por favor, digite um e-mail válido');
            return;
        }

        confirmEmailBtn.disabled = true;
        confirmEmailBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Verificando...';

        try {
            // Buscar cliente pelo email
            const response = await fetch(`http://localhost:3000/api/clientes/email/${encodeURIComponent(email)}`);

            if (!response.ok) {
                throw new Error('Cliente não encontrado');
            }

            const cliente = await response.json();
            
            // Salvar no localStorage
            currentUserEmail = cliente.email;
            currentUserId = cliente.id;
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify({
                id: cliente.id,
                email: cliente.email,
                nome: cliente.nome
            }));

            loginModal.hide();
            showUserInfo();
            loadPedidos();
            toast.success('Bem-vindo de volta!');

        } catch (error) {
            toast.error('E-mail não encontrado. Faça uma compra primeiro!');
        } finally {
            confirmEmailBtn.disabled = false;
            confirmEmailBtn.textContent = 'Continuar';
        }
    }

    function showUserInfo() {
        userEmailSpan.textContent = currentUserEmail;
        userInfo.classList.remove('d-none');
    }

    async function loadPedidos() {
        loadingElement.classList.remove('d-none');
        pedidosContainer.classList.add('d-none');
        emptyMessage.classList.add('d-none');

        try {
            const response = await fetch(`http://localhost:3000/api/pedidos/cliente/${currentUserId}`);

            if (!response.ok) {
                throw new Error('Erro ao carregar pedidos');
            }

            const pedidos = await response.json();

            console.log('Pedidos recebidos:', pedidos);

            if (!pedidos || pedidos.length === 0) {
                emptyMessage.classList.remove('d-none');
            } else {
                renderPedidos(pedidos);
                pedidosContainer.classList.remove('d-none');
            }

        } catch (error) {
            toast.error('Erro ao carregar suas compras');
            emptyMessage.classList.remove('d-none');
        } finally {
            loadingElement.classList.add('d-none');
        }
    }

    function renderPedidos(pedidos) {
        // Ordenar pedidos por data (mais recente primeiro)
        const pedidosOrdenados = pedidos.sort((a, b) => new Date(b.data) - new Date(a.data));

        pedidosContainer.innerHTML = pedidosOrdenados.map(pedido => {
            const data = new Date(pedido.data);
            const dataFormatada = data.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const total = pedido.itens.reduce((sum, item) => {
                const preco = item.preco || item.valor_total || 0;
                const quantidade = item.quantidade || 1;
                return sum + (preco * quantidade);
            }, 0);

            return `
                <div class="card mb-3">
                    <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Pedido #${pedido.id}</strong>
                            <span class="ms-3 text-muted">${dataFormatada}</span>
                        </div>
                        <span class="badge bg-success">R$ ${total.toFixed(2)}</span>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <small class="text-muted">Pagamento:</small>
                                <p class="mb-0"><strong>${formatPaymentMethod(pedido.meio_pagamento)}</strong></p>
                            </div>
                            <div class="col-md-6 text-end">
                                <small class="text-muted">Total de itens:</small>
                                <p class="mb-0"><strong>${pedido.itens.length} ${pedido.itens.length === 1 ? 'produto' : 'produtos'}</strong></p>
                            </div>
                        </div>
                        
                        <h6 class="border-bottom pb-2">Itens do Pedido:</h6>
                        <div class="list-group list-group-flush">
                            ${pedido.itens.map(item => {
                                const preco = item.preco || item.valor_total || 0;
                                const quantidade = item.quantidade || 1;
                                const nome = item.produto?.nome || 'Produto';
                                const imagem = item.produto?.imagem || '';
                                
                                return `
                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center">
                                        <img src="${imagem}" alt="${nome}" 
                                             style="width: 50px; height: 50px; object-fit: contain;" class="me-3">
                                        <div>
                                            <h6 class="mb-0">${nome}</h6>
                                            <small class="text-muted">Quantidade: ${quantidade}</small>
                                        </div>
                                    </div>
                                    <div class="text-end">
                                        <div class="fw-bold">R$ ${(preco * quantidade).toFixed(2)}</div>
                                        <small class="text-muted">R$ ${preco.toFixed(2)} cada</small>
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function formatPaymentMethod(method) {
        const methods = {
            'credit': '💳 Cartão de Crédito',
            'debit': '💳 Cartão de Débito',
            'pix': '📱 PIX',
            'boleto': '📄 Boleto'
        };
        return methods[method] || method;
    }

    function handleLogout() {
        if (confirm('Deseja realmente sair?')) {
            localStorage.removeItem(STORAGE_KEY_USER);
            toast.info('Você saiu da sua conta');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

})();
