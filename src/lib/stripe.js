import { loadStripe } from '@stripe/stripe-js'

let stripePromise

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      throw new Error('Missing Stripe publishable key')
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}