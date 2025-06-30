import { auth } from '../lib/auth.js'
import { router } from './router.js'
import '../css/style.css'

let currentUser = null

async function init() {
  const appElement = document.getElementById('app')
  
  auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null
    router.render(appElement, currentUser)
  })
  
  const user = await auth.getUser()
  currentUser = user
  router.render(appElement, currentUser)
}

init()

export { currentUser }