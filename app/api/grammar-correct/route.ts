import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";

// Initialize Gemini API with the correct model name
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const GEMINI_MODEL = "gemini-1.5-flash";
const API_TIMEOUT = 15000; // 15 seconds timeout

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return Response.json(
        { error: "Please enter some text to correct" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured");
    }

    // Initialize the model with the correct model name
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Prepare the prompt
    const prompt = `Convert the following text to proper English, maintaining the original meaning and making it sound natural:

Examples of good conversions:
• Input: "Main kal office ke liye late ho gaya tha"
  Output: "I was late for office yesterday"
• Input: "Mujhe movie dekhne ka plan cancel karna pada"
  Output: "I had to cancel my plan to watch the movie"

Text to convert: "${text}"

Provide ONLY the converted English text without any explanations or additional text.`;

    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("API request timed out")), API_TIMEOUT);
    });

    // Generate the response with proper configuration
    const result = (await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        },
      }),
      timeoutPromise,
    ])) as GenerateContentResult;

    const response = await result.response;
    const correctedText = response.text().trim();

    if (!correctedText) {
      throw new Error("No correction generated");
    }

    return Response.json({
      correctedText,
    });
  } catch (error: unknown) {
    console.error("Text correction error:", error);

    // More specific error messages based on the error type
    let errorMessage = "Something went wrong. Please try again.";
    let statusCode = 500;

    // Type guard for Error objects
    if (error instanceof Error) {
      if (error.message?.includes("API_KEY")) {
        errorMessage =
          "API key configuration error. Please check server configuration.";
      } else if (error.message?.includes("timeout")) {
        errorMessage =
          "Request took too long. Please try again with a simpler prompt.";
        statusCode = 408;
      } else if (
        error.message?.includes("429") ||
        error.message?.includes("quota")
      ) {
        errorMessage =
          "API quota exceeded. Please wait before trying again, or try a shorter prompt.";
        statusCode = 429;
      } else if (error.message?.includes("400")) {
        errorMessage =
          "The API encountered an error with your request. Try simplifying your prompt.";
        statusCode = 400;
      }
    }

    return Response.json({ error: errorMessage }, { status: statusCode });
  }
}
