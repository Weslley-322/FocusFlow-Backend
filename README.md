# FocusFlow - Backend

Este repositório contém a API e a infraestrutura de backend do **FocusFlow**, um sistema de gestão de produtividade desenvolvido como Trabalho de Conclusão de Curso (TCC) para o curso de Desenvolvimento de Sistemas.

O backend foi construído com foco em escalabilidade, tipagem forte e persistência de dados robusta, servindo de base para todas as operações da aplicação.

## 🛠️ Tecnologias Utilizadas

* **Node.js**: Ambiente de execução para o JavaScript no servidor.
* **Express**: Framework web para construção das rotas e middlewares.
* **TypeScript**: Superconjunto de JavaScript que adiciona tipagem estática ao código.
* **MySQL**: Banco de dados relacional para armazenamento de dados.
* **TypeORM**: ORM (Object-Relational Mapper) utilizado para gerenciar a comunicação com o banco de dados e as entidades do sistema.

## 🏗️ Estrutura do Projeto

A arquitetura do projeto organiza as responsabilidades de forma clara:

* `src/entities`: Definição dos modelos de dados e tabelas do banco.
* `src/controllers`: Lógica de tratamento das requisições e retornos da API.
* `src/services`: Camada onde residem as regras de negócio.
* `src/database`: Configurações de conexão e migrações.
* `src/routes`: Definição dos endpoints da aplicação.

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Node.js instalado.
* Instância do MySQL ativa.

### Instalação e Execução

1. **Clone o repositório:**
   git clone https://github.com/Weslley-322/FocusFlow-Backend.git

2. **Instale as dependências:**
   npm install

3. **Configuração de Ambiente:**
   Crie um arquivo .env na raiz do projeto e configure as credenciais do seu banco de dados:
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=focusflow

4. **Execute as Migrations:**
   Para criar as tabelas no banco de dados:
   npm run typeorm migration:run

5. **Inicie o servidor:**
   npm run dev
