'use client'

import { Button } from '@/components/ui/button'
import { ResumeData, JobDescription, AnalysisResult } from '@/lib/types'
import { Download } from 'lucide-react'

interface PDFExportButtonProps {
  result: AnalysisResult
  resumeData: ResumeData
  jobDescription: JobDescription
}

export function PDFExportButton({ result, resumeData, jobDescription }: PDFExportButtonProps) {
  const generatePDF = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>JobJotter Analysis Report</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              margin: 0; 
              padding: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
            }
            .logo { 
              font-size: 24px; 
              font-weight: bold; 
              color: #3b82f6; 
              margin-bottom: 10px;
            }
            .score-section { 
              background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
              color: white; 
              padding: 20px; 
              border-radius: 12px; 
              margin-bottom: 30px; 
              text-align: center;
            }
            .overall-score { 
              font-size: 48px; 
              font-weight: bold; 
              margin-bottom: 10px;
            }
            .skills-grid { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 15px; 
              margin-bottom: 30px;
            }
            .skill-item { 
              padding: 15px; 
              border: 1px solid #e5e7eb; 
              border-radius: 8px; 
              background: #f9fafb;
            }
            .skill-name { 
              font-weight: bold; 
              margin-bottom: 5px;
            }
            .skill-score { 
              font-size: 18px; 
              font-weight: bold;
            }
            .score-excellent { color: #22c55e; }
            .score-good { color: #eab308; }
            .score-poor { color: #ef4444; }
            .section { 
              margin-bottom: 30px;
            }
            .section-title { 
              font-size: 20px; 
              font-weight: bold; 
              margin-bottom: 15px; 
              color: #1f2937;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
            }
            .improvement-item { 
              margin-bottom: 15px; 
              padding: 15px; 
              background: #fef3c7; 
              border-left: 4px solid #f59e0b; 
              border-radius: 4px;
            }
            .improvement-category { 
              font-weight: bold; 
              margin-bottom: 5px;
            }
            .keywords { 
              display: flex; 
              flex-wrap: wrap; 
              gap: 8px;
            }
            .keyword { 
              background: #dbeafe; 
              color: #1e40af; 
              padding: 4px 8px; 
              border-radius: 4px; 
              font-size: 12px;
            }
            .missing-keyword { 
              background: #fee2e2; 
              color: #dc2626;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #6b7280; 
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            .two-column { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px;
            }
            @media print {
              body { margin: 0; }
              .score-section { background: #3b82f6 !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">JobJotter</div>
            <h1>Resume Analysis Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="score-section">
            <div class="overall-score">${result.overallScore}%</div>
            <div>Overall Job Match Score</div>
            <div style="margin-top: 15px; display: flex; justify-content: center; gap: 30px;">
              <div>
                <div style="font-size: 24px; font-weight: bold;">${result.skillMatches.length}</div>
                <div>Skills Analyzed</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: bold;">${result.strongMatches.length}</div>
                <div>Strong Matches</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: bold;">${result.missingSkills.length}</div>
                <div>Missing Skills</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Skill Analysis</div>
            <div class="skills-grid">
              ${result.skillMatches.map(skill => `
                <div class="skill-item">
                  <div class="skill-name">${skill.name}</div>
                  <div class="skill-score ${skill.score >= 80 ? 'score-excellent' : skill.score >= 60 ? 'score-good' : 'score-poor'}">
                    ${skill.score}% Match
                  </div>
                  <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">
                    ${skill.evidence.substring(0, 100)}...
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="two-column">
            <div class="section">
              <div class="section-title">Matched Keywords</div>
              <div class="keywords">
                ${result.matchedKeywords.slice(0, 20).map(keyword => `
                  <span class="keyword">${keyword}</span>
                `).join('')}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Missing Keywords</div>
              <div class="keywords">
                ${result.missingKeywords.slice(0, 20).map(keyword => `
                  <span class="keyword missing-keyword">${keyword}</span>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">AI-Generated Improvement Recommendations</div>
            ${result.improvements.map(improvement => `
              <div class="improvement-item">
                <div class="improvement-category">${improvement.category}</div>
                <div>${improvement.suggestion}</div>
                <div style="margin-top: 8px;">
                  <span style="background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 3px; font-size: 11px;">
                    Impact: ${improvement.impact}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>This report was generated by JobJotter - AI-Powered Resume Analysis</p>
            <p>Resume: ${resumeData.fileName} | Analysis Date: ${new Date().toLocaleDateString()}</p>
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
