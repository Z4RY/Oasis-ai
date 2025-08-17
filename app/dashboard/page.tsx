"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, BookOpen, Clock, Zap, Plus, Keyboard } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { ref, query, orderByChild, equalTo, get } from "firebase/database"
import { database } from "@/lib/firebase"
import { SmartLogo } from "@/components/smart-logo"

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [essays, setEssays] = useState([])
  const [stats, setStats] = useState({
    totalEssays: 0,
    averageScore: 0,
    streak: 0,
    xp: 0,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      // Load user essays from Realtime Database
      const essaysRef = ref(database, "essays")
      const essaysQuery = query(essaysRef, orderByChild("userId"), equalTo(user.uid))
      const essaysSnapshot = await get(essaysQuery)

      const userEssays = []
      if (essaysSnapshot.exists()) {
        const essaysData = essaysSnapshot.val()
        Object.keys(essaysData).forEach((key) => {
          if (!essaysData[key].isDraft) {
            userEssays.push({
              id: key,
              ...essaysData[key],
            })
          }
        })
      }

      // Load evaluations to get scores for each essay
      const evaluationsRef = ref(database, "evaluations")
      const evaluationsSnapshot = await get(evaluationsRef)

      // Create a map of essay ID to evaluation score
      const essayScores = new Map()
      let totalScore = 0
      let scoreCount = 0

      if (evaluationsSnapshot.exists()) {
        const evaluationsData = evaluationsSnapshot.val()
        Object.values(evaluationsData).forEach((evaluation: any) => {
          if (evaluation.essayId && evaluation.overallScore) {
            essayScores.set(evaluation.essayId, evaluation.overallScore)
            totalScore += evaluation.overallScore
            scoreCount++
          }
        })
      }

      // Add scores to essays
      userEssays.forEach(essay => {
        essay.score = essayScores.get(essay.id) || "N/A"
      })

      // Sort by creation date (most recent first)
      userEssays.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      setEssays(userEssays.slice(0, 3)) // Show only recent 3

      // Calculate stats
      const totalEssays = userEssays.length
      const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0

      setStats({
        totalEssays,
        averageScore,
        streak: 7, // This would be calculated based on daily activity
        xp: totalEssays * 50, // Simple XP calculation
      })
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-minimal">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <SmartLogo />
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-foreground font-medium">
              Dashboard
            </Link>
            <Link href="/write" className="text-muted-foreground hover:text-foreground transition-colors">
              Write
            </Link>
            <Link href="/typing" className="text-muted-foreground hover:text-foreground transition-colors">
              Typing
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Welcome, {user.displayName || user.email}</span>
            <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-full bg-transparent border-border hover:bg-secondary">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-light text-foreground mb-2">Welcome back, {user.displayName || "Writer"}! 👋</h1>
          <p className="text-xl text-muted-foreground">Ready to continue your writing journey?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Writing Streak</p>
                  <p className="text-2xl font-light text-foreground">{stats.streak} days</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Essays</p>
                  <p className="text-2xl font-light text-foreground">{stats.totalEssays}</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                  <p className="text-2xl font-light text-foreground">{stats.averageScore}/100</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total XP</p>
                  <p className="text-2xl font-light text-foreground">{stats.xp}</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription>Jump right into writing or test your typing skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/write">
                    <Button className="w-full h-20 bg-foreground text-background hover:bg-foreground/90 flex flex-col items-center justify-center space-y-2 rounded-lg transition-colors">
                      <Plus className="w-6 h-6" />
                      <span>Start New Essay</span>
                    </Button>
                  </Link>
                  <Link href="/typing">
                    <Button
                      variant="outline"
                      className="w-full h-20 border-foreground text-foreground hover:bg-secondary flex flex-col items-center justify-center space-y-2 rounded-lg bg-transparent transition-colors"
                    >
                      <Keyboard className="w-6 h-6" />
                      <span>Typing Test</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Essays */}
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Essays</CardTitle>
                <CardDescription>Your latest writing submissions and scores</CardDescription>
              </CardHeader>
              <CardContent>
                {essays.length > 0 ? (
                  <div className="space-y-4">
                    {essays.map((essay: any) => (
                      <div
                        key={essay.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{essay.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(essay.createdAt).toLocaleDateString()}
                            </span>
                            <Badge variant="secondary" className="bg-secondary text-foreground">
                              {essay.topic?.category || "General"}
                            </Badge>
                            <span>{essay.wordCount || 0} words</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-light text-foreground mb-1">{essay.score || "N/A"}</div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                          <Link href={`/evaluation/${essay.id}`}>
                            <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent transition-colors">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-border">
                      <Link href="/profile" className="w-full">
                        <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary bg-transparent transition-colors">
                          View All Essays
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No essays yet. Start writing your first essay!</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-foreground">Progress</CardTitle>
                <CardDescription>Your writing journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>XP Progress</span>
                      <span>{stats.xp}/1000</span>
                    </div>
                    <Progress value={(stats.xp / 1000) * 100} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">{1000 - stats.xp} XP until next level</p>
                </div>
              </CardContent>
            </Card>

            {/* Daily Challenge */}
            <Card className="minimal-card border-foreground bg-secondary">
              <CardHeader>
                <CardTitle className="text-foreground">Daily Challenge</CardTitle>
                <CardDescription>Complete today's writing challenge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Write about a technological innovation that changed your life
                    </p>
                    <p className="text-xs text-muted-foreground">Target: 300-400 words • Difficulty: Intermediate</p>
                  </div>
                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full transition-colors">
                    Accept Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
