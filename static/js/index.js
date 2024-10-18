// Initialize Embla carousel
const emblaRoot = document.querySelector('.embla');
const emblaViewport = emblaRoot?.querySelector('.embla__viewport');
const prevBtn = emblaRoot?.querySelector('.embla__prev');
const nextBtn = emblaRoot?.querySelector('.embla__next');
const options = { loop: true };

if (emblaRoot) {
  const carousel = EmblaCarousel(emblaViewport, options);
  prevBtn.addEventListener('click', carousel.scrollPrev, false);
  nextBtn.addEventListener('click', carousel.scrollNext, false);
}