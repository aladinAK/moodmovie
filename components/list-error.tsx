import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ListErrorProps {
  onRetry: () => void
}

// État d'erreur commun aux listes : distingue une panne d'API d'une liste vide
export function ListError({ onRetry }: ListErrorProps) {
  return (
    <div className="text-center py-10" role="alert">
      <p className="text-white/70 mb-4">Impossible de charger le contenu pour le moment.</p>
      <Button
        variant="outline"
        className="gap-2 rounded-full bg-black/40 border-white/20 text-white hover:bg-black/60 hover:text-white"
        onClick={onRetry}
      >
        <RotateCw className="h-4 w-4" />
        Réessayer
      </Button>
    </div>
  )
}
