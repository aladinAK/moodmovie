"use client"

import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/utils"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

const PARTICLE_COUNT = 100

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 0.1,
    speedX: Math.random() * 0.5 - 0.25,
    speedY: Math.random() * 0.5 - 0.25,
    opacity: Math.random() * 0.5 + 0.1,
  }
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Faire correspondre la taille du canvas à la fenêtre
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    // Création des particules
    const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvas.width, canvas.height))

    let frameId = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Fonction d'animation
    const animate = () => {
      for (const p of particles) {
        p.x += p.speedX
        p.y += p.speedY

        // Vérification des limites du canvas
        if (p.x > canvas.width || p.x < 0) p.x = Math.random() * canvas.width
        if (p.y > canvas.height || p.y < 0) p.y = Math.random() * canvas.height
      }
      draw()
      frameId = requestAnimationFrame(animate)
    }

    // « Réduire les animations » activé : particules affichées sans mouvement
    const reduceMotion = prefersReducedMotion()
    const onResize = () => {
      resizeCanvas()
      if (reduceMotion) draw()
    }
    window.addEventListener('resize', onResize)

    if (reduceMotion) draw()
    else animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  )
}
