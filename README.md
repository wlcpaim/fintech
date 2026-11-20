# ApexBank — Banco Digital Moderno (Fintech SPA)

O **ApexBank** é uma aplicação completa de banco digital desenvolvida com foco em alta performance, usabilidade móvel e desktop, design dark mode sofisticado e persistência integral de dados no navegador (`localStorage`).

---

## 🚀 Telas e Funcionalidades

### 1. Início (Dashboard)
- **Saldos:** Exibição do Saldo Disponível em Conta Corrente, Total Investido e Patrimônio Líquido.
- **Privacidade:** Botão de alternância (ícone de olho) para ocultar ou revelar todos os valores financeiros da tela, com preferência salva no navegador.
- **Fluxo Mensal:** Indicadores visuais de Entradas (+) e Saídas (-) do mês corrente e rendimentos.
- **Ações Rápidas:** Acesso direto a Pix, Transferência, Extrato, Cartão Virtual, Investimentos e Depósito Rápido.
- **Feed de Atividades:** Últimas transações realizadas com clique para abertura de comprovante oficial.
- **Miniatura do Cartão:** Status do cartão virtual ativo e limite disponível.

### 2. Área Pix
- **Aba Enviar Pix:** Suporte a chaves CPF/CNPJ, E-mail, Telefone e Chave Aleatória com validação de saldo e emissão de comprovante.
- **Aba Receber / Cobrar:** Geração dinâmica de código Pix Copia e Cola e simulação de recebimento imediato para testes de crédito em conta.
- **Aba Minhas Chaves:** Visualização das chaves cadastradas, cópia rápida para a área de transferência e cadastro de novas chaves instantaneamente.

### 3. Transferências (TED / DOC)
- Formulário bancário completo com escolha de banco (Banco do Brasil, Itaú, Bradesco, Santander, Nubank, Inter, Caixa, ApexBank), agência, conta com dígito, titular, CPF e data.
- Validação estrita de saldo e emissão automática de comprovante autenticado.

### 4. Extrato Inteligente com Filtros
- **Filtros por Categoria:** Todos, Pix, Transferência, Entradas (+), Saídas (-), Cartão e Investimentos.
- **Filtros por Período:** Todo Histórico, Últimos 7 dias e Últimos 30 dias.
- **Busca em Tempo Real:** Campo de pesquisa textual dinâmico por descrição, nome de favorecido ou valor.
- **Comprovantes:** Clique em qualquer linha do extrato para abrir o comprovante detalhado com código de autenticação único.
- **Exportação:** Exportação dos lançamentos filtrados para arquivo `.csv`.

### 5. Cartão Virtual
- **Visualização Moderna:** Cartão dark com chip dourado, bandeira, numeração formatada, validade e CVV.
- **Controle de CVV:** Botão para exibir ou ocultar o código de segurança.
- **Segurança:** Bloqueio e desbloqueio temporário instantâneo com trava de compras.
- **Regeneração:** Botão para emitir um novo número de cartão virtual descartável.
- **Ajuste de Limite:** Slider interativo para ajustar o limite pré-aprovado entre R$ 1.000 e R$ 25.000 em tempo real.
- **Simulador de Compra Online:** Permite testar compras online (ex: Amazon, Netflix) debitando do limite e lançando na fatura.

### 6. Investimentos com Simulador Financeiro
- **Carteira:** Total aplicado, saldo disponível para aportes e rentabilidade média ponderada.
- **Vitrine de Produtos:**
  - *CDB Apex Pós-Fixado (115% do CDI)* com liquidez diária.
  - *LCI Sustentável Isenta de IR (98% do CDI)*.
  - *Tesouro Selic 2029*.
  - *Fundo Cripto & Tech Apex*.
- **Operações:** Botões de **Aplicar** (debita do saldo em conta e aloca no produto) e **Resgatar** (retorna o valor para a conta corrente).
- **Simulador de Juros Compostos:**
  - Entradas: Valor Inicial, Aporte Mensal e Prazo em Meses.
  - Comparativo simultâneo de rentabilidade: **ApexBank CDB vs Poupança Tradicional vs Total Depositado**.
  - Gráfico de barras visual com projeção patrimonial.

---

## 🛠️ Arquitetura e Estrutura de Arquivos

```
fintech/
├── index.html            # Shell semântico da SPA, views e modal de comprovante
├── css/
│   ├── styles.css        # Design System dark, reset, layout responsivo e utilitários
│   └── components.css    # Estilização do cartão virtual, simulador, extrato e toasts
├── js/
│   ├── state.js          # Motor de dados, persistência no localStorage e transações
│   ├── views.js          # Geradores de templates HTML para cada tela e simulador
│   └── app.js            # Controlador principal, roteador SPA e manipuladores de eventos
└── README.md             # Documentação do projeto
```

---

## 💾 Persistência de Dados (`localStorage`)

- Toda a base de dados (saldo, extrato, chaves Pix, cartão virtual e produtos investidos) é salva automaticamente sob a chave `apexbank_fintech_state_v1`.
- Ao recarregar a página, todos os dados, compras, envios e novos investimentos permanecem salvos exatamente como estavam.
- No rodapé da barra lateral (desktop) existe o botão **"Restaurar Demonstração"**, que permite redefinir os dados para o estado inicial a qualquer momento.

---

## 🌐 Como Executar

Por ser uma aplicação SPA estática moderna em Vanilla JS, basta abrir o arquivo `index.html` em qualquer navegador web moderno ou utilizar um servidor local estático:

```bash
# Exemplo com Python
python3 -m http.server 8080

# Ou com Node.js (npx)
npx serve .
```

Acesse no navegador: `http://localhost:8080`.
