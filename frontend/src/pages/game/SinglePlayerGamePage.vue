<template>
  <div class="space-y-6 p-4">
    <div class="flex justify-between items-center text-xl font-semibold">
      <span>Moves: {{ gameStore.moves }}</span>
      <span>Time: {{ gameStore.gameTime.toFixed(3) }} s</span>
    </div>
    
    <GameBoard :cards="gameStore.cards" @flip-card="flipCard"></GameBoard>
  </div>
</template>

<script setup>
import GameBoard from '@/components/teste/GameBoard.vue' // Ajustei o path para 'game'
import { useGameStore } from '@/stores/game';
import { onMounted, watch } from 'vue'

const gameStore = useGameStore()

const flipCard = (card) => {
  gameStore.flipCard(card)
}

watch(() => gameStore.isGameComplete, (isComplete) => {
  if (isComplete) {
    // 2. Chamar endGame() para parar o timer e salvar o score
    gameStore.endGame()
    
    // Alerta com o tempo final
    alert(`Game Completed in ${gameStore.moves} moves and ${gameStore.gameTime.toFixed(3)} seconds!`)
  }
})

// Variável para o timer de atualização (Passo 25)
let timerInterval = null

onMounted(() => {
  // Configurar o tabuleiro
  gameStore.setBoard()
  
  // 1. Iniciar o timer do jogo
  gameStore.startGameTimer()
  
  // Opcional: Atualizar o tempo a cada 100ms para exibição em tempo real (Passo 25)
  // Isso faz com que a computed property gameTime seja reativa no template
  timerInterval = setInterval(() => {
    // Apenas força uma reavaliação da computed property (não altera o estado)
    if (!gameStore.isGameComplete) {
      // Simplesmente acede a uma propriedade para garantir reatividade
      const elapsed = gameStore.gameTime 
    } else {
      clearInterval(timerInterval)
    }
  }, 100)
})
</script>