'use client'

import React from 'react'

export default function Contact() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-[#4A3419] mb-4">Contact Us</h1>
      <p className="text-lg text-[#4A3419] mb-8">We'd love to hear from you! Please use the forms below to get in touch or leave feedback. You can also email us at <a href="mailto:caydiscreations@gmail.com" className="underline hover:text-[#6B4B26]">caydiscreations@gmail.com</a>.</p>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <a
          href="https://forms.gle/f1UuzVKmN3V85b9N9"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#E8C39E] text-[#4A3419] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d6b28e] transition-colors duration-300"
        >
          Contact Form
        </a>
        <a
          href="https://forms.gle/icTi5R3iQh8rti5SA"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#4A3419] text-[#FFF5E6] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#6B4B26] transition-colors duration-300"
        >
          Feedback Form
        </a>
      </div>
    </div>
  )
} 