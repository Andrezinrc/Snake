export function controlePc(event, gameState) {
  if (gameState.jogoPausado) return; 
  
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

export function controleSwipeMobile(gameState) {
  let startX = 0;
  let startY = 0;
  const minDist = 30;
  
  window.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });
  
  window.addEventListener('touchend', e => {
    const touch = e.changedTouches[0];
    const distX = touch.clientX - startX;
    const distY = touch.clientY - startY;
    
    if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > minDist) {
      if (distX > 0 && gameState.ultimaDirecao.x !== -1) {
        gameState.vel.x = 1 * gameState.velocidade;
        gameState.vel.y = 0;
        navigator.vibrate?.(30);
      } else if (distX < 0 && gameState.ultimaDirecao.x !== 1) {
        gameState.vel.x = -1 * gameState.velocidade;
        gameState.vel.y = 0;
        navigator.vibrate?.(30);
      }
    } else if (Math.abs(distY) > minDist) {
      if (distY > 0 && gameState.ultimaDirecao.y !== -1) {
        gameState.vel.x = 0;
        gameState.vel.y = 1 * gameState.velocidade;
        navigator.vibrate?.(30);
      } else if (distY < 0 && gameState.ultimaDirecao.y !== 1) {
        gameState.vel.x = 0;
        gameState.vel.y = -1 * gameState.velocidade;
        navigator.vibrate?.(30);
      }
    }
  });
}
