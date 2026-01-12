# NowFit API - Deploy na Vercel

## Configuração necessária

1. Faça o deploy do projeto no Vercel:
   ```bash
   vercel
   ```

2. Configure as variáveis de ambiente no Vercel Dashboard:
   - `STRIPE_SECRET_KEY` - Sua chave secreta do Stripe
   - `STRIPE_WEBHOOK_SECRET` - Secret do webhook do Stripe
   - `SUPABASE_URL` - URL do seu projeto Supabase
   - `SUPABASE_SERVICE_KEY` - Service role key do Supabase
   - `FRONTEND_URL` - URL do frontend (para redirect após pagamento)

3. Configure o webhook no Stripe Dashboard:
   - URL: `https://seu-dominio.vercel.app/api/payments/webhook`
   - Eventos: `checkout.session.completed`

4. Atualize o PAYMENTS_API_BASE_URL no frontend:
   ```typescript
   // config.ts
   export const PAYMENTS_API_BASE_URL = 'https://seu-dominio.vercel.app/api';
   ```

## Estrutura do projeto

- `src/main.ts` - Configurado para funcionar como serverless function
- `vercel.json` - Configuração do Vercel
- `dist/main.js` - Entrypoint após build

## Rotas disponíveis

- `GET /api` - Documentação Swagger
- `POST /api/payments/checkout` - Criar sessão de checkout
- `POST /api/payments/webhook` - Webhook do Stripe
- `GET /api/payments/config` - Configuração do Stripe

## Desenvolvimento local

```bash
npm run start:dev
```

API estará disponível em: http://localhost:8000
