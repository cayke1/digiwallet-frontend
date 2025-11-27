# DigiWallet - Frontend

Esta aplicação implementa a interface de usuário para o gerenciamento de uma carteira digital, permitindo que os usuários realizem operações financeiras como depósitos, transferências e reversões de transações.

## Funcionalidades Implementadas

A interface suporta as seguintes funcionalidades principais:

| Funcionalidade                    | Descrição
| ----------------------------| ----|
| Autenticação             | Login e gerenciamento de sessão do usuário
| Visualização de saldo  | Exibição do saldo atual da conta
| Histórico de transações | Consulta das movimentações realizadas
| Depósitos              | Inclusão de valores na conta
| Transferências       | Transferência de valores entre contas de diferentes usuários
| Reversão de operações | Capacidade de desfazer transações previamente executadas

## Tecnologias Utilizadas

| Tecnologia                | Finalidade
| ----------------------| ------|
| Next.js             | Framework para construção da aplicação
| TypeScript       | Tipagem estática
| Tailwind CSS   | Estilização e layout responsivo
| Server Actions| Execução segura de operações críticas no servidor
| Zod           | Validação de dados de entrada
| Zustand      | Gerenciamento de estado global
| Fetch API   | Comunicação com a API backend

## Como Rodar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm, yarn ou pnpm

### Instalação

1. Clone o repositório e navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` e configure a URL da API backend:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Executando em Desenvolvimento

Para rodar a aplicação em modo de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

### Build de Produção

Para gerar o build de produção:

```bash
npm run build
npm start
# ou
yarn build
yarn start
# ou
pnpm build
pnpm start
```

### Outros Comandos

- **Lint**: Verificar problemas no código
```bash
npm run lint
```

## Abordagem de Implementação

A interface foi estruturada com foco na separação clara entre operações seguras e funcionalidades de apresentação:

- **Operações Financeiras**: Todas as movimentações financeiras (depósitos, transferências e reversões) são executadas exclusivamente através de Server Actions, garantindo que essas operações sejam processadas no servidor sem exposição de credenciais no cliente.

- **Gerenciamento de Estado**: Utilização de uma store global para manter informações relevantes como dados do usuário autenticado, saldo atual e histórico de transações.

- **Validação**: Validações de dados são realizadas tanto no lado do cliente quanto no servidor, garantindo consistência nas informações enviadas.

## Estrutura da Aplicação

A organização da interface segue uma estrutura modular composta por:

| Componente                     | Responsabilidade
| ---------------------------| ------------|
| Server Actions        | Execução de operações financeiras críticas
| Componentes         | Interface de usuário organizada por funcionalidade
| Hooks              | Lógica de negócio específica de cada funcionalidade
| Validações       | Esquemas de validação para formulários e dados de entrada
| Gerenciamento de Estado | Controle centralizado do estado da aplicação

## Considerações de Design e Experiência do Usuário

A interface foi projetada com foco em simplicidade e clareza, priorizando:

- Separação visual entre informações de saldo, histórico de transações e opções de ação
- Feedback imediato sobre o resultado das operações realizadas
- Fluxos de usuário diretos e sem complexidade desnecessária
- Layout responsivo que funciona adequadamente em diferentes tamanhos de tela

## Integração com o Backend

A comunicação entre a interface e o backend segue padrões consistentes:

| Aspecto da Integração      | Abordagem Adotada
| ------------------------| --------------|
| Operações Críticas  | Executadas exclusivamente através de Server Actions
| Comunicação       | Requisições para rotas autenticadas da API
| Tratamento de Erros | Sistema centralizado para lidar com respostas de erro do servidor
| Validação       | Validações complementares no cliente alinhadas com as validações do servidor

## Principais Decisões de Implementação

A escolha pelo uso de Server Actions para operações financeiras foi motivada pela necessidade de garantir que todas as movimentações sejam executadas em ambiente controlado no servidor, eliminando a exposição de tokens de autenticação no código do cliente e assegurando que as operações sejam tratadas com as devidas verificações de autorização e consistência.

A interface mantém uma separação clara entre a apresentação de dados e a execução de operações, utilizando componentes reutilizáveis para exibir informações financeiras e Server Actions para realizar modificações no estado das contas.

Esta abordagem permite manter a segurança das operações financeiras enquanto proporciona uma experiência de usuário fluida, com feedback visual adequado para cada tipo de ação realizada.
