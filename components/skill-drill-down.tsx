'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SkillMatch } from '@/lib/types'
import { X, Target, FileText, Lightbulb } from 'lucide-react'

interface SkillDrillDownProps {
  skill: SkillMatch
  onClose: () => void
}

export function SkillDrillDown({ skill, onClose }: SkillDrillDownProps) {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                {skill.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getScoreBadgeVariant(skill.score)} className="text-lg px-3 py-1">
                  {skill.score}% Match
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Relevance: {skill.relevance}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Evidence from Resume */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Evidence from Resume
              </h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">
                  {skill.evidence}
                </p>
              </div>
            </div>

            {/* Job Description Requirements */}
            <div>
              <h4 className="font-semibold mb-3">Job Description Requirements</h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">
                  {skill.jobRequirement}
                </p>
              </div>
            </div>

            {/* Match Analysis */}
            <div>
              <h4 className="font-semibold mb-3">Match Analysis</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Keyword Match</span>
                  <Badge variant="outline">{skill.keywordMatch}%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Context Relevance</span>
                  <Badge variant="outline">{skill.contextMatch}%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Experience Level</span>
                  <Badge variant="outline">{skill.experienceLevel}</Badge>
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            {skill.suggestions && skill.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Improvement Suggestions
                </h4>
                <div className="space-y-2">
                  {skill.suggestions.map((suggestion, index) => (
                    <div key={index} className="border-l-4 border-primary pl-3 py-2">
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Keywords */}
            {skill.relatedKeywords && skill.relatedKeywords.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Related Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {skill.relatedKeywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
