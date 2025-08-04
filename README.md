# Aplicativo de Pensamentos Diários

Uma aplicação React para registrar e gerenciar pensamentos diários, com suporte a tema claro/escuro.

## 🚀 Deploy no Vercel

### Configuração das Variáveis de Ambiente

Para que a aplicação funcione corretamente no Vercel, você precisa configurar as seguintes variáveis de ambiente:

1. Acesse o dashboard do seu projeto no Vercel
2. Vá para **Settings** > **Environment Variables**
3. Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Como obter as credenciais do Supabase:

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto ou acesse um existente
3. Vá para **Settings** > **API**
4. Copie a **Project URL** e a **anon public** key
5. Cole essas informações nas variáveis de ambiente do Vercel

### Estrutura do Banco de Dados

Certifique-se de que sua tabela `frases` no Supabase tenha a seguinte estrutura:

```sql
CREATE TABLE frases (
  id SERIAL PRIMARY KEY,
  frase TEXT,
  estado TEXT DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Funcionalidades

- ✍️ Escrever e salvar pensamentos
- 📚 Visualizar histórico de pensamentos
- 🌙 Modo escuro/claro
- 🗑️ Excluir pensamentos
- 📱 Interface responsiva

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Supabase
- Vite
- Lucide React Icons

## 📦 Instalação Local

```bash
npm install
npm run dev
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter 