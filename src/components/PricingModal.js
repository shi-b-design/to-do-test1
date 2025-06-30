import { subscription } from '../lib/subscription.js'
import { getStripe } from '../lib/stripe.js'

export class PricingModal {
  constructor(user) {
    this.user = user
    this.modal = null
  }

  render() {
    this.modal = document.createElement('div')
    this.modal.className = 'pricing-modal'
    this.modal.style.display = 'none'
    
    this.modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>Upgrade to Premium</h2>
        
        <div class="pricing-cards">
          <div class="pricing-card free">
            <h3>Free</h3>
            <div class="price">$0<span>/month</span></div>
            <ul class="features">
              <li>✓ Up to 5 todos</li>
              <li>✓ Basic task management</li>
              <li>✗ Unlimited todos</li>
              <li>✗ Priority support</li>
              <li>✗ Advanced features</li>
            </ul>
            <button class="btn btn-secondary" disabled>Current Plan</button>
          </div>
          
          <div class="pricing-card premium">
            <div class="badge">Most Popular</div>
            <h3>Premium</h3>
            <div class="price">￥100<span>/month</span></div>
            <ul class="features">
              <li>✓ Unlimited todos</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced features</li>
              <li>✓ Export capabilities</li>
              <li>✓ No ads</li>
            </ul>
            <button class="btn btn-primary" id="premiumBtn">Upgrade Now</button>
          </div>
        </div>
        
        <p class="pricing-note">Cancel anytime. No questions asked.</p>
      </div>
    `
    
    this.attachEventListeners()
    return this.modal
  }

  attachEventListeners() {
    const overlay = this.modal.querySelector('.modal-overlay')
    const closeBtn = this.modal.querySelector('.modal-close')
    const premiumBtn = this.modal.querySelector('#premiumBtn')
    
    overlay.addEventListener('click', () => this.hide())
    closeBtn.addEventListener('click', () => this.hide())
    
    premiumBtn.addEventListener('click', async () => {
      try {
        premiumBtn.disabled = true
        premiumBtn.textContent = 'Loading...'
        
        const { sessionId } = await subscription.createCheckoutSession(
          this.user.id,
          'price_1RfeQbFTvZObIG4YoiUy6ZUP' // Replace with your actual Stripe price ID
        )
        
        const stripe = await getStripe()
        await stripe.redirectToCheckout({ sessionId })
      } catch (error) {
        alert('Error creating checkout session: ' + error.message)
        premiumBtn.disabled = false
        premiumBtn.textContent = 'Upgrade Now'
      }
    })
  }

  show() {
    this.modal.style.display = 'block'
    document.body.style.overflow = 'hidden'
  }

  hide() {
    this.modal.style.display = 'none'
    document.body.style.overflow = 'auto'
  }
}