export default async function handler(req, res) {
  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API anahtarı bulunamadı. Vercel panelinden OPENROUTER_API_KEY ekleyin.' });
  }

  try {
    const { prompt, systemInstruction } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-7b-instruct:free", // Ücretsiz Qwen modeli
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Hatası:", errorData);
      return res.status(response.status).json({ error: 'Model yanıt verirken bir hata oluştu.' });
    }

    const data = await response.json();
    
    // Qwen'den dönen yanıtı, HTML tarafının beklediği { reply: "..." } formatında yolluyoruz
    const botReply = data.choices[0]?.message?.content || "Üzgünüm, yanıt alınamadı.";

    res.status(200).json({ reply: botReply });
    
  } catch (error) {
    console.error('Sunucu Hatası:', error);
    res.status(500).json({ error: 'İstek işlenirken sunucu hatası oluştu.' });
  }
}
