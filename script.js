// Mohana Mehndi & Makeup — site behaviour
(function () {
  'use strict';
  var WA_NUMBER = '918110846493'; // WhatsApp number (country code + number, no + or spaces)

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); }
  });

  // Highlight active nav link while scrolling
  var links = nav.querySelectorAll('a:not(.btn)');
  var sections = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
  window.addEventListener('scroll', function () {
    var y = window.scrollY + 140, current = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) current = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }, { passive: true });

  // Clicking a service card pre-selects it in the booking form
  var select = document.getElementById('service');
  document.querySelectorAll('.card[data-service]').forEach(function (card) {
    card.addEventListener('click', function () { select.value = card.dataset.service; });
  });

  // No past dates
  var dateInput = document.getElementById('date');
  dateInput.min = new Date().toISOString().split('T')[0];

  // Booking form -> opens WhatsApp with the details pre-filled
  var form = document.getElementById('booking-form');
  var msg = document.getElementById('form-msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = ['name', 'phone', 'service', 'date', 'location'];
    var bad = fields.filter(function (id) {
      var el = document.getElementById(id);
      var ok = el.value.trim() !== '';
      if (id === 'phone') ok = /^[+\d][\d\s-]{8,14}$/.test(el.value.trim());
      el.classList.toggle('invalid', !ok);
      return !ok;
    });
    if (bad.length) {
      msg.hidden = false;
      msg.textContent = 'Please fill in all fields correctly' + (bad.indexOf('phone') > -1 ? ' (enter a valid phone number).' : '.');
      document.getElementById(bad[0]).focus();
      return;
    }
    msg.hidden = true;
    var d = new Date(dateInput.value + 'T00:00');
    var pretty = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    var text = 'Hello Mohana! I would like to book an appointment.\n\n' +
      'Name: ' + form.name.value.trim() + '\n' +
      'Phone: ' + form.phone.value.trim() + '\n' +
      'Service: ' + select.value + '\n' +
      'Event date: ' + pretty + '\n' +
      'Location: ' + form.location.value.trim();
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    form.reset();
  });
  form.addEventListener('input', function (e) { e.target.classList.remove('invalid'); });
})();
