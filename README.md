# Sistema Financeiro

Primeira versao do sistema financeiro para controle diario de lancamentos.

## Como abrir

Instale as dependencias e inicie o servidor local:

```bash
pnpm install
pnpm run dev
```

No Windows, tambem e possivel dar dois cliques em `iniciar-projeto.bat` depois de instalar as dependencias.

## O que ja existe

- Dashboard com saldo do mes, entradas, saidas e total do dia.
- Calendario mensal com navegacao entre meses.
- Clique em um dia para abrir o modal de lancamento.
- Cadastro inicial de lancamento com descricao, valor, tipo e forma de pagamento.
- Listagem dos lancamentos do mes.
- Aplicacao em React + Vite.
- Salvamento local no navegador via `localStorage`.

## Proximos passos

- Ajustar o modelo dos lancamentos conforme as regras finais.
- Definir totais por Dinheiro, Pix, Debito, Credito, Rede, Stone e outros.
- Adicionar edicao/exclusao de lancamentos.
- Evoluir para banco de dados quando a estrutura estiver fechada.
