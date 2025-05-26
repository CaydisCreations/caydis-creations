export default function CancelPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-[#4A3419] mb-4">Checkout Cancelled</h1>
      <p className="text-lg text-[#4A3419] mb-8">Your payment was not completed. You can try again or contact us for help.</p>
      <a href="/cart" className="bg-[#4A3419] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors duration-300">Return to Cart</a>
    </div>
  )
} 