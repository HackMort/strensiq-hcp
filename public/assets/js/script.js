/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', function (e) {
  // console.log('DOM fully loaded and parsed')
  isiHeaderFixed()
  window.addEventListener('scroll', () => {
    isiHeaderFixed()
  })
  window.addEventListener('resize', () => {
    isiHeaderFixed()
    setNavTopPosition()
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
  const menuItems = document.querySelectorAll('.main__navigation li a')
  const mobileQuery = window.matchMedia('(max-width: 1024px)')
  const currentPage = window.location.pathname.replace(/\/+$/, '') // Remove trailing slash if any, this is needed in order to work in the Dev Server.
  menuItems.forEach((item) => {
    if (item.getAttribute('href') === currentPage) {
      item.classList.add('current-page')
      if (item.classList.contains('nav__sub_menu_item_link')) {
        const parent = item.closest('.has__sub_menu')
        parent.classList.add('current-page')
      }
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

  // Internal Navigation
  const headerInnerHeight = document.querySelector('.header__inner').offsetHeight
  window.addEventListener('scroll', () => {
    highlightActiveInternalNavOnScroll(headerInnerHeight)
  })
  setActiveIternalNavItemOnClick()

  // Animated BG on Scroll
  animatedBgColorOnScroll()
})

// Make Header Sticky when the user scrolls down the page and the header is not in viewport using IntersectionObserver API
const header = document.querySelector('.site__header')
const headerInner = document.querySelector('.header__inner')
const internalNav = document.querySelector('.internal__nav')
// const headerMainBar = document.querySelectorAll('.main_bar')
// NodeList to Array
// const headerMainBarArray = Array.prototype.slice.call(headerMainBar)

const headerHeight = header.offsetHeight
const headerObserverOptions = { root: null, rootMargin: '0px', threshold: 0 }
let lastScrollPosition = 0

window.addEventListener('scroll', () => {
  const headerObserver = new window.IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
    // I think we need to play with this 2 variables
    // const isAbove = entry.boundingClientRect.y < entry.rootBounds.y
    // const isBelow = entry.boundingClientRect.y > entry.rootBounds.y

      const currentScrollPosition = window.scrollY

      // When the user scrolls down the page and the header is not in viewport add class is-.sticky-down to header that class hide main bar,
      // then add class is--sticky-up to header to show main bar
      if (!entry.isIntersecting && window.scrollY >= headerHeight) {
        if (currentScrollPosition > lastScrollPosition) {
          headerInner.classList.contains('is--sticky-up') && headerInner.classList.remove('is--sticky-up')
          headerInner.classList.add('is--sticky-down')
          internalNav && internalNav.classList.add('is--fixed')

          // internalNav && internalNav.classList.contains('is--fixed') && internalNav.classList.remove('is--fixed')

          // Save the current scroll position
          lastScrollPosition = currentScrollPosition
        } else if (!entry.isIntersecting && window.scrollY >= headerHeight && currentScrollPosition < lastScrollPosition) {
          headerInner.classList.contains('is--sticky-down') && headerInner.classList.remove('is--sticky-down')
          headerInner.classList.add('is--sticky-up')

          // Save the current scroll position
          lastScrollPosition = currentScrollPosition
        }
      } else {
        headerInner.classList.remove('is--sticky-down')

        // In this way avoid a unwanted jump of the header
        if (currentScrollPosition === 0) {
          headerInner.classList.remove('is--sticky-up')
          internalNav && internalNav.classList.remove('is--fixed')
        }
      }

      setNavTopPosition()
    })
  }, headerObserverOptions)
  headerObserver.observe(header)
})

/*
  * highlightActiveInternalNavOnScroll
  * @description
  * - Add class is--active to internal navigation items when the section is in viewport
  * It requires IntersectionObserver API
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
function highlightActiveInternalNavOnScroll (headerInnerHeight) {
  const internalNavItems = document.querySelectorAll('.internal__nav_list_item')
  const internalNav = document.querySelector('.internal__nav_list')
  const activeLi = document.querySelector('.internal__nav_list_item.is--active') || internalNavItems[0]
  const sections = document.querySelectorAll('.section')
  const headerHeight = screen.width > 768 ? headerInnerHeight + 150 : headerInnerHeight + 200
  const sectionObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  }
  const sectionObserver = new window.IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // console.log(entry.target.getAttribute('id'), 'entry.target.getAttribute(id)')
      // Distance between the top of the section and the top of the viewport
      const sectionTop = entry.boundingClientRect.top

      // Get the position of the active item in the internal navigation
      const internalNavWidth = internalNav.offsetWidth
      const activeLiPosition = activeLi.offsetLeft

      // Validate if the section that are in viewport and is closer of the top of the viewport
      if (entry.isIntersecting && sectionTop <= headerHeight && sectionTop >= 0) {
        const sectionId = entry.target.getAttribute('id')
        internalNavItems.forEach((item) => {
          item.classList.remove('is--active')
        })

        const activeLi = document.querySelector(`.internal__nav_list_item a[href="#${sectionId}"]`).parentElement
        activeLi.classList.add('is--active')

        // Scroll the internal navigation to the active item
        const activeLiWidth = activeLi.clientWidth
        internalNav.scrollLeft = activeLiPosition + activeLiWidth - internalNavWidth
      }
    })
  }
  , sectionObserverOptions)
  sections.forEach((section) => {
    sectionObserver.observe(section)
  })
}

/**
  * setActiveIternalNavItemOnClick
  * @description
  * - Add class is--active to internal navigation items when the link is clicked
  * - Scroll to section
  * It requires IntersectionObserver API
  * * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
*/
async function setActiveIternalNavItemOnClick() {
  const internalNav = document.querySelector(".internal__nav");

  internalNav &&
    internalNav.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target;

      if (target.tagName === "A") {
        const sectionID = target.getAttribute("href");
        if (sectionID !== "#") {
          const targetSection = document.querySelector(sectionID);

          let marginTop = 330;

          if (window.pageYOffset > 0) {
            targetSection.getBoundingClientRect().top <= 0
              ? (marginTop = 225)
              : (marginTop = 100);
          }

          // Scroll to section
          const totalOffset =
            targetSection.getBoundingClientRect().top +
            window.pageYOffset -
            marginTop;

          window.scrollTo({
            top: totalOffset,
            behavior: "smooth",
          });
        }
      }
    });
}

/* Change CSS variable for top position of the
navigation container when has the class is--fixed */
function setNavTopPosition () {
  const internalNav = document.querySelector('.internal__nav')
  if (internalNav) {
    const headerInner = document.querySelector('.header__inner')
    const headerInnerStyles = getComputedStyle(headerInner)
    const headerInnerHeight = headerInnerStyles.getPropertyValue('height')
    internalNav.style.setProperty('--nav-top-position', headerInnerHeight)
  }
}

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

/**
 * animatedBgColorOnScroll
 * @description
 * - Add class fill-in to .animated--bg element when the element is in viewport only once
 * It requires IntersectionObserver API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * @see https://caniuse.com/#feat=intersectionobserver
 */
function animatedBgColorOnScroll () {
  const animatedBg = document.querySelectorAll('.animated--bg')
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1
  }
  const observer = new window.IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fill-in')
      }
    })
  }
  , observerOptions)
  animatedBg.forEach((element) => {
    observer.observe(element)
  })
}
