interface Env {
  GEMINI_API_KEY?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as { messages?: Message[]; language?: string };
    const { messages, language = 'fr' } = body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = env.GEMINI_API_KEY;
    const isFr = (language || 'fr').toLowerCase().includes('fr');

    if (!apiKey) {
      const fallbackResponse = isFr
        ? "Bonjour ! Je suis l'assistant voyage Safarihoo. Pour activer les réponses en temps réel par intelligence artificielle, assurez-vous que la variable d'environnement GEMINI_API_KEY est configurée sur votre projet Cloudflare Pages. En attendant, n'hésitez pas à lancer vos recherches de vols, hôtels et locations de voitures via les comparateurs en haut de page !"
        : "Hello! I am your Safarihoo travel assistant. To enable real-time AI responses, please configure the GEMINI_API_KEY environment variable on your Cloudflare Pages dashboard. Meanwhile, you can search and compare flights, hotels, and car rentals using our tools above!";
      return new Response(JSON.stringify({ reply: fallbackResponse }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `Tu es l'assistant de voyage officiel de Safarihoo (plateforme mondiale tout-en-un de recherche et comparaison de vols pas chers, hôtels, locations de voitures et réclamation de compensation passager avec AirHelp).
Ton style : accueillant, expert, concis, bienveillant et axé sur les bons plans.
Tes compétences :
1. Conseils sur les destinations : meilleure saison, météo, budget moyen, quartiers recommandés.
2. Astuces vols & aéroports : jours les moins chers pour réserver, gestion des escales, règles bagages.
3. Hôtels & séjours : critères de choix, sécurité, commodités.
4. Droits des passagers : expliquer le fonctionnement d'AirHelp pour indemniser les vols retardés de + de 3 heures ou annulés (jusqu'à 700 $ / €).
5. Règles importantes :
- Réponds toujours dans la langue de l'utilisateur (${isFr ? 'français' : 'anglais'}).
- Sois concis, utilise des listes à puces claires et aérées.
- Encourage l'utilisateur à effectuer sa recherche en haut de la page sur le comparateur Safarihoo.`;

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];
    let reply = '';
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              generationConfig: {
                temperature: 0.7,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data: any = await geminiRes.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            reply = generatedText;
            break;
          }
        } else {
          const errData = await geminiRes.text();
          console.warn(`Model ${model} failed:`, errData);
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!reply && lastError) {
      throw lastError;
    }

    if (!reply) {
      reply = isFr
        ? "Comment puis-je vous aider pour votre prochain voyage ?"
        : "How can I help you plan your next trip?";
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
        message: error?.message || 'Cloudflare edge function error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
