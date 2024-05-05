import Link from "next/link";

export default function Component() {
  return (
    <section className="flex h-screen items-center justify-center bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              TypeScript Playground
            </h1>
            <p className="max-w-[700px] text-gray-300 md:text-xl">
              Explore the power of TypeScript with our interactive playground,
              powered by Next.js and Socket.IO.
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#4ade80] px-6 text-sm font-medium text-[#1e293b] shadow-lg shadow-[#4ade80]/50 transition-colors hover:bg-[#34d399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80] disabled:pointer-events-none disabled:opacity-50"
            href="/playground"
          >
            Try it Now
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 -z-10  bg-cover bg-center blur-2xl opacity-30" />
    </section>
  );
}
