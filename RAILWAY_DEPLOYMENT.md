# 🚂 Railway Deployment Guide - Frontend

## 🎯 Konfiguracja dla Railway (Nixpacks)

### 📁 Pliki Konfiguracyjne

Projekt jest skonfigurowany do automatycznego deployu na Railway z **Nixpacks**:

```
✅ nixpacks.toml      - Konfiguracja Nixpacks buildpack
✅ railway.json       - Railway-specific config
✅ package.json       - Start script dodany
✅ .env.example       - Template zmiennych środowiskowych
```

---

## 🚀 Deployment Krok po Kroku

### 1. **Połącz Repo z Railway**

```bash
# Opcja A: Z Railway Dashboard
1. Zaloguj się na railway.app
2. New Project → Deploy from GitHub
3. Wybierz ten repo
4. Railway automatycznie wykryje Nixpacks

# Opcja B: Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

### 2. **Zmienne Środowiskowe**

Ustaw w Railway Dashboard → Variables:

```env
# Required
NODE_ENV=production
VITE_API_BASE_URL=https://your-backend.railway.app

# Optional (jeśli używasz)
VITE_GEMINI_API_KEY=your_gemini_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. **Deploy**

Railway automatycznie deployuje przy każdym push do main branch:

```bash
git add .
git commit -m "Configure Railway deployment"
git push origin main

# Railway automatically:
# 1. Wykrywa nixpacks.toml
# 2. Instaluje dependencies (pnpm install)
# 3. Builduje app (pnpm run build)
# 4. Startuje server (npx serve -s dist)
```

---

## 📋 Nixpacks Configuration

### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs_18", "pnpm"]

[phases.install]
cmds = ["pnpm install --frozen-lockfile"]

[phases.build]
cmds = ["pnpm run build"]

[start]
cmd = "npx serve -s dist -l $PORT"
```

**Co to robi:**
- Setup: Node.js 18 + pnpm
- Install: Instaluje dependencies
- Build: Tworzy production build
- Start: Serwuje statyczne pliki z `/dist`

---

## 🔧 Railway.json Details

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npx serve -s dist -l $PORT",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Features:**
- ✅ Nixpacks builder (nie Dockerfile)
- ✅ Health check na `/`
- ✅ Auto-restart przy fail
- ✅ Port binding z `$PORT`

---

## 🎨 Static File Serving

### Używamy `serve` Package

```json
// package.json
"scripts": {
  "start": "npx serve -s dist -l ${PORT:-4173}"
}
```

**Dlaczego `serve`?**
- ✅ Lightweight (5MB)
- ✅ SPA routing support
- ✅ Gzip compression
- ✅ Auto port binding
- ✅ Zero configuration

**Alternatywy (jeśli wolisz):**
```bash
# nginx (wymaga Dockerfile - nie zalecane dla Railway)
# http-server
# static-server
```

---

## 🔍 Troubleshooting

### Problem: Build fails

**Błąd:** `pnpm: command not found`

**Rozwiązanie:**
```toml
# nixpacks.toml - upewnij się że jest pnpm
[phases.setup]
nixPkgs = ["nodejs_18", "pnpm"]  # <-- musi być pnpm
```

---

### Problem: App nie startuje

**Błąd:** `Cannot find dist directory`

**Rozwiązanie:**
```bash
# Sprawdź czy build się powiódł lokalnie
npm run build
ls dist/  # Powinien zawierać index.html

# Railway logs:
railway logs
```

---

### Problem: 404 na routing

**Błąd:** SPA routes nie działają (np. `/analytics`)

**Rozwiązanie:**
`serve` automatycznie obsługuje SPA routing z flagą `-s`:
```bash
serve -s dist  # -s = SPA mode (single page app)
```

Jeśli problem persists, dodaj `serve.json`:
```json
{
  "rewrites": [
    { "source": "**", "destination": "/index.html" }
  ]
}
```

---

### Problem: Zmienne środowiskowe nie działają

**Błąd:** `VITE_API_BASE_URL` is undefined

**Rozwiązanie:**
1. Zmienne MUSZĄ zaczynać się od `VITE_`
2. Ustaw w Railway Dashboard → Variables
3. Redeploy po dodaniu zmiennych:
```bash
railway up --detach
```

---

## 🔐 Environment Variables

### Frontend (.env.example)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Google Gemini
VITE_GEMINI_API_KEY=your_key_here

# Supabase (jeśli używasz)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Production (Railway)
```env
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_GEMINI_API_KEY=actual_key
```

**WAŻNE:** 
- ⚠️ NIE commituj .env do repo!
- ✅ Używaj Railway Secrets dla production
- ✅ Zmienne `VITE_*` są wbudowane w build time

---

## 📊 Performance na Railway

### Obecna Konfiguracja:
```
Build Time:  ~2-3 minuty
Bundle Size: ~1.2 MB
Start Time:  <5 sekund
Memory:      ~100 MB
```

### Optymalizacja:
```toml
# nixpacks.toml - cache dla szybszych buildów
[phases.install]
cacheDirectories = ["node_modules"]
```

---

## 🚦 Health Checks

Railway automatycznie sprawdza:
```
GET / → 200 OK
Timeout: 100s
Retry: 10x on failure
```

Możesz dodać custom endpoint:
```typescript
// src/health.ts
export const healthCheck = () => ({
  status: 'ok',
  timestamp: Date.now(),
  version: '1.0.0'
});
```

---

## 🔄 CI/CD Pipeline

### Automatyczny Deploy przy Push

```bash
main branch → Railway wykrywa zmianę
           ↓
     Nixpacks Build
           ↓
   Deploy do Production
           ↓
     Health Check
           ↓
  ✅ Live na Railway!
