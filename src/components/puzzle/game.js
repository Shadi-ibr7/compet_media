import { fetchRandomFact, verifyWithGPT, updateStats } from '../../services/api.js';

export function initPuzzleGame() {
  return {
    pieces: [],
    selectedPieces: [],
    isCorrect: false,
    showExplanation: false,
    message: '',
    loading: true,
    error: null,
    currentFact: {
      realNews: '',
      fakeNews: '',
      explanation: '',
      category: ''
    },
    
    async init() {
      try {
        this.loading = true;
        this.error = null;
        this.showExplanation = false;
        this.message = '';
        
        const fact = await fetchRandomFact();
        this.currentFact = fact;
        
        // Split and shuffle the fake news for the puzzle
        this.pieces = fact.fakeNews.split(/\s+/);
        this.pieces = this.shuffleArray(this.pieces);
        this.selectedPieces = [];
      } catch (error) {
        console.error('Error initializing game:', error);
        this.error = "Une erreur est survenue lors du chargement du jeu. Veuillez réessayer.";
      } finally {
        this.loading = false;
      }
    },
    
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },
    
    selectPiece(piece, index) {
      this.selectedPieces.push(piece);
      this.pieces = this.pieces.filter((_, i) => i !== index);
      this.checkSentence();
    },
    
    removePiece(piece, index) {
      this.pieces.push(piece);
      this.selectedPieces = this.selectedPieces.filter((_, i) => i !== index);
      this.message = '';
      this.showExplanation = false;
    },
    
    async checkSentence() {
      const currentSentence = this.selectedPieces.join(' ');
      if (currentSentence.trim() === '') return;

      if (this.selectedPieces.length === this.currentFact.fakeNews.split(/\s+/).length) {
        try {
          this.loading = true;
          const result = await verifyWithGPT(currentSentence);
          this.isCorrect = !result.isTrue;
          this.message = this.isCorrect ? 
            'Bravo ! Vous avez bien identifié une fausse information !' : 
            'Ce n\'est pas une fausse information, essayez encore !';
          this.showExplanation = true;
          
          await updateStats(this.isCorrect);
        } catch (error) {
          console.error('Error checking sentence:', error);
          this.error = "Une erreur est survenue lors de la vérification. Veuillez réessayer.";
        } finally {
          this.loading = false;
        }
      }
    },
    
    async reset() {
      await this.init();
    }
  };
}