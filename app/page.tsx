export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <h1 className="text-5xl font-bold mb-4 text-brand-primary">
          Welcome to BrandON
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your Premier Digital Advertising Partner
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-brand-primary hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition">
            View Services
          </button>
          <button className="bg-brand-secondary hover:bg-brand-accent text-white font-bold py-3 px-6 rounded-lg transition">
            Our Portfolio
          </button>
        </div>
      </div>
    </main>
  )
}