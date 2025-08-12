'use client'

import { Button } from '@/components/ui/button'
import { CandidateData } from '@/lib/types'
import { Download } from 'lucide-react'

interface PDFExportProps {
  candidate: CandidateData
}

export function PDFExport({ candidate }: PDFExportProps) {
  const generatePDF = async () => {
    // Create a simplified HTML version for PDF export
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Skill Assessment Report - ${candidate.name}</title>
          <style>
            body { font-family: system-ui, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .candidate-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
            .skill-item { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
            .score { font-weight: bold; color: #2563eb; }
            .integrity-section { margin-top: 20px; padding: 15px; background: #fef2f2; border-radius: 8px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Skill Assessment Report</h1>
            <h2>${candidate.name}</h2>
            <p>${candidate.position}</p>
          </div>
          
          <div class="candidate-info">
            <h3>Performance Summary</h3>
            <p><strong>Overall Score:</strong> ${Math.round(candidate.skills.reduce((sum, skill) => sum + skill.score, 0) / candidate.skills.length)}%</p>
            <p><strong>Average Time to Solution:</strong> ${candidate.avgTimeToSolution} minutes</p>
            <p><strong>Success Rate:</strong> ${candidate.successRate}%</p>
            <p><strong>Retry Rate:</strong> ${candidate.retryRate}%</p>
          </div>
          
          <h3>Skill Breakdown</h3>
          <div class="skills-grid">
            ${candidate.skills.map(skill => `
              <div class="skill-item">
                <strong>${skill.name}</strong><br>
                <span class="score">${skill.score}%</span><br>
                <small>Consistency: ${skill.consistency}%</small>
              </div>
            `).join('')}
          </div>
          
          <div class="integrity-section">
            <h3>Evidence Integrity</h3>
            <p><strong>Total Submissions:</strong> ${candidate.submissions.length}</p>
            <p><strong>AI Suspected:</strong> ${candidate.submissions.filter(s => s.aiSuspected).length}</p>
            <p><strong>Verified Clean:</strong> ${candidate.submissions.filter(s => !s.aiSuspected).length}</p>
          </div>
          
          <h3>Top Submissions</h3>
          ${candidate.submissions
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(submission => `
              <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                <strong>${submission.skill}</strong> - Score: ${submission.score}%<br>
                <small>Time: ${submission.timeToSolution}min | Attempts: ${submission.attempts}</small>
              </div>
            `).join('')}
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} | Skill Radar Dashboard</p>
          </div>
        </body>
      </html>
    `

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print()
        printWindow.close()
      }
    }
  }

  return (
    <Button onClick={generatePDF} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  )
}
