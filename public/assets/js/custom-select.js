
/**
 * #################################################################################################
 * Custom select logic
 * #################################################################################################
 */

document.addEventListener('DOMContentLoaded', () => {
  const customSelect = document.querySelector('.form__control-select-wrapper')
  const nativeSelect = customSelect.querySelector('select')
  const label = document.createElement('label')
  const optionsList = document.createElement('div')

  const options = nativeSelect.options

  const toggleClass = 'form__control-select-wrapper--active'

  nativeSelect.setAttribute('style', 'display: none')

  const close = () => {
    customSelect.classList.add(toggleClass)
  }
  const open = () => {
    customSelect.classList.remove(toggleClass)
  }
  const toggle = () => {
    const opened = customSelect.classList.contains(toggleClass)
    if (opened) {
      close()
    } else {
      open()
    }
  }

  const getSelectedOptionIndex = () => nativeSelect.selectedIndex

  /** Set initial option label */
  const selectOption = (index) => {
    nativeSelect.selectedIndex = index
    label.innerHTML = options[index].innerHTML || nativeSelect.ariaPlaceholder
  }

  selectOption(nativeSelect.selectedIndex)
  customSelect.appendChild(label)
  /** Set initial option label */

  /** Create options list */
  optionsList.classList.add('select__options', 'select__options--hide')
  for (let i = 0; i <= options.length; i++) {
    const html = options[i].innerHTML
    const index = options[i].index

    const button = document.createElement('button')
    button.dataset.index = index.toString()
    button.innerHTML = html

    button.classList.add('select__option')
    optionsList.appendChild(button)
  }
  /** Create options list */

  /**
       * Events
       */

  /** Select an option when is clicked */
  optionsList.querySelectorAll('button').forEach((option) => {
    option.addEventListener('click', (event) => {
      const index = option.dataset.index
      if (+index !== getSelectedOptionIndex()) {
        selectOption(+index)
      }
      close()
    })
  })
  /** Select an option when is clicked */

  /** Toggle select option list */
  customSelect.addEventListener('click', () => {
    toggle()
  })
  document.addEventListener('click', toggle)
  /** Toggle select option list */
})

/**
       * #################################################################################################
       * Custom select logic
       * #################################################################################################
       */
