FROM node:20-alpine

# Diretório da aplicação
WORKDIR /app

# Instala as dependências
COPY package*.json ./
RUN npm install

# Copiar projeto
COPY . .

# Expor porta do Vite
EXPOSE 3001

# Comando padrão para desenvolvimento
CMD ["npm", "run", "dev", "--", "--host"]
