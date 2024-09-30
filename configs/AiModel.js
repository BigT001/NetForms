
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.7,
  topP: 1,
  topK: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const PROMPT = `Generate a form structure in JSON format based on the given description. The JSON should include:
- formHeading
- formTitle
- formSubheading
- formName
- fields (an array of objects, each containing:
  - fieldType
  - formField
  - placeholderName
  - formLabel
  - formControl
  - required
  - options (for select and radio types)
)

Ensure the output is a valid JSON object.`;

// ... (previous imports and configurations)

export const AiChatSession = model.startChat({
  generationConfig,
  safetySettings,
  history: [
    {
      role: "user",
      parts: [{ text: PROMPT }],
    },
    {
      role: "model",
      parts: [{ text: "Understood. I'll generate form structures in JSON format based on the given descriptions." }],
    },
  ],
});

export async function generateFormStructure(userInput) {
  try {
    const result = await AiChatSession.sendMessage(userInput);
    const responseText = result.response.text();
    
    console.log("AI Response:", responseText);

    // Extract JSON from markdown code block
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsedJson = JSON.parse(jsonMatch[1]);
        if (parsedJson && typeof parsedJson === 'object' && parsedJson.fields) {
          return parsedJson;
        }
      } catch (parseError) {
        console.log("Failed to parse extracted JSON");
      }
    }

    // If extraction fails, try to parse the entire response
    try {
      const parsedJson = JSON.parse(responseText);
      if (parsedJson && typeof parsedJson === 'object' && parsedJson.fields) {
        return parsedJson;
      }
    } catch (parseError) {
      console.log("Failed to parse entire response as JSON");
    }

    throw new Error('No valid form structure found in the AI response');
  } catch (error) {
    console.error("Error in generateFormStructure:", error);
    throw error;
  }
}
