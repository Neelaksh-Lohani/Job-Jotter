import { ResumeData, JobDescription, AnalysisResult, SkillMatch, ImprovementSuggestion } from './types'

export function analyzeResumeMatch(resume: ResumeData, jobDescription: JobDescription): AnalysisResult {
  const resumeText = resume.content.toLowerCase()
  const jdText = jobDescription.content.toLowerCase()
  
  // Extract skills and keywords
  const skillMatches = extractAndMatchSkills(resumeText, jdText)
  const { matchedKeywords, missingKeywords } = analyzeKeywords(resumeText, jdText)
  
  // Calculate overall score
  const overallScore = calculateOverallScore(skillMatches, matchedKeywords, missingKeywords)
  
  // Categorize matches
  const strongMatches = skillMatches.filter(skill => skill.score >= 80)
  const partialMatches = skillMatches.filter(skill => skill.score >= 40 && skill.score < 80)
  const missingSkills = extractMissingSkills(jdText, resumeText)
  
  // Generate improvement suggestions
  const improvements = generateImprovements(skillMatches, missingSkills, matchedKeywords, missingKeywords)
  
  return {
    overallScore,
    skillMatches,
    strongMatches,
    partialMatches,
    missingSkills,
    matchedKeywords,
    missingKeywords,
    improvements,
    analysisDate: new Date().toISOString()
  }
}

function extractAndMatchSkills(resumeText: string, jdText: string): SkillMatch[] {
  const commonSkills = [
    'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'sql',
    'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum', 'html', 'css',
    'mongodb', 'postgresql', 'redis', 'graphql', 'rest api', 'microservices',
    'vue.js', 'angular', 'express', 'django', 'flask', 'spring boot',
    'product management', 'ux design', 'ui design', 'figma', 'sketch',
    'user research', 'prototyping', 'wireframing', 'a/b testing',
    'data analysis', 'machine learning', 'artificial intelligence',
    'devops', 'ci/cd', 'jenkins', 'terraform', 'ansible'
  ]
  
  const skillMatches: SkillMatch[] = []
  
  commonSkills.forEach(skill => {
    const skillInResume = resumeText.includes(skill)
    const skillInJD = jdText.includes(skill)
    
    if (skillInResume || skillInJD) {
      const score = calculateSkillScore(skill, resumeText, jdText)
      const evidence = extractEvidence(skill, resumeText)
      const jobRequirement = extractJobRequirement(skill, jdText)
      
      skillMatches.push({
        name: skill.charAt(0).toUpperCase() + skill.slice(1),
        score,
        relevance: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
        evidence,
        jobRequirement,
        keywordMatch: skillInResume && skillInJD ? 100 : skillInResume ? 50 : 0,
        contextMatch: score,
        experienceLevel: determineExperienceLevel(skill, resumeText),
        suggestions: generateSkillSuggestions(skill, score, skillInResume, skillInJD),
        relatedKeywords: getRelatedKeywords(skill)
      })
    }
  })
  
  return skillMatches.sort((a, b) => b.score - a.score).slice(0, 12)
}

function calculateSkillScore(skill: string, resumeText: string, jdText: string): number {
  const skillInResume = resumeText.includes(skill)
  const skillInJD = jdText.includes(skill)
  
  if (!skillInResume && !skillInJD) return 0
  if (!skillInResume && skillInJD) return 0
  if (skillInResume && !skillInJD) return 30
  
  // Both present - calculate context score
  const resumeContext = getSkillContext(skill, resumeText)
  const jdContext = getSkillContext(skill, jdText)
  
  const contextSimilarity = calculateContextSimilarity(resumeContext, jdContext)
  const experienceBonus = getExperienceBonus(skill, resumeText)
  
  return Math.min(100, 60 + contextSimilarity + experienceBonus)
}

function getSkillContext(skill: string, text: string): string {
  const skillIndex = text.indexOf(skill)
  if (skillIndex === -1) return ''
  
  const start = Math.max(0, skillIndex - 100)
  const end = Math.min(text.length, skillIndex + skill.length + 100)
  
  return text.substring(start, end)
}

function calculateContextSimilarity(context1: string, context2: string): number {
  const words1 = context1.split(/\s+/).filter(word => word.length > 3)
  const words2 = context2.split(/\s+/).filter(word => word.length > 3)
  
  const commonWords = words1.filter(word => words2.includes(word))
  const similarity = (commonWords.length / Math.max(words1.length, words2.length)) * 30
  
  return Math.round(similarity)
}

function getExperienceBonus(skill: string, resumeText: string): number {
  const experienceKeywords = ['senior', 'lead', 'expert', 'advanced', 'years', 'experience']
  const skillContext = getSkillContext(skill, resumeText)
  
  const hasExperience = experienceKeywords.some(keyword => skillContext.includes(keyword))
  return hasExperience ? 10 : 0
}

function extractEvidence(skill: string, resumeText: string): string {
  const skillContext = getSkillContext(skill, resumeText)
  const sentences = skillContext.split(/[.!?]+/)
  
  const relevantSentence = sentences.find(sentence => 
    sentence.toLowerCase().includes(skill) && sentence.length > 20
  )
  
  return relevantSentence?.trim() || `Experience with ${skill} mentioned in resume`
}

function extractJobRequirement(skill: string, jdText: string): string {
  const skillContext = getSkillContext(skill, jdText)
  const sentences = skillContext.split(/[.!?]+/)
  
  const relevantSentence = sentences.find(sentence => 
    sentence.toLowerCase().includes(skill) && sentence.length > 20
  )
  
  return relevantSentence?.trim() || `${skill} required for this position`
}

