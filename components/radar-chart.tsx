'use client'

import { useEffect, useRef } from 'react'
import { SkillData, SkillType } from '@/lib/types'

interface RadarChartProps {
  skills: SkillData[]
  onSkillClick: (skill: SkillType) => void
}

export function RadarChart({ skills, onSkillClick }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) - 60

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw grid circles
    const gridLevels = 5
    ctx.strokeStyle = 'hsl(var(--border))'
    ctx.lineWidth = 1
    for (let i = 1; i <= gridLevels; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / gridLevels, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw spokes and labels
    const angleStep = (2 * Math.PI) / skills.length
    ctx.fillStyle = 'hsl(var(--foreground))'
    ctx.font = '12px system-ui'
    ctx.textAlign = 'center'

    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const x1 = centerX + Math.cos(angle) * radius
      const y1 = centerY + Math.sin(angle) * radius

      // Draw spoke
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x1, y1)
      ctx.stroke()

      // Draw label
      const labelX = centerX + Math.cos(angle) * (radius + 30)
      const labelY = centerY + Math.sin(angle) * (radius + 30)
      ctx.fillText(skill.name, labelX, labelY + 4)
    })

    // Draw data polygon
    ctx.beginPath()
    ctx.fillStyle = 'hsla(var(--primary), 0.2)'
    ctx.strokeStyle = 'hsl(var(--primary))'
    ctx.lineWidth = 2

    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const distance = (radius * skill.score) / 100
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw data points
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const distance = (radius * skill.score) / 100
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = 'hsl(var(--primary))'
      ctx.fill()
    })

    // Add click handler
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Check which skill area was clicked
      skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2
        const labelX = centerX + Math.cos(angle) * (radius + 30)
        const labelY = centerY + Math.sin(angle) * (radius + 30)

        const distance = Math.sqrt((x - labelX) ** 2 + (y - labelY) ** 2)
        if (distance < 30) {
          onSkillClick(skill.name as SkillType)
        }
      })
    }

    canvas.addEventListener('click', handleClick)
    return () => canvas.removeEventListener('click', handleClick)
  }, [skills, onSkillClick])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
