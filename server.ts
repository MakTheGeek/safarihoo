import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize AI APIs (OpenRouter or Gemini)
const geminiApiKey = process.env.GEMINI_API_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, language = 'fr' } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required.' });
    }

    const isFr = language.toLowerCase().includes('fr');
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
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ];

      for (const model of openRouterModels) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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

          if (response.ok) {
            const data: any = await response.json();
            const text = data?.choices?.[0]?.message?.content;
            if (text) {
              reply = text;
              break;
            }
          } else {
            const errText = await response.text();
            console.warn(`OpenRouter model ${model} failed:`, errText);
          }
        } catch (openRouterErr: any) {
          console.warn(`OpenRouter error with ${model}:`, openRouterErr?.message || openRouterErr);
        }
      }
    }

    // 2. Fallback to Gemini if OpenRouter wasn't used or failed, and Gemini is configured
    if (!reply && ai) {
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
            },
          });
          if (response.text) {
            reply = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Gemini model ${model} failed:`, err.message || err);
        }
      }
    }

    // 3. Fallback message if neither API key is active or both failed
    if (!reply) {
      if (!openRouterApiKey && !geminiApiKey) {
        const fallbackResponse = isFr
          ? "Bonjour ! Je suis l'assistant voyage Safarihoo. Pour activer les réponses de l'IA avec votre clé gratuite OpenRouter, configurez la variable OPENROUTER_API_KEY. En attendant, n'hésitez pas à lancer vos recherches de vols, hôtels et locations de voitures via les comparateurs en haut de page !"
          : "Hello! I am your Safarihoo travel assistant. To enable real-time AI responses with your free OpenRouter API key, configure the OPENROUTER_API_KEY environment variable. Meanwhile, you can search and compare flights, hotels, and car rentals using our tools above!";
        return res.json({ reply: fallbackResponse });
      }

      reply = isFr
        ? "Comment puis-je vous aider pour planifier votre prochain voyage ?"
        : "How can I help you plan your next journey?";
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error?.message || 'Server error',
    });
  }
});

// Dev vs Prod middleware setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Safarihoo server is running on http://0.0.0.0:${PORT}`);
});
