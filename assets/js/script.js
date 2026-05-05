// ============================================
// 1. HEADER — efeito ao rolar a página
// ============================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});


// ============================================
// 2. MENU HAMBURGUER (mobile)
// ============================================
const hamburger      = document.getElementById('hamburger');
const mobileOverlay  = document.getElementById('mobile-overlay');
const closeMenu      = document.getElementById('close-menu');
const mobLinks       = document.querySelectorAll('.mob-link');

function openMenu() {
    mobileOverlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeMenuFn() {
    mobileOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFn);
mobLinks.forEach(link => link.addEventListener('click', closeMenuFn));


// ============================================
// 3. REVEAL ON SCROLL (animação de entrada)
// ============================================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


// ============================================
// 4. FILTRO DE PORTFÓLIO
// ============================================
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.masonry-item');

// Também filtra ao clicar nos links do submenu
document.querySelectorAll('[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
        const filter = link.dataset.filter;
        applyFilter(filter);
        // Ativa o botão correspondente
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    });
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
    });
});

function applyFilter(filter) {
    galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}


// ============================================
// 5. LIGHTBOX
// ============================================
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbClose   = document.getElementById('lb-close');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');

let visibleItems = [];
let currentIndex = 0;

function getVisible() {
    return [...galleryItems].filter(item => !item.classList.contains('hidden'));
}

function openLightbox(index) {
    visibleItems = getVisible();
    currentIndex = index;
    showImage(currentIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

function showImage(index) {
    const item = visibleItems[index];
    const img  = item.querySelector('img');
    lbImg.src  = img.src;
    lbImg.alt  = img.alt;
    lbCaption.textContent = img.alt;
}

function prevImage() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    showImage(currentIndex);
}
function nextImage() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    showImage(currentIndex);
}

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        visibleItems = getVisible();
        const visIndex = visibleItems.indexOf(item);
        if (visIndex !== -1) openLightbox(visIndex);
    });
});

// ✅ Só adiciona os eventos se os elementos existirem (evita erro em pacotes.html)
if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev)  lbPrev.addEventListener('click', prevImage);
if (lbNext)  lbNext.addEventListener('click', nextImage);

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevImage();
    if (e.key === 'ArrowRight') nextImage();
});


// ============================================
// 6. ACTIVE LINK NO SCROLL (highlight no menu)
// ============================================
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks  = document.querySelectorAll('#main-nav a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active-nav',
                    link.getAttribute('href') === '#' + entry.target.id
                );
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

console.log('Sandra Amaral Fotografia — site carregado!');


// ============================================
// 7. FILTRO VIA URL (portfolio.html?filter=gestante)
// ============================================
const urlParams = new URLSearchParams(window.location.search);
const urlFilter = urlParams.get('filter');
if (urlFilter && document.querySelector('.filter-btn')) {
    applyFilter(urlFilter);
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === urlFilter);
    });
}


// ============================================
// 8. FAQ ACCORDION (pacotes.html)
// ============================================
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        // Fecha todos
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        // Abre o clicado (se estava fechado)
        if (!isOpen) item.classList.add('open');
    });
});


// ============================================
// 9. CARROSSEL DE FEEDBACKS — arrastar + dots
// ============================================
const track   = document.getElementById('reviews-track');
const dotsBox = document.getElementById('reviews-dots');

if (track && dotsBox) {
    const cards      = track.querySelectorAll('.review-card');
    const realCount  = Math.ceil(cards.length / 2); // metade são duplicatas
    let   currentDot = 0;

    // Cria os dots
    for (let i = 0; i < realCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
        dot.addEventListener('click', () => scrollToCard(i));
        dotsBox.appendChild(dot);
    }

    function updateDots(index) {
        currentDot = index % realCount;
        dotsBox.querySelectorAll('.dot').forEach((d, i) =>
            d.classList.toggle('active', i === currentDot)
        );
    }

    function scrollToCard(index) {
        const card   = cards[index];
        const offset = card.offsetLeft - 60;
        track.parentElement.scrollTo({ left: offset, behavior: 'smooth' });
        updateDots(index);
    }

    // Atualiza dot ao rolar manualmente
    track.parentElement.addEventListener('scroll', () => {
        const scrollLeft = track.parentElement.scrollLeft;
        const cardWidth  = cards[0].offsetWidth + 28;
        const index      = Math.round(scrollLeft / cardWidth);
        updateDots(index);
    });

    // Arrastar com o mouse
    let isDown = false, startX, scrollLeft;
    track.parentElement.addEventListener('mousedown', e => {
        isDown = true;
        startX = e.pageX - track.parentElement.offsetLeft;
        scrollLeft = track.parentElement.scrollLeft;
        track.style.animation = 'none';
    });
    track.parentElement.addEventListener('mouseleave', () => { isDown = false; });
    track.parentElement.addEventListener('mouseup',    () => { isDown = false; });
    track.parentElement.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x    = e.pageX - track.parentElement.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.parentElement.scrollLeft = scrollLeft - walk;
    });
}