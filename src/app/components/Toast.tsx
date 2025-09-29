'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  type: 'error' | 'success' | 'info'
  isVisible: boolean
  onClose: () => void
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto-close after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '⚠️'
      case 'success':
        return '✅'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg border shadow-lg ${getToastStyles()}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">{getIcon()}</span>
          <div className="flex-1">
            <p className="font-medium text-sm leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for managing toast notifications
export function useToast() {
  const [toast, setToast] = useState<{
    message: string
    type: 'error' | 'success' | 'info'
    isVisible: boolean
  }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  return {
    toast,
    showToast,
    hideToast
  }
}
