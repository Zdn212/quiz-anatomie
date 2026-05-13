// Serveur intermédiaire Vercel — cache la clé API et vérifie le mot de passe
export default async function handler(req, res) {
  // Autoriser uniquement POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Vérifier le mot de passe
  const password = req.headers["x-quiz-pass"];
  if (password !== process.env.QUIZ_PASSWORD) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  // Appeler l'API Anthropic avec la clé secrète
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}
