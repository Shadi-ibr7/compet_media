const API_BASE_URL = 'http://localhost:3000';

export async function fetchRandomFact() {
  try {
    const response = await fetch(`${API_BASE_URL}/facts/random`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data || !data.realNews || !data.fakeNews || !data.explanation) {
      throw new Error('Données invalides reçues du serveur');
    }
    
    return {
      realNews: data.realNews,
      fakeNews: data.fakeNews,
      explanation: data.explanation,
      category: data.category
    };
  } catch (error) {
    console.error('Error fetching fact:', error);
    throw new Error('Impossible de récupérer le fait. Veuillez réessayer.');
  }
}

export async function verifyWithGPT(sentence) {
  try {
    if (!sentence || typeof sentence !== 'string' || sentence.trim() === '') {
      throw new Error('La phrase est invalide');
    }
    
    const response = await fetch(`${API_BASE_URL}/facts/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sentence: sentence.trim() }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur lors de la vérification');
    }
    
    const data = await response.json();
    if (!data || typeof data.isTrue !== 'boolean' || !data.explanation) {
      throw new Error('Réponse invalide du serveur');
    }
    
    return {
      isTrue: data.isTrue,
      explanation: data.explanation
    };
  } catch (error) {
    console.error('Error verifying with GPT:', error);
    throw new Error('Erreur lors de la vérification. Veuillez réessayer.');
  }
}

export async function updateStats(isCorrect) {
  try {
    if (typeof isCorrect !== 'boolean') {
      throw new Error('Invalid isCorrect parameter');
    }
    
    const response = await fetch(`${API_BASE_URL}/stats/attempt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isCorrect }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur de mise à jour des statistiques');
    }
    
    const data = await response.json();
    if (!data || !data.success) {
      throw new Error('Réponse invalide du serveur');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating stats:', error);
    throw new Error('Impossible de mettre à jour les statistiques. Veuillez réessayer.');
  }
}