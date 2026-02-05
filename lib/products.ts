export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  category: string
  features: string[]
  stock: number
  duration: string
  popular?: boolean
  games?: string[]
}

export const PRODUCTS: Product[] = [
  // Script Keys
  {
    id: 'vlasic-weekly',
    name: 'Weekly Key',
    description: 'Perfect for trying out Vlasic. Full access for 7 days to both supported games.',
    priceInCents: 300,
    category: 'Script Keys',
    duration: '7 Days',
    games: ['Tha Bronx 3', 'Philly Streets 2'],
    features: [
      'Tha Bronx 3 Support',
      'Philly Streets 2 Support',
      'Auto Updates',
      '7 Day Duration',
      'Discord Support',
    ],
    stock: 999,
  },
  {
    id: 'vlasic-monthly',
    name: 'Monthly Key',
    description: 'Best value for regular users. Full access for 30 days to both supported games.',
    priceInCents: 500,
    category: 'Script Keys',
    duration: '30 Days',
    popular: true,
    games: ['Tha Bronx 3', 'Philly Streets 2'],
    features: [
      'Tha Bronx 3 Support',
      'Philly Streets 2 Support',
      'Auto Updates',
      '30 Day Duration',
      'Priority Discord Support',
      'Early Feature Access',
    ],
    stock: 500,
  },
  {
    id: 'vlasic-lifetime',
    name: 'Lifetime Key',
    description: 'One-time purchase. Never pay again with permanent access to both games.',
    priceInCents: 800,
    category: 'Script Keys',
    duration: 'Forever',
    games: ['Tha Bronx 3', 'Philly Streets 2'],
    features: [
      'Tha Bronx 3 Support',
      'Philly Streets 2 Support',
      'Auto Updates Forever',
      'Lifetime Duration',
      'VIP Discord Support',
      'Early Feature Access',
      'Beta Testing Access',
      'Custom Requests Priority',
    ],
    stock: 100,
  },
  // Discord Alt Gen
  {
    id: 'discord-alts-10',
    name: '10 Discord Alts',
    description: 'Fresh Discord accounts ready to use. Email verified and aged.',
    priceInCents: 299,
    category: 'Discord Alts',
    duration: 'Instant',
    features: [
      '10 Discord Accounts',
      'Email Verified',
      'Aged Accounts',
      'Instant Delivery',
      'Full Access Details',
    ],
    stock: 250,
  },
  {
    id: 'discord-alts-50',
    name: '50 Discord Alts',
    description: 'Bulk pack of fresh Discord accounts. Best value for larger needs.',
    priceInCents: 999,
    category: 'Discord Alts',
    duration: 'Instant',
    popular: true,
    features: [
      '50 Discord Accounts',
      'Email Verified',
      'Aged Accounts',
      'Instant Delivery',
      'Full Access Details',
      'Bonus Replacements',
    ],
    stock: 100,
  },
  {
    id: 'discord-alts-100',
    name: '100 Discord Alts',
    description: 'Maximum value bulk pack. Premium aged accounts with full details.',
    priceInCents: 1499,
    category: 'Discord Alts',
    duration: 'Instant',
    features: [
      '100 Discord Accounts',
      'Email Verified',
      'Premium Aged Accounts',
      'Instant Delivery',
      'Full Access Details',
      'Priority Replacements',
      'Dedicated Support',
    ],
    stock: 50,
  },
]

export const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))]
