<template>
  <div class="space-y-6">
    <GameBoard :cards="gameStore.cards" @flip-card="flipCard"></GameBoard>
 </div>
</template>

<script setup>
import GameBoard from '@/components/teste/GameBoard.vue'
import { useGameStore } from '@/stores/game';
import { onMounted, watch } from 'vue'

const gameStore = useGameStore()

const flipCard = (card) => {
  gameStore.flipCard(card)
}

watch(() => gameStore.isGameComplete, (isComplete) => {
  if (isComplete) {
    alert(`Game Completed in ${gameStore.moves} moves`)
  }
})

onMounted(() => {
  gameStore.setBoard()
})
</script>