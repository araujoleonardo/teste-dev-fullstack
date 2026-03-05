FROM node:20-alpine

# Diretório da aplicação
WORKDIR /www

# Copia dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

# Usa o entrypoint personalizado
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
