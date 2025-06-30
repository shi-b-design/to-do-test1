# Deployment Guide for Edge Functions

## Prerequisites
- Supabase CLI installed (`npm install -g supabase`)
- Stripe account with products/prices created
- Access to your Supabase project

## Step 1: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

Your project ref can be found in Supabase dashboard URL: `https://app.supabase.com/project/[PROJECT_REF]`

## Step 2: Set Environment Variables

Set secrets for your edge functions:

```bash
# Set your Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key

# Set your Stripe webhook secret (get this after creating webhook in Step 4)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Step 3: Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook
```

## Step 4: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint:
   - URL: `https://[PROJECT_REF].functions.supabase.co/stripe-webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
3. Copy the webhook signing secret
4. Update the secret: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

## Step 5: Update Your Frontend

In `src/components/PricingModal.js`, replace `'price_YOUR_STRIPE_PRICE_ID'` with your actual Stripe price ID (starts with `price_`).

## Step 6: Configure CORS (if needed)

If you encounter CORS issues, update each function to include CORS headers:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

## Testing

1. Create a test account and sign up
2. Try to create more than 5 todos (should be blocked)
3. Click "Upgrade to Premium"
4. Use Stripe test card: `4242 4242 4242 4242`
5. Verify subscription is active in your database
6. Verify you can now create unlimited todos

## Production Checklist

- [ ] Replace Stripe test keys with live keys
- [ ] Set up proper CORS origins (not `*`)
- [ ] Enable email confirmation in Supabase Auth
- [ ] Set up error monitoring
- [ ] Configure rate limiting on edge functions
- [ ] Set up proper success/cancel URLs for Stripe checkout