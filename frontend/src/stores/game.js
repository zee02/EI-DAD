import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from './auth'
import { useAPIStore } from './api'

export const useGameStore = defineStore('game', () => {
    // ESTADO
    const difficulties = ref([
        { value: 'easy', label: 'Easy', description: '4x2 grid' },
        { value: 'medium', label: 'Medium', description: '4x3 grid' },
        { value: 'hard', label: 'Hard', description: '4x4 grid' },
    ])
    const difficulty = ref('medium')
    const cards = ref([])
    const flippedCards = ref([])
    const matchedPairs = ref([])
    const moves = ref(0)
    const beganAt = ref(undefined)
    const endedAt = ref(undefined)
    
    // ESTADO MULTIPLAYER (Passo 19, 30)
    const games = ref([]) 
    const multiplayerGame = ref({}) 

    // STORES/SOCKET
    const socket = inject('socket')
    const authStore = useAuthStore()
    const apiStore = useAPIStore()

    // COMPUTED
    const isGameComplete = computed(() => {
        if (cards.value.length === 0) return false
        return matchedPairs.value.length === cards.value.length
    })
    const gameTime = computed(() => {
        if (!beganAt.value) return 0 
        const start = new Date(beganAt.value).getTime()
        const end = endedAt.value ? new Date(endedAt.value).getTime() : Date.now()
        return Math.max(0, (end - start) / 1000) 
    })
    const myGames = computed(() => {
        return games.value.filter((game) => game.creator === authStore.currentUserID)
    })
    const availableGames = computed(() => {
        return games.value.filter((game) => game.creator !== authStore.currentUserID)
    })

    // FUNÇÕES
    const setGames = (newGames) => {
        games.value = newGames
        console.log(`[Game] Games changed (game count: ${games.value.length})`)
    }
    const setMultiplayerGame = (game) => {
        multiplayerGame.value = game
        console.log(`[Game] Multiplayer Game changed (game moves: ${game.moves})`)
    }
    const createGame = (difficulty = 'medium') => {
        if (!authStore.currentUser || !socket || !socket.connected) {
            toast.error('Must be logged in and connected to create a game.')
            return
        }
        socket.emit('create-game', difficulty)
    }
    const cancelGame = (gameID) => { // Ajuste Final
        if (!socket || !socket.connected) {
            toast.error('Not connected to server.')
            return;
        }
        socket.emit('cancel-game', gameID);
    }
    const saveGame = async () => {
        // ... (lógica de save game via API) ...
    }

    // ... (restante das funções como setBoard, flipCard, etc.) ...
    
    return {
        difficulties, difficulty, cards, moves,
        isGameComplete, gameTime,
        games, multiplayerGame, myGames, availableGames,
        setGames, setMultiplayerGame, createGame, cancelGame, saveGame
        // ...
    }
})