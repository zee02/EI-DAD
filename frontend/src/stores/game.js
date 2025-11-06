import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue' // <-- Adicionar 'watch'

// --- 1. Persistência: Carregar High Scores do localStorage ---
// O localStorage armazena strings, por isso usamos JSON.parse para converter para array.
const storedScores = localStorage.getItem('memoryGameHighScores')
const initialHighScores = storedScores ? JSON.parse(storedScores) : []
// -----------------------------------------------------------

export const useGameStore = defineStore('game', () => {
    // --- Estado do Passo 11 ---
    const difficulties = [
        { value: 'easy', label: 'Easy', description: '4x2 grid' },
        { value: 'medium', label: 'Medium', description: '4x3 grid' },
        { value: 'hard', label: 'Hard', description: '4x4 grid' },
    ]
    const difficulty = ref('medium')

    // --- Novo Estado (Passo 14) ---
    const options = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        return { face: i, matched: false, flipped: false }
    })
    const cards = ref([])
    const flippedCards = ref([])
    const matchedPairs = ref([])
    const moves = ref(0)

    // --- 2. NOVO Estado para Timer e High Scores (Passos 24, 23) ---
    const startTime = ref(0) // Timestamp (ms) do início do jogo
    const endTime = ref(0)   // Timestamp (ms) do fim do jogo
    const highScores = ref(initialHighScores) // Inicializa com scores do localStorage
    // -------------------------------------------------------------

    // --- Computadas Existentes ---
    const isGameComplete = computed(() => {
        if (cards.value.length === 0) return false
        return matchedPairs.value.length === cards.value.length
    })

    // --- 3. NOVAS Computed Properties (Passos 25, 26) ---
    const gameTime = computed(() => {
        if (startTime.value === 0) return 0 // Jogo ainda não começou

        const end = endTime.value || Date.now() // Usa o tempo atual se o jogo ainda estiver a decorrer
        return (end - startTime.value) / 1000 // Tempo em segundos
    })

    const top3Scores = computed(() => {
        // Filtra por dificuldade, ordena pelo tempo (ascendente para melhor tempo) e pega os 3 primeiros
        return highScores.value
            .filter(score => score.difficulty === difficulty.value)
            .sort((a, b) => a.time - b.time) // Menor tempo é o melhor
            .slice(0, 3)
    })
    // -----------------------------------------------------

    // --- Funções Existentes ---
    const setBoard = () => {
        cards.value = []
        moves.value = 0
        flippedCards.value = []
        matchedPairs.value = []
        
        // --- Resetar Timer (Passo 24) ---
        startTime.value = 0
        endTime.value = 0
        // ---------------------------------
        
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
    
    // --- 4. NOVAS Funções para Timer e High Scores (Passos 24, 25) ---
    const startGameTimer = () => {
        startTime.value = Date.now()
        endTime.value = 0 // Garante que está resetado
    }

    const endGame = () => {
        if (startTime.value && !endTime.value) {
            endTime.value = Date.now()
            addHighScore(gameTime.value) // Chama para salvar a pontuação
        }
    }

    const addHighScore = (time) => {
        const newScore = {
            time: time,
            difficulty: difficulty.value,
            date: new Date().toISOString() // Para registar quando foi feito
        }
        highScores.value.push(newScore)
    }
    // -------------------------------------------------------------------
    
    // --- 5. Persistência: Observar High Scores e Salvar (Passo 27) ---
    // O 'deep: true' é necessário para observar mudanças dentro do array (adição de um novo score).
    watch(highScores, (newScores) => {
        localStorage.setItem('memoryGameHighScores', JSON.stringify(newScores))
    }, { deep: true })
    // -------------------------------------------------------------------

    return {
        // Estado
        difficulties,
        difficulty,
        cards,
        flippedCards,
        matchedPairs,
        moves,
        startTime, // NOVO
        endTime,   // NOVO
        highScores, // NOVO
        // Computadas
        isGameComplete,
        gameTime,   // NOVO
        top3Scores, // NOVO
        // Funções
        setBoard,
        flipCard,
        checkForMatch,
        startGameTimer, // NOVO
        endGame,        // NOVO
        addHighScore    // NOVO
    }
})