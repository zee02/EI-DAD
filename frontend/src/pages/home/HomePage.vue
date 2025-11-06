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
            <Button v-for="level in gameStore.difficulties" :key="level.value" size="sm"
              :variant="selectedDifficulty === level.value ? 'default' : 'outline'" class="h-auto flex-col items-start"
              @click="selectedDifficulty = level.value">
              <span class="font-semibold">{{ level.label }}</span>
              <span class="text-xs opacity-70">{{ level.description }}</span>
            </Button>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">High Scores (local)</label>
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="max-h-64 overflow-y-auto">
                <div v-if="highScores.length === 0" class="p-6 text-center text-sm text-muted-foreground">
                  No high scores yet. Be the first!
                </div>
                <div v-else class="divide-y">
                  <div v-for="(score, index) in highScores" :key="index"
                    class="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                    <div class="flex items-center gap-3">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                        :class="{
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': index === 0,
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': index === 1,
                          'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300': index === 2,
                          'bg-muted text-muted-foreground': index > 2
                        }">
                        {{ index + 1 }}
                      </div>
                      <div>
                        <div class="font-medium text-sm">{{ score.moves }} Moves</div>
                        <div class="text-xs text-muted-foreground">{{ score.time }}s</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
import { useAPIStore } from '../../stores/api.js'
import { onMounted } from 'vue'


const router = useRouter()
const gameStore = useGameStore()


const apiStore = useAPIStore()
const highScores = ref([])

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

// onMounted method:
onMounted(async () => {
  const response = await apiStore.getGames()

  highScores.value = response.data.data
		.map(item => ({
			moves: item.player1_moves,
      time: item.total_time,
      username: item.player1?.name
    }))
    .sort((a, b) => a.time - b.time == 0 ? a.moves - b.moves : a.time - b.time)
    .slice(0, 3)
})

</script>