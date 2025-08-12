export interface ResumeData {
  fileName: string
  content: string
  parsedAt: string
}

export interface JobDescription {
  content: string
  title: string
  company: string
}

export interface SkillMatch {
  name: string
  score: number
  relevance: 'high' | 'medium' | 'low'
  evidence: string
  jobRequirement: string
  keywordMatch: number
  contextMatch: number
  experienceLevel: string
  suggestions?: string[]
  relatedKeywords?: string[]
}

export interface ImprovementSuggestion {
  category: string
  suggestion: string
  impact: 'high' | 'medium' | 'low'
}

export interface AnalysisResult {
  overallScore: number
  skillMatches: SkillMatch[]
  strongMatches: SkillMatch[]
  partialMatches: SkillMatch[]
  missingSkills: string[]
  matchedKeywords: string[]
  missingKeywords: string[]
  improvements: ImprovementSuggestion[]
  analysisDate: string
}
