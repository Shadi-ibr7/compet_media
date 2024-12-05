import { verifyFactWithGPT } from './openai.js';

const topics = [
  {
    category: 'Sport',
    facts: [
      {
        realNews: "La France a gagné la Coupe du Monde de football en 1998",
        fakeNews: "La France a perdu la Coupe du Monde de football en 1998",
        explanation: "La France a effectivement remporté la Coupe du Monde 1998 en battant le Brésil 3-0 en finale."
      },
      {
        realNews: "Usain Bolt détient le record du monde du 100m en 9.58 secondes",
        fakeNews: "Usain Bolt détient le record du monde du 100m en 8.58 secondes",
        explanation: "Usain Bolt a établi le record du monde du 100m en 9.58 secondes lors des Championnats du monde de Berlin en 2009."
      }
    ]
  },
  {
    category: 'Histoire',
    facts: [
      {
        realNews: "La Tour Eiffel a été construite en 1889",
        fakeNews: "La Tour Eiffel a été construite en 1789",
        explanation: "La Tour Eiffel a été construite entre 1887 et 1889 pour l'Exposition universelle de Paris de 1889."
      },
      {
        realNews: "L'homme a marché sur la Lune pour la première fois en 1969",
        fakeNews: "L'homme a marché sur la Lune pour la première fois en 1959",
        explanation: "Neil Armstrong a été le premier homme à marcher sur la Lune le 21 juillet 1969 lors de la mission Apollo 11."
      }
    ]
  },
  {
    category: 'Science',
    facts: [
      {
        realNews: "L'eau bout à 100 degrés Celsius au niveau de la mer",
        fakeNews: "L'eau bout à 90 degrés Celsius au niveau de la mer",
        explanation: "L'eau bout effectivement à 100 degrés Celsius (212°F) au niveau de la mer sous une pression atmosphérique normale."
      }
    ]
  }
];

export async function getRandomFact() {
  try {
    if (!topics || topics.length === 0) {
      throw new Error('No topics available');
    }

    const category = topics[Math.floor(Math.random() * topics.length)];
    if (!category || !category.facts || category.facts.length === 0) {
      throw new Error('Invalid category or no facts available');
    }

    const fact = category.facts[Math.floor(Math.random() * category.facts.length)];
    if (!fact || !fact.realNews || !fact.fakeNews || !fact.explanation) {
      throw new Error('Invalid fact data');
    }

    return {
      realNews: fact.realNews,
      fakeNews: fact.fakeNews,
      explanation: fact.explanation,
      category: category.category
    };
  } catch (error) {
    console.error('Error getting random fact:', error);
    throw new Error('Failed to get random fact');
  }
}