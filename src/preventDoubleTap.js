let lastTouch = 0;

document.querySelectorAll('#cima, #baixo, #esquerda, #direita, html, body').forEach(el => {
  el.addEventListener('touchstart', (e) => {
    const now = new Date().getTime();
    if (now - lastTouch <= 300) {
      e.preventDefault();
    }
    lastTouch = now;
  });
});
