export interface Product {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  fullDescription: string
  price: number
  discountPrice?: number
  category: string
  collection: string
  rating: number
  reviewCount: number
  images: string[]
  sizes: string[]
  colors: Array<{ name: string; hex: string }>
  material: string
  care: string
  stock: number
  isNew: boolean
  isBestseller: boolean
  isFeatured: boolean
  tags: string[]
  brand: string
}

export interface CartItem {
  productId: string
  quantity: number
  selectedSize: string
  selectedColor: string
}

export interface WishlistItem {
  productId: string
  addedAt: number
}

export interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export interface OrderData {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  customerInfo: CheckoutForm
  createdAt: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  content: string
  helpful: number
  createdAt: number
  verified: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  description: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  image: string
  description: string
  productIds: string[]
}
