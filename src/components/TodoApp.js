import { auth } from '../lib/auth.js'
import { todosDb } from '../lib/todos.js'
import { subscription } from '../lib/subscription.js'
import { PricingModal } from './PricingModal.js'

export class TodoApp {
  constructor(user) {
    this.user = user
    this.todos = []
    this.subscriptionStatus = null
    this.pricingModal = new PricingModal(user)
  }

  async render() {
    const container = document.createElement('div')
    container.className = 'app-container'
    
    try {
      this.subscriptionStatus = await subscription.getSubscriptionStatus(this.user.id)
      this.todos = await todosDb.getTodos(this.user.id)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    
    const isPremium = this.subscriptionStatus?.status === 'active'
    const todoCount = this.todos.length
    const maxFreeTodos = 5
    
    container.innerHTML = `
      <header class="app-header">
        <div class="header-content">
          <h1>My Todo List</h1>
          <div class="header-actions">
            <span class="user-email">${this.user.email}</span>
            ${isPremium ? '<span class="premium-badge">Premium</span>' : ''}
            ${!isPremium && this.subscriptionStatus?.status === 'canceled' ? '<span class="canceled-badge">Canceled</span>' : ''}
            <button id="subscriptionBtn" class="btn btn-secondary">
              ${isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
            </button>
            <button id="logoutBtn" class="btn btn-ghost">Logout</button>
          </div>
        </div>
      </header>
      
      <main class="app-main">
        <div class="container">
          ${!isPremium && todoCount >= maxFreeTodos ? `
            <div class="limit-notice">
              <p>You've reached the free plan limit of ${maxFreeTodos} todos.</p>
              <button class="btn btn-primary upgrade-btn">Upgrade to Premium for unlimited todos</button>
            </div>
          ` : ''}
          
          <div class="todo-container">
            <div class="input-container">
              <input type="text" id="taskInput" placeholder="Add a new task..." 
                ${!isPremium && todoCount >= maxFreeTodos ? 'disabled' : ''}>
              <button id="addBtn" ${!isPremium && todoCount >= maxFreeTodos ? 'disabled' : ''}>Add</button>
            </div>
            
            <div class="todo-stats">
              <span>${todoCount} ${todoCount === 1 ? 'task' : 'tasks'}</span>
              ${!isPremium ? `<span class="limit-text">${todoCount}/${maxFreeTodos} free tasks</span>` : ''}
            </div>
            
            <ul id="taskList" class="task-list"></ul>
          </div>
        </div>
      </main>
    `
    
    this.renderTodos(container)
    this.attachEventListeners(container)
    
    container.appendChild(this.pricingModal.render())
    
    return container
  }

  renderTodos(container) {
    const taskList = container.querySelector('#taskList')
    taskList.innerHTML = ''
    
    this.todos.forEach(todo => {
      const li = document.createElement('li')
      li.className = 'task-item'
      if (todo.completed) {
        li.classList.add('completed')
      }
      
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
        <span class="task-text">${this.escapeHtml(todo.text)}</span>
        <button class="delete-btn" data-id="${todo.id}">Delete</button>
      `
      
      taskList.appendChild(li)
    })
  }

  attachEventListeners(container) {
    const logoutBtn = container.querySelector('#logoutBtn')
    const subscriptionBtn = container.querySelector('#subscriptionBtn')
    const taskInput = container.querySelector('#taskInput')
    const addBtn = container.querySelector('#addBtn')
    const taskList = container.querySelector('#taskList')
    const upgradeBtn = container.querySelector('.upgrade-btn')
    
    logoutBtn.addEventListener('click', async () => {
      await auth.signOut()
    })
    
    subscriptionBtn.addEventListener('click', async () => {
      if (this.subscriptionStatus?.status === 'active') {
        try {
          const { url } = await subscription.createPortalSession(this.user.id)
          window.location.href = url
        } catch (error) {
          alert('Error opening subscription portal: ' + error.message)
        }
      } else {
        this.pricingModal.show()
      }
    })
    
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        this.pricingModal.show()
      })
    }
    
    const addTask = async () => {
      const text = taskInput.value.trim()
      if (!text) {
        alert('Please enter a task!')
        return
      }
      
      try {
        const newTodo = await todosDb.createTodo(this.user.id, text)
        this.todos.unshift(newTodo)
        taskInput.value = ''
        this.renderTodos(container)
        this.reRender()
      } catch (error) {
        alert('Error adding task: ' + error.message)
      }
    }
    
    addBtn.addEventListener('click', addTask)
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addTask()
      }
    })
    
    taskList.addEventListener('change', async (e) => {
      if (e.target.classList.contains('task-checkbox')) {
        const id = e.target.dataset.id
        const todo = this.todos.find(t => t.id === id)
        
        try {
          await todosDb.updateTodo(id, { completed: e.target.checked })
          todo.completed = e.target.checked
          this.renderTodos(container)
        } catch (error) {
          alert('Error updating task: ' + error.message)
          e.target.checked = !e.target.checked
        }
      }
    })
    
    taskList.addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id
        
        if (confirm('Are you sure you want to delete this task?')) {
          try {
            await todosDb.deleteTodo(id)
            this.todos = this.todos.filter(t => t.id !== id)
            this.renderTodos(container)
            this.reRender()
          } catch (error) {
            alert('Error deleting task: ' + error.message)
          }
        }
      }
    })
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  async reRender() {
    const app = document.getElementById('app')
    const newContent = await this.render()
    app.innerHTML = ''
    app.appendChild(newContent)
  }
}