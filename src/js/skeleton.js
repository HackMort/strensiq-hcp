/* Data to show about symptoms */
const symptomsData = [
  {
    mainWord: 'neurologic',
    symptoms: [
      'Seizures (in infants)',
      'Headaches',
      'Mood disorders'
    ]
  },
  {
    mainWord: 'dental',
    symptoms: [
      'Premature tooth loss',
      'Poor dentition'
    ]
  },
  {
    mainWord: 'respiratory',
    symptoms: [
      'Failure (in infants)',
      'Pneumonia'
    ]
  },
  {
    mainWord: 'muscular',
    symptoms: [
      'Pain',
      'Weakness'
    ]
  },
  {
    mainWord: 'renal',
    symptoms: [
      'Hypercalcemia',
      'Hypercalciuria',
      'Nephrocalcinosis'
    ]
  },
  {
    mainWord: 'rheumatic',
    symptoms: [
      'Fibromyalgia ',
      'Pain ',
      'Pseudogout'
    ]
  },
  {
    mainWord: 'skeletal',
    symptoms: [
      'Fractures (slow to heal)',
      'Weak bones',
      'Failure to thrive (in children)',
      'Rickets (soft bones)'
    ]
  },
  {
    mainWord: 'orthopedic',
    symptoms: [
      'Procedures',
      'Therapies'
    ]
  }
]

/* List element where symptoms are showec */
// const symptomsList = document.querySelector('.skeleton__symptoms-list')

document.addEventListener('DOMContentLoaded', event => {
  /* Get the list of clickable elements */
  const skeletonWords = document.querySelectorAll('.skeleton__word')

  /* Loop through the array by adding the click event on each element */
  skeletonWords.forEach(skeletonWord => {
    skeletonWord.addEventListener('click', wordClickEventHandler)
  })
})

async function wordClickEventHandler (event) {
  const pointElement = event.target.closest('.skeleton__point')
  const symptomsList = pointElement.closest('.skeleton__image-container').querySelector('.skeleton__symptoms-list')

  /* If point is not on an active state hide previous and change this element to active */
  const isThisPointActive = pointElement.classList.contains('skeleton__point--active')
  await hiddenSymponstList()

  if (!isThisPointActive) {
    /* Calculate position of symptoms list, length of vertical and horizontal lines from point */
    calculateListPosition(symptomsList, pointElement)
    setLengthAfterElement(symptomsList, pointElement)
    setLengthBeforeElement(symptomsList, pointElement)

    /* Get and set data of symptoms according to the selected word */
    const dataWord = pointElement.dataset.word
    const symptoms = symptomsData.find(data => {
      return data.mainWord === dataWord
    })
    symptomsList.innerHTML = symptoms.symptoms.map(symptom => {
      return `<li class="skeleton__symptom">${symptom}</li>`
    }).join('')

    showSymptonsList(symptomsList, pointElement)
  }
}

/* Hide the symptoms list, if this function is fired by the current active element
awaits 500ms to let the fade out animation runs */
async function hiddenSymponstList () {
  const activeElement = document.querySelector('.skeleton__point--active')
  if (activeElement) {
    activeElement.classList.remove('skeleton__point--active')

    const symptomsList = activeElement.closest('.skeleton__image-container').querySelector('.skeleton__symptoms-list')
    if (!symptomsList.classList.contains('skeleton__symptoms-list--hidden')) {
      symptomsList.classList.remove('in-animation')
      symptomsList.classList.add('skeleton__symptoms-list--hidden')
    }
  }
}

function showSymptonsList (symptomsList, pointElement) {
  symptomsList.classList.remove('skeleton__symptoms-list--hidden')
  symptomsList.classList.add('in-animation')
  pointElement.classList.add('skeleton__point--active')
}

