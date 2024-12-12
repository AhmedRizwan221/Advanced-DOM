'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelector('.operations__tab-container');
const tabContainer = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const openModal = function (e) {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(buttons => {
  buttons.addEventListener('click', openModal);
})

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//scrolling 
btnScrollTo.addEventListener('click', function (e) {
  section1.getBoundingClientRect();
  section1.scrollIntoView({
    behavior: 'smooth',
  });
})

//smooth navigation 

// document.querySelectorAll('.nav__link').forEach(element => {
//     element.addEventListener('click', function(e) {
//       e.preventDefault();
//       const id = this.getAttribute('href');
//       document.querySelector(id).scrollIntoView({
//         behavior:'smooth',
//       });
//     });
// });

//Event deligation 

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  //compare event occurance 
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});


// tabbed 
tabs.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // console.log(clicked);
  if (!clicked) return;

  tabContainer.forEach(tab => {
    tab.classList.remove('operations__tab--active')
  });
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(tabCont => {
    tabCont.classList.remove('operations__content--active');
  });
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//nav fade animation 
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    sibling.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
// nav.addEventListener('mouseover', function(e) {
//   if(e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const sibling = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//     sibling.forEach(el => {
//       if(el !== link) el.style.opacity = 0.5;
//     });
//     logo.style.opacity =0.5;
// }
// });

//it is not a nice way of calling a function so we use binf method 
// nav.addEventListener('mouseover', function(e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function(e) {
//   handleHover(e, 1);
// });


//sticky nav bar 
// const inittailCoods = section1.getBoundingClientRect();
// // console.log(inittailCoods);

// window.addEventListener('scroll', function() {
//   // console.log(this.window.scrollY);
//   if(this.window.scrollY > inittailCoods.top) {
//     nav.classList.add('sticky');
//   }else {
//     nav.classList.remove('sticky');
//   }
// });

//Sticky navigation: intersection observation API
//how intersection observer api works 
// const obsCallBack = function(entries, oberver) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// }

// const obsOption = {
//   root:null,
//   threshold:[0, 0.2]
// }
// const oberver = new IntersectionObserver(obsCallBack, obsOption);
// oberver.observe(section1);

// sticky navigation

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const entry = entries[0];
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);


// reveal animation on sections 

const allSections = document.querySelectorAll('.section');

const revealsection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // console.log(entry);
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealsection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});


// lazy images loading 
const lazyImg = document.querySelectorAll('img[data-src]');

const loadImage = function (entries, oberver) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
    oberver.unobserve(entry.target);
  });
}

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

lazyImg.forEach(image => imageObserver.observe(image));


//slider 
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  let currentSlide = 0;
  const maxSlide = slides.length;

  //function for slides dost 
  const activatedDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }
  document.addEventListener('DOMCntentLoaded', function () {
    activatedDot(0);
  })

  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  const goToSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
  }
  //function for slide next 
  const nextSlide = function () {
    //checking if the slide is last then it will move again first slide 
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activatedDot(currentSlide);
  }

  //function for previous slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activatedDot(currentSlide);
  }

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //key arrow
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
  });

  document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
  });

  // add dots in slides 
  const dotContainer = document.querySelector('.dots');

  const createElement = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend',
        `
        <button class="dots__dot" data-slide="${i}"></button>
      `);
    });
  }
  createElement();

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activatedDot(slide);
    }
  });
}
slider();

// document.addEventListener('DOMContentLoaded', function(e) {
//   console.log('DOM loaded' ,e);
// })

// window.addEventListener('load', function(e) {
//   console.log('Page is fully loaded ', e);
// })

window.addEventListener('beforeunload', function(e) {
  e.preventDefault();
  // console.log(e);
  e.returnValue = '';
})
//////////////////////////////////////////
//////////////////////////
// //Selecting  Elements
// console.log(document.documentElement);

// const header = document.querySelector('.header');
// console.log(header);

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

//Creating and inserting elements
// const message = document.createElement('div');
//add css class in element
// message.classList.add('cookie-message');
// message.innerHTML ='This is a cookie message for add functionality <button class="btn button-close-cookie">Got It!</button>';
// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);

// //Delete elements
// document.querySelector('.button-close-cookie').addEventListener('click', function() {
//   message.remove();
// });

// //styles
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// console.log(getComputedStyle(message).padding);

// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);

// // //absolute url
// console.log(logo.src);
// //relative url
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);

// //lecture 6 is ende d

// //lecture 7
// const btnScrollTo2 = document.querySelector('.btn--scroll-to');
// const section12 = document.querySelector('#section--1');

// btnScrollTo2.addEventListener('click', function(e) {
//   const s1Coods = section12.getBoundingClientRect();
//   console.log(s1Coods);

//   console.log(e.target.getBoundingClientRect());

//   console.log('Current Scroll X/Y', window.pageXOffset, window.pageYOffset);

//   console.log('Width / Height of viewport', document.documentElement.clientHeight,  document.documentElement.clientWidth);

//   //scrolling effect
//   // window.scroll(s1Coods.left + window.pageXOffset, s1Coods.top + window.pageYOffset);
//   // window.scroll(
//   //   {
//   //     left: s1Coods.left + window.pageXOffset,
//   //     top: s1Coods.top + window.pageYOffset,
//   //     behavior: "smooth",
//   //   }
//   // )
//   section12.scrollIntoView({
//     behavior:'smooth'
//   })
// });

//lecture 8
//Events

// const h1 = document.querySelector('h1');

// // h1.addEventListener('mouseenter', function(e) {
// //   alert('Mouse is enters in h1');
// //   h1.removeEventListener('mouseenter');
// // })

// const h1alert =  function(e) {
//   alert('Mouse is enters in h1');
// }

// h1.addEventListener('mouseenter', h1alert);
// // h1.removeEventListener('mouseenter');

// setTimeout(() => {
//   h1.removeEventListener('mouseenter',h1alert);
// }, 300);


//lecture 10
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// console.log(randomInt(0,100));
// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor(0,255));

// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('link', e.target);
// });

// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('container', e.target);
// });

// document.querySelector('.nav').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Nav', e.target);
// });

// //rgb(255,255,255)

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + 1);
// // console.log(randomInt(0,9));

// const randomColor = () => `rgb(${randomInt(0,255)}, ${randomInt(0,255)}, ${randomInt(0,255)})`;
// // console.log(randomColor);

// document.querySelector('.nav__link').addEventListener('click', function() {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener('click', function() {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav').addEventListener('click', function() {
//   this.style.backgroundColor = randomColor();
// });

//////DOM traversing

// //going down :childs
// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'blue';
// h1.lastElementChild.style.color = 'orangered';

// //going upword:parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--color-primary)';

// console.log('-----Siblings-----');
// //going side : siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// //but if we want to all childs of parent then we simply do
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(el => {
//   if(el !== h1) el.style.fontSize = '30px';
// });


