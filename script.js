/* =============================================
   LA CONSENTIDA — script.js
   ============================================= */

/* -----------------------------------------------
   1. ANIMACIÓN DE ENTRADA DEL LOGO AL CARGAR
   ----------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (logo) {
    // Pequeño delay para que la animación sea perceptible
    setTimeout(() => logo.classList.add('loaded'), 120);
  }
});

/* -----------------------------------------------
   2. NAVBAR — fondo al hacer scroll
   ----------------------------------------------- */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // ejecutar al inicio por si se carga en medio de la página

/* -----------------------------------------------
   3. MENÚ HAMBURGUESA — mobile
   ----------------------------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
  });

  // Cerrar al hacer click en un link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.innerHTML = '&#9776;';
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}

/* -----------------------------------------------
   4. SCROLL SUAVE — para navegadores que no lo
      soportan nativamente con scroll-behavior: smooth
   ----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

/* -----------------------------------------------
   5. FADE-UP AL HACER SCROLL — Intersection Observer
   ----------------------------------------------- */
const fadeTargets = document.querySelectorAll(
  '#nosotros .container, .menu-item, .gallery-grid img, .gallery-grid video, .contact-info, .contact-form, #footer .container'
);

fadeTargets.forEach(el => el.classList.add('fade-up'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Escalonar elementos hijos (cards del menú, galería)
      const delay = entry.target.closest('.menu-grid, .gallery-grid') ? i * 60 : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeTargets.forEach(el => fadeObserver.observe(el));

/* -----------------------------------------------
   6. PARALLAX SUAVE EN EL HERO
   ----------------------------------------------- */
const hero = document.getElementById('hero');

function handleParallax() {
  if (!hero) return;
  // Solo en desktop (background-attachment: fixed en mobile da problemas)
  if (window.innerWidth > 640) {
    const scrolled = window.scrollY;
    hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.3}px)`;
  }
}

window.addEventListener('scroll', handleParallax, { passive: true });

/* -----------------------------------------------
   7. TABS / FILTROS DEL MENÚ
   ----------------------------------------------- */
function buildMenuTabs() {
  const menuSection = document.getElementById('menu');
  if (!menuSection) return;

  const categories = menuSection.querySelectorAll('.menu-category');
  if (categories.length === 0) return;

  // Crear contenedor de tabs si no existe
  const h2 = menuSection.querySelector('h2');
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'menu-tabs';

  // Tab "Todos"
  const allTab = document.createElement('button');
  allTab.className = 'tab-btn active';
  allTab.dataset.tab = 'all';
  allTab.textContent = 'Todos';
  tabsContainer.appendChild(allTab);

  // Tabs por categoría
  categories.forEach(cat => {
    const catTitle = cat.querySelector('h3');
    if (!catTitle) return;
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.dataset.tab = cat.id || catTitle.textContent.trim().toLowerCase();
    btn.textContent = catTitle.textContent.trim();

    // Asignar id a la categoría si no tiene
    if (!cat.id) {
      cat.id = catTitle.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    }
    tabsContainer.appendChild(btn);
  });

  // Insertar después del h2
  h2.insertAdjacentElement('afterend', tabsContainer);

  // Mostrar todas las categorías al inicio
  categories.forEach(cat => cat.classList.add('active'));

  // Lógica de filtro
  tabsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selected = btn.dataset.tab;

    categories.forEach(cat => {
      if (selected === 'all') {
        cat.classList.add('active');
      } else {
        const match = cat.id === selected || cat.id === selected.toLowerCase();
        cat.classList.toggle('active', match);
      }
    });
  });
}

buildMenuTabs();

/* -----------------------------------------------
   8. HOVER EN CARDS — (manejado en CSS, pero el JS
      puede añadir clase para efectos adicionales)
   ----------------------------------------------- */
document.querySelectorAll('.menu-item').forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('hovered'));
  card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
});

/* -----------------------------------------------
   9. BOTÓN WHATSAPP FLOTANTE — inserción dinámica
   ----------------------------------------------- */
function insertWhatsAppButton() {
  const phone = '5491100000000'; // ← reemplazar con número real
  const message = encodeURIComponent('¡Hola! Quería hacer una consulta sobre La Consentida.');

  const btn = document.createElement('a');
  btn.href = `https://wa.me/${phone}?text=${message}`;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.className = 'whatsapp-btn';
  btn.setAttribute('aria-label', 'Contactar por WhatsApp');

  btn.innerHTML = `
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.454-2.013A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.894 22.477c-.334.94-1.658 1.72-2.724 1.948-.726.152-1.675.274-4.865-1.045-4.087-1.655-6.72-5.792-6.923-6.06-.196-.268-1.64-2.18-1.64-4.16s1.027-2.952 1.41-3.356c.334-.35.726-.437 1.018-.437.293 0 .495.006.713.013.228.008.537-.086.84.64.314.746 1.066 2.584 1.159 2.773.093.19.155.413.03.666-.117.246-.176.399-.35.614-.175.215-.366.48-.524.645-.175.182-.357.378-.153.74.204.362.906 1.496 1.944 2.422 1.337 1.19 2.464 1.558 2.814 1.733.35.175.555.146.76-.088.204-.234.877-1.02 1.11-1.37.234-.35.468-.292.79-.175.32.117 2.042.962 2.392 1.137.35.175.585.262.672.407.087.145.087.837-.247 1.777z"/>
    </svg>
  `;

  document.body.appendChild(btn);
}

insertWhatsAppButton();

/* -----------------------------------------------
   10. MOVER CUERPO DE CADA MENU-ITEM AL DIV BODY
       (estructura semántica generada desde HTML)
   ----------------------------------------------- */
function wrapMenuItemContent() {
  document.querySelectorAll('.menu-item').forEach(item => {
    // Si ya tiene .menu-item-body, no hacer nada
    if (item.querySelector('.menu-item-body')) return;

    const img = item.querySelector('img');
    const children = Array.from(item.children).filter(c => c !== img);

    if (children.length > 0) {
      const body = document.createElement('div');
      body.className = 'menu-item-body';
      children.forEach(c => body.appendChild(c));
      item.appendChild(body);
    }
  });
}

wrapMenuItemContent();
