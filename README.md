# Mirivo Frontend

> Frontend React 19 + Vite + TypeScript per **Mirivo**, SaaS helpdesk multi-tenant.

**Repo principale (backend + descrizione progetto):** [Mirivo-helpdesk](https://github.com/DomenicoFoglia/Mirivo-helpdesk)

**Demo live:** [mirivo.domenicofoglia.dev](https://mirivo.domenicofoglia.dev)

---

## Stack

- **React 19** con Hooks e Suspense
- **Vite** come bundler
- **TypeScript** in tutta la codebase
- **Zustand** per state management (auth, ecc.)
- **Tailwind CSS** + CSS variables per tema (Amber / Midnight / Light)
- **React Router DOM** per routing
- **Axios** per chiamate API
- **Lucide React** per icone
- **react-hot-toast** per notifiche
- **i18next** per multi-lingua (in corso)

---

## Setup locale

**Prerequisiti**
- Node.js 20+
- Backend Mirivo attivo (default `http://localhost:8000`, vedi [repo backend](https://github.com/DomenicoFoglia/Mirivo-helpdesk))

**Installazione**

```bash
git clone https://github.com/DomenicoFoglia/Mirivo-helpdesk-frontend
cd mirivo-frontend
npm install
cp .env.example .env
```

Configura `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Avvia il dev server:

```bash
npm run dev
```

Frontend disponibile su `http://localhost:5173`.

---

## Build di produzione

```bash
npm run build
```

Output in `dist/`. Servibile con qualsiasi web server statico (Nginx, Caddy, Vercel, Netlify).

---

## Struttura del repo

```
src/
  api/            # wrapper Axios per chiamate al backend
  components/    # componenti riusabili (AttachmentList, ConfirmModal, ...)
  hooks/         # custom hook (useLastVisit, ...)
  pages/
    admin/       # pagine area admin
    agent/       # pagine area tecnico
    user/        # pagine area utente
    auth/        # login, registrazione, reset password
  store/         # store Zustand
  types/         # tipi TypeScript condivisi
  i18n/          # traduzioni IT/EN
```

---

## Convenzioni

- **State management:** Zustand per stato globale (utente autenticato, tema). State locale nei componenti per il resto.
- **API layer:** wrapper Axios in `src/api/`, tipizzati con generici. Interceptor per token Sanctum e gestione 401 con redirect a login.
- **Routing:** protezione rotte via componenti wrapper (`ProtectedRoute`, `RoleRoute`) che leggono da Zustand.
- **Tema:** CSS variables sotto `:root[data-theme="..."]`. Nuove componenti usano sempre variabili tema, mai hex hardcoded.
- **Toast:** `react-hot-toast` con id per prevenire duplicati (`{ id: 'ticket-load-error' }`).

---

## Autore

Sviluppato da **Domenico Foglia** come progetto di portfolio full-stack. Descrizione completa nel [repo backend](https://github.com/DomenicoFoglia/Mirivo-helpdesk).