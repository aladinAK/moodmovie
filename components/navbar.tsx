import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-4 z-40 mx-auto max-w-5xl px-4 max-sm:hidden">
      <div className=" flex justify-center h-16 items-center rounded-full border text-card-foreground shadow backdrop-blur-md bg-black/30 border-white/10">
        <Link href="/" className="flex items-center gap-8 mx-10 text-xs text-white/80">
          <span className="hover:text-white transition-colors underline">Movie</span>
          <span className="text-white/50 hover:text-white/80 transition-colors">Anime (Coming Soon)</span>
        </Link>
      </div>
    </header>
  )
}