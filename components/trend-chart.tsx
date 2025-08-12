'use client'

import { useEffect, useRef } from 'react'
import { SubmissionData } from '@/lib/types'

interface TrendChartProps {
  submissions: SubmissionData[]
}

export function TrendChart({ submissions }: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const padding = 40
    const chartWidth = rect.width - 2 * padding
    const chartHeight = rect.height - 2 * padding

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    if (submissions.length === 0) return

    // Draw axes
    ctx.strokeStyle = 'hsl(var(--border))'
    ctx.lineWidth = 1
    
    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, rect.height - padding)
    ctx.stroke()
    
    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, rect.height - padding)
    ctx.lineTo(rect.width - padding, rect.height - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = 'hsl(var(--border))'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(rect.width - padding, y)
      ctx.stroke()
    }

    // Draw labels
    ctx.fillStyle = 'hsl(var(--muted-foreground))'
    ctx.font = '12px system-ui'
    ctx.textAlign = 'right'
    for (let i = 0; i <= 5; i++) {
      const y = rect.height - padding - (chartHeight * i) / 5
      const value = (100 * i) / 5
      ctx.fillText(`${value}%`, padding - 10, y + 4)
    }

    // Draw trend line
    if (submissions.length > 1) {
      ctx.strokeStyle = 'hsl(var(--primary))'
      ctx.lineWidth = 2
      ctx.beginPath()

      submissions.forEach((submission, index) => {
        const x = padding + (chartWidth * index) / (submissions.length - 1)
        const y = rect.height - padding - (chartHeight * submission.score) / 100

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      ctx.fillStyle = 'hsl(var(--primary))'
      submissions.forEach((submission, index) => {
        const x = padding + (chartWidth * index) / (submissions.length - 1)
        const y = rect.height - padding - (chartHeight * submission.score) / 100

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
    }

    // Draw attempt labels
    ctx.fillStyle = 'hsl(var(--muted-foreground))'
    ctx.textAlign = 'center'
    submissions.forEach((submission, index) => {
      const x = padding + (chartWidth * index) / Math.max(submissions.length - 1, 1)
      ctx.fillText(`#${index + 1}`, x, rect.height - 10)
    })

  }, [submissions])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
