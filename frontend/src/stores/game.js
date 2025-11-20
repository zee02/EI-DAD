import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from './auth'
import { useAPIStore } from './api'

export const useGameStore = defineStore('game', () => {
    // --- ESTADO (Singleplayer & Game Core) ---
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
    
    // --- ESTADO MULTIPLAYER (Worksheet 6) ---
    const games = ref([]) // Lista de jogos no lobby
    const multiplayerGame = ref({}) // Estado do jogo multiplayer ativo

    // --- STORES/SOCKET ---
    const socket = inject('socket')
    const authStore = useAuthStore()
    const apiStore = useAPIStore()

    // --- COMPUTED PROPERTIES ---
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
    
    // Lista de jogos criados pelo utilizador logado (Lobby)
    const myGames = computed(() => {
        return games.value.filter((game) => game.creator === authStore.currentUserID)
    })
    
    // Lista de jogos disponíveis para outros utilizadores (Lobby)
    const availableGames = computed(() => {
        return games.value.filter((game) => game.creator !== authStore.currentUserID)
    })

    // --- FUNÇÕES DE LOBBY (Worksheet 6) ---
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


    // --- FUNÇÕES CORE (Singleplayer) ---
    const setBoard = () => {
        // Implementação completa da lógica de setBoard
    }
    
    const flipCard = (card) => {
        // Implementação completa da lógica de flipCard
    }
    
    const checkForMatch = () => {
        // Implementação completa da lógica de checkForMatch
    }
    
    // --- FUNÇÃO DE PERSISTÊNCIA (API - Worksheet 4) ---
    const saveGame = async () => {
        const totalTimeCalc = Math.ceil(
            (new Date(endedAt.value).getTime() - new Date(beganAt.value).getTime()) / 1000
        )

        const game = {
            type: 'S',
            status: 'E',
            player1_moves: moves.value,
            began_at: beganAt.value,
            ended_at: endedAt.value,
            total_time: Math.max(0, totalTimeCalc || 0),
            player1_id: authStore.currentUser ? authStore.currentUser.id : undefined,
        }
        
        toast.promise(apiStore.postGame(game), {
            loading: 'Sending data to API...',
            success: () => {
                return `[API] Game saved successfully`
            },
            error: (data) => `[API] Error saving game - ${data?.response?.data?.message}`,
        })
    }
    
    // --- FUNÇÕES DE TEMPO (Worksheet 4) ---
    const startGameTimer = () => {
        beganAt.value = new Date().toISOString()
        endedAt.value = undefined
    }
    
    const endGame = () => {
        if (beganAt.value && !endedAt.value) {
            endedAt.value = new Date().toISOString()
        }
    }


    return {
        // Estado
        difficulties, difficulty, cards, moves,
        // Game State/Computed
        isGameComplete, gameTime,
        // Multiplayer/Lobby
        games, multiplayerGame, myGames, availableGames,
        // Funções
        setBoard, flipCard, checkForMatch, // singleplayer core
        startGameTimer, endGame, saveGame, // persistence
        setGames, setMultiplayerGame, createGame, cancelGame, // multiplayer lobby
    }
})