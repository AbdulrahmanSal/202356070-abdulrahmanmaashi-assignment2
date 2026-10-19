/* =========================================================
   script.js
   Eight features, each in its own function:
     1. Theme toggle (light / dark, remembered between visits)
     2. Greeting that changes with the time of day
     3. Nav link highlighting as you scroll
     4. Project screenshot lightbox (click to view full size)
     5. Contact form validation
     6. Project filter (Assignment 2 — dynamic content)
     7. Dev-advice API fetch (Assignment 2 — data handling)
     8. Scroll-reveal animation (Assignment 2 — transitions)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  setUpThemeToggle();
  setGreeting();
  highlightNavOnScroll();
  setUpContactForm();
  setUpLightbox();
  setUpProjectFilter();
  setUpAdvice();
  setUpScrollReveal();
});

/* ---------- 1. Theme toggle ---------- */
function setUpThemeToggle() {
  var button = document.getElementById('theme-toggle');
  var label = document.getElementById('theme-toggle-label');
  if (!button || !label) return;

  // The inline script in index.html may already have applied a saved theme.
  // If it did not, fall back to whatever the operating system prefers.
  var current = document.documentElement.getAttribute('data-theme');
  if (!current) {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    current = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', current);
  }
  paint(current);

  button.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'light'
      : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    paint(next);

    // Storage can throw in private browsing, so the write is guarded.
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* The theme still applies for this visit; it just is not remembered. */
    }
  });

  // The button label names the theme you would switch TO, not the current one.
  function paint(theme) {
    var isDark = theme === 'dark';
    label.textContent = isDark ? 'Light' : 'Dark';
    button.setAttribute('aria-pressed', String(isDark));
  }
}

/* ---------- 2. Time-of-day greeting ---------- */
function setGreeting() {
  var target = document.getElementById('greeting');
  if (!target) return;

  var hour = new Date().getHours();
  var greeting;

  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  target.textContent = greeting + ' — welcome to my portfolio.';
}

/* ---------- 3. Nav highlighting ---------- */
function highlightNavOnScroll() {
  var links = document.querySelectorAll('.nav__list a');
  if (!links.length || !('IntersectionObserver' in window)) return;

  // Map each section id to its nav link so lookups are cheap while scrolling.
  var linkFor = {};
  var sections = [];

  links.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (!section) return;
    linkFor[id] = link;
    sections.push(section);
  });

  // rootMargin pushes the trigger line to the middle of the viewport, so a
  // section counts as "current" once it reaches the middle of the screen.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) { link.classList.remove('is-active'); });
      var active = linkFor[entry.target.id];
      if (active) active.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(function (section) { observer.observe(section); });
}

/* ---------- 4. Project screenshot lightbox ---------- */
function setUpLightbox() {
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var closeButton = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var thumbnails = document.querySelectorAll('.project__image');
  if (!lightbox || !lightboxImage || !thumbnails.length) return;

  var lastFocused = null;

  thumbnails.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      open(thumb.src, thumb.alt);
    });
  });

  closeButton.addEventListener('click', close);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) close(); // Click on the backdrop closes it.
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !lightbox.hidden) close();
  });

  function open(src, alt) {
    lastFocused = document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.hidden = false;
    closeButton.focus();
    document.body.style.overflow = 'hidden'; // Stop the page scrolling behind it.
  }

  function close() {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus(); // Return focus to the thumbnail that was clicked.
  }
}

