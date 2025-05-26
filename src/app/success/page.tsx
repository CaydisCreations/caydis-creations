export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-[#4A3419] mb-4">Thank you for your purchase!</h1>
      <p className="text-lg text-[#4A3419] mb-8">Your order was successful. A confirmation email has been sent to you.</p>
      <a href="/products" className="bg-[#4A3419] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors duration-300">Continue Shopping</a>
    </div>
  )
} 