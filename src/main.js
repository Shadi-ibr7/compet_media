import 'virtual:uno.css'
import Alpine from 'alpinejs'
import { initPuzzleGame } from './components/puzzle/game.js'

window.Alpine = Alpine

// Register the puzzle game component
Alpine.data('puzzleGame', initPuzzleGame)

// Initialize Alpine.js
Alpine.start()