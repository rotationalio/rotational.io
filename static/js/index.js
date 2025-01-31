// Initialize Embla carousel. 
const emblaRoot = document.querySelectorAll('.embla');

if (emblaRoot) {
  emblaRoot?.forEach((root) => {
    // Set carousel options from the data attributes.
   const options = { loop: Boolean(root?.dataset?.loop), slidesToScroll: Number(root?.dataset?.scroll)};
    const carousel = EmblaCarousel(root?.querySelector('.embla__viewport'), options);

    const prevBtn = root?.querySelector('.embla__prev');
    const nextBtn = root?.querySelector('.embla__next');

    prevBtn?.addEventListener('click', carousel?.scrollPrev, false);
    nextBtn?.addEventListener('click', carousel?.scrollNext, false);
  });
};