/* ---------- 5. Contact form ---------- */
function setUpContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var fields = [
    { input: document.getElementById('name'),    error: document.getElementById('name-error') },
    { input: document.getElementById('email'),   error: document.getElementById('email-error') },
    { input: document.getElementById('message'), error: document.getElementById('message-error') }
  ];

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // No backend: the page must not reload.

    var firstInvalid = null;
    status.textContent = '';

    fields.forEach(function (field) {
      var problem = validate(field.input);
      field.error.textContent = problem;
      field.input.classList.toggle('is-invalid', Boolean(problem));
      if (problem && !firstInvalid) firstInvalid = field.input;
    });

    if (firstInvalid) {
      firstInvalid.focus(); // Send the keyboard straight to the first problem.
      return;
    }

    form.reset();
    status.textContent = 'Thanks — your message looks good. I will reply soon.';
  });

  // Clear a field's error as soon as the person fixes it.
  fields.forEach(function (field) {
    field.input.addEventListener('input', function () {
      if (!field.error.textContent) return;
      if (!validate(field.input)) {
        field.error.textContent = '';
        field.input.classList.remove('is-invalid');
      }
    });
  });

  // Returns an error message, or an empty string when the value is fine.
  function validate(input) {
    var value = input.value.trim();

    if (!value) {
      return 'Enter your ' + input.name + '.';
    }
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Enter an email address like name@example.com.';
    }
    if (input.name === 'message' && value.length < 10) {
      return 'Add a little more detail — at least 10 characters.';
    }
    return '';
  }
}

/* ---------- 6. Project filter (dynamic content) ---------- */
function setUpProjectFilter() {
  var buttons = document.querySelectorAll('.filter__btn');
  var cards = document.querySelectorAll('.project');
  var emptyMessage = document.getElementById('projects-empty');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      buttons.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
      applyFilter(button.dataset.filter);
    });
  });

  // Run once on load so the cards fade in, rather than appearing already
  // visible — this doubles as the page's entrance animation for them.
  applyFilter('all');

  function applyFilter(tag) {
    var anyVisible = false;

    cards.forEach(function (card) {
      var matches = tag === 'all' || card.dataset.tags === tag;

      if (matches) {
        anyVisible = true;
        card.hidden = false;
        // A frame has to pass before adding the class, or the browser
        // collapses the "hidden → visible" change into one step and the
        // fade never plays.
        requestAnimationFrame(function () { card.classList.add('is-visible'); });
      } else {
        card.classList.remove('is-visible');
        // Wait for the fade-out to finish before removing it from the
        // layout, so the card shrinks away instead of vanishing instantly.
        window.setTimeout(function () {
          if (!card.classList.contains('is-visible')) card.hidden = true;
        }, 250);
      }
    });

    if (emptyMessage) emptyMessage.hidden = anyVisible;
  }
}

/* ---------- 7. Dev-advice API fetch (data handling) ---------- */
function setUpAdvice() {
  var textEl = document.getElementById('advice-text');
  var button = document.getElementById('advice-refresh');
  if (!textEl || !button) return;

  var STORAGE_KEY = 'lastAdvice';
  var API_URL = 'https://api.adviceslip.com/advice';

  button.addEventListener('click', loadAdvice);
  loadAdvice(); // Show something as soon as the page opens.

  function loadAdvice() {
    textEl.classList.remove('is-error');
    textEl.textContent = 'Loading a tip…';
    button.disabled = true;

    // A public API can hang rather than fail outright, so give it a
    // deadline instead of waiting forever.
    var timeout = new Promise(function (_, reject) {
      window.setTimeout(function () { reject(new Error('timeout')); }, 6000);
    });

    Promise.race([fetch(API_URL), timeout])
      .then(function (response) {
        if (!response.ok) throw new Error('bad response');
        return response.json();
      })
      .then(function (data) {
        var advice = data.slip && data.slip.advice;
        if (!advice) throw new Error('unexpected shape');
        textEl.textContent = advice;
        try { localStorage.setItem(STORAGE_KEY, advice); } catch (e) { /* storage may be blocked */ }
      })
      .catch(function () {
        var cached = null;
        try { cached = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage may be blocked */ }

        if (cached) {
          textEl.textContent = cached + ' (saved tip — couldn’t reach the server just now)';
        } else {
          textEl.textContent = 'Couldn’t load a tip right now. Check your connection and try again.';
          textEl.classList.add('is-error');
        }
      })
      .finally(function () {
        button.disabled = false;
      });
  }
}

/* ---------- 8. Scroll-reveal animation (transitions) ---------- */
function setUpScrollReveal() {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // Reveal once; don't re-hide on scroll-up.
    });
  }, { threshold: 0.15 });

  targets.forEach(function (target) { observer.observe(target); });
}
