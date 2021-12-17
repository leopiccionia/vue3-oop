import { Injectable } from 'static-injector'
import { Ref, VueComponent, VueService } from 'vue3-oop'

@Injectable()
class CountService extends VueService {
  @Ref() count = 2
  add() {
    this.count++
  }
  remove() {
    this.count--
  }
}

@Injectable()
export class Home extends VueComponent {
  static providers = [CountService]
  constructor(private countService: CountService) {
    super()
    console.log(countService)
  }
  render() {
    return <div>home111</div>
  }
}

// @ts-ignore
console.log(Home.__vccOpts)
