import { NextResponse } from 'next/server'
import { claimKey, getStock } from '@/lib/keys'
import { getStripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    // Verify the Stripe session is paid
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    })
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }
    
    // Check if key was already claimed for this session (stored in metadata)
    if (session.metadata?.keys_claimed) {
      // Return previously claimed keys
      try {
        const previousKeys = JSON.parse(session.metadata.keys_claimed)
        return NextResponse.json({ 
          success: true,
          keys: previousKeys,
          email: session.customer_details?.email,
          alreadyClaimed: true
        })
      } catch {
        return NextResponse.json({ 
          error: 'Key already claimed for this session'
        }, { status: 200 })
      }
    }
    
    // Get cart items from session metadata
    const cartMetadata = session.metadata?.cart_items
    if (!cartMetadata) {
      return NextResponse.json({ error: 'No cart items found in session' }, { status: 400 })
    }
    
    // Parse cart items (format: "productId:quantity,productId:quantity")
    const cartItems = cartMetadata.split(',').map(item => {
      const [productId, quantity] = item.split(':')
      return { productId, quantity: parseInt(quantity, 10) || 1 }
    })
    
    const claimedKeys: { productId: string; key: string }[] = []
    
    for (const item of cartItems) {
      const { productId, quantity } = item
      
      for (let i = 0; i < quantity; i++) {
        // Check stock before claiming
        const stock = getStock(productId)
        if (stock === 0) {
          return NextResponse.json({ 
            error: `Out of stock for ${productId}`,
            claimedKeys 
          }, { status: 400 })
        }
        
        const key = claimKey(productId)
        if (key) {
          claimedKeys.push({ productId, key })
        } else {
          return NextResponse.json({ 
            error: `Failed to claim key for ${productId}`,
            claimedKeys 
          }, { status: 500 })
        }
      }
    }
    
    if (claimedKeys.length === 0) {
      return NextResponse.json({ error: 'No valid products found' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      keys: claimedKeys,
      email: session.customer_details?.email 
    })
    
  } catch (error) {
    console.error('Error claiming key:', error)
    return NextResponse.json({ error: 'Failed to claim key' }, { status: 500 })
  }
}
