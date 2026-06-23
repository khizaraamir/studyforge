import { useState } from "react"

function App() {
  const [notes, setNotes] = useState("")
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [loading, setLoading] = useState(false)
  const [known, setKnown] = useState({})

  const handleGenerate = async () => {
    if (!notes.trim()) return
    setLoading(true)
    setFlashcards([])
    setFlipped({})
    setKnown({})

    try {
      const response = await fetch("https://studyforge-production-8b48.up.railway.app/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })
      const data = await response.json()
      setFlashcards(data.flashcards)
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Check the server.")
    } finally {
      setLoading(false)
    }
  }

  const toggleFlip = (i) => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))
  const markKnown = (e, i) => {
    e.stopPropagation()
    setKnown((prev) => ({ ...prev, [i]: true }))
    setFlipped((prev) => ({ ...prev, [i]: false }))
  }
  const markAgain = (e, i) => {
    e.stopPropagation()
    setKnown((prev) => ({ ...prev, [i]: false }))
    setFlipped((prev) => ({ ...prev, [i]: false }))
  }
    const total = flashcards.length
    const knownCount = Object.values(known).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            Study<span className="text-blue-500">Forge</span> ⚡
          </h1>
          <p className="text-gray-400 text-lg">Paste your notes. Get flashcards instantly.</p>
        </div>

        {/* Input */}
        <textarea
          className="w-full h-48 bg-gray-900 text-white rounded-2xl p-4 resize-none outline-none border border-gray-700 focus:border-blue-500 transition placeholder-gray-600 text-sm"
          placeholder="Paste your lecture notes, textbook excerpt, or any study material..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-2xl transition-all duration-150 text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Generating...
            </span>
          ) : "Generate Flashcards ✨"}
        </button>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{knownCount} of {total} known</span>
              <span>{Math.round((knownCount / total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(knownCount / total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Flashcards */}
        {total > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-gray-400 text-sm uppercase tracking-widest font-semibold">Your Flashcards</h2>
            {flashcards.map((card, i) => (
              <div
                key={i}
                onClick={() => toggleFlip(i)}
                className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 
                  ${known[i]
                    ? "bg-green-950 border-green-700 opacity-60"
                    : "bg-gray-900 border-gray-700 hover:border-blue-500"
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${flipped[i] ? "text-green-400" : "text-blue-400"}`}>
                    {flipped[i] ? "Answer" : "Question"}
                  </span>
                  <span className="text-xs text-gray-600">#{i + 1}</span>
                </div>

                <p className="text-base leading-relaxed">
                  {flipped[i] ? card.answer : card.question}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    {flipped[i] ? "Click to see question" : "Click to reveal answer"}
                  </p>
                  {flipped[i] && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => markAgain(e, i)}
                        className="text-xs px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
                      >
                        Study Again
                      </button>
                      <button
                        onClick={(e) => markKnown(e, i)}
                        className="text-xs px-3 py-1 rounded-lg bg-green-700 hover:bg-green-600 text-white transition"
                      >
                        Got It ✓
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completion message */}
        {total > 0 && knownCount === total && (
          <div className="mt-8 text-center bg-green-900 border border-green-600 rounded-2xl p-6">
            <p className="text-2xl font-bold mb-1">🎉 You know them all!</p>
            <p className="text-green-300 text-sm">Generate a new set or review again.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default App