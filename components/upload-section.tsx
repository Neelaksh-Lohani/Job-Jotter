'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import { FileUpload } from '@/components/file-upload'
import { ResumeData, JobDescription } from '@/lib/types'
import { parseResumeFile } from '@/lib/resume-parser'
import { ArrowLeft, Zap, FileText, Briefcase } from 'lucide-react'

interface UploadSectionProps {
  onAnalyze: (resume: ResumeData, jd: JobDescription) => void
  isAnalyzing: boolean
  onBack: () => void
}

export function UploadSection({ onAnalyze, isAnalyzing, onBack }: UploadSectionProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescriptionText, setJobDescriptionText] = useState('')
  const [isParsingResume, setIsParsingResume] = useState(false)

  const handleFileUpload = useCallback(async (file: File) => {
    setResumeFile(file)
    setIsParsingResume(true)
    
    try {
      const parsedText = await parseResumeFile(file)
      setResumeText(parsedText)
    } catch (error) {
      console.error('Error parsing resume:', error)
      setResumeText('Error parsing resume. Please try again or paste your resume text manually.')
    } finally {
      setIsParsingResume(false)
    }
  }, [])

  const handleAnalyze = () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) return

    const resumeData: ResumeData = {
      fileName: resumeFile?.name || 'Manual Input',
      content: resumeText,
      parsedAt: new Date().toISOString()
    }

    const jobDescription: JobDescription = {
      content: jobDescriptionText,
      title: 'Job Position', // Could be extracted from JD
      company: 'Company Name' // Could be extracted from JD
    }

    onAnalyze(resumeData, jobDescription)
  }

  const canAnalyze = resumeText.trim() && jobDescriptionText.trim() && !isParsingResume

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              JobJotter
            </span>
          </div>
        </div>
        <ThemeToggle />
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Upload & Analyze</h1>
          <p className="text-xl text-muted-foreground">
            Upload your resume and job description to get instant insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Resume Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload
                  onFileUpload={handleFileUpload}
                  isProcessing={isParsingResume}
                  acceptedTypes={['.pdf', '.docx', '.doc']}
                />
                
                {resumeFile && (
                  <div className="text-sm text-muted-foreground">
                    Uploaded: {resumeFile.name}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Parsed Resume Content (editable)
                  </label>
                  <Textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Your resume content will appear here after upload, or you can paste it manually..."
                    className="min-h-[200px] font-mono text-sm"
                    disabled={isParsingResume}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Paste Job Description
                  </label>
                  <Textarea
                    value={jobDescriptionText}
                    onChange={(e) => setJobDescriptionText(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="min-h-[300px]"
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Include requirements, responsibilities, and desired skills for best results.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analysis Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Analyze Match
              </>
            )}
          </Button>
          
          {!canAnalyze && !isAnalyzing && (
            <p className="text-sm text-muted-foreground mt-2">
              Please upload a resume and add a job description to continue
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
