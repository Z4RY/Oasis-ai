import { type NextRequest, NextResponse } from "next/server"
import { evaluateEssay } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { essay, topic } = await request.json()

    console.log("API received:", { essayLength: essay?.length, topicTitle: topic?.title })

    if (!essay || !topic) {
      return NextResponse.json({ error: "Essay and topic are required" }, { status: 400 })
    }

    if (essay.trim().length < 50) {
      return NextResponse.json({ error: "Essay is too short for evaluation" }, { status: 400 })
    }

    const evaluation = await evaluateEssay(essay, topic)
    console.log("Evaluation completed:", evaluation.overallScore)

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Essay evaluation error:", error)
    return NextResponse.json(
      {
        error: "Failed to evaluate essay",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
