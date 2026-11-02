import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { KeyboardEvent } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Rend un élément non-bouton (carte, image) activable à la souris et au clavier (Entrée / Espace).
// Les touches pressées sur un bouton imbriqué (favori, vu) sont ignorées.
export function clickableProps(onActivate: () => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.target !== e.currentTarget) return
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onActivate()
      }
    },
  }
}

// Respecte le réglage système « réduire les animations »
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
