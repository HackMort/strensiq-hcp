/* eslint-disable no-unused-vars */
/**
     * If the parent element of the child element has the class name, return the parent
     * element, otherwise, call the function again with the parent element as the child
     * element.
     * @param child {HTMLElement} - the child element that you want to find the parent of
     * @param className {string} - The class name of the parent element you're looking for.
     * @returns {HTMLElement} The parent element of the child element.
     */
const getParent = function (child, className) {
  const parent = child.parentElement
  const isControlParent = parent.classList.contains(className)

  if ((parent === null) || isControlParent) {
    return parent
  } else {
    return getParent(parent, className)
  }
}

/**
     * "Return true if every required control has been touched."
     *
     * The function starts by filtering the controls array to only include controls
     * that are required. Then it uses the every method to check if every control in
     * the array has been touched
     * @returns A boolean value.
     */
const formHasBeenTouched = function (form) {
  const controls = Array.from(form.querySelectorAll('.form__control'))
  return controls
    .filter((control) => control.dataset.required === 'true')
    .some((control) => control.dataset.touched === 'true')
}

/**
     * It returns true if all the controls that have the data-required attribute set to
     * true also have the data-is-valid attribute set to true
     * @returns {boolean} A boolean value.
     */
const checkFormValidity = function (form) {
  const controls = Array.from(form.querySelectorAll('.form__control'))
  return controls
    .filter((control) => control.dataset.required === 'true')
    .every((control) => control.dataset.isValid === 'true')
}

function validateFormControl (event) {
  const parentClassName = 'form__control'
  const formClassName = 'form'

  /**
     * If any of the radio buttons in the group are checked, return true.
     * @param name {string} - The name of the radio group.
     * @returns {boolean} A boolean value.
     */
  const radioGroupIsValid = function (name) {
    const radioGroup = document.getElementsByName(`input[type="radio"][name=${name}]`)
    let isValid = false
    for (let i = 0; i < radioGroup.length; i++) {
      if (radioGroup[i].checked) {
        isValid = true
        break
      }
    }

    return isValid
  }

  const control = event.target
  const parent = getParent(control, parentClassName)
  const form = getParent(parent, formClassName)
  const submitButton = form.querySelector("[type='submit']")
  const controls = Array.from(form.querySelectorAll('.' + parentClassName))

  parent.dataset.touched = 'true'

  /**

    Disables a submit button by adding the 'disabled' attribute and the 'disabled' class to its parent element.
    @param {Element} submit - The submit button to be disabled.
    */
  const disableSubmitButton = (submit) => {
    submit && submit.setAttribute('disabled', 'true')
    submit.parentElement.classList.add('disabled')
  }

  /**

    Enables a submit button by removing the 'disabled' attribute and the 'disabled' class from its parent element.
    @param {Element} submit - The submit button to be enabled.
    */
  const enableSubmitButton = (submit) => {
    submit && submit.removeAttribute('disabled')
    submit.parentElement.classList.remove('disabled')
  }

  /**
     * If the form is valid, remove the disabled attribute from the submit button,
     * otherwise add the disabled attribute to the submit button
     */
  const toggleSubmitButtonState = function () {
    if (form && checkFormValidity(form)) {
      enableSubmitButton(submitButton)
      form.classList.remove('form--invalid')
    } else {
      disableSubmitButton(submitButton)
      if (formHasBeenTouched(form)) {
        form.classList.add('form--invalid')
      }
    }
  }

  toggleSubmitButtonState()

  const isOptional = parent.dataset.required === 'false'

  if (control.type === 'radio' && !control.checked) {
    const groupIsValid = radioGroupIsValid(control.name)

    if (groupIsValid || isOptional) {
      parent.classList.remove('form__control--invalid')
      parent.dataset.isValid = 'true'
    } else {
      parent.classList.add('form__control--invalid')
      parent.dataset.isValid = 'false'
    }
  } else {
    if (control.checkValidity() || isOptional) {
      parent.classList.remove('form__control--invalid')
      parent.dataset.isValid = 'true'
    } else {
      parent.classList.add('form__control--invalid')
      parent.dataset.isValid = 'false'
    }
  }

  toggleSubmitButtonState()
}
