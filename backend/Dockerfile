FROM node:20-alpine

# Diretório da aplicação
WORKDIR /www

# Instala as dependências
COPY package*.json ./
RUN npm install

# Copia o projeto
COPY . .

# Expõe a porta
EXPOSE 3000

# Rodar a aplicação em modo desenvolvimento
CMD ["npm", "run", "dev"]

