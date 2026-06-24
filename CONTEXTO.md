# Contexto do Projeto Financeiro

Este arquivo registra o estado atual do projeto para continuar o desenvolvimento em outro computador.

## Objetivo

Construir um sistema financeiro para controlar lancamentos diarios.

## Estado atual

- Aplicacao em React + Vite.
- Sistema totalmente modular e componentizado.
- Dashboard principal totalizando os lancamentos do mes.
- Calendario mensal como base da tela de lancamentos.
- Ao clicar em um dia do calendario, abre um modal para cadastrar lancamentos.
- Lancamento inicial possui descricao, valor, tipo e forma de pagamento.
- Os dados ainda sao salvos no navegador usando `localStorage`.
- Ainda nao existe backend nem banco de dados.

## Organizacao atual

- `src/app`: composicao principal da aplicacao.
- `src/components`: componentes reutilizaveis de layout e interface.
- `src/features`: modulos por dominio, como dashboard, calendario e lancamentos.
- `src/services`: integracoes e persistencia de dados.
- `src/utils`: funcoes utilitarias puras, como datas, moeda e calculos.
- `src/constants`: listas e valores fixos usados pelo sistema.

## Regras combinadas

- O projeto deve continuar modular e componentizado.
- Nao subir automaticamente para o GitHub.
- Subir para o GitHub somente quando for solicitado com "subir github" ou pedido equivalente explicito.
- Sempre que subir para o GitHub, gerar um resumo do que foi feito e informar o commit enviado.

## Como rodar

```bash
git clone https://github.com/hudsonleite/financeiro.git
cd financeiro
pnpm install
pnpm run dev
```

## Proximos passos planejados

- Detalhar as regras reais dos lancamentos.
- Definir totais por Dinheiro, Pix, Debito, Credito, Rede, Stone e outros.
- Adicionar edicao e exclusao de lancamentos.
- Definir se havera banco de dados e backend.
- Evoluir o dashboard conforme os tipos de lancamento forem fechados.
