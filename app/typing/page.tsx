"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Keyboard, RotateCcw, Play, Pause } from "lucide-react"
import Link from "next/link"
import { generateTypingText } from "@/lib/gemini"
import { SmartLogo } from "@/components/smart-logo"

export default function TypingTestPage() {
  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    generateNewText()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      setIsFinished(true)
      calculateResults()
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const generateNewText = async () => {
    console.log("generateNewText called");
    setLoading(true);
    try {
      console.log("Calling generateTypingText...");
      const newText = await generateTypingText();
      console.log("Received text:", newText.substring(0, 100) + "...");
      setText(newText);
    } catch (error) {
      console.error("Error generating text:", error);
      const fallbackText = "The quick brown fox jumps over the lazy dog. This is a sample text for typing practice. It contains various words and punctuation marks to test your typing skills effectively. Technology has revolutionized the way we communicate and work in the modern world. From smartphones to artificial intelligence, digital innovations continue to shape our daily experiences.";
      console.log("Setting fallback text:", fallbackText.substring(0, 100) + "...");
      setText(fallbackText);
    } finally {
      setLoading(false);
    }
  }

  const startTest = () => {
    setIsActive(true)
    setIsFinished(false)
    setUserInput("")
    setTimeLeft(60)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    inputRef.current?.focus()
  }

  const resetTest = () => {
    setIsActive(false)
    setIsFinished(false)
    setUserInput("")
    setTimeLeft(60)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    generateNewText()
  }

  const calculateResults = () => {
    const wordsTyped = userInput.trim().split(" ").length
    const timeElapsed = (60 - timeLeft) / 60
    const calculatedWpm = Math.round(wordsTyped / timeElapsed) || 0

    let errorCount = 0
    const minLength = Math.min(userInput.length, text.length)

    for (let i = 0; i < minLength; i++) {
      if (userInput[i] !== text[i]) {
        errorCount++
      }
    }

    const calculatedAccuracy = minLength > 0 ? Math.round(((minLength - errorCount) / minLength) * 100) : 100

    setWpm(calculatedWpm)
    setAccuracy(calculatedAccuracy)
    setErrors(errorCount)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive) return

    const value = e.target.value
    if (value.length <= text.length) {
      setUserInput(value)

      // Calculate real-time stats
      const wordsTyped = value.trim().split(" ").length
      const timeElapsed = (60 - timeLeft) / 60
      if (timeElapsed > 0) {
        setWpm(Math.round(wordsTyped / timeElapsed))
      }

      let errorCount = 0
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== text[i]) {
          errorCount++
        }
      }

      if (value.length > 0) {
        setAccuracy(Math.round(((value.length - errorCount) / value.length) * 100))
        setErrors(errorCount)
      }
    }
  }

  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "text-muted-foreground"

      if (index < userInput.length) {
        className = userInput[index] === char ? "text-foreground bg-secondary" : "text-destructive bg-destructive/10"
      } else if (index === userInput.length) {
        className = "text-foreground bg-secondary border-l-2 border-foreground"
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      )
    })
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
            <Link href="/write" className="text-muted-foreground hover:text-foreground transition-colors">
              Write
            </Link>
            <Link href="/typing" className="text-foreground font-medium">
              Typing Test
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-foreground mb-4 animate-fade-in">Typing Speed Test</h1>
          <p className="text-xl text-muted-foreground">Test your typing speed and accuracy with AI-generated content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-light text-foreground mb-1">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-light text-foreground mb-1">{wpm}</div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-light text-foreground mb-1">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>

          <Card className="minimal-card animate-slide-up">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-light text-destructive mb-1">{errors}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={((60 - timeLeft) / 60) * 100} className="h-2" />
        </div>

        {/* Main Typing Area */}
        <Card className="minimal-card mb-6">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Keyboard className="w-5 h-5 mr-2" />
              Typing Test
            </CardTitle>
            <CardDescription>
              Type the text below exactly as shown. The test will start when you begin typing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Generating new text...</div>
              </div>
            ) : (
              <>
                {/* Text Display */}
                <div className="bg-secondary p-6 rounded-lg mb-4 text-lg leading-relaxed font-mono border-2 border-border">
                  {renderText()}
                </div>

                {/* Input Area */}
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder={isActive ? "Start typing..." : "Click Start to begin the test"}
                  className="w-full h-32 p-4 minimal-input resize-none font-mono text-lg focus:ring-foreground"
                  disabled={!isActive || isFinished}
                />

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4 mt-6">
                  {!isActive && !isFinished && (
                    <Button onClick={startTest} className="minimal-button rounded-full px-6">
                      <Play className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  )}

                  {isActive && (
                    <Button
                      onClick={() => setIsActive(false)}
                      variant="outline"
                      className="border-foreground text-foreground rounded-full px-6 bg-transparent hover:bg-secondary transition-colors"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}

                  <Button
                    onClick={resetTest}
                    variant="outline"
                    className="border-border text-muted-foreground rounded-full px-6 bg-transparent hover:bg-secondary transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {isFinished && (
          <Card className="minimal-card border-foreground bg-secondary">
            <CardHeader>
              <CardTitle className="text-foreground">Test Complete!</CardTitle>
              <CardDescription>Here are your results:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-light text-foreground mb-2">{wpm}</div>
                  <div className="text-muted-foreground">Words Per Minute</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-foreground mb-2">{accuracy}%</div>
                  <div className="text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-destructive mb-2">{errors}</div>
                  <div className="text-muted-foreground">Total Errors</div>
                </div>
              </div>

              <div className="text-center mt-6">
                <Button onClick={resetTest} className="minimal-button rounded-full px-6">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
