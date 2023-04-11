document.addEventListener('DOMContentLoaded', function (e) {
  // console.log('DOM fully loaded and parsed')
  isiHeaderFixed()
  window.addEventListener('scroll', () => {
    isiHeaderFixed()
  })
  window.addEventListener('resize', () => {
    isiHeaderFixed()
  })
  const toggleIsiSection = document.querySelector('.isi__section_toggle')
  if (toggleIsiSection) {
    toggleIsiSection.addEventListener('click', () => {
      const isiHeader = document.querySelector('.isi__section_header.is--fixed')
      isiHeader.classList.toggle('is--open')
    })
  }

  // Toggle Menu Button
  const mobileMenuToogleBtn = document.getElementById('toggle-menu-button')
  const mobileNav = document.querySelector('.mobile .main__navigation')
  if (mobileMenuToogleBtn) {
    mobileMenuToogleBtn.addEventListener('click', () => {
      mobileMenuToogleBtn.classList.toggle('is--open')
      mobileNav.classList.toggle('is--open')
    })
  }

  // Menu Dropdown
  const menuItems = document.querySelectorAll('.nav__menu_item_link')
  const mobileQuery = window.matchMedia('(max-width: 1024px)')
  menuItems.forEach((item) => {
    if (item.getAttribute('href') === window.location.pathname) {
      item.classList.add('current-page')
    }
    item.addEventListener('click', (e) => {
      if (!mobileQuery.matches) {
        return
      }
      if (item.parentElement.classList.contains('has__sub_menu')) {
        e.preventDefault()
        item.parentElement.classList.toggle('is--open')
        // const subNav = item.nextElementSibling
        // if (subNav) {
        //   subNav.classList.toggle('is--open')
        // }
      }
    })
  })
})

// Make Header Sticky when the user scrolls down the page and the header is not in viewport using IntersectionObserver API
const header = document.querySelector('.site__header')
const headerInner = document.querySelector('.header__inner')
const headerMainBar = document.querySelectorAll('.main_bar')
//NodeList to Array
const headerMainBarArray = Array.prototype.slice.call(headerMainBar)

const headerHeight = header.offsetHeight
let lastScrollPosition = 0

addEventListener('scroll', () => {

const headerObserver = new window.IntersectionObserver((entries, observer) => {

  entries.forEach(entry => {
    // I think we need to play with this 2 variables
    // const isAbove = entry.boundingClientRect.y < entry.rootBounds.y
    // const isBelow = entry.boundingClientRect.y > entry.rootBounds.y

    let currentScrollPosition = window.scrollY 

    //When the user scrolls down the page and the header is not in viewport add class is-.sticky-down to header that class hide main bar,
    //then add class is--sticky-up to header to show main bar
    if (!entry.isIntersecting && window.scrollY >= headerHeight) {

      if(currentScrollPosition > lastScrollPosition) {
        headerInner.classList.contains('is--sticky-up') && headerInner.classList.remove('is--sticky-up')
        headerInner.classList.add('is--sticky-down')

        //Save the current scroll position
        lastScrollPosition = currentScrollPosition
      } else if (!entry.isIntersecting && window.scrollY >= headerHeight && currentScrollPosition < lastScrollPosition) {
        headerInner.classList.contains('is--sticky-down') && headerInner.classList.remove('is--sticky-down')
        headerInner.classList.add('is--sticky-up')
        
        //Save the current scroll position
        lastScrollPosition = currentScrollPosition
      }

    } else {
      headerInner.classList.remove('is--sticky-down')
      
      //In this way avoid a unwanted jump of the header
      if (currentScrollPosition === 0) {
        headerInner.classList.remove('is--sticky-up')
      }

    }
    
  })
}
, {
  root: null,
  rootMargin: '0px',
  threshold: 0
})
headerObserver.observe(header)
})

/**
   * isiHeaderFixed
   * @description
   * - Add class is--fixed to isi__section_header when isi__section is not in viewport
   * - Remove class is--fixed and is--open to isi__section_header when isi__section is in viewport
   * It requires IntersectionObserver API
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
   * @see https://caniuse.com/#feat=intersectionobserver
  */
function isiHeaderFixed () {
  // const mobileMedia = window.matchMedia('(min-width: 100px)')
  const isiHeader = document.querySelector('.isi__section_header')
  const isiSection = document.querySelector('.isi')
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  }
  const isiObserver = new window.IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // if (!mobileMedia.matches) {
      //   isiHeader.classList.remove('is--fixed')
      //   return
      // } else {
      // isiHeader.classList.add('is--fixed')
      // }
      isiHeader.classList.add('is--fixed')
      if (entry.isIntersecting) {
        isiHeader.classList.remove('is--fixed', 'is--open')
      } else {
        if (entry.boundingClientRect.top < 0) {
          isiHeader.classList.remove('is--fixed')
        }
      }
    })
  }
  , observerOptions)
  if (isiSection) {
    isiObserver.observe(isiSection)
  }
}
