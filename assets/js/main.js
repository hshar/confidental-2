
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 0) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }
  
  
  
  let selectDownloadWrapper = select('.download-wrapper')
  if (selectDownloadWrapper) {
    const downloadScrolled = () => {
      if (window.scrollY > 10) {
        selectDownloadWrapper.classList.add('dental-hero-fixed')
      } else {
        selectDownloadWrapper.classList.remove('dental-hero-fixed')
      }
    }
    window.addEventListener('load', downloadScrolled)
    onscroll(document, downloadScrolled)
  }
  
  let selectSingleDownloadWrapper = select('.single-download-wrapper')
  if (selectSingleDownloadWrapper) {
    const singleDownloadScrolled = () => {
      if (window.scrollY > 10) {
        selectSingleDownloadWrapper.classList.add('single-download-wrapper-fixed')
      } else {
        selectSingleDownloadWrapper.classList.remove('single-download-wrapper-fixed')
      }
    }
    window.addEventListener('load', singleDownloadScrolled)
    onscroll(document, singleDownloadScrolled)
  }

  /**
   * Hero carousel indicators
   */
  let heroCarouselIndicators = select("#hero-carousel-indicators")
  let heroCarouselItems = select('#heroCarousel .carousel-item', true)

  heroCarouselItems.forEach((item, index) => {
    (index === 0) ?
    heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "' class='active'></li>":
      heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "'></li>"
  });

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });
 

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

	let categorySelector = select('.all-category-wrap li', true);
    on('click', '.all-category-wrap li', function(e) {
        e.preventDefault();
        categorySelector.forEach(function(el) {
          el.classList.remove('active');
        });
        this.classList.add('active');
    }, true);
	
	let categoryMobileBtn = select('.all-category-wrapper')
	let body = select('body')
	
    on('click', '.all-category-mobile-btn', function(e) {
        e.preventDefault();
        categoryMobileBtn.classList.add('fixed');
        body.classList.add('all-category-wrapper-open');
    }, true);
	
    on('click', '.category-close-btn', function(e) {
        e.preventDefault();
        categoryMobileBtn.classList.remove('fixed');
		body.classList.remove('all-category-wrapper-open');
    }, true);

})()

/* Single Product Slick Slider*/
jQuery('.product-images-carousel').slick({
	//centerMode: true,
	slidesToShow:1,
	autoplay: true,
	autoplaySpeed: 2000,
	dots: true,
	arrows:false,
	padding:0
});
/* Career Keys Slick Slider*/
jQuery('.career-keys-carousel').slick({
	//centerMode: true,
	slidesToShow:1,
	autoplay: true,
	autoplaySpeed: 2000,
	dots: false,
	arrows:false
});

jQuery('.cat-menu-dental-slider').slick({
	dots:true,
	arrows:true,
	infinite:true,
	fade:false,
	prevArrow:"<button type='button' class='slick-line-prev'><i class='bi bi-chevron-left' aria-hidden='true'></i></button>",
	nextArrow:"<button type='button' class='slick-line-next'><i class='bi bi-chevron-right' aria-hidden='true'></i></button>",
	speed:200,
	slidesToShow:8,
	slidesToScroll:2,
	responsive:[
		{breakpoint:1100,settings:{slidesToShow:8,slidesToScroll:2}},
		{breakpoint:992,settings:{slidesToShow:6,slidesToScroll:3}},
		{breakpoint:640,settings:{slidesToShow:4,slidesToScroll:1,arrows:false}},
		{breakpoint:480,settings:{slidesToShow:3,slidesToScroll:1,arrows:false}},
		{breakpoint:320,settings:{slidesToShow:8,slidesToScroll:1,arrows:false}}
	]
});

jQuery('.cat-menu-medical-slider').slick({
	dots:true,
	arrows:true,
	infinite:true,
	fade:false,
	prevArrow:"<button type='button' class='slick-line-prev'><i class='bi bi-chevron-left' aria-hidden='true'></i></button>",
	nextArrow:"<button type='button' class='slick-line-next'><i class='bi bi-chevron-right' aria-hidden='true'></i></button>",
	speed:200,
	slidesToShow:8,
	slidesToScroll:2,
	responsive:[
		{breakpoint:1100,settings:{slidesToShow:8,slidesToScroll:2}},
		{breakpoint:992,settings:{slidesToShow:6,slidesToScroll:3}},
		{breakpoint:640,settings:{slidesToShow:4,slidesToScroll:1,arrows:false}},
		{breakpoint:480,settings:{slidesToShow:3,slidesToScroll:1,arrows:false}},
		{breakpoint:320,settings:{slidesToShow:8,slidesToScroll:1,arrows:false}}
	]
});

