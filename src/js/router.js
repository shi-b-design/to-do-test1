import { AuthView } from '../components/AuthView.js'
import { TodoApp } from '../components/TodoApp.js'
import { LandingPage } from '../components/LandingPage.js'

export const router = {
  currentView: 'landing',
  
  render(container, user) {
    container.innerHTML = ''
    
    if (!user) {
      // Reset to landing page when user logs out
      if (this.currentView === 'app') {
        this.currentView = 'landing'
      }
      
      if (this.currentView === 'landing') {
        const landingPage = new LandingPage((authMode) => {
          this.currentView = 'auth'
          this.authMode = authMode
          this.render(container, user)
        })
        container.appendChild(landingPage.render())
      } else if (this.currentView === 'auth') {
        const authView = new AuthView(this.authMode)
        authView.onBackToLanding = () => {
          this.currentView = 'landing'
          this.render(container, user)
        }
        container.appendChild(authView.render())
      }
    } else {
      this.currentView = 'app'
      const todoApp = new TodoApp(user)
      todoApp.render().then(element => {
        container.appendChild(element)
      })
    }
  }
}