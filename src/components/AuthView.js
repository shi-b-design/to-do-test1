import { auth } from '../lib/auth.js'

export class AuthView {
  constructor(initialMode = 'signin') {
    this.isLogin = initialMode === 'signin'
    this.onBackToLanding = null
  }

  render() {
    const container = document.createElement('div')
    container.className = 'auth-container'
    container.innerHTML = `
      <div class="auth-box">
        <button class="btn btn-ghost back-btn" id="backBtn">← 戻る</button>
        <h1>Todo App Premium</h1>
        <p class="tagline">Organize your life with powerful features</p>
        
        <form id="authForm" class="auth-form">
          <h2 id="formTitle">${this.isLogin ? 'Sign In' : 'Sign Up'}</h2>
          
          <div class="form-group">
            <input type="email" id="email" placeholder="Email" required>
          </div>
          
          <div class="form-group">
            <input type="password" id="password" placeholder="Password" required>
          </div>
          
          <button type="submit" class="btn btn-primary">
            ${this.isLogin ? 'Sign In' : 'Sign Up'}
          </button>
          
          <p class="auth-switch">
            ${this.isLogin ? "Don't have an account?" : "Already have an account?"}
            <a href="#" id="authSwitch">
              ${this.isLogin ? 'Sign Up' : 'Sign In'}
            </a>
          </p>
        </form>
        
        <div id="authError" class="error-message" style="display: none;"></div>
      </div>
    `
    
    this.attachEventListeners(container)
    return container
  }

  attachEventListeners(container) {
    const form = container.querySelector('#authForm')
    const authSwitch = container.querySelector('#authSwitch')
    const formTitle = container.querySelector('#formTitle')
    const submitBtn = container.querySelector('button[type="submit"]')
    const authSwitchText = container.querySelector('.auth-switch')
    const backBtn = container.querySelector('#backBtn')
    
    backBtn.addEventListener('click', () => {
      if (this.onBackToLanding) {
        this.onBackToLanding()
      }
    })
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const email = container.querySelector('#email').value
      const password = container.querySelector('#password').value
      const errorDiv = container.querySelector('#authError')
      
      try {
        submitBtn.disabled = true
        submitBtn.textContent = 'Loading...'
        errorDiv.style.display = 'none'
        
        if (this.isLogin) {
          await auth.signIn(email, password)
        } else {
          await auth.signUp(email, password)
          if (!this.isLogin) {
            errorDiv.style.display = 'block'
            errorDiv.textContent = 'Check your email to confirm your account!'
            errorDiv.className = 'success-message'
          }
        }
      } catch (error) {
        errorDiv.style.display = 'block'
        errorDiv.textContent = error.message
        errorDiv.className = 'error-message'
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = this.isLogin ? 'Sign In' : 'Sign Up'
      }
    })
    
    authSwitch.addEventListener('click', (e) => {
      e.preventDefault()
      this.isLogin = !this.isLogin
      
      formTitle.textContent = this.isLogin ? 'Sign In' : 'Sign Up'
      submitBtn.textContent = this.isLogin ? 'Sign In' : 'Sign Up'
      authSwitchText.innerHTML = `
        ${this.isLogin ? "Don't have an account?" : "Already have an account?"}
        <a href="#" id="authSwitch">
          ${this.isLogin ? 'Sign Up' : 'Sign In'}
        </a>
      `
    })
  }
}