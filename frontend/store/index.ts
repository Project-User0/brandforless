import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, WishlistItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: (products: any[]) => number
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

interface UIStore {
  isMobileMenuOpen: boolean
  isCartOpen: boolean
  isSearchOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

interface FilterStore {
  selectedCategories: string[]
  priceRange: [number, number]
  selectedSizes: string[]
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
  setSelectedCategories: (categories: string[]) => void
  setPriceRange: (range: [number, number]) => void
  setSelectedSizes: (sizes: string[]) => void
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest') => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({  
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }))
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: (products) => {
        return get().items.reduce((total, item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product) return total
          const price = product.discountPrice || product.price
          return total + price * item.quantity
        }, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        set((state) => {
          const exists = state.items.some((i) => i.productId === productId)
          if (exists) return state
          return {
            items: [...state.items, { productId, addedAt: Date.now() }],
          }
        })
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },
      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId)
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)

export const useUI = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}))

export const useFilters = create<FilterStore>()(
  persist(
    (set) => ({
      selectedCategories: [],
      priceRange: [0, 500],
      selectedSizes: [],
      sortBy: 'featured',
      setSelectedCategories: (categories) => set({ selectedCategories: categories }),
      setPriceRange: (range) => set({ priceRange: range }),
      setSelectedSizes: (sizes) => set({ selectedSizes: sizes }),
      setSortBy: (sort) => set({ sortBy: sort }),
    }),
    {
      name: 'filters-storage',
    }
  )
)
