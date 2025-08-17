import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, Zap, TrendingUp, Target, Award, Keyboard } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-minimal">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 text-foreground">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2L8 6h3v6H8l4 4 4-4h-3V6h3l-4-4z" />
                <path d="M2 12l4-4v3h6v-3l4 4-4 4v-3H6v3l-4-4z" />
              </svg>
            </div>
            <span className="text-2xl font-light text-foreground">Oasis</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-foreground hover:text-foreground/80 transition-colors">
              Features
            </Link>
            <Link href="#typing" className="text-foreground hover:text-foreground/80 transition-colors">
              Typing Test
            </Link>
            <Link href="#how-it-works" className="text-foreground hover:text-foreground/80 transition-colors">
              How it Works
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-foreground hover:text-foreground/80 hover:bg-secondary">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 transition-colors">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-foreground leading-tight animate-fade-in">Write. Reflect. Rise.</h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
            Transform your writing with AI-powered feedback. Master grammar, structure, and style with personalized
            insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-3 transition-colors">
                Start Writing Free
              </Button>
            </Link>
            <Link href="#typing">
              <Button
                size="lg"
                variant="outline"
                className="border-foreground text-foreground hover:bg-secondary rounded-full px-8 py-3 bg-transparent transition-colors"
              >
                Try Typing Test
              </Button>
            </Link>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center animate-slide-up">
              <div className="text-3xl font-light text-foreground mb-2">10,000+</div>
              <div className="text-muted-foreground">Essays Analyzed</div>
            </div>
            <div className="text-center animate-slide-up">
              <div className="text-3xl font-light text-foreground mb-2">95%</div>
              <div className="text-muted-foreground">Improvement Rate</div>
            </div>
            <div className="text-center animate-slide-up">
              <div className="text-3xl font-light text-foreground mb-2">4.9/5</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div> */}
        </div> 
      </section>

      {/* Typing Test Section */}
      <section id="typing" className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-light mb-6 text-foreground">Test Your Typing Skills</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Challenge yourself with our AI-generated typing tests. Improve your speed and accuracy.
          </p>

          <Card className="max-w-2xl mx-auto minimal-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center justify-center">
                <Keyboard className="w-6 h-6 mr-2" />
                60-Second Typing Challenge
              </CardTitle>
              <CardDescription>Type the generated text exactly as shown within 60 seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/typing">
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-3 transition-colors">
                  Start Typing Test
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-foreground">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From AI-powered feedback to typing tests, master every aspect of writing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Essay Evaluation */}
            <Card className="minimal-card hover:shadow-minimal-lg transition-shadow animate-slide-up">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-foreground">AI Essay Evaluation</CardTitle>
                <CardDescription>Detailed analysis with Gemini AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Every grammatical error identified</li>
                  <li>• Structure & flow analysis</li>
                  <li>• Personalized improvement suggestions</li>
                </ul>
              </CardContent>
            </Card>

            {/* Typing Test */}
            <Card className="minimal-card hover:shadow-minimal-lg transition-shadow animate-slide-up">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Keyboard className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-foreground">Typing Test</CardTitle>
                <CardDescription>60-second accuracy challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AI-generated random texts</li>
                  <li>• Real-time accuracy tracking</li>
                  <li>• Speed & precision metrics</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cloud Storage */}
            <Card className="minimal-card hover:shadow-minimal-lg transition-shadow animate-slide-up">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <PenTool className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-foreground">Cloud Storage</CardTitle>
                <CardDescription>Save and sync your essays</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Firebase cloud storage</li>
                  <li>• Access from anywhere</li>
                  <li>• Automatic backups</li>
                </ul>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card className="minimal-card hover:shadow-minimal-lg transition-shadow animate-slide-up">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-foreground">Progress Tracking</CardTitle>
                <CardDescription>Monitor your improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Writing skill analytics</li>
                  <li>• Typing speed progress</li>
                  <li>• Achievement system</li>
                </ul>
              </CardContent>
            </Card>

            {/* Smart Prompts */}
            <Card className="minimal-card hover:shadow-minimal-lg transition-shadow animate-slide-up">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-foreground">Smart Prompts</CardTitle>
                <CardDescription>AI-generated writing topics</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Difficulty-based prompts</li>
                  <li>• Multiple categories</li>
                  <li>• Exam preparation topics</li>
                </ul>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="minimal-card hover:shadow-minimal-lg transition-shadow animate-slide-up">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-foreground">Achievements</CardTitle>
                <CardDescription>Gamified learning experience</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Writing milestones</li>
                  <li>• Typing achievements</li>
                  <li>• Streak rewards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-foreground">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to improve your writing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center animate-slide-up">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-background">1</span>
              </div>
              <h3 className="text-xl font-medium mb-4 text-foreground">Write or Type</h3>
              <p className="text-muted-foreground">
                Choose between essay writing with prompts or typing tests with AI-generated content.
              </p>
            </div>

            <div className="text-center animate-slide-up">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-background">2</span>
              </div>
              <h3 className="text-xl font-medium mb-4 text-foreground">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our Gemini AI analyzes every aspect of your writing with detailed feedback.
              </p>
            </div>

            <div className="text-center animate-slide-up">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-background">3</span>
              </div>
              <h3 className="text-xl font-medium mb-4 text-foreground">Improve</h3>
              <p className="text-muted-foreground">Get personalized suggestions and track your progress over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-light mb-6 text-background">Ready to Transform Your Writing?</h2>
          <p className="text-xl text-background/80 mb-8">
            Join thousands of writers improving their skills with AI-powered feedback.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 py-3 transition-colors">
              Start Writing for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 text-foreground">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2L8 6h3v6H8l4 4 4-4h-3V6h3l-4-4z" />
                    <path d="M2 12l4-4v3h6v-3l4 4-4 4v-3H6v3l-4-4z" />
                  </svg>
                </div>
                <span className="text-xl font-light text-foreground">Oasis</span>
              </div>
              <p className="text-muted-foreground">Your personal oasis for written expression and growth.</p>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#typing" className="hover:text-foreground transition-colors">
                    Typing Test
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Oasis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