jQuery('.cat-page-slider').slick({
	dots:true,
	arrows:true,
	infinite:true,
	fade:false,
	prevArrow:"<button type='button' class='slick-line-prev'><i class='bi bi-chevron-left' aria-hidden='true'></i></button>",
	nextArrow:"<button type='button' class='slick-line-next'><i class='bi bi-chevron-right' aria-hidden='true'></i></button>",
	speed:200,
	slidesToShow:8,
	slidesToScroll:2,
	responsive:[
		{breakpoint:1100,settings:{slidesToShow:8,slidesToScroll:2}},
		{breakpoint:992,settings:{slidesToShow:6,slidesToScroll:3}},
		{breakpoint:768,settings:{slidesToShow:4,slidesToScroll:2,arrows:false}},
		{breakpoint:480,settings:{slidesToShow:3,slidesToScroll:3,arrows:false}},
		{breakpoint:360,settings:{slidesToShow:2,slidesToScroll:2,arrows:false,dots:false}}
	]
});

jQuery('.related-equipments-slider').slick({
	dots:true,
	arrows:false,
	infinite:true,
	fade:false,
	prevArrow:"<button type='button' class='slick-line-prev'><i class='bi bi-chevron-left' aria-hidden='true'></i></button>",
	nextArrow:"<button type='button' class='slick-line-next'><i class='bi bi-chevron-right' aria-hidden='true'></i></button>",
	speed:200,
	slidesToShow:4,
	slidesToScroll:1,
	responsive:[
		{breakpoint:1200,settings:{slidesToShow:3}},
		{breakpoint:992,settings:{slidesToShow:2}},
		{breakpoint:768,settings:{slidesToShow:2,arrows:false,dots:false}},
		{breakpoint:576,settings:{slidesToShow:1,arrows:false,dots:false}}
	]
});

jQuery('.last-view-slider').slick({
	dots:true,
	arrows:false,
	infinite:true,
	fade:false,
	prevArrow:"<button type='button' class='slick-line-prev'><i class='bi bi-chevron-left' aria-hidden='true'></i></button>",
	nextArrow:"<button type='button' class='slick-line-next'><i class='bi bi-chevron-right' aria-hidden='true'></i></button>",
	speed:200,
	slidesToShow:4,
	slidesToScroll:1,
	responsive:[
		{breakpoint:1200,settings:{slidesToShow:3}},
		{breakpoint:992,settings:{slidesToShow:2}},
		{breakpoint:768,settings:{slidesToShow:2,arrows:false,dots:false}},
		{breakpoint:576,settings:{slidesToShow:1,arrows:false,dots:false}}
	]
});
  
jQuery('.portfolio-details-slider').slick({
	speed: 400,
    loop: true,
	slidesToShow:1,
	autoplay: true,
	autoplaySpeed: 2000,
	dots: false,
	arrows:false
});
  
jQuery('.feature-product-slider').slick({
	speed: 600,
    loop: true,
	slidesToShow:1,
	autoplay: true,
	autoplaySpeed: 2000,
	dots: false,
	arrows:false
});
jQuery('.blog-slider').slick({
	speed: 600,
    loop: true,
	slidesToShow:1,
	autoplay: true,
	autoplaySpeed: 2000,
	dots: false,
	arrows:false
});

jQuery('.testimonial-slider').slick({
	speed: 600,
    loop: true,
	slidesToShow:1,
	autoplay: true,
	autoplaySpeed: 2000,
	prevArrow:"<button type='button' class='slick-line-prev'><i class='bi bi-chevron-left' aria-hidden='true'></i></button>",
	nextArrow:"<button type='button' class='slick-line-next'><i class='bi bi-chevron-right' aria-hidden='true'></i></button>",
	dots: true,
	arrows:true
});

jQuery('.management-people-carousel').slick({
	speed: 600,
    loop: true,
	slidesToShow:2,
	slidesToScroll:1,
	autoplay: true,
	autoplaySpeed: 2000,
	dots: false,
	arrows:false
});

jQuery('.our-infrastructure-carousel').slick({
	speed: 600,
    loop: true,
	slidesToShow:1,
	slidesToScroll:1,
	autoplay: true,
	autoplaySpeed: 2000,
	dots: true,
	arrows:false
});

jQuery('.our-machinary-carousel').slick({
	speed: 600,
    loop: true,
	slidesToShow:1,
	slidesToScroll:1,
	autoplay: true,
	autoplaySpeed: 2000,
	dots: true,
	arrows:false
});