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
    skeletonWord.addEventListener('click', event => {
      const wordParent = event.target.closest('.skeleton__point')
      const symptomsList = wordParent.closest('.skeleton__image-container').querySelector('.skeleton__symptoms-list')

      /* If word is not in an active state hide previous and change this element to active */
      if (!wordParent.classList.contains('skeleton__point--active')) {
        hiddenSymponstList()
        const dataWord = wordParent.dataset.word
        const dataListPosition = wordParent.dataset.listPosition
        calculateListPosition(symptomsList, dataListPosition, wordParent)
        setHeightAfterElement(symptomsList, wordParent)
        const symptoms = symptomsData.find(data => {
          return data.mainWord === dataWord
        })
        symptomsList.innerHTML = symptoms.symptoms.map(symptom => {
          return `<li class="skeleton__symptom">${symptom}</li>`
        }).join('')
        showSymptonsList(symptomsList, wordParent)
      } else {
        hiddenSymponstList()
      }
    })
  })
})

function hiddenSymponstList (symptomsList) {
  const activeElement = document.querySelector('.skeleton__point--active')
  if (activeElement) {
    activeElement.classList.remove('skeleton__point--active')

    const symptomsList = activeElement.closest('.skeleton__image-container').querySelector('.skeleton__symptoms-list')
    if (!symptomsList.classList.contains('skeleton__symptoms-list--hidden')) {
      symptomsList.classList.add('skeleton__symptoms-list--hidden')
    }
  }
}

function showSymptonsList (symptomsList, element) {
  symptomsList.classList.remove('skeleton__symptoms-list--hidden')
  element.classList.add('skeleton__point--active')
}

function calculateListPosition (symptomsList, listPosition, pointElement = null) {
  const distanceUnderPointElement = 30
  let leftWordPosition = 0

  if (listPosition === 'mobile-top') {
    pointElement = document.querySelector('.skeleton__point[data-word="dental"]')
  } else if (listPosition === 'mobile-bottom') {
    pointElement = document.querySelector('.skeleton__point[data-word="muscular"]')
  } else {
    if(pointElement.classList.contains('skeleton__pooint--invert'))
    sideWordPosition = pointElement.clientWidth
    symptomsList.style.setProperty('left', sideWordPosition + "px")
  }
  // setHeightAfterElement(pointElement)
  const pointElementStyles = getComputedStyle(pointElement)
  const pointElementTop = parseInt(pointElementStyles.getPropertyValue('top').slice(0, -2))
  const listTopPosition = pointElementTop + distanceUnderPointElement
  symptomsList.style.setProperty('top', listTopPosition + 'px')
}

function setHeightAfterElement (symptomsList, element) {
  const wordParentStyles = getComputedStyle(element)
  const symptomsListStyles = getComputedStyle(symptomsList)
  const wordParentTop = parseInt(wordParentStyles.getPropertyValue('top').slice(0, -2))
  const symptomsListTop = parseInt(symptomsListStyles.getPropertyValue('top').slice(0, -2))

  const wordParentAfterHeight = Math.abs(symptomsListTop - wordParentTop)
  element.style.setProperty('--point-active-after-height', wordParentAfterHeight + 'px')
}