function determineExperienceLevel(skill: string, resumeText: string): string {
  const skillContext = getSkillContext(skill, resumeText)
  
  if (skillContext.includes('senior') || skillContext.includes('lead') || skillContext.includes('expert')) {
    return 'Senior'
  } else if (skillContext.includes('years') || skillContext.includes('experience')) {
    return 'Intermediate'
  } else {
    return 'Junior'
  }
}

function generateSkillSuggestions(skill: string, score: number, inResume: boolean, inJD: boolean): string[] {
  const suggestions: string[] = []
  
  if (!inResume && inJD) {
    suggestions.push(`Consider adding ${skill} experience to your resume`)
    suggestions.push(`Highlight any projects or coursework involving ${skill}`)
  } else if (score < 70 && inResume && inJD) {
    suggestions.push(`Provide more specific examples of ${skill} usage`)
    suggestions.push(`Quantify your achievements with ${skill}`)
    suggestions.push(`Mention the scale or complexity of ${skill} projects`)
  }
  
  return suggestions
}

function getRelatedKeywords(skill: string): string[] {
  const keywordMap: { [key: string]: string[] } = {
    'javascript': ['ES6', 'Node.js', 'npm', 'webpack', 'babel'],
    'react': ['JSX', 'Redux', 'hooks', 'components', 'Next.js'],
    'python': ['Django', 'Flask', 'pandas', 'numpy', 'pip'],
    'aws': ['EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation'],
    'docker': ['containers', 'Kubernetes', 'microservices', 'DevOps'],
    'sql': ['PostgreSQL', 'MySQL', 'database', 'queries', 'optimization']
  }
  
  return keywordMap[skill.toLowerCase()] || []
}

function analyzeKeywords(resumeText: string, jdText: string): { matchedKeywords: string[], missingKeywords: string[] } {
  const jdKeywords = extractKeywords(jdText)
  const resumeKeywords = extractKeywords(resumeText)
  
  const matchedKeywords = jdKeywords.filter(keyword => 
    resumeKeywords.some(rKeyword => rKeyword.includes(keyword) || keyword.includes(rKeyword))
  )
  
  const missingKeywords = jdKeywords.filter(keyword => 
    !resumeKeywords.some(rKeyword => rKeyword.includes(keyword) || keyword.includes(rKeyword))
  )
  
  return { matchedKeywords, missingKeywords }
}

function extractKeywords(text: string): string[] {
  const commonKeywords = [
    'agile', 'scrum', 'kanban', 'ci/cd', 'devops', 'microservices',
    'api', 'rest', 'graphql', 'database', 'cloud', 'security',
    'testing', 'debugging', 'optimization', 'scalability',
    'collaboration', 'leadership', 'mentoring', 'communication'
  ]
  
  return commonKeywords.filter(keyword => text.includes(keyword))
}

function extractMissingSkills(jdText: string, resumeText: string): string[] {
  const jdSkills = [
    'machine learning', 'data science', 'blockchain', 'mobile development',
    'ios', 'android', 'flutter', 'react native', 'vue.js', 'angular',
    'golang', 'rust', 'scala', 'kotlin', 'swift', 'c++', 'c#',
    'elasticsearch', 'kafka', 'rabbitmq', 'nginx', 'apache'
  ]
  
  return jdSkills.filter(skill => 
    jdText.includes(skill) && !resumeText.includes(skill)
  ).slice(0, 8)
}

function calculateOverallScore(skillMatches: SkillMatch[], matchedKeywords: string[], missingKeywords: string[]): number {
  const avgSkillScore = skillMatches.reduce((sum, skill) => sum + skill.score, 0) / skillMatches.length
  const keywordRatio = matchedKeywords.length / (matchedKeywords.length + missingKeywords.length)
  const keywordScore = keywordRatio * 100
  
  return Math.round((avgSkillScore * 0.7) + (keywordScore * 0.3))
}

function generateImprovements(
  skillMatches: SkillMatch[], 
  missingSkills: string[], 
  matchedKeywords: string[], 
  missingKeywords: string[]
): ImprovementSuggestion[] {
  const improvements: ImprovementSuggestion[] = []
  
  // Skill-based improvements
  const weakSkills = skillMatches.filter(skill => skill.score < 60)
  if (weakSkills.length > 0) {
    improvements.push({
      category: 'Skill Enhancement',
      suggestion: `Strengthen your ${weakSkills[0].name} section by adding specific projects, metrics, and technologies used. Consider mentioning the scale and impact of your work.`,
      impact: 'high'
    })
  }
  
  // Missing skills
  if (missingSkills.length > 0) {
    improvements.push({
      category: 'Skill Gaps',
      suggestion: `Consider adding experience with ${missingSkills.slice(0, 3).join(', ')} to better match job requirements. These skills appear in the job description but not in your resume.`,
      impact: 'high'
    })
  }
  
  // Keyword optimization
  if (missingKeywords.length > matchedKeywords.length) {
    improvements.push({
      category: 'Keyword Optimization',
      suggestion: `Include more industry-specific keywords such as ${missingKeywords.slice(0, 5).join(', ')}. This will improve ATS compatibility and recruiter visibility.`,
      impact: 'medium'
    })
  }
  
  // Quantification
  improvements.push({
    category: 'Impact Quantification',
    suggestion: 'Add more specific metrics and numbers to demonstrate the impact of your work. Include percentages, dollar amounts, user counts, or performance improvements.',
    impact: 'high'
  })
  
  // Technical depth
  improvements.push({
    category: 'Technical Detail',
    suggestion: 'Provide more technical depth in your project descriptions. Mention specific technologies, architectures, and methodologies you used.',
    impact: 'medium'
  })
  
  return improvements
}
