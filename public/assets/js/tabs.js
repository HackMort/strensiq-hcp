const tablist = document.querySelector("ul[role='tablist']")
const tabs = Array.from(tablist.querySelectorAll('a'))
const panels = document.querySelectorAll("section[role='tabpanel']")

const LEFT_ARROW = 'ArrowLeft'
const RIGHT_ARROW = 'ArrowRight'
const DOWN_ARROW = 'ArrowDown'

tabs.forEach(function (tab, i) {
  tab.addEventListener('click', (e) => {
    e.preventDefault()
    const currentTab = tablist.querySelector('[aria-selected]')
    if (e.currentTarget !== currentTab) {
      switchTab(currentTab, e.currentTarget)
    }
  })

  tab.addEventListener('keydown', (e) => {
    const index = tabs.indexOf(e.currentTarget)
    switch (e.key) {
      case DOWN_ARROW:
        panels[i].focus()
        break
      case LEFT_ARROW:
        e.preventDefault()
        if (tabs[index - 1]) {
          switchTab(e.currentTarget, tabs[index - 1])
        }
        break
      case RIGHT_ARROW:
        e.preventDefault()
        if (tabs[index + 1]) {
          switchTab(e.currentTarget, tabs[index + 1])
        }
        break

      default:
        break
    }
  })
})

const switchTab = (prevTab, newTab) => {
  newTab.focus()
  newTab.removeAttribute('tabindex')
  newTab.setAttribute('aria-selected', 'true')
  prevTab.removeAttribute('aria-selected')
  prevTab.setAttribute('tabindex', '-1')
  panels[tabs.indexOf(prevTab)].hidden = true
  panels[tabs.indexOf(newTab)].hidden = false
}
