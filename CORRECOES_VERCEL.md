# ⚠️ Correções Necessárias no Vercel

## 🔴 Problema 1: Root Directory

**Atual:** `./`  
**Correto:** `frontend-analisecontrato`

### Como corrigir:
1. Na tela de configuração do Vercel
2. Clique em **"Edit"** ao lado de **Root Directory**
3. Altere de `./` para `frontend-analisecontrato`
4. Clique em **"Save"**

---

## 🔴 Problema 2: URL do Backend (Placeholder)

**Atual:** `https://seu-backend.railway.app`  
**Status:** ⚠️ Esta é uma URL de exemplo/placeholder

### Como corrigir:
1. **Primeiro:** Faça deploy do backend no Railway
2. **Depois:** Copie a URL real gerada pelo Railway (ex: `https://seu-projeto.up.railway.app`)
3. **No Vercel:** Atualize `NEXT_PUBLIC_API_URL` com a URL real
4. **Importante:** Não coloque barra `/` no final

---

## ✅ O que está correto:

- ✅ Build Command: `npm run build`
- ✅ Output Directory: `Next.js default`
- ✅ Install Command: `npm install`
- ✅ `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Configurado corretamente

---

## 📋 Checklist antes de fazer Deploy:

- [ ] Root Directory alterado para `frontend-analisecontrato`
- [ ] `NEXT_PUBLIC_API_URL` atualizada com URL real do backend
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` configurada corretamente
- [ ] Backend já está deployado e acessível
- [ ] Todas as variáveis configuradas para Production, Preview e Development

---

## 🚀 Ordem de Deploy Recomendada:

1. **Primeiro:** Deploy do Backend no Railway
2. **Segundo:** Obter URL do backend
3. **Terceiro:** Configurar `NEXT_PUBLIC_API_URL` no Vercel
4. **Quarto:** Fazer deploy do Frontend no Vercel

---

**Após fazer essas correções, você pode clicar em "Deploy"!** 🎉

