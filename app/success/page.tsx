'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface ClaimedKey {
  productId: string
  key: string
}

const productNames: Record<string, string> = {
  'vlasic-weekly': 'Weekly Key',
  'vlasic-monthly': 'Monthly Key',
  'vlasic-lifetime': 'Lifetime Key',
  'discord-alts-10': '10 Discord Alts',
  'discord-alts-50': '50 Discord Alts',
  'discord-alts-100': '100 Discord Alts',
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [claimedKeys, setClaimedKeys] = useState<ClaimedKey[]>([])
  const [customerEmail, setCustomerEmail] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setErrorMessage('No session ID found')
      return
    }

    fetch('/api/claim-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error && !data.keys) {
          setStatus('error')
          setErrorMessage(data.error)
        } else if (data.keys && data.keys.length > 0) {
          setStatus('success')
          setClaimedKeys(data.keys)
          setCustomerEmail(data.email || '')
        } else if (data.key) {
          setStatus('success')
          setClaimedKeys([{ productId: 'unknown', key: data.key }])
        } else {
          setStatus('error')
          setErrorMessage('Failed to retrieve your license key')
        }
      })
      .catch(err => {
        console.error('Error claiming key:', err)
        setStatus('error')
        setErrorMessage('Something went wrong. Please contact support.')
      })
  }, [sessionId])

  const copyToClipboard = (key: string, index: number) => {
    navigator.clipboard.writeText(key)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-foreground border-t-transparent mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Processing your payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 border border-destructive mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-tight">Something Went Wrong</h1>
          <p className="text-muted-foreground mb-6">{errorMessage || 'Please contact support with your payment confirmation.'}</p>
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 border border-border hover:border-foreground/50 text-foreground py-3 px-6 transition-colors text-center text-sm uppercase tracking-wider"
            >
              Return to Shop
            </Link>
            <a
              href="https://discord.gg/aEnqgtK8sU"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-foreground text-background py-3 px-6 transition-colors text-center text-sm uppercase tracking-wider hover:bg-accent"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 border border-accent mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 uppercase tracking-tight">Payment Successful</h1>
          <p className="text-muted-foreground">Thank you for your purchase</p>
          {customerEmail && (
            <p className="text-muted-foreground/70 text-sm mt-1">Receipt sent to {customerEmail}</p>
          )}
        </div>

        {claimedKeys.map((claimed, index) => (
          <div key={index} className="bg-background border border-border p-6 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                {productNames[claimed.productId] || 'LICENSE KEY'} #{index + 1}
              </span>
              <span className="border border-accent text-accent text-xs px-2 py-1 uppercase tracking-wider">Save This</span>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-secondary border border-border px-4 py-3 text-lg font-mono text-foreground tracking-wider overflow-x-auto">
                {claimed.key}
              </code>
              <button
                onClick={() => copyToClipboard(claimed.key, index)}
                className="border border-border hover:border-foreground/50 p-3 transition-colors flex-shrink-0"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}

        <div className="bg-secondary border border-border p-4 mb-6">
          <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider text-sm">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Redeem
          </h3>
          <ol className="text-muted-foreground text-sm space-y-2 list-decimal list-inside">
            <li>Open your executor and load the script</li>
            <li>When prompted, paste your license key</li>
            <li>Click verify and enjoy the features</li>
          </ol>
        </div>

        <div className="bg-destructive/10 border border-destructive/30 p-4 mb-6">
          <p className="text-destructive text-sm flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong>Important:</strong> Save your license key now! This key is tied to your HWID and cannot be recovered if lost.
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 border border-border hover:border-foreground/50 text-foreground py-3 px-6 transition-colors text-center text-sm uppercase tracking-wider"
          >
            Back to Shop
          </Link>
          <a
            href="https://discord.gg/aEnqgtK8sU"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-foreground text-background py-3 px-6 transition-colors text-center text-sm uppercase tracking-wider hover:bg-accent"
          >
            Join Discord
          </a>
        </div>
      </div>
    </div>
  )
}
