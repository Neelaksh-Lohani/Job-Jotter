'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { ArrowDown, Zap, Target, BarChart3, FileText } from 'lucide-react'

interface LandingPageProps {
  onStartAnalysis: () => void
}

export function LandingPage({ onStartAnalysis }: LandingPageProps) {
  const scrollToExplore = () => {
    const exploreSection = document.getElementById('explore-section')
    exploreSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            JobJotter
          </span>
        </motion.div>
        <ThemeToggle />
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            Transform Your Resume Into Insights
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Instantly analyze how well your resume matches any job description. 
            Get actionable insights, skill gaps, and improvement recommendations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            onClick={onStartAnalysis}
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Analysis
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6"
            onClick={scrollToExplore}
          >
            Learn More
            <ArrowDown className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Floating Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: Target, title: 'Smart Matching', desc: 'AI-powered resume analysis' },
            { icon: BarChart3, title: 'Skill Radar', desc: 'Visual skill assessment' },
            { icon: FileText, title: 'Instant Reports', desc: 'Professional PDF exports' }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              className="bg-card/80 backdrop-blur-sm border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <feature.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Explore Section */}
      <section id="explore-section" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">How JobJotter Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI analyzes your resume against job descriptions to provide 
              actionable insights and improvement recommendations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Drop your PDF or DOCX file' },
              { step: '02', title: 'Add Job Description', desc: 'Paste or upload the JD' },
              { step: '03', title: 'AI Analysis', desc: 'Smart matching & skill extraction' },
              { step: '04', title: 'Get Insights', desc: 'Radar chart & improvement tips' }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              onClick={onStartAnalysis}
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
