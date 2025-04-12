export function Footer() {
  return (
    <footer className="border-t w-full border-white/20 py-3">
      <div className=" flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Made By
          </span>
          <a href="https://aladinakkari.ca" className="text-sm text-white hover:underline">
            Aladinakkari
          </a>
        </div>
      </div>
    </footer>
  )
}