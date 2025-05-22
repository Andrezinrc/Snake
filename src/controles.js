//controle pc
export function controlePc(event, estado) {
  switch (event.keyCode) {
    case 37:
      estado.velX = -estado.velocidade;
      estado.velY = 0;
      break;
    case 38:
      estado.velY = -estado.velocidade;
      estado.velX = 0;
      break;
    case 39:
      estado.velX = estado.velocidade;
      estado.velY = 0;
      break;
    case 40:
      estado.velY = estado.velocidade;
      estado.velX = 0;
      break;
    default:
      break;
  }
}

//controle mobile
export function controleMobile(estado) {
  document.querySelector("#cima").addEventListener('touchstart', () => {
    estado.velY = -estado.velocidade;
    estado.velX = 0;
  }, false);
  
  document.querySelector("#baixo").addEventListener('touchstart', () => {
    estado.velY = estado.velocidade;
    estado.velX = 0;
  }, false);
  
  document.querySelector("#esquerda").addEventListener('touchstart', () => {
    estado.velX = -estado.velocidade;
    estado.velY = 0;
  }, false);
  
  document.querySelector("#direita").addEventListener('touchstart', () => {
    estado.velX = estado.velocidade;
    estado.velY = 0;
  }, false);
}