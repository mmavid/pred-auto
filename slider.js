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

<<<<<<< HEAD
document.querySelector('.slider_btn--prev').addEventListener('click', () => {
    goTo(currentIndex - 1);
    startAutoplay();
});

document.querySelector('.slider_btn--next').addEventListener('click', () => {
    goTo(currentIndex + 1);
    startAutoplay();
});

=======
>>>>>>> origin/master
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

<<<<<<< HEAD
slider.addEventListener('mouseenter', stopAutoplay);
slider.addEventListener('mouseleave', startAutoplay);

=======
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


>>>>>>> origin/master
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
});

<<<<<<< HEAD
startAutoplay();
=======

startAutoplay();
>>>>>>> origin/master
