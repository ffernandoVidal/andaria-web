// Sistema UX mejorado para Paseo Andaria
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistemas UX
    initMobileMenu();
    initHeroCarousel();
    initScrollEffects();
    initFormValidation();
    initImageLazyLoading();
    initAccessibility();
    
    // Funcionalidad del menú móvil mejorada
    function initMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Toggle del menú móvil con animación mejorada
        mobileMenu?.addEventListener('click', function() {
            const isActive = mobileMenu.classList.contains('active');
            
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Añadir atributos de accesibilidad
            mobileMenu.setAttribute('aria-expanded', !isActive);
            navMenu.setAttribute('aria-hidden', isActive);
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.style.overflow = isActive ? 'auto' : 'hidden';
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu?.classList.remove('active');
                navMenu?.classList.remove('active');
                mobileMenu?.setAttribute('aria-expanded', 'false');
                navMenu?.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            });
        });

        // Cerrar menú con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
                mobileMenu?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Funcionalidad del carrusel hero mejorada
    function initHeroCarousel() {
        const heroSlides = document.querySelectorAll('.hero-slide');
        const heroPrevBtn = document.getElementById('heroPrevBtn');
        const heroNextBtn = document.getElementById('heroNextBtn');
        const heroIndicators = document.querySelectorAll('.hero-indicator');
        
        if (!heroSlides.length) return;
        
        // Detectar orientación de imágenes y aplicar clase apropiada
        heroSlides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                img.addEventListener('load', function() {
                    if (this.naturalWidth > this.naturalHeight) {
                        // Imagen horizontal
                        this.classList.add('horizontal-img');
                    } else {
                        // Imagen vertical
                        this.classList.add('vertical-img');
                    }
                });
                
                // Si la imagen ya está cargada
                if (img.complete) {
                    if (img.naturalWidth > img.naturalHeight) {
                        img.classList.add('horizontal-img');
                    } else {
                        img.classList.add('vertical-img');
                    }
                }
            }
        });
        
        let currentHeroSlide = 0;
        const totalHeroSlides = heroSlides.length;
        let heroAutoSlideInterval;
        
        // Función para mostrar slide del hero con animación suave
        function showHeroSlide(index) {
            // Remover clases activas con transición
            heroSlides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    setTimeout(() => slide.classList.add('active'), 50);
                }
            });
            
            heroIndicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
                indicator.setAttribute('aria-current', i === index ? 'true' : 'false');
            });
            
            currentHeroSlide = index;
        }
        
        // Función para siguiente slide del hero
        function nextHeroSlide() {
            const next = (currentHeroSlide + 1) % totalHeroSlides;
            showHeroSlide(next);
        }
        
        // Función para slide anterior del hero
        function prevHeroSlide() {
            const prev = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
            showHeroSlide(prev);
        }
        
        // Event listeners para botones del hero
        heroNextBtn?.addEventListener('click', () => {
            nextHeroSlide();
            resetAutoSlide();
        });
        heroPrevBtn?.addEventListener('click', () => {
            prevHeroSlide();
            resetAutoSlide();
        });
        
        // Event listeners para indicadores del hero
        heroIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                showHeroSlide(index);
                resetAutoSlide();
            });
        });
        
        // Función para reiniciar auto-slide
        function resetAutoSlide() {
            clearInterval(heroAutoSlideInterval);
            heroAutoSlideInterval = setInterval(nextHeroSlide, 6000);
        }
        
        // Auto-slide del hero
        resetAutoSlide();
        
        // Pausar auto-slide al hover
        const heroCarousel = document.querySelector('.hero-carousel');
        heroCarousel?.addEventListener('mouseenter', () => clearInterval(heroAutoSlideInterval));
        heroCarousel?.addEventListener('mouseleave', resetAutoSlide);
        
        // Control con teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                prevHeroSlide();
                resetAutoSlide();
            }
            if (e.key === 'ArrowRight') {
                nextHeroSlide();
                resetAutoSlide();
            }
        });
        
        // Touch/swipe support mejorado
        let heroTouchStartX = 0;
        let heroTouchEndX = 0;
        
        if (heroCarousel) {
            heroCarousel.addEventListener('touchstart', function(e) {
                heroTouchStartX = e.changedTouches[0].screenX;
            });
            
            heroCarousel.addEventListener('touchend', function(e) {
                heroTouchEndX = e.changedTouches[0].screenX;
                handleHeroSwipe();
            });
        }
        
        function handleHeroSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = heroTouchEndX - heroTouchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    prevHeroSlide();
                } else {
                    nextHeroSlide();
                }
                resetAutoSlide();
            }
        }
    }

    // Scroll suave para navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Resaltar enlace activo según scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Efecto parallax en hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Animación de aparición en scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.tienda-card, .evento-card, .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Funcionalidad del formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envío del formulario
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Mensaje enviado ✓';
                submitBtn.style.background = '#27ae60';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '#e74c3c';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }

    // Funcionalidad del botón CTA en hero
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const tiendasSection = document.querySelector('#tiendas');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = tiendasSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    // Efecto hover mejorado para las tarjetas de tiendas
    const tiendaCards = document.querySelectorAll('.tienda-card');
    tiendaCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contador animado para estadísticas
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    }

    // Observar estadísticas para animación de contador
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('h3');
                const target = parseInt(statNumber.textContent);
                
                if (!statNumber.dataset.animated) {
                    statNumber.textContent = '0';
                    animateCounter(statNumber, target);
                    statNumber.dataset.animated = 'true';
                }
            }
        });
    }, { threshold: 0.5 });

    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Funcionalidad de búsqueda (preparada para futuras implementaciones)
    function initSearch() {
        // Placeholder para funcionalidad de búsqueda de tiendas
        console.log('Búsqueda de tiendas lista para implementar');
    }

    // Funcionalidad de filtros (preparada para futuras implementaciones)
    function initFilters() {
        // Placeholder para filtros de categorías
        console.log('Filtros de categorías listos para implementar');
    }

    // Inicializar funcionalidades adicionales
    initSearch();
    initFilters();

    // Header con efecto al hacer scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - ocultar header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - mostrar header
            header.style.transform = 'translateY(0)';
        }
        
        // Cambiar fondo del header al hacer scroll
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Lazy loading para imágenes (cuando se agreguen)
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    initLazyLoading();

    // Funcionalidad para manejar eventos especiales
    function setupEventHandlers() {
        // Manejar clicks en eventos
        const eventCards = document.querySelectorAll('.evento-card');
        eventCards.forEach(card => {
            card.addEventListener('click', function() {
                // Aquí se puede agregar funcionalidad para mostrar más detalles del evento
                console.log('Evento seleccionado:', this.querySelector('h3').textContent);
            });
        });
    }

    setupEventHandlers();

    // Mensaje de bienvenida en consola
    console.log('🏬 Paseo Andaria - Sistema web cargado correctamente');
    console.log('✅ Todas las funcionalidades JavaScript están activas');
});

// Funciones utilitarias
const utils = {
    // Formatear números
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Validar email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Debounce para optimizar eventos
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
};

// Exportar funciones para uso global si es necesario
window.PaseoAndaria = {
    utils: utils,
    version: '1.0.0'
};