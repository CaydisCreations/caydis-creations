'use client'

import React from 'react'

interface SEOStructuredDataProps {
  type?: 'product' | 'organization' | 'website' | 'breadcrumb'
  data?: any
}

export default function SEOStructuredData({ type = 'website', data }: SEOStructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Caydi's Creations",
          "url": "https://caydiscreations.com",
          "description": "Beautiful handmade crochet creations crafted with love",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://caydiscreations.com/products?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      
      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data || [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://caydiscreations.com"
            }
          ]
        }
      
      case 'product':
        return data || {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Handmade Crochet Item",
          "description": "Beautiful handmade crochet creation",
          "brand": {
            "@type": "Brand",
            "name": "Caydi's Creations"
          },
          "category": "Handmade Crafts"
        }
      
      default:
        return data
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
    />
  )
}
