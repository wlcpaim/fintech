/**
 * ApexBank - js/views.js
 * Templates e Renderizadores para as 6 Telas da SPA
 */

const Views = {
  /**
   * 1. TELA: INÍCIO (DASHBOARD)
   */
  renderHome(state) {
    const hiddenClass = state.ui.hideBalance ? 'balance-hidden' : '';
    const recentTx = state.transactions.slice(0, 4);
    const monthStats = state.getMonthStats();
    const card = state.card;

    return `
      <div class="dashboard-grid">
        <!-- Card Principal de Saldos -->
        <div class="balance-card">
          <div class="balance-card-header">
            <div>
              <span class="balance-label">Saldo Disponível em Conta</span>
              <div class="balance-amount ${hiddenClass}" id="display-main-balance">
                ${state.formatMoney(state.balance)}
              </div>
            </div>
            <div class="balance-badge">
              <span class="status-dot"></span> Conta Corrente Ativa
            </div>
          </div>

          <div class="balance-breakdown">
            <div class="breakdown-item">
              <span class="breakdown-label">Total Investido</span>
              <span class="breakdown-value ${hiddenClass}">${state.formatMoney(state.investments.totalInvested)}</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">Patrimônio Líquido</span>
              <span class="breakdown-value text-accent ${hiddenClass}">${state.formatMoney(state.balance + state.investments.totalInvested)}</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">Rendimento Este Mês</span>
              <span class="breakdown-value text-success">+${state.formatMoney(monthStats.investmentsProfit)}</span>
            </div>
          </div>

          <div class="month-flow">
            <div class="flow-pill income">
              <span class="flow-icon">↓</span>
              <div>
                <span class="flow-label">Entradas (Mês)</span>
                <strong class="flow-val ${hiddenClass}">+${state.formatMoney(monthStats.incomes)}</strong>
              </div>
            </div>
            <div class="flow-pill expense">
              <span class="flow-icon">↑</span>
              <div>
                <span class="flow-label">Saídas (Mês)</span>
                <strong class="flow-val ${hiddenClass}">-${state.formatMoney(monthStats.expenses)}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Ações Rápidas -->
        <div class="quick-actions-card">
          <h2 class="section-title">Acesso Rápido</h2>
          <div class="quick-actions-grid">
            <button class="quick-btn" data-navigate="pix">
              <div class="quick-icon-box pix-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </div>
              <span>Área Pix</span>
            </button>

            <button class="quick-btn" data-navigate="transfer">
              <div class="quick-icon-box transfer-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </div>
              <span>Transferir</span>
            </button>

            <button class="quick-btn" data-navigate="statement">
              <div class="quick-icon-box statement-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span>Extrato</span>
            </button>

            <button class="quick-btn" data-navigate="card">
              <div class="quick-icon-box card-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </div>
              <span>Cartão</span>
            </button>

            <button class="quick-btn" data-navigate="invest">
              <div class="quick-icon-box invest-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <span>Investir</span>
            </button>

            <button class="quick-btn" id="btn-quick-deposit">
              <div class="quick-icon-box deposit-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <span>Depositar</span>
            </button>
          </div>
        </div>

        <!-- Coluna Esquerda: Últimas Transações -->
        <div class="content-box">
          <div class="content-box-header">
            <h2 class="section-title">Últimas Transações</h2>
            <button class="btn-text" data-navigate="statement">Ver Extrato Completo &rarr;</button>
          </div>

          <div class="tx-list">
            ${recentTx.map(tx => Views.renderTransactionItem(tx, state)).join('')}
          </div>
        </div>

        <!-- Coluna Direita: Cartão em Destaque & Projeção -->
        <div class="content-box">
          <div class="content-box-header">
            <h2 class="section-title">Cartão Virtual Apex</h2>
            <button class="btn-text" data-navigate="card">Gerenciar &rarr;</button>
          </div>

          <div class="mini-card-preview ${card.locked ? 'card-is-locked' : ''}">
            <div class="mini-card-top">
              <span class="mini-card-brand">Apex Virtual</span>
              <span class="card-status-badge ${card.locked ? 'badge-locked' : 'badge-active'}">
                ${card.locked ? 'Bloqueado' : 'Ativo'}
              </span>
            </div>
            <div class="mini-card-number">•••• •••• •••• ${card.number.slice(-4)}</div>
            <div class="mini-card-bottom">
              <div>
                <span class="text-xs text-muted">Limite Disponível</span>
                <p class="font-semibold text-sm ${hiddenClass}">
                  ${state.formatMoney(card.limit - card.usedLimit)}
                </p>
              </div>
              <div class="text-right">
                <span class="text-xs text-muted">Validade</span>
                <p class="font-semibold text-sm">${card.expiry}</p>
              </div>
            </div>
          </div>

          <div class="home-invest-teaser">
            <div class="teaser-info">
              <span class="text-xs text-muted">Simulador de Rendimento</span>
              <p class="text-sm font-medium">Seus R$ 5.000 renderiam +R$ 684,00 no Apex CDB</p>
            </div>
            <button class="btn btn-sm btn-outline" data-navigate="invest">Simular</button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 2. TELA: ÁREA PIX
   */
  renderPix(state) {
    return `
      <div class="page-container">
        <div class="tabs-header" role="tablist">
          <button class="tab-btn active" data-tab="pix-send" role="tab">Enviar Pix</button>
          <button class="tab-btn" data-tab="pix-receive" role="tab">Receber / Cobrar</button>
          <button class="tab-btn" data-tab="pix-keys" role="tab">Minhas Chaves</button>
        </div>

        <!-- ABA 1: ENVIAR PIX -->
        <div id="tab-pix-send" class="tab-content active">
          <div class="form-card max-w-xl">
            <h2 class="form-title">Transferência Instantânea Pix</h2>
            <p class="form-subtitle">Transfira 24h por dia, 7 dias por semana sem custo</p>

            <form id="form-send-pix" novalidate>
              <div class="form-group">
                <label for="pix-key-type">Tipo de Chave</label>
                <select id="pix-key-type" class="form-control" required>
                  <option value="cpf">CPF / CNPJ</option>
                  <option value="email">E-mail</option>
                  <option value="phone">Telefone Celular</option>
                  <option value="random">Chave Aleatória (EVP)</option>
                </select>
              </div>

              <div class="form-group">
                <label for="pix-key">Chave de Destino</label>
                <input type="text" id="pix-key" class="form-control" placeholder="Digite a chave Pix" required>
              </div>

              <div class="form-group">
                <label for="pix-recipient">Nome do Favorecido</label>
                <input type="text" id="pix-recipient" class="form-control" placeholder="Ex: Mariana Silva" required>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="pix-amount">Valor (R$)</label>
                  <div class="input-money-wrapper">
                    <span class="currency-prefix">R$</span>
                    <input type="number" id="pix-amount" class="form-control" placeholder="0,00" step="0.01" min="0.01" required>
                  </div>
                  <span class="input-help">Saldo disponível: <strong>${state.formatMoney(state.balance)}</strong></span>
                </div>
              </div>

              <div class="form-group">
                <label for="pix-desc">Descrição (Opcional)</label>
                <input type="text" id="pix-desc" class="form-control" placeholder="Ex: Almoço de domingo">
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-block">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Confirmar e Pagar Pix
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ABA 2: RECEBER / COBRAR -->
        <div id="tab-pix-receive" class="tab-content">
          <div class="form-card max-w-xl">
            <h2 class="form-title">Receber via Pix</h2>
            <p class="form-subtitle">Gere uma cobrança imediata ou simule um depósito na sua conta</p>

            <form id="form-receive-pix">
              <div class="form-group">
                <label for="receive-amount">Valor a Receber (R$)</label>
                <div class="input-money-wrapper">
                  <span class="currency-prefix">R$</span>
                  <input type="number" id="receive-amount" class="form-control" placeholder="0,00" step="0.01" min="0.01" value="150.00">
                </div>
              </div>

              <div class="form-group">
                <label for="receive-desc">Identificador / Descrição</label>
                <input type="text" id="receive-desc" class="form-control" placeholder="Ex: Pagamento de Serviço" value="Depósito de Teste">
              </div>

              <div class="qr-preview-box">
                <div class="fake-qrcode" id="qrcode-display">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="2" width="8" height="8" rx="1"/>
                    <rect x="14" y="2" width="8" height="8" rx="1"/>
                    <rect x="2" y="14" width="8" height="8" rx="1"/>
                    <rect x="4" y="4" width="4" height="4" fill="currentColor"/>
                    <rect x="16" y="4" width="4" height="4" fill="currentColor"/>
                    <rect x="4" y="16" width="4" height="4" fill="currentColor"/>
                    <line x1="14" y1="14" x2="14" y2="18"/>
                    <line x1="18" y1="14" x2="18" y2="22"/>
                    <line x1="14" y1="22" x2="22" y2="22"/>
                  </svg>
                </div>
                <div class="qr-info">
                  <span class="text-xs text-muted">Pix Copia e Cola:</span>
                  <code class="pix-copia-cola" id="pix-code-text">00020126580014br.gov.bcb.pix0136apex-${Date.now()}520400005303986540${(150).toFixed(2)}5802BR5913ApexBank6009SaoPaulo62070503***6304E1F2</code>
                  <button type="button" id="btn-copy-pix-code" class="btn btn-sm btn-secondary mt-2">
                    Copiar Código Pix
                  </button>
                </div>
              </div>

              <div class="form-actions mt-4">
                <button type="submit" class="btn btn-success btn-block">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                  Simular Recebimento Imediato
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ABA 3: MINHAS CHAVES -->
        <div id="tab-pix-keys" class="tab-content">
          <div class="form-card max-w-xl">
            <div class="flex-between mb-4">
              <div>
                <h2 class="form-title">Chaves Pix Cadastradas</h2>
                <p class="form-subtitle">Suas chaves associadas a esta conta ApexBank</p>
              </div>
              <button id="btn-open-add-key" class="btn btn-sm btn-outline">+ Nova Chave</button>
            </div>

            <div class="keys-list" id="keys-list-container">
              ${state.user.pixKeys.map(k => `
                <div class="key-item">
                  <div class="key-badge">${k.type.toUpperCase()}</div>
                  <div class="key-value-box">
                    <span class="key-value">${k.key}</span>
                    <span class="text-xs text-muted">Cadastrada em ${k.created}</span>
                  </div>
                  <button class="btn-icon-sm btn-copy-single-key" data-key="${k.key}" title="Copiar Chave">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              `).join('')}
            </div>

            <!-- Formulário Embutido de Adição de Chave -->
            <form id="form-add-key" class="add-key-form hidden mt-4">
              <h3 class="text-sm font-semibold mb-2">Cadastrar Nova Chave</h3>
              <div class="form-row">
                <select id="new-key-type" class="form-control" style="max-width: 140px;">
                  <option value="cpf">CPF</option>
                  <option value="email">E-mail</option>
                  <option value="telefone">Telefone</option>
                  <option value="aleatoria">Aleatória</option>
                </select>
                <input type="text" id="new-key-value" class="form-control flex-1" placeholder="Digite o valor da chave" required>
              </div>
              <div class="flex-gap mt-2">
                <button type="submit" class="btn btn-sm btn-primary">Salvar Chave</button>
                <button type="button" id="btn-cancel-add-key" class="btn btn-sm btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 3. TELA: TRANSFERIR (TED / DOC)
   */
  renderTransfer(state) {
    return `
      <div class="page-container">
        <div class="form-card max-w-xl">
          <h2 class="form-title">Transferência Bancária (TED / DOC)</h2>
          <p class="form-subtitle">Envie para qualquer instituição financeira do Brasil</p>

          <form id="form-transfer" novalidate>
            <div class="form-group">
              <label for="transfer-bank">Instituição de Destino</label>
              <select id="transfer-bank" class="form-control" required>
                <option value="001 - Banco do Brasil S.A.">001 - Banco do Brasil S.A.</option>
                <option value="033 - Banco Santander Brasil">033 - Banco Santander Brasil</option>
                <option value="104 - Caixa Econômica Federal">104 - Caixa Econômica Federal</option>
                <option value="237 - Banco Bradesco S.A.">237 - Banco Bradesco S.A.</option>
                <option value="260 - Nubank Pagamentos S.A.">260 - Nubank Pagamentos S.A.</option>
                <option value="341 - Itaú Unibanco S.A.">341 - Itaú Unibanco S.A.</option>
                <option value="077 - Banco Inter S.A.">077 - Banco Inter S.A.</option>
                <option value="999 - ApexBank Fintech">999 - ApexBank Fintech (Entre Contas)</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label for="transfer-agency">Agência (sem dígito)</label>
                <input type="text" id="transfer-agency" class="form-control" placeholder="0001" maxlength="5" required>
              </div>
              <div class="form-group flex-2">
                <label for="transfer-account">Conta com Dígito</label>
                <input type="text" id="transfer-account" class="form-control" placeholder="123456-7" required>
              </div>
            </div>

            <div class="form-group">
              <label for="transfer-recipient">Nome Completo do Titular</label>
              <input type="text" id="transfer-recipient" class="form-control" placeholder="Ex: Roberto Carlos Pereira" required>
            </div>

            <div class="form-group">
              <label for="transfer-cpf">CPF ou CNPJ</label>
              <input type="text" id="transfer-cpf" class="form-control" placeholder="000.000.000-00" required>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label for="transfer-amount">Valor (R$)</label>
                <div class="input-money-wrapper">
                  <span class="currency-prefix">R$</span>
                  <input type="number" id="transfer-amount" class="form-control" placeholder="0,00" step="0.01" min="0.01" required>
                </div>
                <span class="input-help">Saldo: <strong>${state.formatMoney(state.balance)}</strong></span>
              </div>
              <div class="form-group flex-1">
                <label for="transfer-date">Quando Transferir?</label>
                <select id="transfer-date" class="form-control">
                  <option value="today">Hoje (Imediato)</option>
                  <option value="scheduled">Agendar para amanhã</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="transfer-desc">Finalidade / Descrição</label>
              <input type="text" id="transfer-desc" class="form-control" placeholder="Ex: Pagamento de Honorários">
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-block">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Confirmar Transferência
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  /**
   * 4. TELA: EXTRATO COM FILTROS
   */
  renderStatement(state, filteredList = null) {
    const list = filteredList || state.transactions;
    const filter = state.ui.statementFilter;

    return `
      <div class="page-container">
        <!-- Filtros do Extrato -->
        <div class="filter-card">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="statement-search-input" class="search-input" placeholder="Buscar por descrição, favorecido ou valor..." value="${filter.search || ''}">
            ${filter.search ? '<button id="btn-clear-search" class="btn-clear">&times;</button>' : ''}
          </div>

          <div class="filter-chips-row">
            <span class="filter-label">Tipo:</span>
            <div class="chips-group" id="filter-type-chips">
              <button class="chip ${filter.type === 'all' ? 'active' : ''}" data-type="all">Todos</button>
              <button class="chip ${filter.type === 'pix' ? 'active' : ''}" data-type="pix">Pix</button>
              <button class="chip ${filter.type === 'transfer' ? 'active' : ''}" data-type="transfer">Transferência</button>
              <button class="chip ${filter.type === 'income' ? 'active' : ''}" data-type="income">Entradas (+)</button>
              <button class="chip ${filter.type === 'expense' ? 'active' : ''}" data-type="expense">Saídas (-)</button>
              <button class="chip ${filter.type === 'card' ? 'active' : ''}" data-type="card">Cartão</button>
              <button class="chip ${filter.type === 'investment' ? 'active' : ''}" data-type="investment">Investimentos</button>
            </div>
          </div>

          <div class="filter-chips-row mt-2">
            <span class="filter-label">Período:</span>
            <div class="chips-group" id="filter-period-chips">
              <button class="chip ${filter.period === 'all' ? 'active' : ''}" data-period="all">Todo Histórico</button>
              <button class="chip ${filter.period === '7' ? 'active' : ''}" data-period="7">Últimos 7 dias</button>
              <button class="chip ${filter.period === '30' ? 'active' : ''}" data-period="30">Últimos 30 dias</button>
            </div>
          </div>
        </div>

        <!-- Lista de Resultados -->
        <div class="content-box mt-4">
          <div class="content-box-header">
            <span class="text-sm text-muted">
              Exibindo <strong>${list.length}</strong> movimentação(ões)
            </span>
            <button id="btn-export-statement" class="btn btn-sm btn-outline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar CSV
            </button>
          </div>

          <div class="tx-list">
            ${list.length > 0 
              ? list.map(tx => Views.renderTransactionItem(tx, state)).join('')
              : `
                <div class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  <h3>Nenhuma movimentação encontrada</h3>
                  <p class="text-secondary text-sm">Tente ajustar os filtros ou a busca digitada.</p>
                </div>
              `
            }
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 5. TELA: CARTÃO VIRTUAL
   */
  renderCard(state) {
    const card = state.card;
    const available = Math.max(0, card.limit - card.usedLimit);
    const usedPercent = Math.min(100, Math.round((card.usedLimit / card.limit) * 100));

    return `
      <div class="page-container">
        <div class="card-screen-grid">
          <!-- Visualização 3D do Cartão -->
          <div class="card-visual-wrapper">
            <div class="virtual-card ${card.locked ? 'card-locked' : ''}" id="apex-virtual-card">
              <div class="card-shine"></div>
              
              <div class="card-brand-row">
                <span class="card-logo-text">Apex<span class="text-accent">Bank</span></span>
                <span class="card-chip-badge">Black Virtual</span>
              </div>

              <div class="card-chip-graphic">
                <div class="chip-inner"></div>
              </div>

              <div class="card-number-display" id="card-display-number">
                ${card.number}
              </div>

              <div class="card-meta-row">
                <div class="card-holder-col">
                  <span class="card-meta-label">Titular</span>
                  <span class="card-meta-val">${card.holder}</span>
                </div>
                <div class="card-expiry-col">
                  <span class="card-meta-label">Validade</span>
                  <span class="card-meta-val">${card.expiry}</span>
                </div>
                <div class="card-cvv-col">
                  <span class="card-meta-label">CVV</span>
                  <span class="card-meta-val" id="card-cvv-text">${card.showCvv ? card.cvv : '•••'}</span>
                </div>
              </div>

              ${card.locked ? `
                <div class="card-locked-overlay">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>Cartão Bloqueado Temporariamente</span>
                </div>
              ` : ''}
            </div>

            <!-- Botões de Ação Rápida do Cartão -->
            <div class="card-quick-controls">
              <button id="btn-toggle-cvv" class="btn btn-secondary flex-1">
                ${card.showCvv ? 'Ocultar CVV' : 'Mostrar CVV'}
              </button>
              <button id="btn-toggle-lock" class="btn ${card.locked ? 'btn-success' : 'btn-danger'} flex-1">
                ${card.locked ? 'Desbloquear Cartão' : 'Bloquear Cartão'}
              </button>
              <button id="btn-regenerate-card" class="btn btn-secondary" title="Gerar novo número de cartão virtual descartável">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                Novo Número
              </button>
            </div>

            <!-- Simulador de Compra Online -->
            <div class="content-box mt-4">
              <h3 class="text-sm font-semibold mb-2">Simular Compra no Cartão Virtual</h3>
              <form id="form-card-purchase" class="form-row">
                <input type="text" id="card-purchase-merchant" class="form-control flex-2" placeholder="Estabelecimento (ex: Amazon)" required>
                <input type="number" id="card-purchase-amount" class="form-control flex-1" placeholder="Valor (R$)" step="0.01" min="1" required>
                <button type="submit" class="btn btn-primary" ${card.locked ? 'disabled' : ''}>Comprar</button>
              </form>
              ${card.locked ? '<p class="text-xs text-danger mt-1">Desbloqueie o cartão para realizar compras.</p>' : ''}
            </div>
          </div>

          <!-- Gerenciador de Limite e Fatura -->
          <div class="card-management-wrapper">
            <div class="content-box">
              <h2 class="section-title">Fatura & Limites</h2>

              <div class="limit-status-box">
                <div class="flex-between mb-1">
                  <span class="text-sm text-muted">Limite Utilizado</span>
                  <span class="text-sm font-semibold text-danger">${state.formatMoney(card.usedLimit)}</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${usedPercent}%"></div>
                </div>
                <div class="flex-between mt-1 text-xs text-muted">
                  <span>Disponível: <strong class="text-success">${state.formatMoney(available)}</strong></span>
                  <span>Total: <strong>${state.formatMoney(card.limit)}</strong></span>
                </div>
              </div>

              <!-- Ajuste de Limite via Slider -->
              <div class="limit-slider-container mt-4">
                <div class="flex-between mb-2">
                  <label for="limit-range" class="text-sm font-medium">Ajustar Limite Pré-Aprovado</label>
                  <span class="limit-val-highlight" id="slider-limit-label">${state.formatMoney(card.limit)}</span>
                </div>
                <input type="range" id="limit-range" min="1000" max="25000" step="500" value="${card.limit}" class="custom-range">
                <div class="flex-between text-xs text-muted mt-1">
                  <span>Mínimo: R$ 1.000</span>
                  <span>Máximo: R$ 25.000</span>
                </div>
              </div>

              <!-- Compras Recentes no Cartão -->
              <div class="card-tx-section mt-4">
                <h3 class="text-sm font-semibold mb-2">Lançamentos na Fatura</h3>
                <div class="tx-list mini-tx-list">
                  ${state.transactions.filter(t => t.category === 'Cartão Virtual').slice(0, 4).map(tx => `
                    <div class="tx-item">
                      <div class="tx-icon card-bg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/></svg>
                      </div>
                      <div class="tx-details">
                        <span class="tx-title">${tx.description}</span>
                        <span class="tx-time">${state.formatDate(tx.date)}</span>
                      </div>
                      <span class="tx-amount negative">-${state.formatMoney(tx.amount)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 6. TELA: INVESTIMENTOS COM SIMULADOR
   */
  renderInvest(state) {
    const inv = state.investments;

    return `
      <div class="page-container">
        <!-- Resumo da Carteira -->
        <div class="invest-summary-grid">
          <div class="invest-stat-card">
            <span class="stat-label">Total Aplicado</span>
            <div class="stat-value text-accent">${state.formatMoney(inv.totalInvested)}</div>
            <span class="stat-meta text-success">Rentabilidade Geral: +${inv.profitRate}%</span>
          </div>

          <div class="invest-stat-card">
            <span class="stat-label">Saldo em Conta Corrente</span>
            <div class="stat-value">${state.formatMoney(state.balance)}</div>
            <span class="stat-meta text-muted">Disponível para aportes</span>
          </div>

          <div class="invest-stat-card">
            <span class="stat-label">CDI Atual (Referência)</span>
            <div class="stat-value">11,25% a.a.</div>
            <span class="stat-meta text-accent">Selic Meta: 11,25%</span>
          </div>
        </div>

        <div class="invest-main-grid mt-4">
          <!-- Produtos Disponíveis para Aplicação -->
          <div class="content-box">
            <h2 class="section-title">Produtos de Renda Fixa & Tech</h2>
            <p class="text-secondary text-sm mb-4">Aplique e resgate diretamente do seu saldo da conta</p>

            <div class="products-grid">
              ${inv.products.map(p => `
                <div class="product-card">
                  <div class="product-badge">${p.risk}</div>
                  <h3 class="product-title">${p.name}</h3>
                  <p class="product-desc">${p.description}</p>

                  <div class="product-meta">
                    <div>
                      <span class="text-xs text-muted">Rentabilidade</span>
                      <strong class="text-success text-sm block">${p.rate}</strong>
                    </div>
                    <div>
                      <span class="text-xs text-muted">Liquidez</span>
                      <strong class="text-sm block">${p.liquidity}</strong>
                    </div>
                  </div>

                  <div class="product-my-share">
                    <span class="text-xs text-muted">Você possui investido:</span>
                    <strong class="text-accent">${state.formatMoney(p.invested)}</strong>
                  </div>

                  <div class="product-actions">
                    <button class="btn btn-sm btn-primary btn-apply-product" data-product-id="${p.id}">
                      + Aplicar
                    </button>
                    ${p.invested > 0 ? `
                      <button class="btn btn-sm btn-outline btn-withdraw-product" data-product-id="${p.id}">
                        Resgatar
                      </button>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- SIMULADOR DE JUROS COMPOSTOS -->
          <div class="content-box">
            <div class="content-box-header">
              <div>
                <h2 class="section-title">Simulador Financeiro Inteligente</h2>
                <p class="text-secondary text-sm">Compare o ApexBank com a Poupança e a Inflação</p>
              </div>
            </div>

            <form id="simulator-form" class="sim-controls-grid">
              <div class="form-group">
                <label for="sim-initial">Valor Inicial (R$)</label>
                <input type="number" id="sim-initial" class="form-control" value="5000" min="100" step="100">
              </div>

              <div class="form-group">
                <label for="sim-monthly">Aporte Mensal (R$)</label>
                <input type="number" id="sim-monthly" class="form-control" value="500" min="0" step="50">
              </div>

              <div class="form-group">
                <label for="sim-months">Prazo (Meses)</label>
                <input type="number" id="sim-months" class="form-control" value="24" min="3" max="120" step="1">
              </div>

              <div class="form-group flex-end">
                <button type="button" id="btn-recalculate-sim" class="btn btn-primary btn-block">
                  Recalcular Projeção
                </button>
              </div>
            </form>

            <!-- Resultados Comparativos da Simulação -->
            <div class="sim-results-container mt-4" id="sim-results-box">
              <!-- Renderizado dinamicamente pelo simulador -->
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Componente de Item da Lista de Transações
   */
  renderTransactionItem(tx, state) {
    const isIncome = tx.type === 'income';
    const amountSign = isIncome ? '+' : '-';
    const amountClass = isIncome ? 'positive' : 'negative';

    let iconBg = 'transfer-bg';
    if (tx.category === 'Pix') iconBg = 'pix-bg';
    if (tx.category === 'Cartão Virtual') iconBg = 'card-bg';
    if (tx.category === 'Investimentos') iconBg = 'invest-bg';
    if (isIncome) iconBg = 'income-bg';

    return `
      <div class="tx-item cursor-pointer" data-tx-id="${tx.id}" title="Clique para ver o comprovante">
        <div class="tx-icon ${iconBg}">
          ${isIncome ? '↓' : '↑'}
        </div>
        <div class="tx-details">
          <div class="tx-main-row">
            <span class="tx-title">${tx.description}</span>
            <span class="tx-badge">${tx.category}</span>
          </div>
          <div class="tx-sub-row">
            <span class="tx-recipient">${tx.recipient || 'ApexBank'}</span>
            <span class="tx-time">• ${state.formatDate(tx.date)}</span>
          </div>
        </div>
        <div class="tx-amount-col">
          <span class="tx-amount ${amountClass}">
            ${amountSign}${state.formatMoney(tx.amount)}
          </span>
          <span class="tx-status-ok">Concluído</span>
        </div>
      </div>
    `;
  },

  /**
   * Cálculo Determinístico e Renderização do Simulador Financeiro
   */
  calculateSimulation(initial, monthly, months) {
    // Taxas anuais estimadas
    // ApexBank CDB (115% CDI a 11.25% a.a.) ≈ 12.93% a.a. -> ~1.018% a.m.
    const rApexMonth = 0.01018;
    // Poupança tradicional (~6.17% a.a. + TR) -> ~0.53% a.m.
    const rPoupMonth = 0.0053;
    // Inflação projetada (IPCA ~4.0% a.a.) -> ~0.33% a.m.
    const rInfMonth = 0.0033;

    let totalApex = initial;
    let totalPoup = initial;
    let totalDeposited = initial;

    const dataPoints = [];

    for (let m = 1; m <= months; m++) {
      totalApex = (totalApex + monthly) * (1 + rApexMonth);
      totalPoup = (totalPoup + monthly) * (1 + rPoupMonth);
      totalDeposited += monthly;

      if (m === Math.round(months / 2) || m === months) {
        dataPoints.push({ month: m, apex: totalApex, poup: totalPoup, deposited: totalDeposited });
      }
    }

    const profitApex = totalApex - totalDeposited;
    const profitPoup = totalPoup - totalDeposited;
    const diff = totalApex - totalPoup;

    return `
      <div class="sim-cards-row">
        <div class="sim-card card-apex">
          <span class="sim-provider">ApexBank CDB (115% CDI)</span>
          <strong class="sim-final-val">${State.formatMoney(totalApex)}</strong>
          <span class="sim-profit-text text-success">+${State.formatMoney(profitApex)} de rendimento líquido</span>
        </div>

        <div class="sim-card card-poupanca">
          <span class="sim-provider">Poupança Tradicional</span>
          <strong class="sim-final-val">${State.formatMoney(totalPoup)}</strong>
          <span class="sim-profit-text text-muted">+${State.formatMoney(profitPoup)} de rendimento</span>
        </div>

        <div class="sim-card card-diff">
          <span class="sim-provider">Ganho Adicional no Apex</span>
          <strong class="sim-final-val text-accent">+${State.formatMoney(diff)}</strong>
          <span class="sim-profit-text">a mais no seu bolso</span>
        </div>
      </div>

      <!-- Gráfico de Barras Relativo -->
      <div class="sim-graph-box mt-4">
        <h4 class="text-xs text-muted mb-2">Evolução do Patrimônio em ${months} meses</h4>
        <div class="sim-bars-comparison">
          <div class="bar-col">
            <div class="bar-fill bar-deposited" style="height: 60%"></div>
            <span class="bar-label">Total Depositado</span>
            <strong class="bar-val">${State.formatMoney(totalDeposited)}</strong>
          </div>
          <div class="bar-col">
            <div class="bar-fill bar-poup" style="height: 75%"></div>
            <span class="bar-label">Poupança</span>
            <strong class="bar-val">${State.formatMoney(totalPoup)}</strong>
          </div>
          <div class="bar-col">
            <div class="bar-fill bar-apex" style="height: 98%"></div>
            <span class="bar-label">ApexBank</span>
            <strong class="bar-val text-accent">${State.formatMoney(totalApex)}</strong>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Modal de Comprovante de Transação
   */
  renderReceiptDetails(tx) {
    return `
      <div class="receipt-amount-badge">
        <span class="text-xs text-muted">Valor da Transação</span>
        <h2 class="receipt-value">${State.formatMoney(tx.amount)}</h2>
      </div>

      <div class="receipt-rows">
        <div class="receipt-row">
          <span class="receipt-key">Tipo de Operação:</span>
          <span class="receipt-val font-semibold">${tx.category}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-key">Descrição:</span>
          <span class="receipt-val">${tx.description}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-key">Favorecido / Destino:</span>
          <span class="receipt-val font-semibold">${tx.recipient || 'ApexBank'}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-key">Data e Horário:</span>
          <span class="receipt-val">${State.formatDate(tx.date)}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-key">Status:</span>
          <span class="receipt-val text-success font-semibold">Liquidada com Sucesso</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-key">Código de Autenticação:</span>
          <code class="receipt-auth-code">${tx.authCode}</code>
        </div>
      </div>
    `;
  }
};
