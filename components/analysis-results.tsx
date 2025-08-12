'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import { SkillRadarChart } from '@/components/skill-radar-chart'
import { SkillDrillDown } from '@/components/skill-drill-down'
import { PDFExportButton } from '@/components/pdf-export-button'
import { ResumeData, JobDescription, AnalysisResult, SkillMatch } from '@/lib/types'
import { ArrowLeft, FileText, Target, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Download } from 'lucide-react'

interface AnalysisResultsProps {
  result: AnalysisResult
  resumeData: ResumeData
  jobDescription: JobDescription
  onReset: () => void
}

export function AnalysisResults({ 
  result, 
  resumeData, 
  jobDescription, 
  onReset 
}: AnalysisResultsProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillMatch | null>(null)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onReset}>
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
        <div className="flex items-center space-x-4">
          <PDFExportButton 
            result={result}
            resumeData={resumeData}
            jobDescription={jobDescription}
          />
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Analysis Results</h1>
          <p className="text-xl text-muted-foreground">
            Here's how well your resume matches the job description
          </p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}%
                  </div>
                  <div className="text-lg text-muted-foreground">Overall Match</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {result.skillMatches.length}
                  </div>
                  <div className="text-lg text-muted-foreground">Skills Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {result.strongMatches.length}
                  </div>
                  <div className="text-lg text-muted-foreground">Strong Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Radar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Skill Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <SkillRadarChart 
                    skills={result.skillMatches}
                    onSkillClick={setSelectedSkill}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Click on any skill to see detailed analysis
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Match Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Match Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Strong Matches</span>
                  <Badge variant="default">{result.strongMatches.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Partial Matches</span>
                  <Badge variant="secondary">{result.partialMatches.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Missing Skills</span>
                  <Badge variant="destructive">{result.missingSkills.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Top Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.skillMatches
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5)
                    .map((skill) => (
                      <div key={skill.name} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <Badge variant={getScoreBadgeVariant(skill.score)}>
                          {skill.score}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Missing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.missingSkills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="outline" className="mr-2 mb-2">
                      {skill}
                    </Badge>
                  ))}
                  {result.missingSkills.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      +{result.missingSkills.length - 5} more
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Analysis Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Tabs defaultValue="improvements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
              <TabsTrigger value="matches">Skill Matches</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>
            
            <TabsContent value="improvements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    AI-Generated Improvement Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.improvements.map((improvement, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <h4 className="font-medium mb-2">{improvement.category}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {improvement.suggestion}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Impact: {improvement.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="matches" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.skillMatches.map((skill) => (
                  <Card key={skill.name} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedSkill(skill)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{skill.name}</h4>
                        <Badge variant={getScoreBadgeVariant(skill.score)}>
                          {skill.score}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {skill.evidence.slice(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="keywords" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Matched Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.map((keyword) => (
                        <Badge key={keyword} variant="default" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Missing Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.slice(0, 20).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Skill Drill-down Modal */}
      {selectedSkill && (
        <SkillDrillDown
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  )
}
