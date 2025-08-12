'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CandidateData, SkillType } from '@/lib/types'
import { X, Clock, Code, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { TrendChart } from '@/components/trend-chart'

interface DrillDownPanelProps {
  skill: SkillType
  candidate: CandidateData
  onClose: () => void
}

export function DrillDownPanel({ skill, candidate, onClose }: DrillDownPanelProps) {
  const [selectedView, setSelectedView] = useState<'first' | 'last' | 'best'>('best')

  const skillData = candidate.skills.find(s => s.name === skill)
  const skillSubmissions = candidate.submissions.filter(s => s.skill === skill)
  
  const bestSubmission = skillSubmissions.reduce((best, current) => 
    current.score > best.score ? current : best, skillSubmissions[0]
  )
  
  const firstSubmission = skillSubmissions[0]
  const lastSubmission = skillSubmissions[skillSubmissions.length - 1]

  const getCurrentSubmission = () => {
    switch (selectedView) {
      case 'first': return firstSubmission
      case 'last': return lastSubmission
      case 'best': return bestSubmission
      default: return bestSubmission
    }
  }

  const currentSubmission = getCurrentSubmission()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {skill} - Detailed Evidence
            </CardTitle>
            <p className="text-muted-foreground">
              {candidate.name} • Score: {skillData?.score}%
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="evidence" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evidence" className="space-y-4">
              {/* View Selector */}
              <div className="flex gap-2">
                <Button
                  variant={selectedView === 'first' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('first')}
                >
                  First Attempt
                </Button>
                <Button
                  variant={selectedView === 'best' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('best')}
                >
                  Best Attempt
                </Button>
                <Button
                  variant={selectedView === 'last' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('last')}
                >
                  Latest Attempt
                </Button>
              </div>

              {/* Submission Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Submission
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentSubmission.timeToSolution}min
                      </Badge>
                      <Badge variant={currentSubmission.aiSuspected ? 'destructive' : 'secondary'}>
                        {currentSubmission.aiSuspected ? (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            AI Suspected
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Problem Statement</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {currentSubmission.problemStatement}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Solution Code</h4>
                      <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                        <code>{currentSubmission.code}</code>
                      </pre>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Performance Metrics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Score:</span>
                            <span className="font-medium">{currentSubmission.score}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Attempts:</span>
                            <span className="font-medium">{currentSubmission.attempts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Runtime:</span>
                            <span className="font-medium">{currentSubmission.runtime}ms</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Error Timeline</h4>
                        <div className="space-y-1 text-sm">
                          {currentSubmission.errors.map((error, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-muted-foreground">{error}</span>
                            </div>
                          ))}
                          {currentSubmission.errors.length === 0 && (
                            <p className="text-muted-foreground">No errors recorded</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <TrendChart submissions={skillSubmissions} />
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Improvement Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      +{Math.round(((lastSubmission.score - firstSubmission.score) / firstSubmission.score) * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From first to latest attempt
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Consistency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(skillData?.consistency || 0)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Performance stability
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reviewer Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidate.reviewerFeedback
                      .filter(feedback => feedback.skill === skill)
                      .map((feedback, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{feedback.reviewer}</span>
                            <span className="text-sm text-muted-foreground">
                              {feedback.timestamp}
                            </span>
                          </div>
                          <p className="text-sm">{feedback.comment}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">
                              Rating: {feedback.rating}/5
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {candidate.reviewerFeedback.filter(f => f.skill === skill).length === 0 && (
                      <p className="text-muted-foreground">No reviewer feedback available for this skill.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
