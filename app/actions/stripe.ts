'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'
import { headers } from 'next/headers'

interface CartItem {
  productId: string
  quantity: number
}

export async function startCheckoutSession(cartItems: CartItem[]) {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  const headersList = await headers()
  const origin = headersList.get('origin') || 'http://localhost:3000'

  const lineItems = cartItems.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId)
    if (!product) {
      throw new Error(`Product with id "${item.productId}" not found`)
    }

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.priceInCents,
      },
      quantity: item.quantity,
    }
  })

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: lineItems,
    mode: 'payment',
    return_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  })

  return { clientSecret: session.client_secret }
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
    paymentStatus: session.payment_status,
  }
}
