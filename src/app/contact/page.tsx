'use client'

import React, { useState } from 'react'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('idle');
    try {
      const res = await fetch('https://formspree.io/f/mpwrbkgw', {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-[#4A3419] mb-4">Contact Us</h1>
      <p className="text-lg text-[#4A3419] mb-8">We'd love to hear from you! Please use the forms below to get in touch or leave feedback. You can also email us at <a href="mailto:caydicreations@gmail.com" className="underline hover:text-[#6B4B26]">caydicreations@gmail.com</a>.</p>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <a
          href="https://forms.gle/2kRHpSdE6KnGr5zF7"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#E8C39E] text-[#4A3419] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d6b28e] transition-colors duration-300"
        >
          Contact Form
        </a>
        <a
          href="https://forms.gle/i6F8uiLPzfHMeu1V8"
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