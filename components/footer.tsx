export function Footer() {
  return (
    <footer className="border-t w-full border-white/20 py-3">
      <div className=" flex items-center justify-center flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Créé par
          </span>
          <a href="https://aladinakkari.ca" className="text-sm text-white hover:underline">
            Aladinakkari
          </a>
        </div>
        <div className="text-center text-xs text-muted-foreground px-4">
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
            Ce site utilise l&apos;API TMDB sans être approuvé ni certifié par TMDB.
          </a>
        </div>
      </div>
    </footer>
  )
}