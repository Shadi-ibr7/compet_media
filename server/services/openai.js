import OpenAI from 'openai';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

if (!process.env.ORGANIZATION_ID) {
  throw new Error('ORGANIZATION_ID is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.ORGANIZATION_ID
});

export async function verifyFactWithGPT(sentence) {
  if (!sentence) {
    throw new Error('Sentence is required for verification');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en vérification des faits. Pour chaque affirmation, tu dois :\n1. Déterminer si elle est vraie ou fausse\n2. Fournir une explication détaillée\n3. Commencer ta réponse par VRAI ou FAUX en majuscules"
        },
        {
          role: "user",
          content: `Vérifie cette information : "${sentence}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }

    const response = completion.choices[0].message.content;
    if (!response.match(/^(VRAI|FAUX)\s/i)) {
      throw new Error('Invalid response format from OpenAI');
    }

    const isTrue = response.toLowerCase().startsWith('vrai');
    const explanation = response.substring(response.indexOf(' ') + 1).trim();
    
    if (!explanation) {
      throw new Error('No explanation provided in the response');
    }

    return {
      isTrue,
      explanation
    };
  } catch (error) {
    console.error('OpenAI Error:', error);
    if (error.response) {
      console.error('OpenAI API Response:', error.response.data);
    }
    throw new Error(error.message || 'Failed to verify fact with GPT');
  }
}