import { defineStore } from 'pinia'
import { ref, computed } from 'vue' // [cite: 169, 226]

export const useGameStore = defineStore('game', () => {
  // --- Estado do Passo 11 ---
  const difficulties = [
    { value: 'easy', label: 'Easy', description: '4x2 grid' },
    { value: 'medium', label: 'Medium', description: '4x3 grid' },
    { value: 'hard', label: 'Hard', description: '4x4 grid' },
  ]
  const difficulty = ref('medium')

  // --- Novo Estado (Passo 14) ---
  const options = [1,2,3,4,5,6,7,8].map((i) => {
    return { face: i, matched: false, flipped: false }
  })
  const cards = ref([])
  const flippedCards = ref([])
  const matchedPairs = ref([])
  const moves = ref(0)

  const isGameComplete = computed(() => {
    if (cards.value.length === 0) return false
    return matchedPairs.value.length === cards.value.length
  })

  // --- Novas Funções (Passo 14) ---
  const setBoard = () => {
    cards.value = []
    moves.value = 0
    flippedCards.value = [] // Resetar cartas viradas
    matchedPairs.value = [] // Resetar pares encontrados
    
    let numPairs = 4
    if (difficulty.value === 'medium') numPairs = 6
    if (difficulty.value === 'hard') numPairs = 8

    const boardOptions = options.slice(0, numPairs)
    let idCounter = 0
    
    boardOptions.forEach((option) => {
      cards.value.push({ id: idCounter++, ...option })
      cards.value.push({ id: idCounter++, ...option })
    })

    for (let i = cards.value.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards.value[i], cards.value[j]] = [cards.value[j], cards.value[i]]
    }
  }

  const flipCard = (card) => {
    if (flippedCards.value.includes(card.id)) return
    if (matchedPairs.value.includes(card.id)) return
    if (flippedCards.value.length >= 2) return

    flippedCards.value.push(card.id)
    card.flipped = true

    if (flippedCards.value.length === 2) {
      checkForMatch()
    }
  }

  const checkForMatch = () => {
    if (flippedCards.value.length !== 2) return

    const [first, second] = flippedCards.value
    const firstCard = cards.value.find((c) => c.id === first)
    const secondCard = cards.value.find((c) => c.id === second)

    moves.value++

    if (firstCard.face === secondCard.face) {
      matchedPairs.value.push(first, second)
      firstCard.matched = true
      secondCard.matched = true
      flippedCards.value = []
    } else {
      setTimeout(() => {
        firstCard.flipped = false
        secondCard.flipped = false
        flippedCards.value = []
      }, 1000)
    }
  }

  return {
    // Estado
    difficulties,
    difficulty,
    cards,
    flippedCards,
    matchedPairs,
    moves,
    // Computadas
    isGameComplete,
    // Funções
    setBoard,
    flipCard,
    checkForMatch
  }
})