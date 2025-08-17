"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, RotateCcw, Send, Save, Play, Pause, Timer } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { ref, push, set, serverTimestamp } from "firebase/database"
import { database } from "@/lib/firebase"
import { generateEssayTopic } from "@/lib/gemini"
import { SmartLogo } from "@/components/smart-logo"

export default function WritePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState<any>(null)
  const [essay, setEssay] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isWriting, setIsWriting] = useState(false)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [difficulty, setDifficulty] = useState("Intermediate")
  const [category, setCategory] = useState("General")

  const categories = [
    "General",
    "Technology",
    "Environment",
    "Society",
    "Education",
    "Health",
    "Politics",
    "Science",
    "Arts",
    "Business",
  ]

  const difficulties = ["Beginner", "Intermediate", "Advanced"]

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    const words = essay
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    setWordCount(essay.trim() === "" ? 0 : words)
    setCharCount(essay.length)
  }, [essay])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const generateTopic = async () => {
    setGenerating(true)
    try {
      console.log("Generating topic with:", { difficulty, category })
      const topic = await generateEssayTopic(difficulty, category)
      console.log("Generated topic:", topic)
      setSelectedTopic(topic)
    } catch (error) {
      console.error("Error generating topic:", error)
      alert("Failed to generate topic. Please check your internet connection and try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleStartWriting = () => {
    setIsWriting(true)
    setIsTimerRunning(true)
    setTimeElapsed(0)
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimeElapsed(0)
  }

  const handleSaveDraft = async () => {
    if (!user || !selectedTopic || !essay.trim()) return

    setSaving(true)
    try {
      const essaysRef = ref(database, "essays")
      const newEssayRef = push(essaysRef)

      await set(newEssayRef, {
        userId: user.uid,
        title: selectedTopic.title,
        content: essay,
        topic: selectedTopic,
        wordCount,
        timeSpent: timeElapsed,
        isDraft: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      alert("Draft saved successfully!")
    } catch (error) {
      console.error("Error saving draft:", error)
      alert("Failed to save draft")
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitEssay = async () => {
    if (!user || !selectedTopic || !essay.trim()) return

    if (essay.trim().length < 50) {
      alert("Please write at least 50 words before submitting.")
      return
    }

    setSaving(true)
    try {
      console.log("Submitting essay:", {
        essayLength: essay.length,
        topicTitle: selectedTopic.title,
      })

      // Save essay to Firebase Realtime Database
      const essaysRef = ref(database, "essays")
      const newEssayRef = push(essaysRef)
      const essayId = newEssayRef.key

      await set(newEssayRef, {
        userId: user.uid,
        title: selectedTopic.title,
        content: essay,
        topic: selectedTopic,
        wordCount,
        timeSpent: timeElapsed,
        isDraft: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      console.log("Essay saved to Firebase:", essayId)

      // Evaluate essay with OpenAI API
      const response = await fetch("/api/evaluate-essay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          essay: essay.trim(),
          topic: selectedTopic,
        }),
      })

      console.log("API response status:", response.status)

      if (response.ok) {
        const evaluation = await response.json()
        console.log("Received evaluation:", evaluation)

        // Save evaluation results to Realtime Database
        const evaluationsRef = ref(database, "evaluations")
        const newEvaluationRef = push(evaluationsRef)

        await set(newEvaluationRef, {
          essayId: essayId,
          userId: user.uid,
          ...evaluation,
          createdAt: serverTimestamp(),
        })

        console.log("Evaluation saved, redirecting...")
        router.push(`/evaluation/${essayId}`)
      } else {
        const errorData = await response.json()
        console.error("API error:", errorData)
        throw new Error(errorData.error || "Failed to evaluate essay")
      }
    } catch (error) {
      console.error("Error submitting essay:", error)
      alert(`Failed to submit essay: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setSaving(false)
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
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/write" className="text-foreground font-medium">
              Write
            </Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
              Profile
            </Link>
            <Link href="/typing" className="text-muted-foreground hover:text-foreground transition-colors">
              Typing
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Welcome, {user.displayName || user.email}</span>
            <Button
              onClick={() => router.push("/profile")}
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent border-border hover:bg-secondary"
            >
              Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {!selectedTopic ? (
          // Topic Generation
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-light text-foreground mb-4 animate-fade-in">Generate Your Essay Topic</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Let AI create a personalized writing prompt based on your preferences
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Difficulty Level</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-full minimal-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full minimal-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateTopic}
                disabled={generating}
                className="minimal-button rounded-full px-8 py-3"
              >
                <Zap className="w-4 h-4 mr-2" />
                {generating ? "Generating Topic..." : "Generate Essay Topic"}
              </Button>

              {/* API Status Info */}
              <div className="mt-8 p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This feature uses OpenAI API for topic generation. If you're experiencing
                  issues, please check your API key configuration.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Writing Interface (same as before)
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Writing Area */}
            <div className="lg:col-span-3">
              <Card className="minimal-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground mb-2">{selectedTopic.title}</CardTitle>
                      <CardDescription className="text-sm mb-4">{selectedTopic.description}</CardDescription>
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className="bg-secondary text-foreground">
                          {selectedTopic.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${
                            selectedTopic.difficulty === "Beginner"
                              ? "border-foreground text-foreground"
                              : selectedTopic.difficulty === "Intermediate"
                                ? "border-foreground text-foreground"
                                : "border-foreground text-foreground"
                          }`}
                        >
                          {selectedTopic.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTopic(null)}
                      className="border-border text-foreground hover:bg-secondary rounded-full transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      New Topic
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Timer Controls */}
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Timer className="w-5 h-5 text-foreground" />
                          <span className="text-lg font-mono text-foreground">{formatTime(timeElapsed)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!isWriting ? (
                            <Button
                              onClick={handleStartWriting}
                              size="sm"
                              className="minimal-button rounded-full"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={toggleTimer}
                                size="sm"
                                variant="outline"
                                className="border-foreground text-foreground rounded-full bg-transparent hover:bg-secondary transition-colors"
                              >
                                {isTimerRunning ? (
                                  <>
                                    <Pause className="w-4 h-4 mr-1" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4 mr-1" />
                                    Resume
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={resetTimer}
                                size="sm"
                                variant="outline"
                                className="border-border text-muted-foreground rounded-full bg-transparent hover:bg-secondary transition-colors"
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Reset
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Target: {selectedTopic.targetWords} • Time Limit: {selectedTopic.timeLimit}
                      </div>
                    </div>

                    {!isWriting && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          Ready to start writing? Click the Start button above to begin your essay and start the timer.
                        </p>
                      </div>
                    )}

                    {isWriting && (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Start writing your essay here..."
                          value={essay}
                          onChange={(e) => setEssay(e.target.value)}
                          className="min-h-[400px] minimal-input resize-none rounded-lg focus:ring-foreground"
                        />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <span>{wordCount} words</span>
                            <span>{charCount} characters</span>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Button
                              onClick={handleSaveDraft}
                              variant="outline"
                              size="sm"
                              className="border-border text-foreground rounded-full bg-transparent hover:bg-secondary transition-colors"
                              disabled={saving}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {saving ? "Saving..." : "Save Draft"}
                            </Button>
                            <Button
                              onClick={handleSubmitEssay}
                              disabled={wordCount < 50 || saving}
                              className="minimal-button rounded-full"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              {saving ? "Submitting..." : "Submit for Review"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Topic Guidelines */}
              <Card className="minimal-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Writing Guidelines</CardTitle>
                  <CardDescription>Key points to address</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-foreground mb-1">Target Length</p>
                      <p className="text-muted-foreground">{selectedTopic.targetWords}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Time Limit</p>
                      <p className="text-muted-foreground">{selectedTopic.timeLimit}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Key Points to Cover</p>
                      <ul className="text-muted-foreground space-y-1">
                        {selectedTopic.keyPoints?.map((point: string, index: number) => (
                          <li key={index}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Writing Progress */}
              {isWriting && (
                <Card className="minimal-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Writing Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Word Count</span>
                          <span>
                            {wordCount} / {selectedTopic.targetWords.split("-")[1]?.replace(" words", "") || "500"}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-foreground h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((wordCount / Number.parseInt(selectedTopic.targetWords.split("-")[1]?.replace(" words", "") || "500")) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Time Elapsed</span>
                          <span>{formatTime(timeElapsed)}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-foreground h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((timeElapsed / (Number.parseInt(selectedTopic.timeLimit?.split(" ")[0] || "45") * 60)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Writing Tips */}
              <Card className="minimal-card border-foreground bg-secondary">
                <CardHeader>
                  <CardTitle className="text-foreground">Writing Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {selectedTopic.tips?.map((tip: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0" />
                        <p className="text-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
