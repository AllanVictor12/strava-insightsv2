# ============================================
# Stage 1: Build do Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build do frontend
RUN npm run build

# ============================================
# Stage 2: Build do Backend
# ============================================
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copiar arquivos do servidor
COPY server/package*.json ./

# Instalar dependências de produção
RUN npm install --production

# ============================================
# Stage 3: Imagem final com Nginx + Node
# ============================================
FROM nginx:alpine

# Instalar Node.js e supervisor
RUN apk add --no-cache nodejs npm supervisor

WORKDIR /app

# Copiar frontend buildado para nginx
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar backend
COPY --from=backend-builder /app/node_modules ./server/node_modules
COPY server/ ./server/

# Copiar configuração do supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001
ENV DB_HOST=10.0.1.10
ENV DB_PORT=5432
ENV DB_NAME=postgres
ENV DB_USER=postgres

# Iniciar supervisor (gerencia nginx + node)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
