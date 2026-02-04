'use client'

import { useCallback, useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { PRODUCTS, Product } from '@/lib/products'
import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  product: Product
  quantity: number
}

// Header Component
function Header({ cartCount, onCartClick }: { cartCount: number; onCartClick: () => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="/" className="group">
          <span className="text-2xl font-bold tracking-tighter text-foreground">
            VLASIC<span className="text-accent">.CC</span>
          </span>
        </a>
        
        <nav className="hidden md:flex items-center gap-10">
          <a href="#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">Products</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">Features</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">FAQ</a>
        </nav>

        <button
          onClick={onCartClick}
          className="relative flex items-center gap-3 px-5 py-2.5 border border-border hover:border-foreground/50 transition-colors"
        >
          <span className="text-sm uppercase tracking-wider text-foreground">Cart</span>
          {cartCount > 0 && (
            <span className="bg-foreground text-background text-xs w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

// Hero Section - Bold Typography Driven
function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <span className="inline-block border border-accent/50 text-accent px-4 py-1.5 text-xs uppercase tracking-widest">
            Undetected & Updated Daily
          </span>
        </div>
        
        <h1 className="text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.85] tracking-tighter text-foreground uppercase">
          Dominate
          <br />
          <span className="text-stroke">Every Game</span>
        </h1>
        
        <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
            Premium scripts with advanced features, instant delivery, and round-the-clock support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#products"
              className="group bg-foreground text-background px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-accent transition-colors flex items-center justify-center gap-3"
            >
              View Products
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="https://discord.gg/Kezxm2TyGY"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border hover:border-foreground/50 px-8 py-4 text-sm uppercase tracking-wider font-medium text-foreground transition-colors flex items-center justify-center gap-3"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .text-stroke {
          -webkit-text-stroke: 2px currentColor;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  )
}

// Stats Section - Minimal
function Stats() {
  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
    { value: '50+', label: 'Games' },
  ]

  return (
    <section className="py-20 px-6 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Product Card - Clean, Minimal
function ProductCard({ product, onAddToCart, stock }: { product: Product; onAddToCart: (product: Product) => void; stock: number }) {
  const outOfStock = stock === 0
  const isPopular = product.popular
  
  return (
    <div className={`relative flex flex-col p-8 border transition-all hover:border-foreground/50 ${
      isPopular ? 'border-accent bg-card' : 'border-border bg-card/50'
    } ${outOfStock ? 'opacity-50' : ''}`}>
      {isPopular && !outOfStock && (
        <div className="absolute -top-3 left-8 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 uppercase tracking-wider">
          Popular
        </div>
      )}
      {outOfStock && (
        <div className="absolute -top-3 left-8 bg-muted text-muted-foreground text-xs font-bold px-4 py-1 uppercase tracking-wider">
          Sold Out
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">{product.name}</h3>
        <p className="text-accent text-sm uppercase tracking-wider mt-1">{product.duration}</p>
      </div>
      
      <div className="mb-6">
        <div className="text-5xl font-bold tracking-tighter text-foreground">
          ${(product.priceInCents / 100).toFixed(0)}
        </div>
        <p className="text-muted-foreground text-sm mt-1">one-time</p>
      </div>

      <div className="flex items-center gap-2 mb-6 text-sm">
        <span className={`w-2 h-2 ${stock > 10 ? 'bg-accent' : stock > 0 ? 'bg-yellow-500' : 'bg-destructive'}`} />
        <span className="text-muted-foreground">
          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
        </span>
      </div>

      <p className="text-muted-foreground text-sm mb-8 flex-grow">{product.description}</p>
      
      <ul className="space-y-3 mb-8">
        {product.features.slice(0, 4).map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
            <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => !outOfStock && onAddToCart(product)}
        disabled={outOfStock}
        className={`w-full py-4 text-sm uppercase tracking-wider font-medium transition-colors ${
          outOfStock
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : isPopular
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : 'bg-foreground text-background hover:bg-foreground/90'
        }`}
      >
        {outOfStock ? 'Sold Out' : 'Add to Cart'}
      </button>
    </div>
  )
}

// Products Section
function Products({ onAddToCart, stock }: { onAddToCart: (product: Product) => void; stock: Record<string, number> }) {
  return (
    <section id="products" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground uppercase">Choose Your Plan</h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl">
            Select the duration that works best for you. All plans include full access and instant delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} stock={stock[product.id] || 0} />
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Payment
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant Delivery
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            24/7 Support
          </span>
        </div>
      </div>
    </section>
  )
}

// Features Section - Grid Layout
function ScriptFeatures() {
  const features = [
    { title: 'Auto Farm', desc: 'Automatically farm resources, XP, and currency while AFK' },
    { title: 'ESP & Wallhack', desc: 'See players, items, and NPCs through walls' },
    { title: 'Speed & Fly', desc: 'Move faster and fly anywhere on the map' },
    { title: 'Teleport', desc: 'Instantly teleport to any location or player' },
    { title: 'Aimbot', desc: 'Perfect aim assistance for combat games' },
    { title: 'Anti-AFK', desc: 'Stay in game without getting kicked' },
  ]

  return (
    <section id="features" className="py-24 px-6 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground uppercase">Powerful Features</h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl">
            Everything you need to dominate any game.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {features.map((f, i) => (
            <div key={i} className="bg-background p-8 hover:bg-card transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Supported Games - Marquee Style
function SupportedGames() {
  const games = ['Blox Fruits', 'Pet Simulator X', 'Arsenal', 'Murder Mystery 2', 'Jailbreak', 'Adopt Me', 'Tower of Hell', 'King Legacy']
  
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground uppercase">Supported Games</h2>
          <p className="text-muted-foreground text-lg mt-4">
            Works with 50+ popular games and counting.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {games.map((game, i) => (
            <span 
              key={i} 
              className="border border-border px-6 py-3 text-foreground text-sm uppercase tracking-wider hover:border-foreground/50 hover:bg-card transition-all cursor-default"
            >
              {game}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section - Accordion Style
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: 'How do I get my key after purchase?', a: 'Your license key is delivered instantly after payment. It will be displayed on the success page and sent to your email.' },
    { q: 'Which executors are supported?', a: 'We support all major executors including Synapse X, Script-Ware, Krnl, Fluxus, and more.' },
    { q: 'Is this detectable?', a: 'Our script is updated daily to bypass anti-cheat. We have a 99.9% undetection rate.' },
    { q: 'Can I use on multiple accounts?', a: 'Each key is HWID locked to one device. You can use it on multiple accounts on the same PC.' },
    { q: 'What if I get banned?', a: 'Use at your own risk. We recommend using alt accounts. We are not responsible for any bans.' },
  ]

  return (
    <section id="faq" className="py-24 px-6 bg-card/30">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground uppercase">FAQ</h2>
        </div>
        
        <div className="space-y-px">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-background border-b border-border">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-card/50 transition-colors"
              >
                <span className="text-foreground font-medium pr-4">{faq.q}</span>
                <svg 
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-40' : 'max-h-0'}`}>
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer - Minimal
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="/" className="text-2xl font-bold tracking-tighter text-foreground">
          VLASIC<span className="text-accent">.CC</span>
        </a>
        <p className="text-muted-foreground text-sm">2026 Vlasic.CC. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="https://discord.gg/Kezxm2TyGY" className="text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

// Cart Sidebar
function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onCheckout: () => void
}) {
  const total = cart.reduce((sum, item) => sum + item.product.priceInCents * item.quantity, 0)

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">Your Cart</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border border-border mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="bg-background border border-border p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-foreground font-semibold">{item.product.name}</h3>
                        <p className="text-accent text-sm">{item.product.duration}</p>
                      </div>
                      <button onClick={() => onRemove(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                        >
                          -
                        </button>
                        <span className="text-foreground w-8 text-center font-mono">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-foreground font-bold">${((item.product.priceInCents * item.quantity) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-border">
              <div className="flex items-center justify-between mb-6">
                <span className="text-muted-foreground uppercase tracking-wider text-sm">Total</span>
                <span className="text-3xl font-bold tracking-tighter text-foreground">${(total / 100).toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-foreground text-background py-4 text-sm uppercase tracking-wider font-medium hover:bg-accent transition-colors"
              >
                Checkout
              </button>
            </div>
          )}
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card border border-border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">Complete Purchase</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border border-destructive mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={() => setError(null)}
                className="bg-foreground text-background px-6 py-2 text-sm uppercase tracking-wider hover:bg-accent transition-colors"
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
    <div className="min-h-screen bg-background text-foreground">
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
  )
}
