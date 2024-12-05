export function renderPuzzleGame(container, game) {
  const template = `
    <div class="bg-white rounded-xl shadow-lg p-8">
      <div x-show="loading" class="text-center py-8">
        <p class="text-gray-600">Chargement...</p>
      </div>

      <div x-show="error" class="bg-red-100 text-red-700 p-4 rounded-lg mb-6" x-text="error"></div>

      <div x-show="!loading && !error">
        <div class="mb-8">
          <h3 class="text-lg font-semibold mb-4">Reconstituez la fausse information :</h3>
          <div class="min-h-20 bg-gray-100 p-4 rounded-lg flex flex-wrap gap-2">
            <template x-for="(piece, index) in selectedPieces" :key="index">
              <button 
                @click="removePiece(piece, index)"
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                x-text="piece"
              ></button>
            </template>
          </div>
        </div>

        <div class="mb-8">
          <h3 class="text-lg font-semibold mb-4">Pièces disponibles :</h3>
          <div class="flex flex-wrap gap-2">
            <template x-for="(piece, index) in pieces" :key="index">
              <button 
                @click="selectPiece(piece, index)"
                class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
                x-text="piece"
              ></button>
            </template>
          </div>
        </div>

        <div x-show="message" 
             class="mb-6 p-4 rounded-lg"
             :class="isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
             x-text="message">
        </div>

        <div x-show="showExplanation && currentFact && currentFact.explanation" 
             class="bg-blue-50 p-4 rounded-lg text-blue-700 mb-6">
          <h3 class="font-semibold mb-2">Explication :</h3>
          <p x-text="currentFact.explanation"></p>
        </div>

        <button 
          @click="reset"
          class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Nouvelle phrase
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = template;
}