/**
 * ApexBank - js/app.js
 * Controlador Principal da SPA, Roteamento e Interações
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o estado persistido no localStorage
  State.init();

  const App = {
    currentView: 'home',

    init() {
      this.bindGlobalEvents();
      this.bindNavigation();
      this.handleRouting();
      this.updateHeaderProfile();
    },

    /**
     * Atualiza dados do usuário no rodapé da Sidebar
     */
    updateHeaderProfile() {
      const user = State.user;
      const avatarEl = document.getElementById('sidebar-user-avatar');
      const nameEl = document.getElementById('sidebar-user-name');
      const accountEl = document.getElementById('sidebar-user-account');

      if (avatarEl) {
        const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('');
        avatarEl.textContent = initials;
      }
      if (nameEl) nameEl.textContent = user.name;
      if (accountEl) accountEl.textContent = `Ag: ${user.agency} • C/C: ${user.account}`;
    },

    /**
     * Roteamento SPA baseado em hash
     */
    bindNavigation() {
      window.addEventListener('hashchange', () => this.handleRouting());

      // Delegação de cliques em links de navegação
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-navigate]');
        if (target) {
          e.preventDefault();
          const view = target.getAttribute('data-navigate');
          window.location.hash = `#${view}`;
        }
      });
    },

    handleRouting() {
      const hash = window.location.hash.replace('#', '') || 'home';
      const validViews = ['home', 'pix', 'transfer', 'statement', 'card', 'invest'];
      const viewToLoad = validViews.includes(hash) ? hash : 'home';

      this.currentView = viewToLoad;
      this.renderView(viewToLoad);
      this.updateActiveNavLinks(viewToLoad);
      this.updateTopBar(viewToLoad);
      window.scrollTo(0, 0);
    },

    updateActiveNavLinks(view) {
      document.querySelectorAll('.sidebar-nav .nav-link, .bottom-nav .bottom-nav-item').forEach(el => {
        const linkView = el.getAttribute('data-view');
        if (linkView === view) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    },

    updateTopBar(view) {
      const heading = document.getElementById('topbar-heading');
      const subheading = document.getElementById('topbar-subheading');

      const titles = {
        home: { title: 'Início', sub: 'Visão geral da sua conta ApexBank' },
        pix: { title: 'Área Pix', sub: 'Envie, receba e gerencie suas chaves instantaneamente' },
        transfer: { title: 'Transferências', sub: 'TED e DOC para qualquer banco sem tarifas' },
        statement: { title: 'Extrato Detalhado', sub: 'Histórico completo de movimentações com filtros' },
        card: { title: 'Cartão Virtual', sub: 'Segurança máxima para compras online e assinaturas' },
        invest: { title: 'Investimentos & Simulador', sub: 'Faça seu patrimônio render acima da inflação' }
      };

      if (heading && titles[view]) heading.textContent = titles[view].title;
      if (subheading && titles[view]) subheading.textContent = titles[view].sub;
    },

    /**
     * Renderização da Tela Ativa
     */
    renderView(view) {
      // Oculta todas as seções
      document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
        panel.innerHTML = '';
      });

      const activePanel = document.getElementById(`view-${view}`);
      if (!activePanel) return;

      activePanel.classList.add('active');

      switch (view) {
        case 'home':
          activePanel.innerHTML = Views.renderHome(State);
          this.bindHomeEvents();
          break;
        case 'pix':
          activePanel.innerHTML = Views.renderPix(State);
          this.bindPixEvents();
          break;
        case 'transfer':
          activePanel.innerHTML = Views.renderTransfer(State);
          this.bindTransferEvents();
          break;
        case 'statement':
          activePanel.innerHTML = Views.renderStatement(State);
          this.bindStatementEvents();
          break;
        case 'card':
          activePanel.innerHTML = Views.renderCard(State);
          this.bindCardEvents();
          break;
        case 'invest':
          activePanel.innerHTML = Views.renderInvest(State);
          this.bindInvestEvents();
          break;
      }
    },

    /**
     * Eventos Globais (Header, Saldo, Modal de Comprovante, Reset)
     */
    bindGlobalEvents() {
      // Toggle Ocultar/Exibir Saldo
      const btnEye = document.getElementById('btn-toggle-eye');
      if (btnEye) {
        btnEye.addEventListener('click', () => {
          State.toggleBalanceVisibility();
          const openIcon = document.getElementById('eye-open-icon');
          const closedIcon = document.getElementById('eye-closed-icon');

          if (State.ui.hideBalance) {
            openIcon.classList.add('hidden');
            closedIcon.classList.remove('hidden');
          } else {
            openIcon.classList.remove('hidden');
            closedIcon.classList.add('hidden');
          }

          this.renderView(this.currentView);
          this.showToast(State.ui.hideBalance ? 'Valores ocultados' : 'Valores visíveis', 'info');
        });
      }

      // Resetar Dados para Demonstração Inicial
      const btnReset = document.getElementById('btn-reset-data');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (confirm('Deseja restaurar os dados de demonstração do ApexBank?')) {
            State.resetToDefault();
            this.updateHeaderProfile();
            this.renderView(this.currentView);
            this.showToast('Dados de demonstração restaurados com sucesso!', 'success');
          }
        });
      }

      // Modal de Comprovante: Fechar
      const btnCloseReceipt = document.getElementById('btn-close-receipt');
      const receiptModal = document.getElementById('receipt-modal');
      if (btnCloseReceipt && receiptModal) {
        btnCloseReceipt.addEventListener('click', () => {
          receiptModal.classList.add('hidden');
        });
        receiptModal.addEventListener('click', (e) => {
          if (e.target === receiptModal) receiptModal.classList.add('hidden');
        });
      }

      // Modal de Comprovante: Copiar
      const btnCopyReceipt = document.getElementById('btn-copy-receipt');
      if (btnCopyReceipt) {
        btnCopyReceipt.addEventListener('click', () => {
          const detailsEl = document.getElementById('receipt-details');
          if (detailsEl) {
            navigator.clipboard.writeText(detailsEl.innerText).then(() => {
              this.showToast('Comprovante copiado para a área de transferência!', 'success');
            }).catch(() => {
              this.showToast('Detalhes do comprovante prontos para cópia.', 'info');
            });
          }
        });
      }

      // Clique em qualquer transação para abrir comprovante
      document.addEventListener('click', (e) => {
        const item = e.target.closest('[data-tx-id]');
        if (item) {
          const txId = item.getAttribute('data-tx-id');
          const tx = State.transactions.find(t => t.id === txId);
          if (tx) this.openReceipt(tx);
        }
      });
    },

    /**
     * Exibe o modal de comprovante para uma transação
     */
    openReceipt(tx) {
      const modal = document.getElementById('receipt-modal');
      const detailsEl = document.getElementById('receipt-details');
      if (!modal || !detailsEl) return;

      detailsEl.innerHTML = Views.renderReceiptDetails(tx);
      modal.classList.remove('hidden');
    },

    /**
     * Sistema de Notificações Toast
     */
    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let icon = 'ℹ️';
      if (type === 'success') icon = '✓';
      if (type === 'error') icon = '⚠️';

      toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('toast-fade');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    },

    /**
     * 1. EVENTOS: INÍCIO
     */
    bindHomeEvents() {
      const btnDeposit = document.getElementById('btn-quick-deposit');
      if (btnDeposit) {
        btnDeposit.addEventListener('click', () => {
          const amountStr = prompt('Quanto deseja depositar na conta corrente? (R$)', '500,00');
          if (!amountStr) return;
          const cleanAmount = parseFloat(amountStr.replace(/\./g, '').replace(',', '.'));
          if (isNaN(cleanAmount) || cleanAmount <= 0) {
            this.showToast('Valor de depósito inválido.', 'error');
            return;
          }

          const res = State.receivePix({
            amount: cleanAmount,
            description: 'Depósito em Conta ApexBank',
            sender: 'TED - Banco de Origem'
          });

          this.renderView('home');
          this.showToast(`Depósito de ${State.formatMoney(cleanAmount)} confirmado!`, 'success');
          this.openReceipt(res.transaction);
        });
      }
    },

    /**
     * 2. EVENTOS: PIX
     */
    bindPixEvents() {
      // Abas
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tabId = e.currentTarget.getAttribute('data-tab');
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

          e.currentTarget.classList.add('active');
          const targetContent = document.getElementById(`tab-${tabId}`);
          if (targetContent) targetContent.classList.add('active');
        });
      });

      // Form Enviar Pix
      const formSendPix = document.getElementById('form-send-pix');
      if (formSendPix) {
        formSendPix.addEventListener('submit', (e) => {
          e.preventDefault();
          const keyType = document.getElementById('pix-key-type').value;
          const key = document.getElementById('pix-key').value.trim();
          const recipient = document.getElementById('pix-recipient').value.trim();
          const amount = parseFloat(document.getElementById('pix-amount').value);
          const description = document.getElementById('pix-desc').value.trim() || 'Transferência Pix';

          if (!key || !recipient || isNaN(amount) || amount <= 0) {
            this.showToast('Preencha todos os campos do Pix corretamente.', 'error');
            return;
          }

          const res = State.sendPix({ keyType, key, recipient, amount, description });
          if (!res.success) {
            this.showToast(res.error, 'error');
            return;
          }

          this.showToast(`Pix de ${State.formatMoney(amount)} enviado para ${recipient}!`, 'success');
          this.openReceipt(res.transaction);
          formSendPix.reset();
        });
      }

      // Form Receber Pix / Simular
      const formReceivePix = document.getElementById('form-receive-pix');
      if (formReceivePix) {
        formReceivePix.addEventListener('submit', (e) => {
          e.preventDefault();
          const amount = parseFloat(document.getElementById('receive-amount').value);
          const description = document.getElementById('receive-desc').value.trim() || 'Cobrança Pix';

          if (isNaN(amount) || amount <= 0) {
            this.showToast('Informe um valor válido para receber.', 'error');
            return;
          }

          const res = State.receivePix({
            amount,
            description,
            sender: 'Pagador Pix Externo'
          });

          this.showToast(`Recebimento de ${State.formatMoney(amount)} creditado no saldo!`, 'success');
          this.openReceipt(res.transaction);
        });
      }

      // Copiar Código Pix
      const btnCopyPixCode = document.getElementById('btn-copy-pix-code');
      if (btnCopyPixCode) {
        btnCopyPixCode.addEventListener('click', () => {
          const code = document.getElementById('pix-code-text').textContent;
          navigator.clipboard.writeText(code).then(() => {
            this.showToast('Código Pix Copia e Cola copiado!', 'success');
          });
        });
      }

      // Adicionar Nova Chave Pix
      const btnOpenAddKey = document.getElementById('btn-open-add-key');
      const formAddKey = document.getElementById('form-add-key');
      const btnCancelAddKey = document.getElementById('btn-cancel-add-key');

      if (btnOpenAddKey && formAddKey) {
        btnOpenAddKey.addEventListener('click', () => formAddKey.classList.remove('hidden'));
        btnCancelAddKey.addEventListener('click', () => formAddKey.classList.add('hidden'));

        formAddKey.addEventListener('submit', (e) => {
          e.preventDefault();
          const type = document.getElementById('new-key-type').value;
          const key = document.getElementById('new-key-value').value.trim();
          if (!key) return;

          State.addPixKey(type, key);
          this.showToast('Nova chave Pix cadastrada com sucesso!', 'success');
          this.renderView('pix');
        });
      }

      // Copiar Chave individual
      document.querySelectorAll('.btn-copy-single-key').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const keyVal = e.currentTarget.getAttribute('data-key');
          navigator.clipboard.writeText(keyVal).then(() => {
            this.showToast(`Chave ${keyVal} copiada!`, 'success');
          });
        });
      });
    },

    /**
     * 3. EVENTOS: TRANSFERÊNCIA (TED)
     */
    bindTransferEvents() {
      const form = document.getElementById('form-transfer');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const bank = document.getElementById('transfer-bank').value;
        const agency = document.getElementById('transfer-agency').value.trim();
        const account = document.getElementById('transfer-account').value.trim();
        const recipient = document.getElementById('transfer-recipient').value.trim();
        const cpf = document.getElementById('transfer-cpf').value.trim();
        const amount = parseFloat(document.getElementById('transfer-amount').value);
        const description = document.getElementById('transfer-desc').value.trim() || 'Transferência Bancária';

        if (!agency || !account || !recipient || !cpf || isNaN(amount) || amount <= 0) {
          this.showToast('Preencha todos os campos bancários obrigatórios.', 'error');
          return;
        }

        const res = State.sendTransfer({
          bank, agency, account, recipient, cpf, amount, description
        });

        if (!res.success) {
          this.showToast(res.error, 'error');
          return;
        }

        this.showToast(`Transferência de ${State.formatMoney(amount)} enviada com sucesso!`, 'success');
        this.openReceipt(res.transaction);
        form.reset();
      });
    },

    /**
     * 4. EVENTOS: EXTRATO COM FILTROS E BUSCA
     */
    bindStatementEvents() {
      const searchInput = document.getElementById('statement-search-input');
      const btnClearSearch = document.getElementById('btn-clear-search');

      // Busca Textual
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          State.ui.statementFilter.search = e.target.value.trim();
          this.refreshStatementList();
        });
      }

      if (btnClearSearch) {
        btnClearSearch.addEventListener('click', () => {
          searchInput.value = '';
          State.ui.statementFilter.search = '';
          this.refreshStatementList();
        });
      }

      // Filtros por Tipo
      document.querySelectorAll('#filter-type-chips .chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          document.querySelectorAll('#filter-type-chips .chip').forEach(c => c.classList.remove('active'));
          e.currentTarget.classList.add('active');
          State.ui.statementFilter.type = e.currentTarget.getAttribute('data-type');
          this.refreshStatementList();
        });
      });

      // Filtros por Período
      document.querySelectorAll('#filter-period-chips .chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          document.querySelectorAll('#filter-period-chips .chip').forEach(c => c.classList.remove('active'));
          e.currentTarget.classList.add('active');
          State.ui.statementFilter.period = e.currentTarget.getAttribute('data-period');
          this.refreshStatementList();
        });
      });

      // Exportar CSV
      const btnExport = document.getElementById('btn-export-statement');
      if (btnExport) {
        btnExport.addEventListener('click', () => {
          const list = State.getFilteredTransactions();
          const csvRows = [
            ['ID', 'Data', 'Tipo', 'Categoria', 'Descricao', 'Favorecido', 'Valor', 'Autenticacao']
          ];

          list.forEach(tx => {
            csvRows.push([
              tx.id,
              tx.date,
              tx.type,
              tx.category,
              `"${tx.description.replace(/"/g, '""')}"`,
              `"${(tx.recipient || '').replace(/"/g, '""')}"`,
              tx.amount,
              tx.authCode
            ]);
          });

          const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(r => r.join(',')).join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', `ApexBank_Extrato_${Date.now()}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          this.showToast('Extrato exportado para CSV com sucesso!', 'success');
        });
      }
    },

    refreshStatementList() {
      const filtered = State.getFilteredTransactions();
      const container = document.getElementById('view-statement');
      if (container) {
        container.innerHTML = Views.renderStatement(State, filtered);
        this.bindStatementEvents();
      }
    },

    /**
     * 5. EVENTOS: CARTÃO VIRTUAL
     */
    bindCardEvents() {
      // Toggle CVV
      const btnToggleCvv = document.getElementById('btn-toggle-cvv');
      if (btnToggleCvv) {
        btnToggleCvv.addEventListener('click', () => {
          State.card.showCvv = !State.card.showCvv;
          State.save();
          this.renderView('card');
        });
      }

      // Bloquear / Desbloquear
      const btnToggleLock = document.getElementById('btn-toggle-lock');
      if (btnToggleLock) {
        btnToggleLock.addEventListener('click', () => {
          const isLocked = State.toggleCardLock();
          this.showToast(isLocked ? 'Cartão virtual bloqueado com sucesso.' : 'Cartão desbloqueado e ativo.', isLocked ? 'error' : 'success');
          this.renderView('card');
        });
      }

      // Regenerar Cartão
      const btnRegenerate = document.getElementById('btn-regenerate-card');
      if (btnRegenerate) {
        btnRegenerate.addEventListener('click', () => {
          if (confirm('Gerar um novo número para o cartão virtual? O número atual deixará de funcionar.')) {
            State.regenerateCard();
            this.showToast('Novo cartão virtual gerado com sucesso!', 'success');
            this.renderView('card');
          }
        });
      }

      // Slider de Ajuste de Limite
      const limitRange = document.getElementById('limit-range');
      const limitLabel = document.getElementById('slider-limit-label');
      if (limitRange && limitLabel) {
        limitRange.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          limitLabel.textContent = State.formatMoney(val);
        });

        limitRange.addEventListener('change', (e) => {
          const val = parseFloat(e.target.value);
          State.updateCardLimit(val);
          this.showToast(`Limite ajustado para ${State.formatMoney(val)}!`, 'success');
          this.renderView('card');
        });
      }

      // Simulação de Compra no Cartão Virtual
      const formCardPurchase = document.getElementById('form-card-purchase');
      if (formCardPurchase) {
        formCardPurchase.addEventListener('submit', (e) => {
          e.preventDefault();
          const merchant = document.getElementById('card-purchase-merchant').value.trim();
          const amount = parseFloat(document.getElementById('card-purchase-amount').value);

          if (!merchant || isNaN(amount) || amount <= 0) {
            this.showToast('Informe o estabelecimento e o valor da compra.', 'error');
            return;
          }

          if (State.card.locked) {
            this.showToast('Cartão bloqueado. Desbloqueie para comprar.', 'error');
            return;
          }

          const available = State.card.limit - State.card.usedLimit;
          if (amount > available) {
            this.showToast(`Limite insuficiente. Disponível: ${State.formatMoney(available)}`, 'error');
            return;
          }

          // Debita do limite e registra transação
          State.card.usedLimit += amount;

          const tx = {
            id: `tx-card-${Date.now()}`,
            type: 'expense',
            category: 'Cartão Virtual',
            description: `Compra: ${merchant}`,
            recipient: merchant,
            amount: amount,
            date: new Date().toISOString(),
            status: 'completed',
            authCode: State.generateAuthCode()
          };

          State.transactions.unshift(tx);
          State.save();

          this.showToast(`Compra de ${State.formatMoney(amount)} aprovada em ${merchant}!`, 'success');
          this.renderView('card');
          this.openReceipt(tx);
        });
      }
    },

    /**
     * 6. EVENTOS: INVESTIMENTOS & SIMULADOR
     */
    bindInvestEvents() {
      // Aplicações em Produtos
      document.querySelectorAll('.btn-apply-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const prodId = e.currentTarget.getAttribute('data-product-id');
          const prod = State.investments.products.find(p => p.id === prodId);
          if (!prod) return;

          const amountStr = prompt(`Quanto deseja aplicar no ${prod.name}? (Saldo em conta: ${State.formatMoney(State.balance)})`, '1.000,00');
          if (!amountStr) return;

          const cleanAmount = parseFloat(amountStr.replace(/\./g, '').replace(',', '.'));
          if (isNaN(cleanAmount) || cleanAmount <= 0) {
            this.showToast('Valor de aplicação inválido.', 'error');
            return;
          }

          const res = State.investInProduct(prodId, cleanAmount);
          if (!res.success) {
            this.showToast(res.error, 'error');
            return;
          }

          this.showToast(`Aplicação de ${State.formatMoney(cleanAmount)} realizada com sucesso!`, 'success');
          this.renderView('invest');
          this.openReceipt(res.transaction);
        });
      });

      // Resgates de Produtos
      document.querySelectorAll('.btn-withdraw-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const prodId = e.currentTarget.getAttribute('data-product-id');
          const prod = State.investments.products.find(p => p.id === prodId);
          if (!prod) return;

          const amountStr = prompt(`Quanto deseja resgatar de ${prod.name}? (Disponível: ${State.formatMoney(prod.invested)})`, State.formatMoney(prod.invested).replace('R$', '').trim());
          if (!amountStr) return;

          const cleanAmount = parseFloat(amountStr.replace(/\./g, '').replace(',', '.'));
          if (isNaN(cleanAmount) || cleanAmount <= 0) {
            this.showToast('Valor de resgate inválido.', 'error');
            return;
          }

          const res = State.withdrawFromProduct(prodId, cleanAmount);
          if (!res.success) {
            this.showToast(res.error, 'error');
            return;
          }

          this.showToast(`Resgate de ${State.formatMoney(cleanAmount)} creditado na conta!`, 'success');
          this.renderView('invest');
          this.openReceipt(res.transaction);
        });
      });

      // Recálculo do Simulador Financeiro
      const btnRecalc = document.getElementById('btn-recalculate-sim');
      const simResultsBox = document.getElementById('sim-results-box');

      const runSim = () => {
        if (!simResultsBox) return;
        const initial = parseFloat(document.getElementById('sim-initial').value) || 0;
        const monthly = parseFloat(document.getElementById('sim-monthly').value) || 0;
        const months = parseInt(document.getElementById('sim-months').value) || 12;

        simResultsBox.innerHTML = Views.calculateSimulation(initial, monthly, months);
      };

      if (btnRecalc) {
        btnRecalc.addEventListener('click', runSim);
      }

      // Executa uma simulação inicial ao carregar a tela
      runSim();
    }
  };

  // Inicializa o App
  App.init();
});
