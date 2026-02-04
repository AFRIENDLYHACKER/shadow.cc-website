import 'server-only'

import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  typescript: true,
})
