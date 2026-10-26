const track = document.querySelector('.slider_track');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');

let currentIndex = 0;
let autoplayId = null;

const AUTOPLAY_DELAY = 2000;

function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(() => goTo(currentIndex + 1), AUTOPLAY_DELAY);
}

function stopAutoplay() {
    if (autoplayId !== null) {
        clearInterval(autoplayId);
        autoplayId = null;
    }
}

document.querySelector('.slider_btn--prev').addEventListener('click', () => {
    goTo(currentIndex - 1);
    startAutoplay();
});

document.querySelector('.slider_btn--next').addEventListener('click', () => {
    goTo(currentIndex + 1);
    startAutoplay();
});


slider.addEventListener('mouseenter', stopAutoplay);
slider.addEventListener('mouseleave', startAutoplay);


document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
});


startAutoplay();