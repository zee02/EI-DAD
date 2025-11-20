<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold">Multiplayer Game Lobby</h1>

    <Card class="bg-gray-50 dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Create New Game</CardTitle>
        <CardDescription>Choose a difficulty and invite a friend!</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        
        <div class="flex gap-2 justify-center">
          <Button
            v-for="level in gameStore.difficulties"
            :key="level.value"
            size="sm"
            :variant="selectedDifficulty === level.value ? 'default' : 'outline'"
            class="h-auto flex-col items-center p-3"
            @click="selectedDifficulty = level.value"
          >
            <span class="font-semibold">{{ level.label }}</span>
            <span class="text-xs opacity-70">{{ level.description }}</span>
          </Button>
        </div>
        
      </CardContent>
      <CardFooter class="flex justify-center">
        <Button 
          @click="createNewGame" 
          :disabled="!authStore.isLoggedIn || !joined" 
          class="w-full max-w-sm"
        >
          Create Game
        </Button>
      </CardFooter>
    </Card>

    <h2 class="text-2xl font-semibold border-b pb-2">
      Waiting for Opponent ({{ myGames.length }})
    </h2>
    <div class="space-y-4">
      <Card
        v-if="myGames.length > 0"
        v-for="game in myGames"
        :key="game.id"
        class="border-2 border-blue-500"
      >
        <CardHeader>
          <CardTitle class="text-lg">Your Game (ID: {{ game.id }})</CardTitle>
          <CardDescription>
            <span v-if="game.player2">Opponent joined!</span>
            <span v-else>Waiting for opponent...</span>
          </CardDescription>
        </CardHeader>
        <CardContent class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <span class="text-sm font-medium">Difficulty: {{ game.difficulty }}</span>
          </div>
          <div class="flex gap-2">
            <Button v-if="game.player2" @click="startGame(game)"> Start Game </Button>
            <Button @click="cancelGame(game.id)" variant="destructive"> Cancel Game </Button>
          </div>
        </CardContent>
      </Card>
      <p v-else class="text-gray-500">You have no games waiting.</p>
    </div>

    <div class="flex justify-between items-center border-b pb-2">
      <h2 class="text-2xl font-semibold">Available Games ({{ availableGames.length }})</h2>
      <Button @click="socketStore.emitGetGames()" variant="outline" size="sm">Refresh</Button>
    </div>

    <div class="space-y-4">
      <Card v-if="availableGames.length > 0" v-for="game in availableGames" :key="game.id">
        <CardContent class="flex justify-between items-center p-4">
          <div class="flex items-center gap-4">
            <span class="font-medium">Game {{ game.id }}</span>
            <span class="text-sm text-gray-500">Difficulty: {{ game.difficulty }}</span>
          </div>

          <Button
            @click="joinGame(game)"
            :disabled="game.player2 !== null || game.started"
          >
            Join Game
          </Button>
        </CardContent>
      </Card>
      <p v-else class="text-gray-500">No games currently available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useSocketStore } from '@/stores/socket'
import { useAuthStore } from '@/stores/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const router = useRouter()
const authStore = useAuthStore()
const gameStore = useGameStore()
const socketStore = useSocketStore()

// --- EXPOSIÇÃO DO ESTADO REATIVO (Obrigatorio para o template) ---
// Propriedades do Lobby da Game Store
const { myGames, availableGames } = storeToRefs(gameStore)
// Estado de Conexão da Socket Store (para desativar o botão 'Create Game')
const { joined } = storeToRefs(socketStore)

const selectedDifficulty = ref('medium')

// Cria um novo jogo (Passo 20.4)
const createNewGame = () => {
  gameStore.createGame(selectedDifficulty.value)
}

// Entra num jogo existente (Passo 29)
const joinGame = (game) => {
  socketStore.emitJoinGame(game) // Avisa o servidor para atribuir o Player 2
  startGame(game) // Redireciona o utilizador para a página do jogo
}

// Inicia/Continua o jogo (Passo 29)
const startGame = (game) => {
  gameStore.setMultiplayerGame(game) // Define o estado do jogo na store
  router.push({ name: 'multiplayer' })
}

// Cancela um jogo (Ajuste Final)
const cancelGame = (gameID) => {
  gameStore.cancelGame(gameID)
}

onMounted(() => {
  // Pede a lista de jogos ao carregar a página (Passo 20.4)
  socketStore.emitGetGames()
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>