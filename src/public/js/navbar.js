document.querySelector('.header__logo--btnDesktop').addEventListener('click', () => {
  console.log('Click')
  document.querySelector('.nav').classList.toggle('show')
})

document.querySelector('.header__logo--btnMobile').addEventListener('click', () => {
  console.log('Click')
  document.querySelector('.nav').classList.toggle('show')
})