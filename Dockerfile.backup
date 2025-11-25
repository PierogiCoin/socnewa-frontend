# ⚠️ UWAGA: Ten Dockerfile jest dostępny jako ALTERNATYWA
# 
# Railway używa NIXPACKS (zalecane) - zobacz nixpacks.toml
# 
# Jeśli chcesz użyć Dockerfile na Railway:
# 1. Railway Dashboard → Settings → Build
# 2. Zmień Builder z "Nixpacks" na "Dockerfile"
# 
# Ale zalecamy Nixpacks - szybszy i lżejszy!

# Multi-stage build for optimal size
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments for Vite environment variables
# These are required at build time because Vite embeds them in the JavaScript bundle
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_BASE_URL

# Set environment variables for the build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config template for SPA routing
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway sets PORT env var - nginx will listen on that port
ENV PORT=80

# Note: EXPOSE is for documentation only; Railway uses the PORT env var
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
