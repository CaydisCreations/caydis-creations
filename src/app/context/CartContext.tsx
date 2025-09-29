'use client'

import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react'

// Cart item interface
export interface CartItem {
  id: number
  name: string
  price: number
  description: string
  category: string
  rating: number
  quantity: number
  image?: string // Optional image property for product images
  priceId: string // Stripe price ID
}

// Cart context interface
interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: any, quantity?: number) => Promise<{ success: boolean; message?: string }>
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => Promise<{ success: boolean; message?: string }>
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  isLoaded: boolean
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on initialization
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart)
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      // Clear corrupted localStorage
      localStorage.removeItem('cart')
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cartItems, isLoaded])

  // Add item to cart with stock validation
  const addToCart = useCallback(async (product: any, quantity: number = 1) => {
    // Check stock availability
    const stock = Number(product.metadata?.stock) || 0
    
    if (stock === 0) {
      return {
        success: false,
        message: "Sorry, this item is currently out of stock. Please check back later or browse our other available products."
      }
    }

    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.id === product.id)
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0
    const totalQuantityAfterAdd = currentQuantityInCart + quantity

    if (totalQuantityAfterAdd > stock) {
      return {
        success: false,
        message: `We don't have ${totalQuantityAfterAdd} of this item in stock. We currently have ${stock} available. Please adjust your quantity or check back later.`
      }
    }

    // If validation passes, add to cart
    setCartItems(currentItems => {
      if (existingItem) {
        // Update quantity of existing item
        return currentItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      } else {
        // Add new item to cart, ensure priceId is included
        return [...currentItems, { ...product, quantity, priceId: product.priceId }]
      }
    })

    return { success: true }
  }, [cartItems])

  // Remove item from cart
  const removeFromCart = useCallback((productId: number) => {
    setCartItems(currentItems => 
      currentItems.filter(item => item.id !== productId)
    )
  }, [])

  // Update item quantity with stock validation
  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove item
      removeFromCart(productId)
      return { success: true }
    }

    // Find the product in cart to get its metadata
    const cartItem = cartItems.find(item => item.id === productId)
    if (!cartItem) {
      return { success: false, message: "Item not found in cart" }
    }

    // Check stock availability
    const stock = Number(cartItem.metadata?.stock) || 0
    
    if (stock === 0) {
      return {
        success: false,
        message: "Sorry, this item is currently out of stock. Please check back later or browse our other available products."
      }
    }

    if (quantity > stock) {
      return {
        success: false,
        message: `We don't have ${quantity} of this item in stock. We currently have ${stock} available. Please adjust your quantity or check back later.`
      }
    }

    // If validation passes, update quantity
    setCartItems(currentItems => 
      currentItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    )

    return { success: true }
  }, [cartItems, removeFromCart])

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  // Calculate total price
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cartItems])

  // Get total number of items
  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isLoaded
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook for using cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 