"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Target,
  BookOpen,
  Clock,
  TrendingUp,
  FileText,
  Award,
  Lightbulb,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { ref, get } from "firebase/database"
import { database } from "@/lib/firebase"
import { SmartLogo } from "@/components/smart-logo"

interface Essay {
  id: string
  title: string
  content: string
  wordCount: number
  timeSpent: number
  createdAt: number
  topic: {
    title: string
    category: string
    difficulty: string
    targetWords: string
    timeLimit: string
  }
}

interface Evaluation {
  overallScore: number
  breakdown: {
    grammar: number
    structure: number
    relevance: number
    wordCount: number
  }
  grammaticalErrors: Array<{
    type: string
    severity: "high" | "medium" | "low"
    quote: string
    correction: string
    explanation: string
    position: string
  }>
  feedback: string | {
    strengths: string[]
    improvements: string[]
    suggestions: string[]
    summary?: string
  }
  strengths: string[]
  improvements: string[]
  wordCount: number
  createdAt: number
}

export default function EvaluationPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [essay, setEssay] = useState<Essay | null>(null)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to extract feedback text from different data structures
  const getFeedbackText = (feedback: any): string => {
    if (typeof feedback === 'string') {
      return feedback
    }
    if (feedback && typeof feedback === 'object') {
      return feedback.summary || feedback.feedback || "No feedback available"
    }
    return "No feedback available"
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
      return
    }

    if (user && params.id) {
      loadEvaluationData()
    }
  }, [user, authLoading, params.id, router])

  const loadEvaluationData = async () => {
    if (!params.id || !user) return

    try {
      setError(null)
      console.log("Loading evaluation data for essay:", params.id)

      // Load essay data
      const essayRef = ref(database, `essays/${params.id}`)
      const essaySnapshot = await get(essayRef)

      if (!essaySnapshot.exists()) {
        setError("Essay not found")
        return
      }

      const essayData = essaySnapshot.val()

      // Check if user owns this essay
      if (essayData.userId !== user.uid) {
        setError("You don't have permission to view this essay")
        return
      }

      setEssay({
        id: params.id as string,
        ...essayData,
      })

      // Load evaluation data
      const evaluationsRef = ref(database, "evaluations")
      const evaluationsSnapshot = await get(evaluationsRef)

      if (evaluationsSnapshot.exists()) {
        let evaluationData: any = null
        evaluationsSnapshot.forEach((childSnapshot) => {
          const evaluation = childSnapshot.val()
          if (evaluation.essayId === params.id) {
            evaluationData = evaluation
          }
        })

        if (evaluationData) {
          console.log("Raw evaluation data:", evaluationData)
          
          // Ensure the evaluation data has the expected structure
          const sanitizedEvaluation = {
            overallScore: evaluationData.overallScore || 0,
            breakdown: {
              grammar: evaluationData.breakdown?.grammar || 0,
              structure: evaluationData.breakdown?.structure || 0,
              relevance: evaluationData.breakdown?.relevance || 0,
              wordCount: evaluationData.breakdown?.wordCount || 0,
            },
            grammaticalErrors: Array.isArray(evaluationData.grammaticalErrors) ? evaluationData.grammaticalErrors : [],
            feedback: evaluationData.feedback || "No feedback available",
            // Handle both old and new data structures for strengths and improvements
            strengths: Array.isArray(evaluationData.strengths) 
              ? evaluationData.strengths 
              : Array.isArray(evaluationData.feedback?.strengths) 
                ? evaluationData.feedback.strengths 
                : [],
            improvements: Array.isArray(evaluationData.improvements) 
              ? evaluationData.improvements 
              : Array.isArray(evaluationData.feedback?.improvements) 
                ? evaluationData.feedback.improvements 
                : [],
            wordCount: evaluationData.wordCount || 0,
            createdAt: evaluationData.createdAt || Date.now(),
          }
          
          console.log("Sanitized evaluation data:", sanitizedEvaluation)
          console.log("Strengths type:", typeof sanitizedEvaluation.strengths, "Value:", sanitizedEvaluation.strengths)
          console.log("Improvements type:", typeof sanitizedEvaluation.improvements, "Value:", sanitizedEvaluation.improvements)
          setEvaluation(sanitizedEvaluation)
        } else {
          setError("Evaluation not found for this essay")
        }
      } else {
        setError("No evaluations found")
      }
    } catch (error: any) {
      console.error("Error loading evaluation data:", error)
      setError("Failed to load evaluation data")
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-destructive bg-destructive/10 border-destructive/20"
      case "medium":
        return "text-foreground bg-secondary border-border"
      case "low":
        return "text-foreground bg-secondary border-border"
      default:
        return "text-muted-foreground bg-secondary border-border"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return XCircle
      case "medium":
        return AlertTriangle
      case "low":
        return CheckCircle
      default:
        return AlertTriangle
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-foreground"
    if (percentage >= 60) return "text-foreground"
    return "text-destructive"
  }

  const getGradeFromScore = (score: number) => {
    if (score >= 90) return "A+"
    if (score >= 85) return "A"
    if (score >= 80) return "A-"
    if (score >= 75) return "B+"
    if (score >= 70) return "B"
    if (score >= 65) return "B-"
    if (score >= 60) return "C+"
    if (score >= 55) return "C"
    if (score >= 50) return "C-"
    return "D"
  }

  // Helper function to safely render arrays
  const renderArrayItems = (items: any, renderItem: (item: any, index: number) => React.ReactNode, emptyMessage: string) => {
    // Additional safety check for nested objects
    if (items && typeof items === 'object' && !Array.isArray(items)) {
      console.warn('Items is an object, not an array:', items)
      // Try to extract arrays from common nested structures
      const itemsObj = items as any
      if (itemsObj.strengths && Array.isArray(itemsObj.strengths)) {
        items = itemsObj.strengths
      } else if (itemsObj.improvements && Array.isArray(itemsObj.improvements)) {
        items = itemsObj.improvements
      } else {
        return <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      }
    }
    
    if (!Array.isArray(items) || items.length === 0) {
      return <p className="text-muted-foreground text-sm">{emptyMessage}</p>
    }
    
    return (
      <ul className="space-y-2">
        {items.map((item, index) => {
          // Ensure item is a string or can be converted to string
          const displayText = typeof item === 'string' ? item : String(item || 'Unknown')
          return renderItem(displayText, index)
        })}
      </ul>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground animate-pulse">Loading evaluation...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/dashboard">
            <Button className="minimal-button">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!essay || !evaluation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">No data available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-colors ${"bg-card/80 backdrop-blur border-b" 
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* brand mark kept minimal */}
            <span className="text-lg md:text-xl font-medium">Oasis</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/write" className="text-muted-foreground hover:text-foreground transition-colors">
              Write
            </Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
              Progress
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4 animate-fade-in">
            <div className="flex-1">
              <h1 className="text-3xl font-light text-foreground mb-2">{essay.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {essay.wordCount} words
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {Math.floor(essay.timeSpent / 60)}m {essay.timeSpent % 60}s
                </span>
                <Badge variant="secondary" className="bg-secondary text-foreground">
                  {essay.topic?.category || "Unknown"}
                </Badge>
                <Badge variant="outline" className="border-border text-foreground">
                  {essay.topic?.difficulty || "Unknown"}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-light text-foreground mb-1">{evaluation.overallScore}</div>
              <div className="text-lg font-medium text-muted-foreground">{getGradeFromScore(evaluation.overallScore)}</div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-2xl font-light text-foreground mb-1">{evaluation.breakdown?.grammar || 0}</div>
              <div className="text-sm text-muted-foreground">Grammar</div>
              <div className="text-xs text-muted-foreground">out of 20</div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-2xl font-light text-foreground mb-1">{evaluation.breakdown?.structure || 0}</div>
              <div className="text-sm text-muted-foreground">Structure</div>
              <div className="text-xs text-muted-foreground">out of 20</div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-2xl font-light text-foreground mb-1">{evaluation.breakdown?.relevance || 0}</div>
              <div className="text-sm text-muted-foreground">Relevance</div>
              <div className="text-xs text-muted-foreground">out of 30</div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-2xl font-light text-foreground mb-1">{evaluation.breakdown?.wordCount || 0}</div>
              <div className="text-sm text-muted-foreground">Word Count</div>
              <div className="text-xs text-muted-foreground">out of 10</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feedback" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="feedback" className="data-[state=active]:bg-background">
              Feedback
            </TabsTrigger>
            <TabsTrigger value="errors" className="data-[state=active]:bg-background">
              Grammar Errors
            </TabsTrigger>
            <TabsTrigger value="essay" className="data-[state=active]:bg-background">
              Your Essay
            </TabsTrigger>
            <TabsTrigger value="topic" className="data-[state=active]:bg-background">
              Topic Details
            </TabsTrigger>
          </TabsList>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Feedback */}
              <Card className="minimal-card">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg font-medium">Overall Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{getFeedbackText(evaluation.feedback)}</p>
                </CardContent>
              </Card>

              {/* Strengths & Improvements */}
              <div className="space-y-6">
                <Card className="minimal-card bg-secondary">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg font-medium">Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderArrayItems(
                      evaluation.strengths || [],
                      (strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-sm">{strength}</span>
                        </li>
                      ),
                      "No specific strengths identified"
                    )}
                  </CardContent>
                </Card>

                <Card className="minimal-card bg-secondary">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg font-medium">Areas for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderArrayItems(
                      evaluation.improvements || [],
                      (improvement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <TrendingUp className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-sm">{improvement}</span>
                        </li>
                      ),
                      "No specific improvements identified"
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Grammar Errors Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-foreground text-lg font-medium">
                  Grammatical Errors ({(evaluation.grammaticalErrors || []).length})
                </CardTitle>
                <CardDescription>Detailed analysis of grammar, spelling, and style issues</CardDescription>
              </CardHeader>
              <CardContent>
                {evaluation.grammaticalErrors && evaluation.grammaticalErrors.length > 0 ? (
                  <div className="space-y-4">
                    {evaluation.grammaticalErrors.map((error, index) => {
                      const SeverityIcon = getSeverityIcon(error.severity)
                      return (
                        <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(error.severity)}`}>
                          <div className="flex items-start space-x-3">
                            <SeverityIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium capitalize text-foreground">{error.type?.replace("-", " ") || "Unknown"}</h4>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    error.severity === "high"
                                      ? "border-destructive/30 text-destructive"
                                      : error.severity === "medium"
                                        ? "border-border text-foreground"
                                        : "border-border text-foreground"
                                  }`}
                                >
                                  {error.severity || "unknown"}
                                </Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-foreground">Original: </span>
                                  <span className="bg-destructive/10 px-1 rounded text-foreground">{error.quote || "N/A"}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">Correction: </span>
                                  <span className="bg-secondary px-1 rounded text-foreground">{error.correction || "N/A"}</span>
                                </div>
                                <p className="text-muted-foreground">{error.explanation || "No explanation provided"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No grammatical errors found! Excellent work!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Essay Tab */}
          <TabsContent value="essay" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-foreground text-lg font-medium">Your Essay</CardTitle>
                <CardDescription>
                  {essay.wordCount} words • Written in {Math.floor(essay.timeSpent / 60)} minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">{essay.content}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Topic Details Tab */}
          <TabsContent value="topic" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-foreground text-lg font-medium">Essay Topic</CardTitle>
                <CardDescription>The prompt you were asked to respond to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Topic</h3>
                    <p className="text-foreground">{essay.topic?.title || "No topic available"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Category</h4>
                      <Badge variant="secondary" className="bg-secondary text-foreground">
                        {essay.topic?.category || "Unknown"}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Difficulty</h4>
                      <Badge variant="outline" className="border-border text-foreground">
                        {essay.topic?.difficulty || "Unknown"}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Target Length</h4>
                      <span className="text-sm text-muted-foreground">{essay.topic?.targetWords || "Unknown"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-12 pt-8 border-t border-border">
          <Link href="/write">
            <Button className="minimal-button">Write Another Essay</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent transition-colors">
              View Progress
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
