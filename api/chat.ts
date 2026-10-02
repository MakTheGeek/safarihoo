interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as { messages?: Message[]; language?: string };
    const { messages, language = 'fr' } = body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const isFr = (language || 'fr').toLowerCase().includes('fr');

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

    let reply = '';

    // 1. Try OpenRouter if OPENROUTER_API_KEY is configured
    if (openRouterApiKey) {
      const openRouterModels = [
        'google/gemini-2.0-flash-exp:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'mistralai/mistral-7b-instruct:free',
        'deepseek/deepseek-r1:free',
        'openrouter/auto',
      ];

      const openRouterMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ];

      for (const model of openRouterModels) {
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openRouterApiKey}`,
              'HTTP-Referer': 'https://safarihoo.com',
              'X-Title': 'Safarihoo Travel Assistant',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              messages: openRouterMessages,
              temperature: 0.7,
            }),
          });

          if (res.ok) {
            const data: any = await res.json();
            const text = data?.choices?.[0]?.message?.content;
            if (text) {
              reply = text;
              break;
            }
          }
        } catch (openRouterErr) {
          console.warn(`OpenRouter model ${model} error:`, openRouterErr);
        }
      }
    }

    // 2. Fallback to Gemini if OpenRouter wasn't configured or failed
    if (!reply && geminiApiKey) {
      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      for (const model of modelsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
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
          }
        } catch (err) {
          console.warn(`Gemini model ${model} failed:`, err);
        }
      }
    }

    // 3. Fallback message if neither key was set or both failed
    if (!reply) {
      if (!openRouterApiKey && !geminiApiKey) {
        const fallbackResponse = isFr
          ? "Bonjour ! Je suis l'assistant voyage Safarihoo. Pour activer les réponses de l'IA avec votre clé gratuite OpenRouter, configurez la variable OPENROUTER_API_KEY sur votre projet Vercel. En attendant, n'hésitez pas à lancer vos recherches de vols, hôtels et locations de voitures via les comparateurs en haut de page !"
          : "Hello! I am your Safarihoo travel assistant. To enable real-time AI responses with your free OpenRouter API key, configure the OPENROUTER_API_KEY environment variable on your Vercel dashboard. Meanwhile, you can search and compare flights, hotels, and car rentals using our tools above!";
        return new Response(JSON.stringify({ reply: fallbackResponse }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      reply = isFr
        ? "Comment puis-je vous aider pour organiser votre prochain voyage ?"
        : "How can I help you plan your next trip?";
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
        message: error?.message || 'Server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
