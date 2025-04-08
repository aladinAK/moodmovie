import { Github, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>© 2025 MoodMovie. Tous droits réservés.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Créé avec
          </span>
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm text-muted-foreground">
            pour les cinéphiles
          </span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:underline"
        >
          <Github className="h-4 w-4" />
          <span>Voir sur GitHub</span>
        </a>
      </div>
    </footer>
  )
}