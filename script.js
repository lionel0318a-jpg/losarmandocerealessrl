/* ============================================
   LOS ARMANDO CEREALES - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- DOM Elements ---------- */
    const topBar       = document.getElementById('topBar');
    const navbar       = document.getElementById('navbar');
    const hamburger    = document.getElementById('hamburger');
    const navLinks     = document.getElementById('navLinks');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const contactForm  = document.getElementById('contactForm');
    const formSuccess  = document.getElementById('formSuccess');
    const statsBg      = document.getElementById('statsBg');

    /* ---------- Variables ---------- */
    let lastScrollY      = 0;
    let topBarHeight     = topBar ? topBar.offsetHeight : 0;
    let statsAnimated    = false;

    /* ============================================
       1. TOP BAR HIDE/SHOW ON SCROLL
       ============================================ */
    function handleTopBar() {
        const currentScroll = window.scrollY;

        if (currentScroll > topBarHeight) {
            // Scrolling down: hide top bar
            if (currentScroll > lastScrollY) {
                topBar.classList.add('hidden');
            }
            // Scrolling up: show top bar
            else {
                topBar.classList.remove('hidden');
            }
        } else {
            topBar.classList.remove('hidden');
        }

        lastScrollY = currentScroll;
    }

    /* ============================================
       2. MOBILE MENU
       ============================================ */
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    /* ============================================
       3. SMOOTH SCROLL
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    /* ============================================
       4. ACTIVE NAV LINK HIGHLIGHT
       ============================================ */
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = navLinks.querySelector(`a[href="#${id}"]`);

            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    /* ============================================
       5. INTERSECTION OBSERVER (Reveal Animations)
       ============================================ */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ============================================
       6. STATS COUNTER ANIMATION
       ============================================ */
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        const duration = 2000;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const start = 0;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(start + (target - start) * eased);

                // Format number with dots for thousands
                counter.textContent = current.toLocaleString('es-AR');

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const statsSection = document.getElementById('cifras');

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        statsObserver.observe(statsSection);
    }

    /* ============================================
       7. PARALLAX - STATS BACKGROUND
       ============================================ */
    function handleParallax() {
        if (!statsBg || !statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Only apply parallax when section is in view
        if (rect.top < windowHeight && rect.bottom > 0) {
            const scrolled = (windowHeight - rect.top) / (windowHeight + rect.height);
            const parallaxOffset = (scrolled - 0.5) * 60;
            statsBg.style.transform = `translateY(${parallaxOffset}px)`;
        }
    }

    /* ============================================
       8. CONTACT FORM HANDLER
       ============================================ */
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Gather form data
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                asunto: document.getElementById('asunto').value,
                mensaje: document.getElementById('mensaje').value
            };

            // Log to console (replace with actual API call)
            console.log('Formulario enviado:', formData);

            // Show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Reset after 5 seconds
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                formSuccess.style.display = 'none';
            }, 5000);
        });
    }

    /* ============================================
       9. SCROLL EVENT LISTENER (Throttled)
       ============================================ */
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleTopBar();
                highlightNavLink();
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Run once on load
    highlightNavLink();
    handleParallax();

    /* ============================================
       10. NAVBAR SHADOW ON SCROLL
       ============================================ */
    // Already handled by CSS sticky, but add enhanced shadow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 4px 24px rgba(27, 67, 50, 0.12)';
        } else {
            navbar.style.boxShadow = '0 4px 24px rgba(27, 67, 50, 0.08)';
        }
    }, { passive: true });

});
