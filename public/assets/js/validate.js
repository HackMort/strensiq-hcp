document.addEventListener('DOMContentLoaded', () => {
  const accessCookie = document.cookie.split(';').filter((item) => item.trim().startsWith('accessCookie=')).pop()
  if (!accessCookie && accessCookie !== 'accessCookie=STr3Ns!Q' && window.location.pathname !== '/validate/') {
    window.location.href = '/validate/'
  }

  // Validate Form
  const form = document.querySelector('.form__validate')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const accessCode = form.querySelector('input[name="access-code"]').value
      if (accessCode === 'STr3Ns!Q') {
        document.cookie = `accessCookie=${accessCode};max-age=604800;path=/`
        // check if user visited a page before it was redirected to the validate page
        const currentHost = window.location.host
        console.log('currentHost', currentHost)
        const previousPage = document.referrer
        if (previousPage && previousPage.includes(currentHost)) {
          window.location.href = previousPage
        } else {
          window.location.href = '/'
        }
      } else {
        window.alert('Invalid Access Code')
      }
    })
  }
})
