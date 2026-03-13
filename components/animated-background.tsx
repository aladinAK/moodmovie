"use client"

import { useEffect, useRef } from "react"

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
    
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    
    // Création des particules
    const particles: Particle[] = []
    const particleCount = 100
    
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      
      constructor() {
        // Utiliser l'opérateur d'assertion non-null (!) pour garantir à TypeScript que canvas n'est pas null
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 2 + 0.1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.5 + 0.1
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        // Protection supplémentaire contre les erreurs TypeScript
        if (!canvas) return;
        
        // Vérification des limites du canvas
        if (this.x > canvas.width || this.x < 0) {
          this.x = Math.random() * canvas.width
        }
        if (this.y > canvas.height || this.y < 0) {
          this.y = Math.random() * canvas.height
        }
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Initialiser les particules
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
    
    // Fonction d'animation
    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  )
}