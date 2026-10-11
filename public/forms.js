(() => {
  const today = new Date();
  const inputDate = date => date.toISOString().slice(0, 10);
  const nextDay = days => { const date = new Date(today); date.setDate(date.getDate() + days); return inputDate(date); };
  const toast = message => { const el = document.querySelector('#toast'); if (!el) return; el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 4400); };
  document.querySelectorAll('input[type="date"]').forEach((input, index) => { input.min = nextDay(index ? 3 : 1); input.value = nextDay(index ? 3 : 1); });

  document.querySelectorAll('[data-demo-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const isGroup = document.body.dataset.template === 'groups';
    const recipient = isGroup ? 'groups@destinationhostels.com' : 'reservations@destinationhostels.com';
    const subject = isGroup ? 'Destination Hostels group enquiry' : 'Destination Hostels website enquiry';
    const details = [...data.entries()].map(([key, value]) => `${key.replace(/\b\w/g, char => char.toUpperCase())}: ${value}`).join('\n');
    const message = form.querySelector('.form-message');
    message.innerHTML = `Your email app is opening. If it does not, write to <a href="mailto:${recipient}"><u>${recipient}</u></a>.`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(details)}`;
  }));

  const bookingLinks = {
    sunset: 'https://app.mews.com/distributor/401a721e-0f61-4d9a-9e85-b42500f6c58b',
    lisbon: 'https://app.mews.com/distributor/13d882ad-7478-409d-8f36-b42800c9b5cf',
    alfama: 'https://app.mews.com/distributor/ff15e99c-fc5f-4437-8a5c-b42500f6c58b',
    'arrifana-hostel': 'https://www.pousadasjuventude.pt/pt/pousadas/pousada-da-arrifana/',
    'arrifana-suites': 'https://app.mews.com/distributor/b9b7d1fb-edd3-4926-bad0-b41900cec6ad',
    'porto-santo': 'https://app.mews.com/distributor/990f2f04-89e9-46ca-9407-b3d4009e898a',
    'porto-santo-apartments': 'https://app.mews.com/distributor/eb8679a9-dd6a-4f28-a7a5-b41d0135eacc'
  };
  const booking = document.querySelector('[data-booking-form]');
  if (booking) {
    const preselectedStay = new URLSearchParams(location.search).get('stay');
    const staySelect = booking.querySelector('[name="stay"]');
    if (preselectedStay && bookingLinks[preselectedStay]) staySelect.value = preselectedStay;
    booking.addEventListener('submit', event => {
      event.preventDefault();
      const selected = staySelect.value;
      const message = booking.querySelector('.form-message');
      if (!selected) { message.textContent = 'Choose a destination to continue to live availability.'; return; }
      message.textContent = 'Taking you to live availability…';
      window.location.href = bookingLinks[selected];
    });
  }
})();
