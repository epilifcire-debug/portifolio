# Build de produção do portfólio EFCSYS para a Shard Cloud.
FROM node:22-slim AS build
WORKDIR /app

# Variáveis públicas do Supabase entram no bundle do cliente, então precisam existir no build.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund

COPY . .
RUN npm run build

# Imagem final: só o servidor gerado pelo Nitro, sem fonte nem dependências de desenvolvimento.
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
