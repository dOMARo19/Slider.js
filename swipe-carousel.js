import Carousel from './carousel.js'

class SwipeCarousel extends Carousel {
  constructor(...args) {
    super(...args)
    this.isSwiping = false
    this._boundSwipeStart = this._swipeStart.bind(this)
    this._boundSwipeEnd = this._swipeEnd.bind(this)
    this._boundSwipeMove = this._swipeMove.bind(this)
  }

  _swipeStart(e) {
    e.preventDefault()
    this.isSwiping = true
    this.startPosX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  }

  _swipeMove(e) {
    if (!this.isSwiping) return
    e.preventDefault()
  }

  _swipeEnd(e) {
    if (!this.isSwiping) return
    e.preventDefault()
    
    const endPosX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX
    const swipeDistance = endPosX - this.startPosX
    
    if (Math.abs(swipeDistance) > 30) { // Зменшуємо поріг для мобільних
      if (swipeDistance > 0) {
        this.prev()
      } else {
        this.next()
      }
    }
    
    this.isSwiping = false
    this.startPosX = null
  }

  _initListeners() {
    super._initListeners()
    
    // Додаємо обробники для всіх слайдів
    this.slideItems.forEach(slide => {
      // Touch events
      slide.addEventListener('touchstart', this._boundSwipeStart, { passive: false })
      slide.addEventListener('touchmove', this._boundSwipeMove, { passive: false })
      slide.addEventListener('touchend', this._boundSwipeEnd, { passive: false })
      
      // Mouse events
      slide.addEventListener('mousedown', this._boundSwipeStart)
      slide.addEventListener('mousemove', this._boundSwipeMove)
      slide.addEventListener('mouseup', this._boundSwipeEnd)
      slide.addEventListener('mouseleave', this._boundSwipeEnd)
    })
  }
}

export default SwipeCarousel