```

### Manual Deploy
```bash
railway up --detach
```

---

## 🌐 Custom Domain

### Dodanie Domeny

1. Railway Dashboard → Settings → Domains
2. Add Domain: `yourdomain.com`
3. Ustaw DNS records:
```
CNAME   @    your-app.railway.app
CNAME   www  your-app.railway.app
```

---

## 💰 Pricing na Railway

### Hobby Plan (Darmowy)
- $5 credit/miesiąc
- ~500 godzin runtime
- 1 GB RAM
- **Perfect dla frontendu!**

### Pro Plan ($20/miesiąc)
- Unlimited usage
- 8 GB RAM
- Priority support

---

## 📱 Monitoring

### Railway Dashboard
- Real-time logs
- CPU/Memory metrics
- Build history
- Deployment status

### Custom Monitoring
```bash
# Railway CLI
railway logs --follow

# Status
railway status
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
```bash
# Nigdy nie commituj secrets!
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### 2. API Keys
```bash
# Używaj Railway Secrets
railway variables set VITE_GEMINI_API_KEY=xxx
```

### 3. CORS Configuration
```typescript
// Jeśli masz backend, skonfiguruj CORS:
const allowedOrigins = [
  'https://your-frontend.railway.app',
  'https://yourdomain.com'
];
```

---

## 🎯 Checklist przed Deployem

- [ ] Build działa lokalnie (`npm run build`)
- [ ] .env.example jest up to date
- [ ] Wszystkie zmienne środowiskowe ustawione w Railway
- [ ] Git repo połączone z Railway
- [ ] Health check endpoint działa
- [ ] SPA routing testowany
- [ ] CORS skonfigurowany (jeśli backend)
- [ ] Custom domain (opcjonalne)

---

## 📚 Przydatne Komendy

```bash
# Railway CLI
railway login                    # Login do Railway
railway init                     # Połącz projekt
railway up                       # Deploy teraz
railway logs                     # Zobacz logi
railway open                     # Otwórz w przeglądarce
railway variables                # Lista zmiennych
railway variables set KEY=value  # Ustaw zmienną
railway link                     # Połącz z projektem
railway status                   # Status deployu

# Local Development
npm run dev                      # Dev server (Vite)
npm run build                    # Production build
npm run preview                  # Preview buildu
npm start                        # Start production (serve)

# Debugging
railway logs --tail 100          # Ostatnie 100 linii
railway shell                    # SSH do containera
```

---

## 🔗 Przydatne Linki

- [Railway Docs](https://docs.railway.app)
- [Nixpacks Docs](https://nixpacks.com/docs)
- [Railway Templates](https://railway.app/templates)
- [Status Page](https://status.railway.app)

---

## 💡 Pro Tips

1. **Cache Node Modules** - Railway cache'uje automatycznie
2. **Use pnpm** - Szybszy i lżejszy niż npm
3. **Enable Gzip** - `serve` robi to automatycznie
4. **Monitor Logs** - `railway logs --follow` w osobnym terminalu
5. **Test Locally** - Zawsze `npm run build && npm start` przed deployem

---

## 🎉 To wszystko!

Projekt jest gotowy do deployu na Railway z Nixpacks!

```bash
git add .
git commit -m "Add Railway configuration"
git push origin main
```

Railway zrobi resztę automatycznie! 🚀

---

**Created:** 2025-11-24  
**Last Updated:** 2025-11-24  
**Railway Version:** Nixpacks (recommended)  
**Alternative:** Dockerfile (available but not recommended)
