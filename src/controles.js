export function controlePc(event, gameState) {
  switch (event.keyCode) {
    case 37: // esquerda
      if (gameState.ultimaDirecao.x !== gameState.velocidade) {
        gameState.vel.x = -gameState.velocidade;
        gameState.vel.y = 0;
      }
      break;
    case 38: // cima
      if (gameState.ultimaDirecao.y !== gameState.velocidade) {
        gameState.vel.y = -gameState.velocidade;
        gameState.vel.x = 0;
      }
      break;
    case 39: // direita
      if (gameState.ultimaDirecao.x !== -gameState.velocidade) {
        gameState.vel.x = gameState.velocidade;
        gameState.vel.y = 0;
      }
      break;
    case 40: // baixo
      if (gameState.ultimaDirecao.y !== -gameState.velocidade) {
        gameState.vel.y = gameState.velocidade;
        gameState.vel.x = 0;
      }
      break;
  }
}


export function controleMobile(gameState) {
  document.querySelector("#cima").addEventListener('touchstart', () => {
    if (gameState.ultimaDirecao.y !== gameState.velocidade) {
      gameState.vel.y = -gameState.velocidade;
      gameState.vel.x = 0;
    }
    navigator.vibrate?.(30);
  });
  
  document.querySelector("#baixo").addEventListener('touchstart', () => {
    if (gameState.ultimaDirecao.y !== -gameState.velocidade) {
      gameState.vel.y = gameState.velocidade;
      gameState.vel.x = 0;
    }
    navigator.vibrate?.(30);
  });
  
  document.querySelector("#esquerda").addEventListener('touchstart', () => {
    if (gameState.ultimaDirecao.x !== gameState.velocidade) {
      gameState.vel.x = -gameState.velocidade;
      gameState.vel.y = 0;
    }
    navigator.vibrate?.(30);
  });
  
  document.querySelector("#direita").addEventListener('touchstart', () => {
    if (gameState.ultimaDirecao.x !== -gameState.velocidade) {
      gameState.vel.x = gameState.velocidade;
      gameState.vel.y = 0;
    }
    navigator.vibrate?.(30);
  });
}