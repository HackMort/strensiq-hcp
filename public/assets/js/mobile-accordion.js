document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('.accordion-mobile')
  accordions.forEach((accordion) => {
    const panels = accordion.querySelectorAll('.expansion-panel-mobile')

    /**
    * The function closes all panels except for the one with the specified ID.
    * @param {string} openedPanelId - The ID of the panel that is currently open and needs to be closed.
    */
    const closePanels = (openedPanelId) => {
      Array.from(panels).filter((panel) => panel.id !== openedPanelId)
        .forEach((panel) => {
          const button = panel.querySelector('.expansion-panel-mobile__button')
          panel.ariaExpanded = 'false'
          button.ariaExpanded = 'false'
        })
    }

    /**
    * The function toggles the value of the aria-expanded attribute of an element.
    * @param {HTMLElement} element - The `element` parameter is a reference to a DOM element that has an `ariaExpanded`
    * attribute. The function `toggleAriaExpanded` toggles the value of this attribute between `'true'`
    * and `'false'`.
    */
    const toggleAriaExpanded = (element) => {
      const opened = element.ariaExpanded === 'true'

      if (opened) {
        element.ariaExpanded = 'false'
      } else {
        element.ariaExpanded = 'true'
      }
    }

    /* This code block is adding a click event listener to each button element within the expansion panels.
    When a button is clicked, it calls the `closePanels` function with the ID of the panel that was
    clicked, which closes all other panels except for the one that was clicked. It also calls the
    `toggleAriaExpanded` function on both the panel and the button that was clicked, which toggles the
    value of the `aria-expanded` attribute between `'true'` and `'false'`. This allows the panel to
    expand or collapse when the button is clicked. */
    panels.forEach((panel) => {
      const button = panel.querySelector('.expansion-panel-mobile__button')

      button.addEventListener('click', () => {
        closePanels(panel.id)
        toggleAriaExpanded(panel)
        toggleAriaExpanded(button)
      })
    })
  })
})
