import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-4 z-40 mx-auto max-w-5xl px-4">
      <div className="backdrop-blur-md bg-black/50 border-[2px] border-white/50 rounded-full flex justify-center h-16 items-center shadow-lg">
        <Link href="/" className="flex items-center gap-8 mx-20 text-xs text-white/80">
          <span className="hover:text-white transition-colors">Movie</span>
          <span className="text-white/50 hover:text-white/80 transition-colors">Show</span>
          <span className="text-white/50 hover:text-white/80 transition-colors">Anime</span>
        </Link>
      </div>
    </header>
  )
}