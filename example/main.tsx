import '@abraham/reflection'
import { Link, Ref, VueComponent, VueService } from 'vue3-oop'
import { Injectable, InjectionToken } from 'static-injector'
import { createApp, h } from 'vue'
import './theme/app.css'

const TOKEN1 = new InjectionToken('TOken')

@Injectable()
class CountService extends VueService {
  @Ref() count = 2
  add() {
    this.count++
  }
  @Link() a?: InstanceType<any>
  remove() {
    this.count--
  }
}

abstract class A {
  name = 1
}

class Home extends VueComponent {
  render() {
    return h('div', 'home')
  }
}

const app = createApp(Home)
app.mount('#app')
