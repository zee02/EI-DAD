import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAPIStore } from './api.js'
import { useAuthStore } from './auth.js'

// import toast
import { toast } from 'vue-sonner'

export const useGameStore = defineStore('game', () => {
  const apiStore = useAPIStore()
  const authStore = useAuthStore()
  

  // Function to get scores from localStorage
  const getStoredScores = (diff) => {
    const stored = localStorage.getItem(`scores_${diff}`)
    return stored ? JSON.parse(stored) : []
  }

  // Initialize top3Scores
  const top3Scores = ref([])

  // Function to update top3Scores based on current difficulty
  const updateTop3Scores = (diff) => {
    const scores = getStoredScores(diff)
    top3Scores.value = scores
      .sort((a, b) => a.time - b.time)
      .slice(0, 3)
  }

  const difficulties = ref([
    { value: 'easy', label: 'Easy', description: '4x2 grid' },
    { value: 'medium', label: 'Medium', description: '4x3 grid' },
    { value: 'hard', label: 'Hard', description: '4x4 grid' },
  ])
  const difficulty = ref('medium')

  const options = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
    return { face: i, matched: false, flipped: false }
  })
  const cards = ref([])
  const flippedCards = ref([])
  const matchedPairs = ref([])
  const moves = ref(0)
  const beganAt = ref(undefined)
  const endedAt = ref(undefined)

  const isGameComplete = computed(() => {
    if (cards.value.length === 0) return false
    return matchedPairs.value.length === cards.value.length
  })

  const gameTime = computed(() => {
    if (!beganAt.value) return 0
    const endTime = endedAt.value || new Date()
    return (endTime - beganAt.value) / 1000
  })

  const startGameTimer = () => {
    beganAt.value = new Date()
    endedAt.value = undefined
  }

  const setBoard = () => {
    cards.value = []
    flippedCards.value = []
    matchedPairs.value = []

    moves.value = 0

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
      const j = Math.floor(Math.random() * (i + 1))
      ;[cards.value[i], cards.value[j]] = [cards.value[j], cards.value[i]]
    }

    beganAt.value = new Date()
  }

  const flipCard = (card) => {
    if (flippedCards.value.includes(card.id)) return
    if (matchedPairs.value.includes(card.id)) return
    if (flippedCards.value.length >= 2) return

    flippedCards.value.push(card.id)
    card.flipped = true
    if (flippedCards.value.length == 2) {
      moves.value++
      checkForMatch()
    }
  }

  const checkForMatch = () => {
    if (flippedCards.value.length !== 2) return

    const [first, second] = flippedCards.value
    const firstCard = cards.value.find((c) => c.id === first)
    const secondCard = cards.value.find((c) => c.id === second)

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

  const saveGame = async () => {
    const game = {
      type: 'S',
      status: 'E',
      // If user is logged in, attach their id as player1_id
      player1_id: authStore.currentUser?.value ? authStore.currentUser.value.id : undefined,
      player1_moves: moves.value,
      began_at: beganAt.value,
      ended_at: endedAt.value,
      total_time: Math.ceil((endedAt.value - beganAt.value) / 1000),
    }
    toast.promise(apiStore.postGame(game), {
      loading: 'Sending data to API...',
      success: () => {
        return `[API] Game saved successfully`
      },
      error: (data) => `[API] Error saving game - ${data?.response?.data?.message}`,
    })
  }

  watch(isGameComplete, (value) => {
    if (value) {
      endedAt.value = new Date()
      // Save the score and update top3
      const time = (endedAt.value - beganAt.value) / 1000
      const scores = getStoredScores(difficulty.value)
      scores.push({ time, date: new Date().toISOString() })
      localStorage.setItem(`scores_${difficulty.value}`, JSON.stringify(scores))
      updateTop3Scores(difficulty.value)
    }
  })

  // Watch for difficulty changes to update scores
  watch(difficulty, (newDifficulty) => {
    updateTop3Scores(newDifficulty)
  })

  // Initialize top3Scores for current difficulty
  updateTop3Scores(difficulty.value)

  return {
    difficulties,
    difficulty,
    cards,
    moves,
    isGameComplete,
    gameTime,
    top3Scores,
    setBoard,
    flipCard,
    checkForMatch,
    saveGame,
    startGameTimer,
  }
})
