'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadarChart } from '@/components/radar-chart'
import { DrillDownPanel } from '@/components/drill-down-panel'
import { PDFExport } from '@/components/pdf-export'
import { CandidateData, SkillType } from '@/lib/types'
import { Download, AlertTriangle, CheckCircle } from 'lucide-react'

interface SkillRadarDashboardProps {
  candidate: CandidateData
}

export function SkillRadarDashboard({ candidate }: SkillRadarDashboardProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null)
  const [showDrillDown, setShowDrillDown] = useState(false)

  const handleSkillClick = (skill: SkillType) => {
    setSelectedSkill(skill)
    setShowDrillDown(true)
  }

  const handleCloseDrillDown = () => {
    setShowDrillDown(false)
    setSelectedSkill(null)
  }

  const overallScore = Math.round(
    candidate.skills.reduce((sum, skill) => sum + skill.score, 0) / candidate.skills.length
  )

  const aiSuspectedCount = candidate.submissions.filter(s => s.aiSuspected).length
  const totalSubmissions = candidate.submissions.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Radar Chart */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{candidate.name}</CardTitle>
                <p className="text-muted-foreground">{candidate.position}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{overallScore}%</div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <PDFExport candidate={candidate} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <RadarChart 
                skills={candidate.skills} 
                onSkillClick={handleSkillClick}
              />
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Click on any skill area to view detailed evidence
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Panel */}
      <div className="space-y-6">
        {/* Integrity Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Evidence Integrity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Submissions</span>
                <Badge variant="outline">{totalSubmissions}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Suspected</span>
                <Badge variant={aiSuspectedCount > 0 ? "destructive" : "secondary"}>
                  {aiSuspectedCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Verified Clean</span>
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  {totalSubmissions - aiSuspectedCount}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. Time to Solution</span>
                <span className="font-medium">{candidate.avgTimeToSolution}min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium">{candidate.successRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Retry Rate</span>
                <span className="font-medium">{candidate.retryRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {candidate.skills
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between">
                    <span className="text-sm">{skill.name}</span>
                    <Badge variant="outline">{skill.score}%</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drill-down Panel */}
      {showDrillDown && selectedSkill && (
        <DrillDownPanel
          skill={selectedSkill}
          candidate={candidate}
          onClose={handleCloseDrillDown}
        />
      )}
    </div>
  )
}
