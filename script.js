/**
 * VERAMENDI GESTIONES - ASESORAMIENTO PERSONALIZADO
 * Scripts interactivos para gestiones vehiculares
 * WhatsApp Oficial: +54 9 11 7238-9331 | Oficina en San Justo, Argentina
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar AOS (Animaciones Dinámicas al Navegar)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-quad',
      once: false, // Permitir que se re-animen al navegar entre pestañas
      offset: 35,
    });
  }

  // 2. Control de Navbar al hacer Scroll
  const mainHeader = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      mainHeader.classList.add('shadow-md', 'border-slate-300');
    } else {
      mainHeader.classList.remove('shadow-md', 'border-slate-300');
    }
  });

  // 3. Menú Móvil
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  const closeMobileMenu = () => {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      if (menuIcon) {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    }
  };

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isClosed = mobileMenu.classList.toggle('hidden');
      if (isClosed) {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      } else {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
      }
    });
  }

  // 4. TRANSICIONES DINÁMICAS AL CAMBIAR DE PESTAÑAS / SECCIONES
  const allTabLinks = document.querySelectorAll('a[href^="#"]');
  allTabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length <= 1) return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();

        // Cerrar menú móvil si estuviera abierto
        closeMobileMenu();

        // Actualizar visualmente enlace activo
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        const matchingNav = document.querySelector(`.nav-link[href="${targetId}"]`);
        if (matchingNav) matchingNav.classList.add('active');

        // Calcular posición exacta con offset para compensar el header sticky
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // Desplazamiento animado suave
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Aplicar animación dinámica de revelación a la sección seleccionada
        targetSection.classList.remove('tab-section-active');
        void targetSection.offsetWidth; // Forzar reflow para reiniciar la animación
        targetSection.classList.add('tab-section-active');

        // Añadir efecto de pulso o resplandor dinámico al badge/título de la sección
        const badge = targetSection.querySelector('span[class*="rounded"], .inline-block, .inline-flex');
        if (badge) {
          badge.classList.remove('tab-badge-glow');
          void badge.offsetWidth;
          badge.classList.add('tab-badge-glow');
        }

        // Refrescar AOS para que los elementos dentro de la sección se muevan
        if (typeof AOS !== 'undefined') {
          setTimeout(() => {
            AOS.refresh();
          }, 350);
        }

        // Limpiar clase de animación al terminar
        setTimeout(() => {
          targetSection.classList.remove('tab-section-active');
        }, 800);
      }
    });
  });

  // 5. PESTAÑAS INTERACTIVAS DE FILTRADO EN LA SECCIÓN SERVICIOS
  const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');

  if (serviceTabBtns.length > 0 && serviceCards.length > 0) {
    serviceTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remover clase activa de todos los botones
        serviceTabBtns.forEach(b => {
          b.classList.remove('active', 'bg-corp-900', 'text-white');
          b.classList.add('bg-white', 'text-slate-700');
        });

        // Activar botón seleccionado
        btn.classList.add('active', 'bg-corp-900', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-700');

        const filter = btn.getAttribute('data-filter');

        serviceCards.forEach(card => {
          const category = card.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden-tab');
            card.classList.add('visible-tab');
          } else {
            card.classList.remove('visible-tab');
            card.classList.add('hidden-tab');
          }
        });

        // Refrescar posiciones de AOS
        if (typeof AOS !== 'undefined') {
          setTimeout(() => {
            AOS.refresh();
          }, 200);
        }
      });
    });
  }

  // 6. Formulario Principal de Contacto -> Envío a WhatsApp
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('form-nombre').value.trim();
      const telefono = document.getElementById('form-telefono').value.trim();
      const patente = document.getElementById('form-patente').value.trim();
      const servicio = document.getElementById('form-servicio').value;
      const mensaje = document.getElementById('form-mensaje').value.trim();

      let text = `*CONSULTA VEHICULAR - VERAMENDI GESTIONES*%0A`;
      text += `━━━━━━━━━━━━━━━━━━━━━%0A`;
      text += `👤 *Nombre:* ${encodeURIComponent(nombre)}%0A`;
      text += `📱 *Teléfono:* ${encodeURIComponent(telefono)}%0A`;
      if (patente) {
        text += `🚗 *Patente:* ${encodeURIComponent(patente.toUpperCase())}%0A`;
      }
      text += `📋 *Servicio:* ${encodeURIComponent(servicio)}%0A`;
      text += `📝 *Detalle:* ${encodeURIComponent(mensaje)}%0A`;
      text += `━━━━━━━━━━━━━━━━━━━━━%0A`;
      text += `_Te asesoramos y gestionamos tu caso de principio a fin._`;

      const waUrl = `https://wa.me/5491172389331?text=${text}`;
      window.open(waUrl, '_blank');
    });
  }

  // 7. Acordeón FAQ
  const faqButtons = document.querySelectorAll('.faq-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isOpen = !content.classList.contains('hidden');

      faqButtons.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.classList.remove('active');
          otherBtn.nextElementSibling.classList.add('hidden');
        }
      });

      if (isOpen) {
        content.classList.add('hidden');
        btn.classList.remove('active');
      } else {
        content.classList.remove('hidden');
        btn.classList.add('active');
      }
    });
  });

  // 8. Contador Animado de Estadísticas
  const counterElements = document.querySelectorAll('.counter');
  let counted = false;

  const startCounters = () => {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800;
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString() + '+';
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString() + '+';
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('#beneficios');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          startCounters();
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  }

  // 9. Navegación activa dinámica al hacer scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 110;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
