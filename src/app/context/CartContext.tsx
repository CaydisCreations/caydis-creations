'use client'

import { createContext, useState, useContext, ReactNode, useEffect } from 'react'

// Cart item interface
export interface CartItem {
  id: number
  name: string
  price: number
  description: string
  category: string
  rating: number
  quantity: number
}

// Cart context interface
interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: any, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initialization
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cartItems])

  // Add item to cart
  const addToCart = (product: any, quantity: number = 1) => {
    setCartItems(currentItems => {
      // Check if product is already in cart
      const existingItem = currentItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update quantity of existing item
        return currentItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      } else {
        // Add new item to cart
        return [...currentItems, { ...product, quantity }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCartItems(currentItems => 
      currentItems.filter(item => item.id !== productId)
    )
  }

  // Update item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove item
      removeFromCart(productId)
      return
    }

    setCartItems(currentItems => 
      currentItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    )
  }

  // Clear entire cart
  const clearCart = () => {
    setCartItems([])
  }

  // Calculate total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Get total number of items
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
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