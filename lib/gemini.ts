import { model } from "./config";
import { safeParseJson } from "./utils";

export async function generateEssayTopic(
  difficulty = "Intermediate",
  category = "General"
) {
  const prompt = `Generate a compelling essay topic for a ${difficulty} level writer in the ${category} category. 

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Essay topic title",
  "description": "Detailed description of what the essay should cover",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "targetWords": "400-500 words",
  "timeLimit": "45 minutes",
  "keyPoints": ["point1", "point2", "point3"],
  "tips": ["tip1", "tip2", "tip3"]
}

Make the topic engaging, relevant, and appropriate for the difficulty level.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();
    return await safeParseJson(text);
  } catch (error) {
    console.error("Gemini API error:", error);
    // Return a fallback topic
    return {
      title: `The Impact of ${category} on Modern Society`,
      description: `Analyze how ${category.toLowerCase()} influences our daily lives and society as a whole.`,
      category: category,
      difficulty: difficulty,
      targetWords: "400-500 words",
      timeLimit: "45 minutes",
      keyPoints: [
        "Identify key impacts",
        "Provide specific examples",
        "Discuss both benefits and challenges",
      ],
      tips: ["Start with a clear thesis", "Use concrete examples", "Organize ideas logically"],
    };
  }
}

export async function evaluateEssay(essay: string, topic: any) {
  const evaluationPrompt = `You are an expert essay evaluator. Analyze this essay and provide detailed feedback.

Essay Topic: "${topic.title}"
Essay Content: "${essay}"

Return ONLY a valid JSON object with this exact structure:
{
  "overallScore": 75,
  "breakdown": {
    "grammar": 15,
    "structure": 16,
    "clarity": 17,
    "relevance": 22,
    "wordCount": 8
  },
  "grammaticalErrors": [
    {
      "error": "exact text with error",
      "correction": "corrected text",
      "explanation": "detailed explanation",
      "position": 1,
      "type": "grammar"
    }
  ],
  "structuralIssues": [
    {
      "issue": "description of problem",
      "suggestion": "how to fix it",
      "severity": "medium"
    }
  ],
  "feedback": {
    "strengths": ["strength1", "strength2", "strength3"],
    "improvements": ["improvement1", "improvement2", "improvement3"],
    "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
  },
  "topicRelevance": {
    "score": 22,
    "analysis": "how well essay addresses topic",
    "missingElements": ["element1", "element2"]
  },
  "readabilityScore": 75,
  "summary": "comprehensive assessment"
}

Focus on identifying ALL grammatical errors, structural issues, and provide constructive feedback.`;

  try {
    const result = await model.generateContent(evaluationPrompt);
    const response = result.response;
    const text = response.text().trim();
    return await safeParseJson(text);
  } catch (error) {
    console.error("Gemini evaluation error:", error);
    // Return a fallback evaluation
    const wordCount = essay.trim().split(/\s+/).length;
    const wordCountScore = Math.min((wordCount / 400) * 10, 10);
    
    return {
      overallScore: 70,
      breakdown: {
        grammar: 14,
        structure: 15,
        clarity: 16,
        relevance: 20,
        wordCount: Math.round(wordCountScore),
      },
      grammaticalErrors: [
        {
          error: "AI evaluation service temporarily unavailable",
          correction: "Please try again later",
          explanation: "The essay evaluation service is currently unavailable. Your essay has been saved successfully.",
          position: 1,
          type: "system-message",
        },
      ],
      structuralIssues: [
        {
          issue: "AI evaluation temporarily unavailable",
          suggestion: "Please try submitting again later for detailed feedback",
          severity: "low",
        },
      ],
      feedback: {
        strengths: [
          "Essay submitted successfully",
          `Word count: ${wordCount} words`,
          "Content appears well-structured",
        ],
        improvements: [
          "AI evaluation service is temporarily unavailable",
          "Please try again later for detailed feedback",
          "Manual review may be needed",
        ],
        suggestions: [
          "Check for basic grammar and spelling errors",
          "Ensure your essay addresses the topic directly",
          "Review paragraph structure and flow",
        ],
      },
      topicRelevance: {
        score: 20,
        analysis: "Unable to analyze topic relevance due to service unavailability",
        missingElements: ["AI analysis pending"],
      },
      readabilityScore: 70,
      summary: "Your essay has been submitted successfully. The AI evaluation service is temporarily unavailable, but your work has been saved. Please try again later for detailed feedback.",
    };
  }
}

export async function generateTypingText() {
  const prompt = `Generate a random paragraph of exactly 150-200 words for a typing test. The text should be moderately challenging with varied vocabulary. Return only the paragraph text, nothing else.`;

  try {
    console.log("Attempting to generate typing text with Gemini...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text().trim();
    console.log("Successfully generated text:", generatedText.substring(0, 100) + "...");
    return generatedText;
  } catch (error) {
    console.error("Gemini typing text error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown"
    });
    // Return fallback text if API fails
    return "The quick brown fox jumps over the lazy dog. This is a sample text for typing practice when the AI service is unavailable. It contains various words and punctuation marks to test your typing skills effectively. Technology has revolutionized the way we communicate and work in the modern world. From smartphones to artificial intelligence, digital innovations continue to shape our daily experiences. Practice makes perfect when it comes to developing typing speed and accuracy. Regular exercise and consistent effort lead to significant improvements over time.";
  }
}