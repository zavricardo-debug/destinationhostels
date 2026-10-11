(() => {
  const page = document.body.dataset.page || '';
  const nav = [
    ['stays.html', 'Stays', 'stays'],
    ['experiences.html', 'Experiences', 'experiences'],
    ['offers.html', 'Offers', 'offers'],
    ['about.html', 'Our story', 'about']
  ];
  const mark = `<svg class="brand-mark" viewBox="0 0 42 42" aria-hidden="true"><path d="M21 3c6.5 0 12 3.2 15.4 8.2L25.6 17 39 22.8C38.1 32 30.4 39 21 39 11.1 39 3 30.9 3 21S11.1 3 21 3Z" fill="currentColor"/><path d="m14 25.8 14-8.2-7 13.5-2.1-6.3-4.9 1.1Z" fill="#fdfbf7"/></svg>`;
  const brand = `<a class="brand" href="index.html" aria-label="Destination Hostels home">${mark}<span><b>destination</b><small>HOSTELS</small></span></a>`;
  const navLinks = nav.map(([href, label, key]) => `<a class="${page === key ? 'is-active' : ''}" href="${href}">${label}</a>`).join('');
  const header = document.querySelector('[data-shared-header]');
  const footer = document.querySelector('[data-shared-footer]');
  if (header) header.innerHTML = `<div class="mini-announcement"><span>✦</span> Slow down, stay longer — save 15% on 7+ nights <a href="offers.html">Explore offers →</a></div><div class="inner-nav section-shell">${brand}<nav aria-label="Main navigation">${navLinks}</nav><div class="nav-actions"><a class="nav-contact" href="contact.html">Contact</a><a class="nav-book" href="book.html">Book a stay <span>↗</span></a><button class="menu-toggle inner-menu-toggle" aria-label="Open navigation" aria-controls="mobile-nav" aria-expanded="false"><span></span><span></span></button></div><div class="inner-mobile-nav" id="mobile-nav" hidden>${navLinks}<a href="contact.html">Contact</a><a class="mobile-book" href="book.html">Book a stay <span>↗</span></a></div></div>`;
  if (footer) footer.innerHTML = `<div class="section-shell footer-top">${brand}<div class="footer-links"><div><b>Explore</b><a href="stays.html">Our stays</a><a href="experiences.html">Experiences</a><a href="offers.html">Offers</a><a href="journal.html">Journal</a></div><div><b>Good to know</b><a href="groups.html">Groups</a><a href="about.html">Our story</a><a href="contact.html">Contact</a><a href="book.html">Book a stay</a></div></div><form class="newsletter" data-newsletter><p><b>Keep the good energy coming.</b><span>Stories, offers and a little sunshine in your inbox.</span></p><label><input type="email" placeholder="Your email address" aria-label="Your email address" required><button aria-label="Sign up for newsletter">→</button></label><small aria-live="polite"></small></form></div><div class="section-shell footer-bottom"><span>© 2026 Destination Hostels</span><span>Made for meaningful detours</span><div><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/DestinationHostels" target="_blank" rel="noreferrer">Facebook</a><a href="contact.html">Talk to us</a></div></div>`;
  const toggle = document.querySelector('.inner-menu-toggle');
  const mobile = document.querySelector('.inner-mobile-nav');
  if (toggle && mobile) toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!open)); mobile.hidden = open; });
  document.querySelectorAll('[data-newsletter]').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); const input = form.querySelector('input'); form.querySelector('small').textContent = `Thanks — we’ll be in touch at ${input.value}.`; input.value = ''; }));
})();
