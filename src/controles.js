//controle pc
export function controlePc(event, gameState) {
  switch (event.keyCode) {
    case 37:
      gameState.vel.x = -gameState.velocidade;
      gameState.vel.y = 0;
      break;
    case 38:
      gameState.vel.y  = -gameState.velocidade;
      gameState.vel.x = 0;
      break;
    case 39:
      gameState.vel.x = gameState.velocidade;
      gameState.vel.y = 0;
      break;
    case 40:
      gameState.vel.y = gameState.velocidade;
      gameState.velX = 0;
      break;
    default:
      break;
  }
}

//controle mobile
export function controleMobile(gameState) {
  document.querySelector("#cima").addEventListener('touchstart', () => {
    gameState.vel.y = -gameState.velocidade;
    gameState.vel.x = 0;
    navigator.vibrate?.(30);
  }, false);
  
  document.querySelector("#baixo").addEventListener('touchstart', () => {
    gameState.vel.y = gameState.velocidade;
    gameState.vel.x = 0;
    navigator.vibrate?.(30);
  }, false);
  
  document.querySelector("#esquerda").addEventListener('touchstart', () => {
    gameState.vel.x = -gameState.velocidade;
    gameState.vel.y = 0;
    navigator.vibrate?.(30);
  }, false);
  
  document.querySelector("#direita").addEventListener('touchstart', () => {
    gameState.vel.x = gameState.velocidade;
    gameState.vel.y = 0;
    navigator.vibrate?.(30);
  }, false);
}
