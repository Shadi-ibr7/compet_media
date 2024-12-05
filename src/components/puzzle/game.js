document.addEventListener('alpine:init', () => {
  Alpine.data('puzzleGame', () => ({
      loading: false,
      error: null,
      selectedPieces: [],
      availablePieces: [...puzzleData.pieces],
      message: '',
      isCorrect: null,
      showExplanation: false,
      puzzleData,

      selectPiece(piece, index) {
          this.selectedPieces.push(piece);
          this.availablePieces.splice(index, 1);
          this.checkAnswer();
      },

      removePiece(piece, index) {
          this.availablePieces.push(piece);
          this.selectedPieces.splice(index, 1);
          this.message = '';
          this.isCorrect = null;
          this.showExplanation = false;
      },

      checkAnswer() {
          const answer = this.selectedPieces.join(' ');
          if (answer === puzzleData.fakeNews) {
              this.isCorrect = true;
              this.showExplanation = true;
              this.message = 'Bravo ! Vous avez correctement reconstitué la fausse information !';
          } else if (this.selectedPieces.length === puzzleData.pieces.length) {
              this.isCorrect = false;
              this.message = "Ce n'est pas la bonne combinaison. Essayez encore !";
          }
      },

      reset() {
          this.selectedPieces = [];
          this.availablePieces = [...puzzleData.pieces];
          this.message = '';
          this.isCorrect = null;
          this.showExplanation = false;
      }
  }));
});