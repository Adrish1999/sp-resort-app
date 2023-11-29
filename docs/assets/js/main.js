document.addEventListener('DOMContentLoaded', () => {

    const glightbox = GLightbox({
        selector: '.glightbox'
      });
    
    new Swiper('.gallery-slider', {
        speed: 400,
        loop: true,
        centeredSlides: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          992: {
            slidesPerView: 5,
            spaceBetween: 20
          }
        }
      });
    
});