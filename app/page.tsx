'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getCheckoutSession } from '@/app/actions/stripe'
import Link from 'next/link'

function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segments = 4
  const segmentLength = 5
  const keyParts: string[] = []
  
  for (let i = 0; i < segments; i++) {
    let segment = ''
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    keyParts.push(segment)
  }
  
  return keyParts.join('-')
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [licenseKey, setLicenseKey] = useState<string>('')
  const [customerEmail, setCustomerEmail] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }

    getCheckoutSession(sessionId)
      .then((session) => {
        if (session.paymentStatus === 'paid') {
          setStatus('success')
          setLicenseKey(generateLicenseKey())
          setCustomerEmail(session.customerEmail || '')
        } else {
          setStatus('error')
        }
      })
      .catch(() => {
        setStatus('error')
      })
  }, [sessionId])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(licenseKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Processing your payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Failed</h1>
          <p className="text-gray-400 mb-6">Something went wrong with your payment. Please try again.</p>
          <Link
            href="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    )
  }

// Product Card
function ProductCard({ product, onAddToCart, stock }: { product: Product; onAddToCart: (product: Product) => void; stock: number }) {
  const outOfStock = stock === 0
  
  return (
    <div className={`relative bg-black/60 backdrop-blur-sm border rounded-xl p-6 transition-all hover:scale-[1.02] group ${
      product.popular ? 'border-red-500 ring-2 ring-red-500/20' : 'border-red-900/30 hover:border-red-600/50'
    } ${outOfStock ? 'opacity-60' : ''}`}>
      {product.popular && !outOfStock && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      {outOfStock && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-xs font-bold px-4 py-1 rounded-full">
          OUT OF STOCK
        </div>
      )}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-red-400 font-medium">{product.duration}</p>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white">
          ${(product.priceInCents / 100).toFixed(2)}
        </div>
        <p className="text-gray-500 text-sm mt-1">one-time payment</p>
      </div>

      {/* Stock indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className={`w-2 h-2 rounded-full ${stock > 10 ? 'bg-green-500' : stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
        <span className={`text-sm ${stock > 10 ? 'text-green-400' : stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
          {stock > 0 ? `${stock} keys in stock` : 'Out of stock'}
        </span>
      </div>

      <p className="text-gray-400 text-sm text-center mb-6">{product.description}</p>
      
      <ul className="space-y-3 mb-6">
        {product.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => !outOfStock && onAddToCart(product)}
        disabled={outOfStock}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
          outOfStock
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : product.popular
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/50'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}

// Products Section
function Products({ onAddToCart, stock }: { onAddToCart: (product: Product) => void; stock: Record<string, number> }) {
  return (
    <section id="products" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Choose Your Plan</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Select the key duration that works best for you. All plans include full script access and instant delivery.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} stock={stock[product.id] || 0} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure Payment
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Instant Delivery
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              24/7 Support
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400">Thank you for your purchase</p>
          {customerEmail && (
            <p className="text-gray-500 text-sm mt-1">Receipt sent to {customerEmail}</p>
          )}
        </div>

        <div className="bg-black border border-zinc-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm font-medium">YOUR LICENSE KEY</span>
            <span className="bg-red-600/20 text-red-400 text-xs px-2 py-1 rounded">SAVE THIS</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-lg font-mono text-white tracking-wider">
              {licenseKey}
            </code>
            <button
              onClick={copyToClipboard}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-lg p-3 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// Checkout Modal
function CheckoutModal({
  isOpen,
  onClose,
  cart,
}: {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
}) {
  const [error, setError] = useState<string | null>(null)
  
  const fetchClientSecret = useCallback(async () => {
    try {
      setError(null)
      const items = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
      const result = await startCheckoutSession(items)
      if (!result.clientSecret) {
        throw new Error('Failed to create checkout session')
      }
      return result.clientSecret
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      throw err
    }
  }, [cart])

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Redeem
          </h3>
          <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
            <li>Open your executor and load the script</li>
            <li>When prompted, paste your license key</li>
            <li>Click verify and enjoy the features</li>
          </ol>
        </div>

        <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong>Important:</strong> Save your license key now! This key is tied to your HWID and cannot be recovered if lost.
            </span>
          </p>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => setError(null)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout className="stripe-checkout" />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Page Component
export default function ShopPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [stock, setStock] = useState<Record<string, number>>({})

  // Fetch stock on mount and periodically
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch('/api/stock')
        const data = await res.json()
        if (data.stock) {
          setStock(data.stock)
        }
      } catch (error) {
        console.error('Error fetching stock:', error)
      }
    }
    
    fetchStock()
    // Refresh stock every 30 seconds
    const interval = setInterval(fetchStock, 30000)
    return () => clearInterval(interval)
  }, [])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <div className="relative z-10">
        <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
        <main>
          <Hero />
          <Stats />
          <Products onAddToCart={addToCart} stock={stock} />
          <ScriptFeatures />
          <SupportedGames />
          <FAQ />
        </main>
        <Footer />
        <CartSidebar
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={() => {
            setCartOpen(false)
            setCheckoutOpen(true)
          }}
        />
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cart={cart}
        />
      </div>
    </div>
  )
}
