<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Single Player</CardTitle>
        <CardDescription>Test your memory by finding matching pairs!</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <p>Choose Difficulty</p>
          
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
          
          <p>High Scores (local)</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button @click="startGame">Start Game</Button>
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
import { ref } from 'vue'
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
// Importar a store
import { useGameStore } from '@/stores/game';

const router = useRouter()
const gameStore = useGameStore()

// 12.1: Variável reativa local
const selectedDifficulty = ref('medium')

// 12.3: Novo método startGame
const startGame = () => {
  // 12.3.1: Definir a dificuldade na store
  gameStore.difficulty = selectedDifficulty.value
  // 12.3.2: Navegar para a página do jogo
  router.push({ name: 'singleplayer' })
}
</script>