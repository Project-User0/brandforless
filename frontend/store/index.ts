import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, WishlistItem } from "@/types";

export interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: (products: any[]) => number
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

interface UIStore {
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

interface FilterStore {
  selectedCategories: string[];
  priceRange: [number, number];
  selectedSizes: string[];
  sortBy: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
  setSelectedCategories: (categories: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setSelectedSizes: (sizes: string[]) => void;
  setSortBy: (
    sort: "featured" | "price-asc" | "price-desc" | "rating" | "newest",
  ) => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const selectedColor = item.selectedColor ?? null
          const selectedSize = item.selectedSize ?? null

          const storageId = `${item.productId}-${selectedColor || 'default'}-${selectedSize || 'default'}`

          const existingIndex = state.items.findIndex((i) => i.id === storageId)

          if (existingIndex > -1) {
            const updatedItems = [...state.items]
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + item.quantity,
            }
            return { items: updatedItems }
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                id: storageId,
                selectedColor,
                selectedSize,
              },
            ],
          }
        })
      },

      // Delete directly using the storage ID
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      // Update directly using the storage ID
      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: (products: any[]) => {
        return get().items.reduce((total, item) => {
          // Finds the original product by its intact productId
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
          const exists = state.items.some((i) => i.productId === productId);
          if (exists) return state;
          return {
            items: [...state.items, { productId, addedAt: Date.now() }],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },
      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
);

export const useUI = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));

export const useFilters = create<FilterStore>()(
  persist(
    (set) => ({
      selectedCategories: [],
      priceRange: [0, 500],
      selectedSizes: [],
      sortBy: "featured",
      setSelectedCategories: (categories) =>
        set({ selectedCategories: categories }),
      setPriceRange: (range) => set({ priceRange: range }),
      setSelectedSizes: (sizes) => set({ selectedSizes: sizes }),
      setSortBy: (sort) => set({ sortBy: sort }),
    }),
    {
      name: "filters-storage",
    },
  ),
);
