# 🚂 Railway Quick Start - 5 minut do deployu!

## ⚡ Najszybsza Droga

### 1. Połącz z Railway (2 min)

```bash
# Zaloguj się
https://railway.app/login

# New Project → Deploy from GitHub → wybierz repo
```

### 2. Ustaw Zmienne Środowiskowe (1 min)

W Railway Dashboard → Variables:

```
NODE_ENV=production
VITE_API_BASE_URL=https://twoj-backend.railway.app
```

### 3. Deploy! (2 min)

```bash
git add .
git commit -m "Add Railway config"
git push origin main
```

Railway **automatycznie**:
- ✅ Wykrywa `nixpacks.toml`
- ✅ Instaluje dependencies
- ✅ Builduje app (`npm run build`)
- ✅ Startuje server (`serve -s dist`)

**GOTOWE!** 🎉

---

## 🔍 Sprawdź Status

```bash
# Railway CLI (opcjonalne)
npm install -g @railway/cli
railway login
railway logs --follow
```

---

## 📋 Checklist

- [x] `nixpacks.toml` ✅ Dodany
- [x] `railway.json` ✅ Dodany  
- [x] `package.json` - script "start" ✅ Dodany
- [x] `serve` package ✅ Zainstalowany
- [ ] Railway project połączony
- [ ] Zmienne środowiskowe ustawione
- [ ] Git push wykonany

---

## 🚨 Jeśli coś nie działa

### Build Error?
```bash
railway logs
# Sprawdź czy wszystkie zmienne są ustawione
```

### 404 na routing?
`serve -s` automatycznie obsługuje SPA routing ✅

### Zmienne nie działają?
Muszą zaczynać się od `VITE_*` i być ustawione w Railway Dashboard

---

## 🎯 To wszystko!

**3 pliki konfiguracyjne:**
- ✅ `nixpacks.toml` - build config
- ✅ `railway.json` - deploy config
- ✅ `package.json` - start script

**Railway robi resztę automatycznie!** 🚀

Więcej: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
