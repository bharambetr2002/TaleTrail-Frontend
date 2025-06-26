# 📊 TaleTrail Project: Data Flow & Deployment Overview

This document explains the **data flow architecture** and how all components—**Frontend (Netlify)**, **Backend (Render)**, and **Database (Supabase)**—work together to form a functional full-stack system. This will help every team member understand how the project is structured and how data moves through it.

---

## 🌐 Live Project URLs

- **Backend (Render):** - Personal
- **Frontend (Netlify):** [`https://taletrail-app.netlify.app/`](Frontend)
- **Database (Supabase):** Used as a hosted PostgreSQL database and auth provider. Accessed via environment variables and API, not directly exposed.

---

## 🔁 Data Flow Overview

```plaintext
[User (Browser)]
     ⬇️  (Request)
[Frontend React App - Hosted on Netlify]
     ⬇️  (API Call - Axios/Fetch)
[Backend REST API - Hosted on Render]
     ⬇️  (SQL Queries, Supabase Client)
[Supabase Database - Hosted PostgreSQL]
     ⬆️
[Backend sends Response ⬅️]
     ⬆️
[Frontend updates UI ⬅️]
```
