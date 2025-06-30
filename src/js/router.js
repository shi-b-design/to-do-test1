import { AuthView } from '../components/AuthView.js'
import { TodoApp } from '../components/TodoApp.js'

export const router = {
  render(container, user) {
    container.innerHTML = ''
    
    if (!user) {
      const authView = new AuthView()
      container.appendChild(authView.render())
    } else {
      const todoApp = new TodoApp(user)
      todoApp.render().then(element => {
        container.appendChild(element)
      })
    }
  }
}