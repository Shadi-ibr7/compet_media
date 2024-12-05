document.addEventListener('alpine:init', () => {
  Alpine.data('puzzleGame', () => ({
      loading: true,
      error: null,
      selectedPieces: [],
      availablePieces: [],
      message: '',
      isCorrect: false,
      showExplanation: false,
      puzzleData: null,
      apiKeyConfigured: false,

      async init() {
          this.loading = true;
          try {
              const apiKey = localStorage.getItem('OPENAI_API_KEY');
              if (!apiKey) {
                  this.error = "Veuillez configurer votre clé API OpenAI";
                  this.showApiKeyPrompt();
                  return;
              }
              await this.generateNewPuzzle();
          } catch (err) {
              this.error = "Erreur lors du chargement du jeu: " + err.message;
          } finally {
              this.loading = false;
          }
      },

      async generateNewPuzzle() {
          const apiKey = localStorage.getItem('OPENAI_API_KEY');
          try {
              const response = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${apiKey}`
                  },
                  body: JSON.stringify({
                      model: "gpt-4",
                      messages: [{
                          role: "system",
                          content: "Génère une fausse information historique sous forme de phrase simple, avec son explication et sa version correcte. Format: {fakeNews, realNews, explanation}"
                      }],
                      temperature: 0.7
                  })
              });

              if (!response.ok) {
                  throw new Error('Erreur API OpenAI');
              }

              const data = await response.json();
              const generatedContent = JSON.parse(data.choices[0].message.content);
              
              this.puzzleData = {
                  ...generatedContent,
                  pieces: generatedContent.fakeNews.split(' ')
              };
              
              this.availablePieces = [...this.puzzleData.pieces];
              this.selectedPieces = [];
              this.message = '';
              this.showExplanation = false;
              this.isCorrect = false;
          } catch (err) {
              this.error = "Erreur lors de la génération du puzzle: " + err.message;
          }
      },

      showApiKeyPrompt() {
          const apiKey = prompt("Veuillez entrer votre clé API OpenAI:");
          if (apiKey) {
              localStorage.setItem('OPENAI_API_KEY', apiKey);
              this.init();
          }
      },

      selectPiece(piece, index) {
          this.selectedPieces.push(piece);
          this.availablePieces.splice(index, 1);
          this.checkAnswer();
      },

      removePiece(piece, index) {
          this.availablePieces.push(piece);
          this.selectedPieces.splice(index, 1);
          this.message = '';
          this.showExplanation = false;
      },

      checkAnswer() {
          const answer = this.selectedPieces.join(' ');
          if (answer === this.puzzleData.fakeNews) {
              this.isCorrect = true;
              this.message = "Bravo ! Vous avez correctement reconstitué la fausse information !";
              this.showExplanation = true;
          } else if (this.selectedPieces.length === this.puzzleData.pieces.length) {
              this.isCorrect = false;
              this.message = "Ce n'est pas la bonne combinaison. Essayez encore !";
          }
      },

      reset() {
          this.generateNewPuzzle();
      }
  }));
});