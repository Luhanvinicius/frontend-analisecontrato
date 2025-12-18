# 🔐 Variáveis de Ambiente - Frontend

## 📋 Variáveis Necessárias para o Vercel

Configure estas variáveis no painel do Vercel em **Settings > Environment Variables**.

### ✅ Variáveis Obrigatórias

#### 1. `NEXT_PUBLIC_API_URL`
**Descrição:** URL do backend API  
**Tipo:** String  
**Exemplo (desenvolvimento):** `http://localhost:8080`  
**Exemplo (produção):** `https://seu-backend.railway.app` ou `https://seu-backend.render.com`

**⚠️ IMPORTANTE:**
- Esta é a URL completa do seu backend
- Não inclua barra `/` no final
- Você obterá esta URL após fazer deploy do backend no Railway ou Render

---

#### 2. `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
**Descrição:** Client ID do Google OAuth para login com Google  
**Tipo:** String  
**Formato:** `seu_client_id.apps.googleusercontent.com`

**Como obter:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** E-Confere
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (desenvolvimento)
     - `https://seu-projeto.vercel.app` (produção)
   - **Authorized redirect URIs:**
     - `http://localhost:3000` (desenvolvimento)
     - `https://seu-projeto.vercel.app` (produção)
6. Copie o **Client ID** gerado

---

## 📝 Como Configurar no Vercel

### Passo 1: Acessar Configurações
1. No painel do Vercel, vá em seu projeto
2. Clique em **Settings**
3. Clique em **Environment Variables**

### Passo 2: Adicionar Variáveis
Para cada variável:

1. Clique em **Add New**
2. Preencha:
   - **Key:** Nome da variável (ex: `NEXT_PUBLIC_API_URL`)
   - **Value:** Valor da variável
   - **Environment:** Selecione:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Clique em **Save**

### Passo 3: Fazer Novo Deploy
Após adicionar as variáveis, faça um novo deploy para que as mudanças tenham efeito.

---

## 🔄 Exemplo Completo

### Desenvolvimento (Local)
Crie um arquivo `.env.local` na raiz do projeto `frontend-analisecontrato`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
```

### Produção (Vercel)
No painel do Vercel, configure:

```
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
```

---

## ⚠️ Observações Importantes

1. **Variáveis `NEXT_PUBLIC_*` são públicas**
   - Elas são expostas ao cliente (navegador)
   - Não coloque informações sensíveis aqui
   - Qualquer pessoa pode ver essas variáveis no código do navegador

2. **Após adicionar variáveis no Vercel**
   - Faça um novo deploy para que as mudanças tenham efeito
   - As variáveis não são aplicadas em deploys anteriores

3. **URLs sem barra no final**
   - ✅ Correto: `https://seu-backend.railway.app`
   - ❌ Errado: `https://seu-backend.railway.app/`

4. **Ordem de deploy**
   - Primeiro: Deploy do backend (Railway/Render)
   - Depois: Obter URL do backend
   - Por último: Configurar `NEXT_PUBLIC_API_URL` no Vercel e fazer deploy

---

## 🧪 Como Testar

Após configurar as variáveis:

1. Faça um novo deploy no Vercel
2. Acesse o site deployado
3. Abra o Console do navegador (F12)
4. Digite: `console.log(process.env.NEXT_PUBLIC_API_URL)`
5. Você deve ver a URL configurada

---

## 📚 Referências

- [Documentação do Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js - Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ Checklist

Antes de fazer deploy, verifique:

- [ ] `NEXT_PUBLIC_API_URL` configurada (URL do backend)
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` configurada
- [ ] Variáveis configuradas para Production, Preview e Development
- [ ] URLs sem barra `/` no final
- [ ] Backend já está deployado e acessível
- [ ] Novo deploy feito após adicionar variáveis

---

**Pronto!** 🚀 Com essas variáveis configuradas, seu frontend estará funcionando corretamente.

