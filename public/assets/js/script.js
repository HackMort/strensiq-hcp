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
  const menuItems = document.querySelectorAll('.main__navigation li a')
  const mobileQuery = window.matchMedia('(max-width: 1024px)')
  menuItems.forEach((item) => {
    if (item.getAttribute('href') === window.location.pathname) {
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
  window.addEventListener('scroll', () => {
    highlightActiveInternalNavOnScroll()
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

          internalNav && internalNav.classList.contains('is--fixed') && internalNav.classList.remove('is--fixed')

          // Save the current scroll position
          lastScrollPosition = currentScrollPosition
        } else if (!entry.isIntersecting && window.scrollY >= headerHeight && currentScrollPosition < lastScrollPosition) {
          headerInner.classList.contains('is--sticky-down') && headerInner.classList.remove('is--sticky-down')
          headerInner.classList.add('is--sticky-up')
          internalNav && internalNav.classList.add('is--fixed')

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
function highlightActiveInternalNavOnScroll () {
  const internalNavItems = document.querySelectorAll('.internal__nav_list_item')
  const internalNav = document.querySelector('.internal__nav_list')
  const activeLi = document.querySelector('.internal__nav_list_item.is--active') || internalNavItems[0]
  const sections = document.querySelectorAll('.section')
  const headerHeight = header.offsetHeight
  const sectionObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.25
  }
  const sectionObserver = new window.IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Distance between the top of the section and the top of the viewport
      const sectionTop = entry.boundingClientRect.top
      const internalNavWidth = internalNav.offsetWidth
      const activeLiPosition = activeLi.offsetLeft

      // Validate if the section that are in viewport and is closer of the top of the viewport
      if (entry.isIntersecting && sectionTop <= headerHeight) {
        const sectionId = entry.target.getAttribute('id')
        internalNavItems.forEach((item) => {
          item.classList.remove('is--active')
        })

        const activeLi = document.querySelector(`.internal__nav_list_item a[href="#${sectionId}"]`).parentElement
        activeLi.classList.add('is--active')

        // Scroll the internal navigation to the active item
        internalNav.scrollLeft = activeLiPosition - internalNavWidth / 2
      }
    })
  }
  , sectionObserverOptions)
  sections.forEach((section) => {
    sectionObserver.observe(section)
  })
}

/*
  * setActiveIternalNavItemOnClick
  * @description
  * - Add class is--active to internal navigation items when the link is clicked
  * - Scroll to section
  * It requires IntersectionObserver API
  * * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
*/
function setActiveIternalNavItemOnClick () {
  const headerNavHeight = document.querySelector('.site__header')
  const internalNav = document.querySelector('.internal__nav')
  const internalNavItems = document.querySelectorAll('.internal__nav_list_item')
  const headerInner = document.querySelector('.site__header .header__inner')
  let marginYOff = 0

  internalNav &&
  internalNav.addEventListener('click', (e) => {
    e.preventDefault()
    const target = e.target

    if (target.tagName === 'A') {
      const sectionID = target.getAttribute('href')
      const targetSection = document.querySelector(sectionID)

      // Get the height of the header when the user scrolls down the page and the header is not in viewport
      if (headerInner.classList.contains('is--sticky-down')) {
        marginYOff = headerNavHeight.offsetHeight + 150
      } else if (headerInner.classList.contains('is--sticky-up')) {
        marginYOff = 0
      } else {
        marginYOff = headerNavHeight.offsetHeight + 150
      }

      // Scroll to section
      const totalOffset = targetSection.getBoundingClientRect().top + window.pageYOffset - marginYOff

      window.scrollTo({
        top: totalOffset,
        behavior: 'smooth'
      })
    }

    // Remove class is--active from all internal navigation items
    internalNavItems.forEach((item) => {
      item.classList.remove('is--active')
    })

    // Add class is--active to the clicked internal navigation item
    target.parentElement.classList.add('is--active')
  })
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
