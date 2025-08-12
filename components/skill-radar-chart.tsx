'use client'

import { useEffect, useRef } from 'react'
import { SkillMatch } from '@/lib/types'

interface SkillRadarChartProps {
  skills: SkillMatch[]
  onSkillClick: (skill: SkillMatch) => void
}

export function SkillRadarChart({ skills, onSkillClick }: SkillRadarChartProps) {
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
    const radius = Math.min(centerX, centerY) - 80

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Get theme colors
    const isDark = document.documentElement.classList.contains('dark')
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    const textColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
    const primaryColor = 'hsl(221.2, 83.2%, 53.3%)'

    // Draw grid circles
    const gridLevels = 5
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    for (let i = 1; i <= gridLevels; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / gridLevels, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw percentage labels
    ctx.fillStyle = textColor
    ctx.font = '12px system-ui'
    ctx.textAlign = 'center'
    for (let i = 1; i <= gridLevels; i++) {
      const labelRadius = (radius * i) / gridLevels
      const percentage = (100 * i) / gridLevels
      ctx.fillText(`${percentage}%`, centerX + labelRadius + 10, centerY - 5)
    }

    if (skills.length === 0) return

    // Draw spokes and labels
    const angleStep = (2 * Math.PI) / skills.length
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const x1 = centerX + Math.cos(angle) * radius
      const y1 = centerY + Math.sin(angle) * radius

      // Draw spoke
      ctx.strokeStyle = gridColor
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x1, y1)
      ctx.stroke()

      // Draw label
      const labelDistance = radius + 40
      const labelX = centerX + Math.cos(angle) * labelDistance
      const labelY = centerY + Math.sin(angle) * labelDistance
      
      ctx.fillStyle = textColor
      ctx.font = 'bold 14px system-ui'
      
      // Multi-line text for long skill names
      const words = skill.name.split(' ')
      if (words.length > 1 && skill.name.length > 12) {
        ctx.fillText(words[0], labelX, labelY - 8)
        ctx.fillText(words.slice(1).join(' '), labelX, labelY + 8)
      } else {
        ctx.fillText(skill.name, labelX, labelY)
      }

      // Draw score
      ctx.font = '12px system-ui'
      ctx.fillStyle = skill.score >= 80 ? '#22c55e' : skill.score >= 60 ? '#eab308' : '#ef4444'
      ctx.fillText(`${skill.score}%`, labelX, labelY + 20)
    })

    // Draw data polygon
    ctx.beginPath()
    ctx.fillStyle = isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'
    ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.6)'
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
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fillStyle = skill.score >= 80 ? '#22c55e' : skill.score >= 60 ? '#eab308' : '#ef4444'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Add click handler
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Check which skill area was clicked
      skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2
        const labelDistance = radius + 40
        const labelX = centerX + Math.cos(angle) * labelDistance
        const labelY = centerY + Math.sin(angle) * labelDistance

        const distance = Math.sqrt((x - labelX) ** 2 + (y - labelY) ** 2)
        if (distance < 40) {
          onSkillClick(skill)
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
