# Projeto Final: Frontend do Twitter Clone

Este repositório contém a aplicação frontend do projeto, uma interface de usuário completa e reativa para o clone do Twitter. O frontend se comunica com a API backend para fornecer uma experiência de usuário dinâmica e interativa.

## Visão Geral

O projeto foi construído com uma arquitetura moderna e escalável, utilizando as tecnologias mais populares do ecossistema de desenvolvimento web. Ele segue a metodologia de componentes, garantindo a reutilização de código e a facilidade de manutenção.

---

## Tecnologias Utilizadas

### Frontend

O frontend é uma aplicação **React** robusta, desenvolvida com **TypeScript**. As principais tecnologias e bibliotecas utilizadas são:

-   **Gerenciamento de Estado e Cache de Dados:** O estado da aplicação é gerenciado com o **Redux Toolkit**, enquanto o **TanStack Query** (React Query) é usado para o gerenciamento eficiente do estado do servidor, como cache, sincronização e atualização de dados da API.
-   **Validação de Formulários:** **React Hook Form** e **Zod** são utilizados para criar formulários controlados com validação robusta.
-   **Estilização:** **Styled-components** para o CSS-in-JS e **PrimeReact** para o componente Mention, garantindo recursos de buscas engatilhadas por '@' para menções via usernames e '#' para trends 
-   **Reatividade:** **Framer Motion** para animações fluidas e **React Responsive** para o design responsivo.
-   **Utilitários:** **Axios** para requisições HTTP, **date-fns** para manipulação de datas, **uuid** para geração de IDs e **browser-image-compression** para otimização de imagens.
-   **Gerenciamento de Pacotes:** `npm` com `package-lock.json`.
-   **Ferramentas de Desenvolvimento:** **Vite** como build tool e **ESLint** com **Prettier** para garantir a qualidade e o estilo do código.

---

## Estrutura do Projeto

A organização do projeto foi pensada para ser intuitiva e modular, facilitando a navegação e o desenvolvimento:

-   `src/api`: Módulos para gerenciar a comunicação com a API backend, com arquivos dedicados para autenticação, posts, comentários, etc.
-   `src/components`: Componentes reutilizáveis da interface, como `PostCard`, `Sidebar`, `SearchBar`, etc.
-   `src/hooks`: Hooks customizados para abstrair lógicas complexas, como o uso da API e o gerenciamento de estados.
-   `src/pages`: Componentes de páginas completas que representam as diferentes rotas da aplicação (`Login`, `Feed`, `Profile`, etc.).
-   `src/store`: Configuração do Redux Toolkit para o gerenciamento de estado global.
-   `src/utils`: Funções utilitárias e helpers, como manipulação de datas e formatação de texto.

---

## Funcionalidades Principais

O frontend oferece uma experiência de usuário completa, permitindo as seguintes ações:

-   **Autenticação:** Login e cadastro de novos usuários.
-   **Feed:** Visualização de posts (`PostList` e `FeedContent`).
-   **Interação com Posts e Comments:** Curtir, comentar e deletar posts.
-   **Navegação:** Roteamento entre páginas como Home, Perfil, Notificações e Explorar.
-   **Gerenciamento de Perfil:** Visualização e edição de perfil, incluindo alteração de senha e exclusão da conta.
-   **Sistema de Notificações:** Exibição de notificações para o usuário.
-   **Busca:** Funcionalidade de busca por usuários e hashtags.

---

## Como Rodar o Projeto Localmente

Siga os passos abaixo para executar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

### Instalação e Execução

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/seu-usuario/twitter-clone-frontend.git](https://github.com/seu-usuario/twitter-clone-frontend.git)
    cd twitter-clone-frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  Configure a URL da API backend:
    -   Crie um arquivo `.env` na raiz do projeto.
    -   Adicione a URL do seu backend.
    
    Exemplo de `.env`:
    ```
    VITE_API_BASE_URL=http://localhost:8000/api
    ```
    *Se a API backend estiver em outro endereço, atualize o valor.*

4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

A aplicação estará disponível em `http://localhost:5173`.
