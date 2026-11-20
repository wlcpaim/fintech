/**
 * APEXBANK - GERENCIADOR DE ESTADO E PERSISTÊNCIA LOCAL
 * Armazena e sincroniza saldo, extrato, cartão e investimentos via localStorage.
 */

const STORAGE_KEY = 'apexbank_fintech_state_v1';

// Dados Iniciais Fictícios
const DEFAULT_STATE = {
  user: {
    name: 'Alexandre Silva',
    account: '0001 / 89342-1',
    agency: '0001',
    cpf: '382.910.458-12',
    avatar: 'AS'
  },
  balance: 12450.80,
  hideBalance: false,
  card: {
    number: '5428 9201 8492 3810',
    holder: 'ALEXANDRE SILVA',
    expiry: '09/29',
    cvv: '742',
    limit: 8000,
    currentSpent: 2140.25,
    isLocked: false,
    showNumber: false,
    showCvv: false
  },
  pixKeys: [
    { id: 'k1', type: 'CPF', value: '382.910.458-12', date: '12/01/2024' },
    { id: 'k2', type: 'E-mail', value: 'alexandre.silva@apexbank.io', date: '15/02/2024' },
    { id: 'k3', type: 'Celular', value: '+55 (11) 98452-1920', date: '28/03/2024' }
  ],
  investments: [
    {
      id: 'inv-cdb',
      title: 'CDB Apex Pós-Fixado 115% CDI',
      category: 'Renda Fixa',
      badge: 'Baixo Risco',
      rate: '115% do CDI',
      annualYield: 12.1,
      minAmount: 50.00,
      appliedAmount: 18500.00,
      totalProfit: 1680.40
    },
    {
      id: 'inv-lci',
      title: 'LCI Sustentável Isenta 98% CDI',
      category: 'Isento IR',
      badge: 'Isento de IR',
      rate: '98% do CDI',
      annualYield: 10.3,
      minAmount: 100.00,
      appliedAmount: 8200.00,
      totalProfit: 720.15
    },
    {
      id: 'inv-selic',
      title: 'Tesouro Selic 2029',
      category: 'Títulos Públicos',
      badge: 'Garantia Tesouro',
      rate: '100% Selic',
      annualYield: 10.75,
      minAmount: 30.00,
      appliedAmount: 4300.00,
      totalProfit: 395.80
    }
  ],
  transactions: [
    {
      id: 'tx-101',
      type: 'pix_in',
      category: 'pix',
      title: 'Pix Recebido - Mariana Duarte',
      subtitle: 'Chave CPF: ***.892.110-**',
      amount: 1450.00,
      isPositive: true,
      date: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min atrás
      authCode: 'PIX-98210384-A1'
    },
    {
      id: 'tx-102',
      type: 'card',
      category: 'card',
      title: 'Apple Store Brasil',
      subtitle: 'Cartão Virtual final 3810',
      amount: 389.90,
      isPositive: false,
      date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 horas atrás
      authCode: 'AUT-CARD-558291'
    },
    {
      id: 'tx-103',
      type: 'pix_out',
      category: 'pix',
      title: 'Pix Enviado - Restaurante Fasano',
      subtitle: 'Pagamento de almoço',
      amount: 240.00,
      isPositive: false,
      date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // ontem
      authCode: 'PIX-11920482-B2'
    },
    {
      id: 'tx-104',
      type: 'invest_in',
      category: 'invest',
      title: 'Aplicação em CDB 115% CDI',
      subtitle: 'Reserva de Emergência',
      amount: 1500.00,
      isPositive: false,
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 dias atrás
      authCode: 'INV-88291045'
    },
    {
      id: 'tx-105',
      type: 'ted_in',
      category: 'ted',
      title: 'TED Recebida - Tech Consulting Ltda',
      subtitle: 'Salário & Bonificação',
      amount: 8750.00,
      isPositive: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 dias atrás
      authCode: 'TED-00294817'
    }
  ]
};

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Falha ao ler localStorage. Usando estado padrão.', e);
    }
    this.persist(DEFAULT_STATE);
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  persist(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }

  save() {
    this.persist(this.state);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- Mutações de Saldo e Transações ---

  formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }

  formatDate(isoString) {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }

  toggleHideBalance() {
    this.state.hideBalance = !this.state.hideBalance;
    this.save();
    return this.state.hideBalance;
  }

  // Pix Enviado
  sendPix({ recipientKey, keyType, amount, description }) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Informe um valor de Pix válido superior a R$ 0,00.');
    }
    if (numAmount > this.state.balance) {
      throw new Error(`Saldo insuficiente. Seu saldo disponível é ${this.formatMoney(this.state.balance)}.`);
    }

    this.state.balance -= numAmount;

    const authCode = 'PIX-' + Math.floor(10000000 + Math.random() * 90000000);
    const tx = {
      id: 'tx-' + Date.now(),
      type: 'pix_out',
      category: 'pix',
      title: `Pix Enviado - ${keyType}: ${recipientKey}`,
      subtitle: description || 'Transferência instantânea Pix',
      amount: numAmount,
      isPositive: false,
      date: new Date().toISOString(),
      authCode,
      details: { recipientKey, keyType, description }
    };

    this.state.transactions.unshift(tx);
    this.save();
    return tx;
  }

  // Simular Recebimento de Pix (para testes do usuário)
  receivePix({ senderName, amount, description }) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Informe um valor válido.');
    }

    this.state.balance += numAmount;

    const authCode = 'PIX-' + Math.floor(10000000 + Math.random() * 90000000);
    const tx = {
      id: 'tx-' + Date.now(),
      type: 'pix_in',
      category: 'pix',
      title: `Pix Recebido - ${senderName || 'Transferência Externa'}`,
      subtitle: description || 'Recebimento Pix QR Code',
      amount: numAmount,
      isPositive: true,
      date: new Date().toISOString(),
      authCode
    };

    this.state.transactions.unshift(tx);
    this.save();
    return tx;
  }

  // Transferência TED / DOC
  sendTransfer({ bankName, agency, account, recipientName, recipientCpf, amount, description }) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Informe um valor de transferência válido.');
    }
    if (numAmount > this.state.balance) {
      throw new Error(`Saldo insuficiente. Saldo atual: ${this.formatMoney(this.state.balance)}.`);
    }

    this.state.balance -= numAmount;

    const authCode = 'TED-' + Math.floor(10000000 + Math.random() * 90000000);
    const tx = {
      id: 'tx-' + Date.now(),
      type: 'ted_out',
      category: 'ted',
      title: `TED Enviada - ${recipientName}`,
      subtitle: `${bankName} • Ag: ${agency} Conta: ${account}`,
      amount: numAmount,
      isPositive: false,
      date: new Date().toISOString(),
      authCode,
      details: { bankName, agency, account, recipientName, recipientCpf, description }
    };

    this.state.transactions.unshift(tx);
    this.save();
    return tx;
  }

  // --- Chaves Pix ---
  addPixKey(type, value) {
    if (!value || value.trim().length < 3) {
      throw new Error('Chave Pix inválida.');
    }
    const exists = this.state.pixKeys.some(k => k.value.toLowerCase() === value.trim().toLowerCase());
    if (exists) {
      throw new Error('Essa chave Pix já se encontra cadastrada.');
    }

    const newKey = {
      id: 'k-' + Date.now(),
      type,
      value: value.trim(),
      date: new Intl.DateTimeFormat('pt-BR').format(new Date())
    };

    this.state.pixKeys.push(newKey);
    this.save();
    return newKey;
  }

  removePixKey(id) {
    this.state.pixKeys = this.state.pixKeys.filter(k => k.id !== id);
    this.save();
  }

  // --- Cartão Virtual ---
  toggleCardLock() {
    this.state.card.isLocked = !this.state.card.isLocked;
    this.save();
    return this.state.card.isLocked;
  }

  toggleCardDetails(field) {
    if (field === 'number') {
      this.state.card.showNumber = !this.state.card.showNumber;
    } else if (field === 'cvv') {
      this.state.card.showCvv = !this.state.card.showCvv;
    }
    this.save();
  }

  updateCardLimit(newLimit) {
    const num = parseFloat(newLimit);
    if (isNaN(num) || num < 500 || num > 25000) {
      throw new Error('O limite deve estar entre R$ 500 e R$ 25.000.');
    }
    this.state.card.limit = num;
    this.save();
  }

  regenerateCard() {
    const randDigits = () => Math.floor(1000 + Math.random() * 9000);
    this.state.card.number = `5428 ${randDigits()} ${randDigits()} ${randDigits()}`;
    this.state.card.cvv = String(Math.floor(100 + Math.random() * 900));
    this.save();
    return this.state.card;
  }

  // --- Investimentos ---
  investInProduct(productId, amount) {
    const num = parseFloat(amount);
    const product = this.state.investments.find(p => p.id === productId);

    if (!product) throw new Error('Produto de investimento não localizado.');
    if (isNaN(num) || num < product.minAmount) {
      throw new Error(`O valor mínimo para investir em ${product.title} é ${this.formatMoney(product.minAmount)}.`);
    }
    if (num > this.state.balance) {
      throw new Error(`Saldo insuficiente em conta corrente (${this.formatMoney(this.state.balance)}).`);
    }

    this.state.balance -= num;
    product.appliedAmount += num;

    const authCode = 'INV-' + Math.floor(10000000 + Math.random() * 90000000);
    const tx = {
      id: 'tx-' + Date.now(),
      type: 'invest_in',
      category: 'invest',
      title: `Aplicação - ${product.title}`,
      subtitle: `Rentabilidade: ${product.rate}`,
      amount: num,
      isPositive: false,
      date: new Date().toISOString(),
      authCode
    };

    this.state.transactions.unshift(tx);
    this.save();
    return { product, tx };
  }

  withdrawFromProduct(productId, amount) {
    const num = parseFloat(amount);
    const product = this.state.investments.find(p => p.id === productId);

    if (!product) throw new Error('Produto não localizado.');
    if (isNaN(num) || num <= 0) throw new Error('Informe um valor de resgate positivo.');
    if (num > product.appliedAmount) {
      throw new Error(`Valor de resgate superior ao saldo aplicado (${this.formatMoney(product.appliedAmount)}).`);
    }

    product.appliedAmount -= num;
    this.state.balance += num;

    const authCode = 'RESG-' + Math.floor(10000000 + Math.random() * 90000000);
    const tx = {
      id: 'tx-' + Date.now(),
      type: 'invest_out',
      category: 'invest',
      title: `Resgate - ${product.title}`,
      subtitle: 'Crédito em conta corrente',
      amount: num,
      isPositive: true,
      date: new Date().toISOString(),
      authCode
    };

    this.state.transactions.unshift(tx);
    this.save();
    return { product, tx };
  }

  // Total Investido Consolidado
  getTotalInvested() {
    return this.state.investments.reduce((acc, curr) => acc + (curr.appliedAmount || 0), 0);
  }

  // Reiniciar Dados de Demonstração
  resetToDefaults() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }
}

// Instância Singleton exportada globalmente
window.ApexState = new StateManager();
