import React from 'react'

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-[#4A3419]">Contact Us</h1>
        <p className="mt-2 text-[#4A3419]">Get in touch for custom orders or inquiries</p>
      </header>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-[#4A3419] font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-[#E8C39E] rounded focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[#4A3419] font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-[#E8C39E] rounded focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-[#4A3419] font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full px-4 py-2 border border-[#E8C39E] rounded focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-[#4A3419] font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              className="w-full px-4 py-2 border border-[#E8C39E] rounded focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#4A3419] text-[#FFF5E6] rounded hover:bg-[#6B4B26]"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#4A3419]">Other Ways to Reach Us</h2>
        <div>
          <p className="text-[#4A3419]">Email: caydicreations@gmail.com</p>
          <p className="text-[#4A3419]">Follow us on social media for updates and new products!</p>
        </div>
      </div>
    </div>
  )
} 