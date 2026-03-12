/* ===== WOOHOO.IN REDESIGN — app.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger Menu ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // ── Scroll animations (Intersection Observer) ──
  const animateEls = document.querySelectorAll('.card, .cat-card, .step, .occasion-card, .benefit-card, .use-case, .occ-detail-card, .stat-card, .value-card, .trust-item');
  if (animateEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${(i % 8) * 60}ms`;
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // CSS class for animation
  const style = document.createElement('style');
  style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
      } else {
        navbar.style.boxShadow = 'none';
      }
      lastScroll = scrollY;
    });
  }

  // ── Hero search ──
  const heroSearch = document.querySelector('.hero-search input');
  const heroBtn = document.querySelector('.hero-search button');
  if (heroBtn && heroSearch) {
    heroBtn.addEventListener('click', () => {
      const q = heroSearch.value.trim();
      if (q) window.location.href = `gift-cards.html?search=${encodeURIComponent(q)}`;
    });
    heroSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter') heroBtn.click();
    });
  }

  // ── Browse page: search filter ──
  const browseSearch = document.getElementById('browse-search');
  if (browseSearch) {
    // Pre-fill from URL param
    const params = new URLSearchParams(window.location.search);
    const sq = params.get('search');
    if (sq) {
      browseSearch.value = sq;
      filterCards(sq);
    }

    browseSearch.addEventListener('input', () => filterCards(browseSearch.value));
  }

  function filterCards(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.browse-grid .card').forEach(card => {
      const name = card.querySelector('.card-name')?.textContent.toLowerCase() || '';
      card.style.display = name.includes(q) ? '' : 'none';
    });
  }

  // ── Sort ──
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const grid = document.querySelector('.browse-grid');
      if (!grid) return;
      const cards = [...grid.children];
      cards.sort((a, b) => {
        if (sortSelect.value === 'name') {
          return a.querySelector('.card-name').textContent.localeCompare(b.querySelector('.card-name').textContent);
        }
        if (sortSelect.value === 'price') {
          const pa = parseInt(a.dataset.price || '0');
          const pb = parseInt(b.dataset.price || '0');
          return pa - pb;
        }
        // default: original order by data-index
        return (a.dataset.index || 0) - (b.dataset.index || 0);
      });
      cards.forEach(c => grid.appendChild(c));
    });
  }

  // ── Filter sidebar checkboxes ──
  const filterChecks = document.querySelectorAll('.filter-group input[type="checkbox"]');
  filterChecks.forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...document.querySelectorAll('.filter-group input[type="checkbox"]:checked')];
      const categories = checked.map(c => c.value.toLowerCase());
      document.querySelectorAll('.browse-grid .card').forEach(card => {
        if (categories.length === 0) {
          card.style.display = '';
        } else {
          const cat = (card.dataset.category || '').toLowerCase();
          card.style.display = categories.includes(cat) ? '' : 'none';
        }
      });
    });
  });

  // ── Price range ──
  const priceRange = document.getElementById('price-range');
  const priceVal = document.getElementById('price-val');
  if (priceRange && priceVal) {
    priceRange.addEventListener('input', () => {
      priceVal.textContent = `₹${priceRange.value}`;
      document.querySelectorAll('.browse-grid .card').forEach(card => {
        const price = parseInt(card.dataset.price || '0');
        card.style.display = price <= parseInt(priceRange.value) ? '' : 'none';
      });
    });
  }

  // ── Corporate demo form ──
  const demoForm = document.getElementById('demo-form');
  if (demoForm) {
    demoForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = demoForm.querySelector('button');
      btn.textContent = '✓ Request Sent!';
      btn.style.background = '#2ECC71';
      setTimeout(() => {
        btn.textContent = 'Request a Demo';
        btn.style.background = '';
        demoForm.reset();
      }, 3000);
    });
  }

  // ── Active nav link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage) a.classList.add('active');
  });

  // ── Counter animation for stats ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.dataset.count;
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const num = parseInt(target);
          let current = 0;
          const step = Math.ceil(num / 60);
          const timer = setInterval(() => {
            current += step;
            if (current >= num) {
              current = num;
              clearInterval(timer);
            }
            el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
          }, 20);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
