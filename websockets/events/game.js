import { getUser } from "../state/connection.js" 
import { createGame, getGames, joinGame, flipCard, clearFlippedCard, removeGame } from "../state/game.js" 
import { server } from "../server.js"; 

// PASSO 37: Desvira as cartas após o timeout e emite a alteração
export const triggerFlipDelay = (game) => {
    // 1. Desvira as cartas e alterna o jogador no estado
    clearFlippedCard(game); 
    
    // 2. Envia o novo estado do jogo APENAS para os jogadores na sala
    server.io.to(`game-${game.id}`).emit("game-change", game);
};

export const handleGameEvents = (io, socket) => {
    
    // 1. Criar novo jogo
    socket.on("create-game", (difficulty) => { 
        const user = getUser(socket.id);
        const game = createGame(difficulty, user);
        
        socket.join(`game-${game.id}`);
        
        console.log(`[Game] User ${user.name} created a new game ID: ${game.id}`);
        
        // Broadcast para todos os clientes, atualizando o lobby
        io.emit("games", getGames()); 
    });

    // 2. Pedir lista de jogos
    socket.on("get-games", () => { 
        // Enviar a lista APENAS para o cliente que pediu
        socket.emit("games", getGames()); 
    });
    
    // 3. Entrar no Jogo (Passo 31)
    socket.on("join-game", (gameID, userID) => {
        const game = joinGame(gameID, userID);
        
        socket.join(`game-${gameID}`);
        
        console.log(`[Game] User ${userID} joined game ${gameID}`);
        
        // Atualiza o lobby para todos e envia o estado do jogo para a sala
        io.emit("games", getGames()); 
        io.to(`game-${gameID}`).emit("game-change", game); 
    });

    // 4. Virar Carta (Passo 31)
    socket.on("flip-card", (gameID, card) => {
        // Obter o ID do utilizador para a lógica de currentPlayer
        const user = getUser(socket.id);
        if (user) {
            card.userID = user.id;
        }

        const game = flipCard(gameID, card); 
        
        if (game) {
            // Envia o estado atualizado do jogo (com cartas viradas) APENAS para a sala
            io.to(`game-${gameID}`).emit("game-change", game);
        }
    });

    // 5. Cancelar Jogo (Ajuste Final)
    socket.on("cancel-game", (gameID) => {
        const user = getUser(socket.id);
        const game = games.get(gameID);

        // Apenas o criador pode cancelar e se o jogo não estiver completo/iniciado
        if (!game || game.creator !== user.id || game.started) {
            return; 
        }

        removeGame(gameID);
        console.log(`[Game] User ${user.name} cancelled game ID: ${gameID}`);

        // Avisa todos para atualizarem o lobby
        io.emit("games", getGames());
    });
};