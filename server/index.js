import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Anthropic from "@anthropic-ai/sdk"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.post("/generate", async (req, res) => {
  const { notes } = req.body

  if (!notes || !notes.trim()) {
    return res.status(400).json({ error: "No notes provided" })
  }

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a flashcard generator. Given the following notes, generate 8 flashcards.
          
Return ONLY a JSON array, no explanation, no markdown, just raw JSON like this:
[
  { "question": "...", "answer": "..." },
  { "question": "...", "answer": "..." }
]

Notes:
${notes}`,
        },
      ],
    })

    const raw = message.content[0].text
    const flashcards = JSON.parse(raw)
    res.json({ flashcards })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to generate flashcards" })
  }
})

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001")
})