function calculateListPosition (symptomsList, pointElement) {
  let distanceFromPointElement = 30
  const listPosition = pointElement.dataset.listPosition

  if (isSkeletonMobile(pointElement)) {
    if (listPosition === 'mobile-top') {
      pointElement = document.querySelector('.skeleton__point[data-word="dental"]')
    } else if (listPosition === 'mobile-bottom') {
      pointElement = document.querySelector('.skeleton__point[data-word="muscular"]')
    }

    const pointElementStyles = getComputedStyle(pointElement)
    const pointElementTop = parseInt(pointElementStyles.getPropertyValue('top').slice(0, -2))
    const listTopPosition = pointElementTop + distanceFromPointElement
    symptomsList.style.setProperty('top', listTopPosition + 'px')
  } else {
    distanceFromPointElement = 35
    const horizontalPosition = 'left'
    const dataVerticalLine = pointElement.dataset.verticalLine === 'top' ? 'bottom' : 'top'
    const pointElementStyles = getComputedStyle(pointElement)
    const wordElement = pointElement.querySelector('.skeleton__word')
    const wordElementStyles = getComputedStyle(wordElement)
    const pointElementPosition = parseInt(pointElementStyles.getPropertyValue(horizontalPosition).slice(0, -2))
    const wordElementPosition = parseInt(wordElementStyles.getPropertyValue(horizontalPosition).slice(0, -2))
    const symptomsListPosition = pointElementPosition + wordElementPosition
    const pointElementVerticalPosition = parseInt(pointElementStyles.getPropertyValue(dataVerticalLine).slice(0, -2))
    const listVerticalPosition = pointElementVerticalPosition + distanceFromPointElement

    symptomsList.style.setProperty('right', 'unset')
    symptomsList.style.setProperty('left', 'unset')
    symptomsList.style.setProperty('top', 'unset')
    symptomsList.style.setProperty('bottom', 'unset')
    symptomsList.style.setProperty(horizontalPosition, symptomsListPosition + 'px')
    symptomsList.style.setProperty(dataVerticalLine, listVerticalPosition + 'px')
  }
}

function setLengthAfterElement (symptomsList, pointElement) {
  if (isSkeletonMobile(pointElement)) {
    const wordParentStyles = getComputedStyle(pointElement)
    const symptomsListStyles = getComputedStyle(symptomsList)
    const wordParentTop = parseInt(wordParentStyles.getPropertyValue('top').slice(0, -2))
    const symptomsListTop = parseInt(symptomsListStyles.getPropertyValue('top').slice(0, -2))

    const wordParentAfterLength = Math.abs(symptomsListTop - wordParentTop)
    pointElement.style.setProperty('--point-active-after-height', wordParentAfterLength + 'px')
  } else {
    const dataVerticalLine = pointElement.dataset.verticalLine
    if (dataVerticalLine === 'top') {
      pointElement.style.setProperty('--point-active-after-height', '115px')
    } else {
      pointElement.style.setProperty('--point-active-after-height', '15px')
    }
  }
}

function setLengthBeforeElement (symptomsList, pointElement) {
  if (!isSkeletonMobile(pointElement)) {
    const dataWordAlignment = pointElement.dataset.wordAlignment
    const horizontalPosition = 'left'
    const wordParentStyles = getComputedStyle(pointElement)
    const symptomsListStyles = getComputedStyle(symptomsList)
    const wordParentPosition = parseInt(wordParentStyles.getPropertyValue(horizontalPosition).slice(0, -2))
    const symptomsListPosition = parseInt(symptomsListStyles.getPropertyValue(horizontalPosition).slice(0, -2))

    let wordParentBeforeLenght = 0
    if (dataWordAlignment === 'left') {
      wordParentBeforeLenght = Math.abs(symptomsListPosition - wordParentPosition) - 150
    } else {
      wordParentBeforeLenght = Math.abs(symptomsListPosition - wordParentPosition)
    }

    pointElement.style.setProperty('--point-active-before-width', wordParentBeforeLenght + 'px')
  }
}

function isSkeletonMobile (skeletonChildren) {
  const skeletonParent = skeletonChildren.closest('.skeleton')
  return skeletonParent.classList.contains('skeleton--mobile')
}
