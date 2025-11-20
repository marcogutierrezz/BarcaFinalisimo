class Slider {
    constructor() {
        this.images = document.querySelectorAll('.slider-bg-img');
        this.currentIndex = 0;
        this.totalSlides = this.images.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; 
        
        this.init();
    }
    
    init() {
        this.startAutoPlay();
    }
    
    updateSlider() {
        this.images.forEach((img, index) => {
            img.classList.remove('active');
            if (index === this.currentIndex) {
                img.classList.add('active');
            }
        });
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Slider();
    });
} else {
    new Slider();
}