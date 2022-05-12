import {
  type ComponentProps,
  Hook,
  Link,
  Mut,
  useForwardRef,
  VueComponent,
} from 'vue3-oop'
import { nextTick } from 'vue'
import { Card } from 'ant-design-vue'

interface OriginProps {
  size?: 'small' | 'large'
  data?: number[]
}

class Origin extends VueComponent<OriginProps> {
  static defaultProps: ComponentProps<OriginProps> = ['size', 'data']

  render() {
    const { props } = this
    return (
      <div>
        {props.data?.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </div>
    )
  }
}

// 自带请求数据的组件
function WithDataOrigin<T extends { new (...args: any[]): any }>(
  Comp: T,
  request: (...args: any[]) => Promise<number[]>
): T {
  class CompWithData extends VueComponent {
    // 处理属性
    static inheritAttrs = false
    // @ts-ignore
    static displayName = Comp.displayName || Comp.name
    // 处理 ref
    forwardRef = useForwardRef()

    @Mut() data?: number[]

    @Hook('Mounted')
    async mounted() {
      this.data = await request()
      // 处理父组件的ref指向
      nextTick(() => this.$parent?.$forceUpdate())
    }

    render() {
      if (!this.data) return <div>loading....</div>
      return (
        <Comp
          ref={this.forwardRef}
          {...this.context.attrs}
          data={this.data}
          v-slots={this.context.slots}
        ></Comp>
      )
    }
  }

  return CompWithData as unknown as T
}

const OriginData = WithDataOrigin(
  Origin,
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve([1, 2, 3]), 3000)
    })
)

export default class HocView extends VueComponent {
  constructor() {
    super()
    const num = setInterval(() => {
      console.log(this.origin)
      if (this.origin instanceof Origin) clearInterval(num)
    }, 1000)
  }

  @Link() origin?: Origin

  render() {
    return (
      <Card>
        <OriginData ref={'origin'} size={'small'}></OriginData>
      </Card>
    )
  }
}
