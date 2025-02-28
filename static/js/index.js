// Initialize Embla carousel. 
const emblaRoot = document.querySelectorAll('.embla');

if (emblaRoot) {
  emblaRoot?.forEach((root) => {
    // Set carousel options from the data attributes.
    const options = { loop: Boolean(root?.dataset?.loop), slidesToScroll: Number(root?.dataset?.scroll), align: "start" };
    const carousel = EmblaCarousel(root?.querySelector('.embla__viewport'), options);

    const prevBtn = root?.querySelector('.embla__prev');
    const nextBtn = root?.querySelector('.embla__next');

    prevBtn?.addEventListener('click', carousel?.scrollPrev, false);
    nextBtn?.addEventListener('click', carousel?.scrollNext, false);
  });
};

// TODO: Debug cookie banner script.
// Display cookie banner on user click.
/* const cookieBttn = document.querySelector('.cookie-bttn');
cookieBttn?.addEventListener('click', () => {
  const _hsp = window._hsp = window._hsp || [];
  _hsp.push(['showBanner']);
})(); */