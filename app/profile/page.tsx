"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenTool, TrendingUp, Award, Target, BarChart3, Clock, FileText, Calendar, Flame } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { ref, get, query, orderByChild, equalTo } from "firebase/database"
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
  }
}

interface Evaluation {
  id: string
  essayId: string
  overallScore: number
  breakdown: {
    grammar: number
    structure: number
    relevance: number
    wordCount: number
  }
  createdAt: number
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [essays, setEssays] = useState<Essay[]>([])
  const [evaluationsData, setEvaluationsData] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && !authLoading) {
      loadUserData()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading])

  const loadUserData = async () => {
    if (!user) return

    try {
      setError(null)
      console.log("Loading user data for:", user.uid)

      // Load user's essays
      const essaysRef = ref(database, "essays")
      const essaysQuery = query(essaysRef, orderByChild("userId"), equalTo(user.uid))
      const essaysSnapshot = await get(essaysQuery)

      const essaysData: Essay[] = []
      if (essaysSnapshot.exists()) {
        essaysSnapshot.forEach((childSnapshot) => {
          const essay = childSnapshot.val()
          essaysData.push({
            id: childSnapshot.key!,
            ...essay,
          })
        })
      }

      console.log("Loaded essays:", essaysData.length)
      setEssays(essaysData)

      // Load evaluations for user's essays
      const evaluationsRef = ref(database, "evaluations")
      const evaluationsSnapshot = await get(evaluationsRef)

      const evaluationsData: Evaluation[] = []
      if (evaluationsSnapshot.exists()) {
        const essayIds = essaysData.map((essay) => essay.id)
        evaluationsSnapshot.forEach((childSnapshot) => {
          const evaluation = childSnapshot.val()
          if (essayIds.includes(evaluation.essayId)) {
            evaluationsData.push({
              id: childSnapshot.key!,
              ...evaluation,
            })
          }
        })
      }

      console.log("Loaded evaluations:", evaluationsData.length)
      setEvaluationsData(evaluationsData)
    } catch (error) {
      console.error("Error loading user data:", error)
      setError("Failed to load user data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalEssays = essays.length
  const totalWords = essays.reduce((sum, essay) => sum + essay.wordCount, 0)
  const totalTimeSpent = essays.reduce((sum, essay) => sum + essay.timeSpent, 0)
  const averageScore =
    evaluationsData.length > 0
      ? Math.round(evaluationsData.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / evaluationsData.length)
      : 0

  // Generate progress data for charts
  const progressData = evaluationsData
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((evaluation, index) => ({
      essay: index + 1,
      score: evaluation.overallScore,
    }))

  // Get recent essays
  const recentEssays = essays
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10)

  // Calculate writing streak
  const calculateStreak = () => {
    if (essays.length === 0) return 0

    const sortedEssays = essays.sort((a, b) => b.createdAt - a.createdAt)
    let streak = 0
    let currentDate = new Date()

    for (const essay of sortedEssays) {
      const essayDate = new Date(essay.createdAt)
      const daysDiff = Math.floor((currentDate.getTime() - essayDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= streak + 1) {
        streak++
        currentDate = essayDate
      } else {
        break
      }
    }

    return streak
  }

  // Generate calendar data for the last 30 days
  const generateCalendarData = () => {
    const calendarData = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const essaysOnDate = essays.filter((essay) => {
        const essayDate = new Date(essay.createdAt)
        return essayDate.toDateString() === date.toDateString()
      })

      calendarData.push({
        date: date.toISOString().split("T")[0],
        count: essaysOnDate.length,
        essays: essaysOnDate,
      })
    }

    return calendarData
  }

  const calendarData = generateCalendarData()
  const writingStreak = calculateStreak()

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground animate-pulse">Loading your progress...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to view your progress.</p>
          <Link href="/auth/signin">
            <Button className="minimal-button">Sign In</Button>
          </Link>
        </div>
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
            <span className="text-lg md:text-xl font-medium">Oasis</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/write" className="text-muted-foreground hover:text-foreground transition-colors">
              Write
            </Link>
            <Link href="/profile" className="text-foreground font-medium">
              Progress
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/write">
              <Button className="minimal-button">Write Essay</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-light text-foreground mb-2">Your Writing Progress</h1>
          <p className="text-muted-foreground">Track your improvement and achievements over time</p>
          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Essays</p>
                  <p className="text-3xl font-light text-foreground">{totalEssays}</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                  <p className="text-3xl font-light text-foreground">{averageScore}</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Words</p>
                  <p className="text-3xl font-light text-foreground">{totalWords.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time Spent</p>
                  <p className="text-3xl font-light text-foreground">{Math.round(totalTimeSpent / 3600)}h</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Writing Streak</p>
                  <p className="text-3xl font-light text-foreground">{writingStreak}</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-background">
              Progress
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-background">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="essays" className="data-[state=active]:bg-background">
              Recent Essays
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card className="minimal-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center text-lg font-medium">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Category Performance
                  </CardTitle>
                  <CardDescription>Average scores by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {evaluationsData.length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries({
                        Grammar:
                          evaluationsData.reduce((sum, evaluation) => sum + evaluation.breakdown.grammar, 0) /
                          evaluationsData.length,
                        Structure:
                          evaluationsData.reduce((sum, evaluation) => sum + evaluation.breakdown.structure, 0) /
                          evaluationsData.length,
                        Relevance:
                          evaluationsData.reduce((sum, evaluation) => sum + evaluation.breakdown.relevance, 0) /
                          evaluationsData.length,
                      }).map(([category, avgScore]) => {
                        const maxScore = category === "Relevance" ? 30 : 20
                        const percentage = (avgScore / maxScore) * 100

                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-foreground">{category}</span>
                              <span className="text-muted-foreground">
                                {Math.round(avgScore)}/{maxScore}
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No evaluation data available yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="minimal-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center text-lg font-medium">
                    <Award className="w-5 h-5 mr-2" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Your writing milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {/* First Essay */}
                    <div
                      className={`p-4 rounded-lg border ${
                        totalEssays >= 1 
                          ? "bg-secondary border-border" 
                          : "bg-secondary/50 border-border/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            totalEssays >= 1 
                              ? "bg-foreground" 
                              : "bg-muted-foreground"
                          }`}
                        >
                          <PenTool className="w-5 h-5 text-background" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">First Steps</h3>
                          <p className="text-sm text-muted-foreground">Write your first essay</p>
                        </div>
                      </div>
                    </div>

                    {/* High Score */}
                    <div
                      className={`p-4 rounded-lg border ${
                        averageScore >= 80 
                          ? "bg-secondary border-border" 
                          : "bg-secondary/50 border-border/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            averageScore >= 80 
                              ? "bg-foreground" 
                              : "bg-muted-foreground"
                          }`}
                        >
                          <Target className="w-5 h-5 text-background" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">High Achiever</h3>
                          <p className="text-sm text-muted-foreground">Average score above 80</p>
                        </div>
                      </div>
                    </div>

                    {/* Writing Streak */}
                    <div
                      className={`p-4 rounded-lg border ${
                        writingStreak >= 7 
                          ? "bg-secondary border-border" 
                          : "bg-secondary/50 border-border/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            writingStreak >= 7 
                              ? "bg-foreground" 
                              : "bg-muted-foreground"
                          }`}
                        >
                          <Flame className="w-5 h-5 text-background" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">On Fire</h3>
                          <p className="text-sm text-muted-foreground">7-day writing streak</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center text-lg font-medium">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Score Progress Over Time
                </CardTitle>
                <CardDescription>Your improvement journey</CardDescription>
              </CardHeader>
              <CardContent>
                {progressData.length > 0 ? (
                  <div className="space-y-4">
                    {/* Simple line chart representation */}
                    <div className="h-64 flex items-end space-x-2">
                      {progressData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-foreground rounded-t"
                            style={{ height: `${(data.score / 100) * 200}px` }}
                          />
                          <div className="text-xs text-muted-foreground mt-2 text-center">
                            <div>Essay {data.essay}</div>
                            <div>{data.score}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progress summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-secondary rounded-lg">
                        <div className="text-2xl font-light text-foreground">
                          {progressData.length > 0 ? progressData[0].score : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">First Score</div>
                      </div>
                      <div className="text-center p-4 bg-secondary rounded-lg">
                        <div className="text-2xl font-light text-foreground">
                          {progressData.length > 0 ? progressData[progressData.length - 1].score : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Latest Score</div>
                      </div>
                      <div className="text-center p-4 bg-secondary rounded-lg">
                        <div className="text-2xl font-light text-foreground">
                          {progressData.length > 1
                            ? `+${progressData[progressData.length - 1].score - progressData[0].score}`
                            : "0"}
                        </div>
                        <div className="text-sm text-muted-foreground">Improvement</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No progress data available yet</p>
                    <Link href="/write">
                      <Button className="minimal-button">Write Your First Essay</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center text-lg font-medium">
                  <Calendar className="w-5 h-5 mr-2" />
                  Writing Calendar
                </CardTitle>
                <CardDescription>Your writing consistency over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}

                    {calendarData.map((day, index) => {
                      const date = new Date(day.date)
                      const dayOfWeek = date.getDay()

                      // Add empty cells for the first week if needed
                      const emptyCells = index === 0 ? dayOfWeek : 0

                      return (
                        <React.Fragment key={day.date}>
                          {Array.from({ length: emptyCells }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                          ))}
                          <div
                            className={`aspect-square rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-colors ${
                              day.count > 0
                                ? day.count === 1
                                  ? "bg-secondary border-border text-foreground"
                                  : day.count === 2
                                    ? "bg-foreground border-border text-background"
                                    : "bg-foreground border-border text-background"
                                : "bg-secondary border-border text-muted-foreground"
                            }`}
                            title={`${day.date}: ${day.count} essay${day.count !== 1 ? "s" : ""}`}
                          >
                            {date.getDate()}
                          </div>
                        </React.Fragment>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-secondary border border-border rounded"></div>
                      <span>No essays</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-3 h-3 bg-secondary border border-border rounded"></div>
                      <span>1 essay</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-3 h-3 bg-foreground border border-border rounded"></div>
                      <span>2 essays</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-3 h-3 bg-foreground border border-border rounded"></div>
                      <span>3+ essays</span>
                    </div>
                  </div>

                  {/* Streak info */}
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Flame className="w-5 h-5 text-foreground" />
                      <span className="text-lg font-medium text-foreground">Current Streak: {writingStreak} days</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {writingStreak > 0
                        ? "Keep it up! Consistency is key to improving your writing skills."
                        : "Start your writing streak today by completing an essay!"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Essays Tab */}
          <TabsContent value="essays" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-foreground text-lg font-medium">Recent Essays</CardTitle>
                <CardDescription>Your latest writing submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentEssays.length > 0 ? (
                  <div className="space-y-4">
                    {recentEssays.map((essay) => {
                      const evaluation = evaluationsData.find((evaluation) => evaluation.essayId === essay.id)

                      return (
                        <div
                          key={essay.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground mb-1">{essay.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{essay.wordCount} words</span>
                              <span>
                                {Math.floor(essay.timeSpent / 60)}m {essay.timeSpent % 60}s
                              </span>
                              <span>{new Date(essay.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="bg-secondary text-foreground">
                                {essay.topic.category}
                              </Badge>
                              <Badge variant="outline" className="border-border text-foreground">
                                {essay.topic.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {evaluation && (
                              <div className="text-right">
                                <div className="text-2xl font-light text-foreground">{evaluation.overallScore}</div>
                                <div className="text-xs text-muted-foreground">Score</div>
                              </div>
                            )}
                            {evaluation && (
                              <Link href={`/evaluation/${essay.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-border text-foreground hover:bg-secondary bg-transparent"
                                >
                                  View Details
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No essays written yet</p>
                    <Link href="/write">
                      <Button className="minimal-button">Write Your First Essay</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <div className="flex justify-center mt-12 pt-8 border-t border-border">
          <Link href="/write">
            <Button className="minimal-button px-8">Write New Essay</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
