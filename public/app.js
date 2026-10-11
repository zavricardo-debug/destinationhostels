(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const today = new Date();
  const toDateInput = (date) => date.toISOString().split('T')[0];
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today); dayAfterTomorrow.setDate(today.getDate() + 3);

  const checkin = $('#checkin');
  const checkout = $('#checkout');
  const dialogCheckin = $('#dialog-checkin');
  const dialogCheckout = $('#dialog-checkout');
  [checkin, dialogCheckin].forEach(input => { input.min = toDateInput(tomorrow); input.value = toDateInput(tomorrow); });
  [checkout, dialogCheckout].forEach(input => { input.min = toDateInput(dayAfterTomorrow); input.value = toDateInput(dayAfterTomorrow); });

  const updateCheckoutMinimum = (from, to) => {
    const selected = new Date(`${from.value}T12:00:00`);
    selected.setDate(selected.getDate() + 1);
    const min = toDateInput(selected);
    to.min = min;
    if (!to.value || to.value < min) to.value = min;
  };
  checkin.addEventListener('change', () => updateCheckoutMinimum(checkin, checkout));
  dialogCheckin.addEventListener('change', () => updateCheckoutMinimum(dialogCheckin, dialogCheckout));

  const dialog = $('#booking-dialog');
  const openBooking = (preferredDestination) => {
    if (preferredDestination) $('#dialog-destination').value = preferredDestination;
    dialog.showModal();
    window.setTimeout(() => $('#dialog-destination').focus(), 100);
  };
  $$('[data-open-booking]').forEach(button => button.addEventListener('click', () => openBooking()));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  const showToast = (message) => {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 4500);
  };

  $('#booking-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const destination = $('#destination').value;
    $('#dialog-destination').value = destination;
    $('#dialog-checkin').value = checkin.value;
    $('#dialog-checkout').value = checkout.value;
    openBooking(destination);
  });

  $('#dialog-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const place = $('#dialog-destination').value;
    dialog.close();
    showToast(`Great choice — we're finding the best stays in ${place}.`);
  });

  $$('.stay-card a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!link.getAttribute('href').includes('booking')) return;
      event.preventDefault();
      const card = link.closest('.stay-card');
      const place = $('.stay-place', card).textContent.trim();
      openBooking(place);
    });
  });
  $$('a[href="#booking"]').forEach((link) => {
    if (link.closest('.stay-card')) return;
    link.addEventListener('click', (event) => { event.preventDefault(); openBooking(); });
  });

  const menuButton = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
  });
  $$('#mobile-menu a').forEach(link => link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  $('.announcement-close').addEventListener('click', () => {
    const bar = $('.announcement-bar');
    bar.style.height = `${bar.offsetHeight}px`;
    requestAnimationFrame(() => { bar.style.transition = 'height .25s ease, opacity .2s'; bar.style.height = '0'; bar.style.opacity = '0'; });
    window.setTimeout(() => bar.remove(), 300);
  });

  const quotes = [
    { text: '“One of those rare places where it takes about five minutes to feel like you already belong.”', author: 'Maya R. ', place: '— London' },
    { text: '“The rooftop became our living room. The people we met there became our Portugal crew.”', author: 'Luca & Jules ', place: '— Berlin' },
    { text: '“Woke up to surf checks, ended the night around a table of new friends. Just perfect.”', author: 'Elena S. ', place: '— Barcelona' }
  ];
  let activeQuote = 0;
  const setQuote = (index) => {
    activeQuote = (index + quotes.length) % quotes.length;
    const quote = quotes[activeQuote];
    const quoteEl = $('#quote-text');
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(6px)';
    window.setTimeout(() => {
      quoteEl.textContent = quote.text;
      $('#quote-author').innerHTML = `${quote.author}<i>${quote.place}</i>`;
      $$('.quote-dots button').forEach((dot, i) => dot.classList.toggle('active', i === activeQuote));
      quoteEl.style.transition = 'opacity .25s, transform .25s';
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 120);
  };
  $('.quote-control.prev').addEventListener('click', () => setQuote(activeQuote - 1));
  $('.quote-control.next').addEventListener('click', () => setQuote(activeQuote + 1));
  $$('.quote-dots button').forEach((dot, index) => dot.addEventListener('click', () => setQuote(index)));

  $('#newsletter-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = $('input', event.currentTarget);
    const message = $('#newsletter-message');
    message.textContent = `Thanks — we'll send the good energy to ${input.value}.`;
    input.value = '';
  });
})();
