# Todo App with Supabase & Stripe

A modern todo application with user authentication, subscription management, and payment processing.

## Features

- 🔐 User authentication (signup/login/logout)
- ✅ User-specific todo lists
- 💳 Stripe integration for premium subscriptions
- 🎯 Free tier: Up to 5 todos
- ⭐ Premium tier: Unlimited todos + future features
- 📱 Responsive design

## Setup Instructions

### 1. Prerequisites

- Node.js 16+ installed
- Supabase account
- Stripe account

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL commands from `supabase-schema.sql` in the SQL editor
3. Enable Email authentication in Authentication settings
4. Copy your project URL and anon key

### 3. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create a product and price for the premium subscription ($9.99/month)
3. Copy your publishable key
4. Set up webhooks for subscription events (see Stripe Edge Functions section)

### 4. Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

## Stripe Edge Functions (Required for Production)

You'll need to create Supabase Edge Functions to handle:

1. **create-checkout-session**: Creates Stripe checkout sessions
2. **create-portal-session**: Creates Stripe customer portal sessions
3. **stripe-webhook**: Handles Stripe webhook events

Example edge function for checkout session:

```typescript
// supabase/functions/create-checkout-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.1.1?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  const { userId, priceId } = await req.json()
  
  // Create or get Stripe customer
  // Create checkout session
  // Return session ID
})
```

## Project Structure

```
├── src/
│   ├── components/     # UI components
│   ├── css/           # Styles
│   ├── js/            # Main app logic
│   └── lib/           # Services (auth, db, stripe)
├── index.html         # Entry point
├── package.json       # Dependencies
└── supabase-schema.sql # Database schema
```

## Security Notes

- Never commit your `.env` file
- Use Row Level Security (RLS) in Supabase
- Validate all user inputs
- Handle Stripe webhooks securely

## Future Enhancements

- Task categories/tags
- Due dates and reminders
- Task sharing
- Mobile app
- Dark mode
- Export functionality