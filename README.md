# FocusFlow — Backend

Este repositório contém a API e a infraestrutura de backend do **FocusFlow**, uma plataforma integrada de estudos desenvolvida como Trabalho de Conclusão de Curso (TCC) em Desenvolvimento de Sistemas.

O backend foi construído com foco em escalabilidade, tipagem forte e persistência de dados robusta, servindo de base para todas as operações da aplicação.

🔗 **[Repositório do Frontend](https://github.com/Weslley-322/FocusFlow-Frontend)** · **[Acessar o FocusFlow](https://focus-flow-frontend-dusky.vercel.app)**

---

## 🛠️ Tecnologias

- **Node.js** — Ambiente de execução JavaScript no servidor
- **Express** — Framework web para construção das rotas e middlewares
- **TypeScript** — Tipagem estática para maior segurança e manutenibilidade
- **MySQL / TiDB Cloud** — Banco de dados relacional para armazenamento persistente
- **TypeORM** — ORM para gerenciamento das entidades e comunicação com o banco
- **JWT** — Autenticação stateless via tokens
- **Nodemailer** — Envio de e-mails de verificação de conta

---

## 🏗️ Estrutura do projeto

```
src/
├── controllers/   # Lógica de tratamento das requisições
├── entities/      # Modelos de dados e tabelas do banco
├── services/      # Regras de negócio
├── middlewares/   # Autenticação, validação e tratamento de erros
├── routes/        # Definição dos endpoints da API
├── validators/    # Validação das entradas
├── database/      # Configuração da conexão com o banco
├── app.ts         # Configuração do Express
└── server.ts      # Inicialização do servidor
```

---

## 🚀 Rodando localmente

### Pré-requisitos

- Node.js 18+
- MySQL rodando localmente

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Weslley-322/FocusFlow-Backend.git

# 2. Instale as dependências
cd FocusFlow-Backend
npm install
```

### Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=focusflow

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d

EMAIL_USER=seu@email.com
EMAIL_PASS=sua_senha_de_app

FRONTEND_URL=http://localhost:3001
```

### Executando

```bash
npm run dev
```

O servidor iniciará na porta `3000` por padrão.

---

## 🌐 Infraestrutura de produção

| Camada | Serviço |
|--------|---------|
| Frontend | Vercel |
| Backend | Render |
| Banco de dados | TiDB Cloud Serverless |

---

## 👨‍💻 Autor

Desenvolvido por **Weslley** como TCC do curso de Desenvolvimento de Sistemas.
