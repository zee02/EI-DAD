<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Single Player</CardTitle>
        <CardDescription>Test your memory by finding matching pairs!</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <p class="font-semibold text-lg">Choose Difficulty</p>
          
          <div class="flex gap-2">
            <Button
              v-for="level in gameStore.difficulties"
              :key="level.value"
              size="sm"
              :variant="selectedDifficulty === level.value ? 'default': 'outline'"
              class="h-auto flex-col items-start"
              @click="selectedDifficulty = level.value"
            >
              <span class="font-semibold">{{ level.label }}</span>
              <span class="text-xs opacity-70">{{ level.description }}</span>
            </Button>
          </div>
          
          <!-- NOVO: Secção de High Score (Passos 23, 26) -->
          <p class="font-semibold text-lg pt-4">🏆 Best Times ({{ selectedDifficulty.toUpperCase() }})</p>
          <div class="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 min-h-[100px]">
            <ul v-if="gameStore.top3Scores.length" class="space-y-1">
              <li 
                v-for="(score, index) in gameStore.top3Scores" 
                :key="score.date" 
                class="flex justify-between items-center text-sm"
              >
                <span :class="{'font-extrabold text-blue-600 dark:text-blue-400': index === 0}">
                  #{{ index + 1 }}
                </span>
                <span class="font-mono">{{ score.time.toFixed(3) }} s</span>
              </li>
            </ul>
            <p v-else class="text-gray-500 text-sm text-center pt-4">
              Play a game on this difficulty to set a record!
            </p>
          </div>
          <!-- Fim da NOVO Secção de High Score -->

        </div>
      </CardContent>
      <CardFooter>
        <Button @click="startGame" class="w-full">Start Game</Button>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>MultiPlayer</CardTitle>
        <CardDescription>Coming Soon!!</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Challenge your friends in a real-time memory battle.</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue' // Adicionar 'watch'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGameStore } from '@/stores/game';

const router = useRouter()
const gameStore = useGameStore()

// 12.1: Variável reativa local
const selectedDifficulty = ref(gameStore.difficulty) // Inicializa com a dificuldade atual da store

// NOVO: Quando a dificuldade local muda, atualizamos a store (e o top3Scores irá reagir)
watch(selectedDifficulty, (newDifficulty) => {
    // Isso garante que o topo3Scores no template se atualiza imediatamente quando muda a dificuldade
    gameStore.difficulty = newDifficulty; 
});

// 12.3: Novo método startGame
const startGame = () => {
  // 12.3.1: A store já tem a dificuldade correta graças ao 'watch' acima, mas definimos
  // novamente por segurança e clareza.
  gameStore.difficulty = selectedDifficulty.value
  // 12.3.2: Navegar para a página do jogo
  router.push({ name: 'singleplayer' })
}

// Inicializar a store com a dificuldade selecionada para que o top3Scores seja logo preenchido
gameStore.difficulty = selectedDifficulty.value
</script>