// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Close mobile menu when link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.style.display = 'none';
    });
});

// Smooth Scrolling
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

// Scroll Animation for Cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const cards = document.querySelectorAll('.service-card, .value-card, .solution-card, .impact-card');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Active Navigation Link
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.borderBottom = '2px solid white';
        } else {
            link.style.borderBottom = 'none';
        }
    });
});

// ==================== COVER FLOW CAROUSELS ====================
document.addEventListener('DOMContentLoaded', () => {
    const sessions = document.querySelectorAll('.coverflow-wrapper');

    sessions.forEach(wrapper => {
        const track = wrapper.querySelector('.coverflow-track');
        const items = Array.from(track.querySelectorAll('.coverflow-item'));
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        const dotsContainer = document.querySelector(`.coverflow-dots[data-session="${wrapper.dataset.session}"]`);
        
        let current = 0;
        let autoplayInterval;
        let isDragging = false;
        let startX = 0;

        // Create dots
        if (dotsContainer) {
            items.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            });
        }

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

        function update() {
            items.forEach((item, i) => {
                item.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
                
                if (i === current) {
                    item.classList.add('active');
                } else if (i === current - 1) {
                    item.classList.add('prev');
                } else if (i === current + 1) {
                    item.classList.add('next');
                } else if (i === current - 2) {
                    item.classList.add('far-prev');
                } else if (i === current + 2) {
                    item.classList.add('far-next');
                } else {
                    item.classList.add('hidden');
                }
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
        }

        function goTo(index) {
            current = (index + items.length) % items.length;
            update();
        }

        function next() {
            goTo(current + 1);
        }

        function prev() {
            goTo(current - 1);
        }

        // Buttons
        if (nextBtn) nextBtn.addEventListener('click', next);
        if (prevBtn) prevBtn.addEventListener('click', prev);

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(next, 4500);
        }
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        wrapper.addEventListener('mouseenter', stopAutoplay);
        wrapper.addEventListener('mouseleave', startAutoplay);
        startAutoplay();

        // Drag / Swipe
        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            stopAutoplay();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const diff = e.clientX - startX;
            if (diff > 60) {
                prev();
                isDragging = false;
            } else if (diff < -60) {
                next();
                isDragging = false;
            }
        });

        // Touch support
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoplay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;
            if (diff > 50) prev();
            else if (diff < -50) next();
            startAutoplay();
        }, { passive: true });

        // Lightbox
        items.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('active')) {
                    const lightbox = document.getElementById('lightbox');
                    const lightboxImg = lightbox.querySelector('.lightbox-img');
                    lightboxImg.src = item.querySelector('img').src;
                    lightbox.classList.add('active');
                }
            });
        });

        update(); // initial call
    });

    // Close lightbox
    const lightboxClose = document.querySelector('.lightbox-close');
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            document.getElementById('lightbox').classList.remove('active');
        });
    }

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                e.target.classList.remove('active');
            }
        });
    }
});
