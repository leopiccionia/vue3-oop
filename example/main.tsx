import '@abraham/reflection'
import { createApp } from 'vue'
import './theme/app.css'
import { Home } from './example'

const app = createApp(Home)
app.mount('#app')
