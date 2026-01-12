# NowFit Payments API

API dedicada à integração com o Stripe para processamento de pagamentos.

## 🚀 Tecnologias

- NestJS
- Stripe
- TypeScript

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Stripe

## 🔧 Instalação

```bash
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=brl

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

## 🎯 Endpoints Disponíveis

### Configuração
- `GET /api/payments/config` - Retorna as chaves públicas do Stripe

### Customers
- `POST /api/payments/create-customer` - Cria um novo customer
- `GET /api/payments/customer` - Busca customer por email ou ID
- `GET /api/payments/customers` - Lista customers

### Pagamentos
- `POST /api/payments/create-payment-intent` - Cria um PaymentIntent
- `POST /api/payments/checkout` - Cria uma sessão de checkout
- `GET /api/payments/payment-intent/:id` - Busca um PaymentIntent

### Produtos
- `POST /api/payments/create-product` - Cria um produto
- `POST /api/payments/create-price` - Cria um preço para um produto

### Reembolsos
- `POST /api/payments/refund` - Cria um reembolso

### Webhooks
- `POST /api/payments/webhook` - Recebe eventos do Stripe
  - `checkout.session.completed` - Atualiza Flames do usuário automaticamente
  - `payment_intent.succeeded` - Log de pagamento bem-sucedido
  - `payment_intent.payment_failed` - Registra falha

## 🚀 Executando

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## 📚 Documentação da API

Acesse `http://localhost:8000/api` para visualizar a documentação Swagger.

## 🔐 Webhooks

Para testar webhooks localmente, use o Stripe CLI:

```bash
stripe listen --forward-to localhost:8000/api/payments/webhook
```

## 📝 Exemplos de Uso

### Criar um Customer

```bash
curl -X POST http://localhost:8000/api/payments/create-customer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "name": "John Doe"
  }'
```

### Criar um Payment Intent

```bash
curl -X POST http://localhost:8000/api/payments/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "customerId": "cus_xxx",
    "metadata": {
      "order_id": "123"
    }
  }'
```

### Criar Checkout Session

```bash
curl -X POST http://localhost:8000/api/payments/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "lineItems": [{
      "price_data": {
        "currency": "brl",
        "product_data": {
          "name": "Produto Teste"
        },
        "unit_amount": 5000
      },
      "quantity": 1
    }],
    "successUrl": "https://seusite.com/success",
    "cancelUrl": "https://seusite.com/cancel"
  }'
```

## 🛠️ Estrutura do Projeto

```
src/
├── stripe/          # Módulo Stripe
│   ├── stripe.service.ts
│   └── stripe.module.ts
├── payments/        # Módulo de Pagamentos
│   ├── payments.controller.ts
│   └── payments.module.ts
├── dto/             # Data Transfer Objects
│   ├── create-checkout-dto.ts
│   └── create-payment-intent.dto.ts
├── app.module.ts    # Módulo principal
└── main.ts          # Ponto de entrada
```

## 📄 Licença

Este projeto é privado e proprietário.
