import Carousel from './carousel.js'

class SwipeCarousel extends Carousel {
  constructor(...args) {
    super(...args)
    this.isSwiping = false
    this._boundSwipeStart = this._swipeStart.bind(this)
    this._boundSwipeEnd = this._swipeEnd.bind(this)
    this._boundSwipeMove = (e) => e.preventDefault()
  }

  _swipeStart(e) {
    e.preventDefault()
    this.isSwiping = true
    this.startPosX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  }

  _swipeEnd(e) {
    e.preventDefault()
    if (!this.isSwiping || this.startPosX == null) return
    const endPosX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX
    const swipeDistance = endPosX - this.startPosX
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        this.prev()
      } else {
        this.next()
      }
    }
    this.isSwiping = false
    this.startPosX = null
  }

  _addSwipeListenersToActiveImage() {
    // Знімаємо обробники з усіх зображень
    this.slideItems.forEach(slide => {
      const img = slide.querySelector('.slide-img')
      if (img) {
        img.removeEventListener('touchstart', this._boundSwipeStart)
        img.removeEventListener('mousedown', this._boundSwipeStart)
        img.removeEventListener('touchend', this._boundSwipeEnd)
        img.removeEventListener('mouseup', this._boundSwipeEnd)
      }
    })
    // Додаємо тільки до зображення активного слайда
    const activeSlide = this.slideItems[this.currentSlide]
    const activeImg = activeSlide.querySelector('.slide-img')
    if (activeImg) {
      activeImg.addEventListener('touchstart', this._boundSwipeStart, { passive: false })
      activeImg.addEventListener('mousedown', this._boundSwipeStart)
      activeImg.addEventListener('touchend', this._boundSwipeEnd, { passive: false })
      activeImg.addEventListener('mouseup', this._boundSwipeEnd)
      activeImg.addEventListener('touchmove', this._boundSwipeMove, { passive: false })
    }
  }

  _gotoNth(n) {
    super._gotoNth(n)
    this._addSwipeListenersToActiveImage()
  }

  _initListeners() {
    super._initListeners()
    this._addSwipeListenersToActiveImage()
  }
}

export default SwipeCarousel