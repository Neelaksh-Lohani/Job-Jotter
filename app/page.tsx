'use client'

import { useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { LandingPage } from '@/components/landing-page'
import { UploadSection } from '@/components/upload-section'
import { AnalysisResults } from '@/components/analysis-results'
import { ResumeData, JobDescription, AnalysisResult } from '@/lib/types'
import { analyzeResumeMatch } from '@/lib/analysis-engine'

type AppState = 'landing' | 'upload' | 'results'

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('landing')
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleStartAnalysis = () => {
    setCurrentState('upload')
  }

  const handleAnalyze = async (resume: ResumeData, jd: JobDescription) => {
    setIsAnalyzing(true)
    setResumeData(resume)
    setJobDescription(jd)
    
    // Simulate analysis processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const result = analyzeResumeMatch(resume, jd)
    setAnalysisResult(result)
    setCurrentState('results')
    setIsAnalyzing(false)
  }

  const handleReset = () => {
    setCurrentState('landing')
    setResumeData(null)
    setJobDescription(null)
    setAnalysisResult(null)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {currentState === 'landing' && (
          <LandingPage onStartAnalysis={handleStartAnalysis} />
        )}
        
        {currentState === 'upload' && (
          <UploadSection 
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            onBack={handleReset}
          />
        )}
        
        {currentState === 'results' && analysisResult && resumeData && jobDescription && (
          <AnalysisResults 
            result={analysisResult}
            resumeData={resumeData}
            jobDescription={jobDescription}
            onReset={handleReset}
          />
        )}
      </div>
    </ThemeProvider>
  )
}
