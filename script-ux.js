// Sistema UX avanzado para Paseo Andaria
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los sistemas UX
    initMobileMenu();
    initHeroCarousel();
    initScrollEffects();
    initFormValidation();
    initImageLazyLoading();
    initAccessibility();
    initFAQ();
    initAnimations();
    initPerformanceOptimizations();
    initBackToTop();
    initNavigationEnhancements();
    
    // Funcionalidad del menú móvil mejorada
    function initMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        mobileMenu?.addEventListener('click', function() {
            const isActive = mobileMenu.classList.contains('active');
            
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Atributos de accesibilidad
            mobileMenu.setAttribute('aria-expanded', !isActive);
            navMenu.setAttribute('aria-hidden', isActive);
            
            // Control de scroll del body
            document.body.style.overflow = isActive ? 'auto' : 'hidden';
        });

        // Cerrar menú con enlaces o Escape
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
                closeMenu();
            }
        });

        function closeMenu() {
            mobileMenu?.classList.remove('active');
            navMenu?.classList.remove('active');
            mobileMenu?.setAttribute('aria-expanded', 'false');
            navMenu?.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    }

    // Carrusel hero con mejoras UX
    function initHeroCarousel() {
        const heroSlides = document.querySelectorAll('.hero-slide');
        const heroPrevBtn = document.getElementById('heroPrevBtn');
        const heroNextBtn = document.getElementById('heroNextBtn');
        const heroIndicators = document.querySelectorAll('.hero-indicator');
        const heroCarousel = document.querySelector('.hero-carousel');
        
        if (!heroSlides.length) return;
        
        let currentHeroSlide = 0;
        const totalHeroSlides = heroSlides.length;
        let heroAutoSlideInterval;
        let isPlaying = true;
        
        // Mostrar slide con transición suave
        function showHeroSlide(index) {
            heroSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            heroIndicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
                indicator.setAttribute('aria-current', i === index ? 'true' : 'false');
            });
            
            currentHeroSlide = index;
            announceSlideChange(index + 1, totalHeroSlides);
        }
        
        // Anunciar cambio de slide para lectores de pantalla
        function announceSlideChange(current, total) {
            const announcement = `Imagen ${current} de ${total}`;
            const srAnnouncement = document.createElement('div');
            srAnnouncement.setAttribute('aria-live', 'polite');
            srAnnouncement.className = 'sr-only';
            srAnnouncement.textContent = announcement;
            document.body.appendChild(srAnnouncement);
            setTimeout(() => document.body.removeChild(srAnnouncement), 1000);
        }
        
        function nextHeroSlide() {
            const next = (currentHeroSlide + 1) % totalHeroSlides;
            showHeroSlide(next);
        }
        
        function prevHeroSlide() {
            const prev = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
            showHeroSlide(prev);
        }
        
        function startAutoSlide() {
            if (isPlaying) {
                heroAutoSlideInterval = setInterval(nextHeroSlide, 5000);
            }
        }
        
        function stopAutoSlide() {
            clearInterval(heroAutoSlideInterval);
        }
        
        // Event listeners
        heroNextBtn?.addEventListener('click', () => {
            nextHeroSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        
        heroPrevBtn?.addEventListener('click', () => {
            prevHeroSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        
        heroIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showHeroSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });
        
        // Control por teclado
        document.addEventListener('keydown', function(e) {
            if (heroCarousel?.contains(document.activeElement)) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevHeroSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextHeroSlide();
                }
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        heroCarousel?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        heroCarousel?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) nextHeroSlide();
                else prevHeroSlide();
                stopAutoSlide();
                startAutoSlide();
            }
        }
        
        // Pausar/reanudar con hover
        heroCarousel?.addEventListener('mouseenter', stopAutoSlide);
        heroCarousel?.addEventListener('mouseleave', startAutoSlide);
        
        // Pausar cuando la página no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoSlide();
                isPlaying = false;
            } else {
                isPlaying = true;
                startAutoSlide();
            }
        });
        
        // Inicializar
        startAutoSlide();
    }
    
    // Efectos de scroll y animaciones
    function initScrollEffects() {
        // Smooth scroll para navegación interna
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Intersection Observer para animaciones
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    entry.target.style.animationDelay = Math.random() * 0.3 + 's';
                }
            });
        }, observerOptions);
        
        // Observar elementos para animación
        const animatedElements = document.querySelectorAll(
            '.store-item, .evento-card, .tienda-card, .card, .contact-item, .stat'
        );
        animatedElements.forEach(el => observer.observe(el));
    }
    
    // Validación avanzada de formularios
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('input', () => validateField(input));
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('focus', () => removeErrorMessage(input));
            });
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateField(input)) isValid = false;
                });
                
                if (isValid) {
                    submitForm(form);
                } else {
                    // Focus en el primer campo con error
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.focus();
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
        });
        
        function validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            let isValid = true;
            
            removeErrorMessage(field);
            
            // Validaciones específicas
            if (field.hasAttribute('required') && !value) {
                showErrorMessage(field, 'Este campo es obligatorio');
                isValid = false;
            } else if (type === 'email' && value && !isValidEmail(value)) {
                showErrorMessage(field, 'Ingresa un email válido');
                isValid = false;
            } else if (type === 'tel' && value && !isValidPhone(value)) {
                showErrorMessage(field, 'Ingresa un teléfono válido (ej: +593 99 123 4567)');
                isValid = false;
            } else if (field.name === 'name' && value && value.length < 2) {
                showErrorMessage(field, 'El nombre debe tener al menos 2 caracteres');
                isValid = false;
            } else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
                showErrorMessage(field, 'El mensaje debe tener al menos 10 caracteres');
                isValid = false;
            }
            
            return isValid;
        }
        
        function showErrorMessage(field, message) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.setAttribute('role', 'alert');
            
            field.parentNode.appendChild(errorDiv);
        }
        
        function removeErrorMessage(field) {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
            
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) errorMessage.remove();
        }
        
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
        
        function isValidPhone(phone) {
            return /^[\+]?[\d\s\-\(\)]{8,}$/.test(phone);
        }
        
        function submitForm(form) {
            const submitBtn = form.querySelector('.btn-submit, button[type="submit"]');
            if (!submitBtn) return;
            
            const originalText = submitBtn.textContent;
            
            // Estado de carga
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simular envío (reemplazar con llamada real a API)
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.textContent = '¡Enviado! ✓';
                submitBtn.style.background = 'var(--primary-green)';
                
                // Mostrar mensaje de éxito
                showSuccessMessage(form);
                
                // Resetear después de 3 segundos
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    form.reset();
                    hideSuccessMessage();
                }, 3000);
            }, 2000);
        }
        
        function showSuccessMessage(form) {
            const message = document.createElement('div');
            message.className = 'success-message';
            message.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>¡Gracias por tu mensaje! Te contactaremos pronto.</p>
            `;
            message.setAttribute('role', 'alert');
            form.parentNode.insertBefore(message, form);
        }
        
        function hideSuccessMessage() {
            const message = document.querySelector('.success-message');
            if (message) message.remove();
        }
    }
    
    // Lazy loading de imágenes optimizado
    function initImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Preload de la imagen
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    };
                    tempImg.src = img.dataset.src;
                    
                    imageObserver.unobserve(img);
                }
            });
        }, { threshold: 0.1 });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
    
    // Mejoras de accesibilidad
    function initAccessibility() {
        // Navegación con teclado
        let isTabbing = false;
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                isTabbing = true;
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', function() {
            isTabbing = false;
            document.body.classList.remove('keyboard-nav');
        });
        
        // Skip links
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // Mejoras para lectores de pantalla
        const interactiveElements = document.querySelectorAll('.store-item, .evento-card, .card');
        interactiveElements.forEach(el => {
            if (!el.getAttribute('role')) {
                el.setAttribute('role', 'button');
            }
            if (!el.getAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });
    }
    
    // Sistema FAQ mejorado
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (!question || !answer) return;
            
            // Configurar IDs únicos para accesibilidad
            const questionId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;
            
            question.id = questionId;
            answer.id = answerId;
            question.setAttribute('aria-controls', answerId);
            question.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-labelledby', questionId);
            
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');
                
                // Cerrar todas las preguntas
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherQuestion && otherAnswer) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherAnswer.style.maxHeight = null;
                    }
                });
                
                // Abrir la pregunta actual si no estaba abierta
                if (!isOpen) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
            
            // Soporte de teclado
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // Sistema de animaciones CSS
    function initAnimations() {
        // Añadir clases de animación CSS
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .lazy {
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .loaded {
                opacity: 1;
            }
            
            .error-message {
                color: #e74c3c;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .success-message {
                background: var(--primary-green);
                color: white;
                padding: 1rem;
                border-radius: var(--radius-md);
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideInDown 0.5s ease;
            }
            
            @keyframes slideInDown {
                from {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .keyboard-nav *:focus {
                outline: 2px solid var(--primary-orange) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Optimizaciones de rendimiento
    function initPerformanceOptimizations() {
        // Preload de recursos críticos
        const criticalImages = [
            '/images/andaria-principal.jpg',
            '/images/logo-andaria.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
        
        // Reducir frecuencia de eventos de scroll
        let scrollTimer;
        window.addEventListener('scroll', () => {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                // Lógica de scroll aquí si es necesaria
            }, 16); // ~60fps
        });
        
        // Cleanup al salir de la página
        window.addEventListener('beforeunload', () => {
            // Limpiar intervalos y observadores
            clearInterval(heroAutoSlideInterval);
        });
    }
    
    // Botón volver arriba
    function initBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        if (!backToTopButton) return;
        
        // Mostrar/ocultar botón basado en scroll
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        // Event listener para scroll
        window.addEventListener('scroll', toggleBackToTop);
        
        // Click handler para volver arriba
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll suave hacia arriba
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Focus en el elemento principal para accesibilidad
            const mainContent = document.getElementById('main-content') || document.querySelector('main') || document.body;
            if (mainContent) {
                mainContent.focus();
            }
        });
        
        // Soporte de teclado
        backToTopButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Mejoras de navegación
    function initNavigationEnhancements() {
        // Resaltar enlace activo basado en URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Smooth scroll para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // Altura del header fijo
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus en el elemento para accesibilidad
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    
                    // Resaltar temporalmente el elemento
                    targetElement.style.outline = '2px solid var(--primary-orange)';
                    setTimeout(() => {
                        targetElement.style.outline = '';
                        targetElement.removeAttribute('tabindex');
                    }, 2000);
                }
            });
        });
        
        // Indicador de carga de página
        window.addEventListener('beforeunload', function() {
            document.body.classList.add('page-loading');
        });
        
        window.addEventListener('load', function() {
            document.body.classList.remove('page-loading');
        });
        
        // Actualizar breadcrumbs dinámicamente
        updateBreadcrumbs();
    }
    
    // Actualizar breadcrumbs
    function updateBreadcrumbs() {
        const breadcrumbsContainer = document.querySelector('.breadcrumbs ol');
        if (!breadcrumbsContainer) return;
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageNames = {
            'index.html': 'Inicio',
            'tiendas.html': 'Tiendas',
            'eventos.html': 'Eventos',
            'nosotros.html': 'Nosotros',
            'contactanos.html': 'Contáctanos'
        };
        
        // Solo actualizar si no es la página de inicio
        if (currentPage !== 'index.html' && pageNames[currentPage]) {
            const currentSpan = breadcrumbsContainer.querySelector('.current');
            if (currentSpan) {
                currentSpan.textContent = pageNames[currentPage];
            }
        }
    }
});