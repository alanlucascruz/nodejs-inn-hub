## Inn-Hub (Backend)

Backend do projeto [To Do List (React)](https://github.com/alanlucascruz/react-to-do-list).

---

## Iniciar o Projeto

### `npm init`

Cria o arquivo package.json.

---

## Scripts para Instalação de Pacotes

### `npm install typescript ts-node tsx @types/node -D`

Pacotes para a execução de TypeScript no Node.js.

### `npm install express`

### `npm install @types/express -D`

Instala o Express, que serve para gerenciar rotas.

### `npm i cors`

### `npm install @types/cors -D`

Instala o CORS para controle de rotas

### `npm install mongoose`

Instala o Mongoose, que traduz os dados do banco para objetos Javascript.

### `npm install dotenv --save`

Instala o Dotenv, que permite criar um arquivo com variáveis secretas.

Para funcionar, é preciso criar estes scripts em package.json:

> `"dev": "tsx watch --env-file=.env src/server.ts"`

> `"start": "tsx --env-file=.env src/server.ts"`

### `npm install bcryptjs`

Instala o Bcryptjs, que criptografa senhas do banco de dados.

### `npm install jsonwebtoken`

Instala o JSONWebToken, que cria Tokens criptografados

### `npm i`

Instala todas as dependências do projeto.

As dependências do projeto estão no arquivo package.json.

Esse comando é útil quando o projeto não tem a pasta node_modules.

---

## Scripts para Executar o Projeto

### `npm run dev`

Executa o script `dev` do arquivo package.json.

Com esse script o servidor irá reiniciar após cada alteração.

### `npm start`

Executa o script `start` do arquivo package.json.
