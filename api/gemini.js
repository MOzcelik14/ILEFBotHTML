export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: req.body.prompt }]
          }
        ],
        systemInstruction: {
          parts: [{ text: req.body.systemInstruction }]
        },
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.2,    
        }
      })
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
