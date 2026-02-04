'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { PRODUCTS, type Product } from '@/lib/products'
import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  product: Product
  quantity: number
}

// Particle Background Component
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 38, 38, ${p.opacity})`
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.15 * (1 - dist / 120)})`
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()

    window.addEventListener('resize', () => {
      resize()
      particles.length = 0
      createParticles()
    })

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: '#0a0a0a' }}
    />
  )
}

// Header Component
function Header({ cartCount, onCartClick }: { cartCount: number; onCartClick: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold tracking-wider text-white hover:text-red-500 transition-colors">
          Shadow<span className="text-red-600">.CC</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#products" className="text-gray-300 hover:text-red-500 transition-colors">Products</a>
          <a href="#features" className="text-gray-300 hover:text-red-500 transition-colors">Features</a>
          <a href="#faq" className="text-gray-300 hover:text-red-500 transition-colors">FAQ</a>
        </nav>
        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

// Hero Section
function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Premium Roblox Scripts
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
          Welcome to <span className="text-red-600">Shadow</span>.CC
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto text-pretty">
          The most powerful and undetected Roblox script on the market. Dominate any game with our premium features.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#products"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
          >
            Get Access Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 border border-red-600/50 text-red-400 hover:bg-red-600/10 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
          >
            View Features
          </a>
        </div>
      </div>
    </section>
  )
}

// Stats Section
function Stats() {
  return (
    <section className="py-12 px-6 border-y border-red-900/20">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { value: '50K+', label: 'Active Users' },
          { value: '99.9%', label: 'Uptime' },
          { value: '100+', label: 'Games Supported' },
          { value: 'Instant', label: 'Key Delivery' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-500">{stat.value}</div>
            <div className="text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Product Card
function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  return (
    <div className={`relative bg-black/60 backdrop-blur-sm border rounded-xl p-6 transition-all hover:scale-[1.02] group ${
      product.popular ? 'border-red-500 ring-2 ring-red-500/20' : 'border-red-900/30 hover:border-red-600/50'
    }`}>
      {product.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full">
          MOST POPULAR
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
        onClick={() => onAddToCart(product)}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
          product.popular
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/50'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Add to Cart
      </button>
    </div>
  )
}

// Products Section
function Products({ onAddToCart }: { onAddToCart: (product: Product) => void }) {
  return (
    <section id="products" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Choose Your Plan</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Select the key duration that works best for you. All plans include full script access and instant delivery.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
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
        </div>
      </div>
    </section>
  )
}

// Script Features Section
function ScriptFeatures() {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Universal Compatibility',
      description: 'Works with all major Roblox executors including Synapse, Fluxus, KRNL, and more.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Undetected',
      description: 'Advanced anti-detection system keeps you safe. Regular updates to bypass new security.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Powerful Features',
      description: 'Aimbot, ESP, speed hacks, fly, noclip, infinite jump, and 50+ more features.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: 'Auto Updates',
      description: 'Script automatically updates when games patch. No manual updates needed.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: 'Customizable UI',
      description: 'Clean, modern GUI with customizable themes, keybinds, and feature toggles.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: '24/7 Discord Support',
      description: 'Active community and dedicated support team ready to help anytime.',
    },
  ]

  return (
    <section id="features" className="py-20 px-6 bg-black/40">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Script Features</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Shadow Script comes packed with everything you need to dominate any Roblox game.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="bg-black/40 border border-red-900/30 rounded-xl p-6 hover:border-red-600/50 transition-colors">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-red-600/20 text-red-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Supported Games Section
function SupportedGames() {
  const games = [
    'Blox Fruits',
    'Pet Simulator X',
    'Arsenal',
    'Jailbreak',
    'Murder Mystery 2',
    'Adopt Me',
    'Tower of Hell',
    'Brookhaven',
    'Da Hood',
    'King Legacy',
    'Anime Fighters',
    'And 100+ More',
  ]

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Supported Games</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {games.map((game, i) => (
            <span
              key={i}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                i === games.length - 1
                  ? 'bg-red-600 text-white'
                  : 'bg-black/40 border border-red-900/30 text-gray-300'
              }`}
            >
              {game}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  const faqs = [
    {
      q: 'How do I receive my key?',
      a: 'After your payment is confirmed, your key will be displayed on the success page and also sent to your email. Make sure to copy and save it immediately.',
    },
    {
      q: 'How do I use the script?',
      a: 'Load your executor (Synapse, Fluxus, KRNL, etc.), join a Roblox game, paste our loader script, execute it, and enter your key when prompted. Full instructions are in our Discord.',
    },
    {
      q: 'Is the script safe to use?',
      a: 'Yes, our script uses advanced anti-detection methods and is regularly updated. However, as with any script, there is always some risk. We recommend using an alt account.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit/debit cards, Apple Pay, Google Pay, and more through our secure Stripe payment processor.',
    },
    {
      q: 'Can I get a refund?',
      a: 'Due to the digital nature of our products, all sales are final. Please make sure you understand what you are purchasing before buying.',
    },
    {
      q: 'What if my key gets blacklisted?',
      a: 'Contact our support team on Discord. If the blacklist was not due to abuse/sharing, we will issue a replacement key.',
    },
    {
      q: 'Can I share my key with friends?',
      a: 'No, keys are limited to one HWID (hardware ID). Sharing keys will result in a permanent blacklist with no replacement.',
    },
  ]

  return (
    <section id="faq" className="py-20 px-6 bg-black/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">FAQ</h2>
        <p className="text-gray-400 text-center mb-12">
          Frequently asked questions about Shadow Script.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-red-900/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 bg-black/40 text-left hover:bg-black/60 transition-colors"
              >
                <span className="font-semibold text-white">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-red-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="p-4 bg-black/20 text-gray-400">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-red-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/" className="text-2xl font-bold text-white hover:text-red-500 transition-colors">
            Shadow<span className="text-red-600">.CC</span>
          </a>
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-500 transition-colors">Discord</a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Shadow.CC. All rights reserved.
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
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-black/95 backdrop-blur-md border-l border-red-900/30 z-50 transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-red-900/30">
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="bg-black/40 border border-red-900/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{item.product.name}</h3>
                        <p className="text-sm text-gray-400">${(item.product.priceInCents / 100).toFixed(2)} each</p>
                        <p className="text-xs text-red-400">{item.product.duration}</p>
                      </div>
                      <button
                        onClick={() => onRemove(item.product.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded bg-red-600/20 text-red-500 hover:bg-red-600/30 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded bg-red-600/20 text-red-500 hover:bg-red-600/30 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-white">
                        ${((item.product.priceInCents * item.quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-red-900/30">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Total</span>
                <span className="text-2xl font-bold text-white">${(total / 100).toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Proceed to Checkout
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
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-red-900/30 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-red-900/30">
          <h2 className="text-xl font-bold text-white">Complete Your Purchase</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
          <Products onAddToCart={addToCart} />
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
