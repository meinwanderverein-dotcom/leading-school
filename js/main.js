/* leading:school – Interaktionen
   Header-Scroll, mobiles Menü, Reveal-Animationen, Kontaktformular. */

(function(){
  // Header: bei Scroll Hintergrund + Trennlinie einblenden
  var header = document.getElementById('siteHeader');
  function onScroll(){
    header.classList.toggle('scrolled', window.scrollY > 16);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Mobiles Menü
  var menu = document.getElementById('mobileMenu');
  var menuBtn = document.getElementById('menuBtn');
  var menuClose = document.getElementById('menuClose');
  function setMenu(open){
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function(){ setMenu(true); });
  menuClose.addEventListener('click', function(){ setMenu(false); });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setMenu(false); });
  });

  // Reveal-Animationen beim Scrollen
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold:0, rootMargin:'0px 0px -40px 0px' });
    items.forEach(function(el){ io.observe(el); });
    setTimeout(function(){
      items.forEach(function(el){
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('in');
      });
    }, 100);
  }

  // Kontaktformular – Web3Forms
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    if (form.website.value) return; // Honeypot
    var ok = true;
    ['name','email','message'].forEach(function(id){
      var f = document.getElementById(id);
      var valid = f.value.trim() && (id !== 'email' || f.checkValidity());
      f.style.borderColor = valid ? '' : '#c0452c';
      if (!valid) ok = false;
    });
    if (!ok) return;
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.style.opacity = '.6';
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form)
    })
    .then(function(res){ return res.json(); })
    .then(function(json){
      if (json.success) {
        success.classList.add('show');
      } else {
        btn.disabled = false;
        btn.style.opacity = '';
        alert('Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.');
      }
    })
    .catch(function(){
      btn.disabled = false;
      btn.style.opacity = '';
      alert('Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    });
  });
})();
