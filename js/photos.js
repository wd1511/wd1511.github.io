(() => {
  const image = document.querySelector('#profile-photo');
  const link = document.querySelector('#portrait-link');
  const controls = document.querySelector('.photo-controls');
  const status = document.querySelector('#photo-status');
  if (!image || !link || !controls || !status) return;

  const buttons = Array.from(controls.querySelectorAll('button'));
  let request = 0;

  function showPhoto(index) {
    const button = buttons[index];
    const currentRequest = ++request;
    const next = new Image();
    status.textContent = '';

    // Load first, then replace the one visible image without changing the frame.
    next.onload = () => {
      if (currentRequest !== request) return;
      image.src = button.dataset.src;
      image.alt = button.dataset.alt;
      link.href = button.dataset.src;
      link.setAttribute('aria-label', button.dataset.viewLabel);
      buttons.forEach((item, i) => item.setAttribute('aria-pressed', String(i === index)));
      status.textContent = `Photo ${index + 1} of ${buttons.length}: ${button.dataset.alt}`;
    };
    next.onerror = () => {
      if (currentRequest === request) {
        status.textContent = 'This photo could not be loaded. Please try again.';
      }
    };
    next.src = button.dataset.src;
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => showPhoto(index));
    button.addEventListener('keydown', (event) => {
      const moves = { ArrowLeft: -1, ArrowRight: 1 };
      if (!(event.key in moves)) return;
      event.preventDefault();
      const next = (index + moves[event.key] + buttons.length) % buttons.length;
      buttons[next].focus();
      showPhoto(next);
    });
  });

  controls.hidden = false;
})();
