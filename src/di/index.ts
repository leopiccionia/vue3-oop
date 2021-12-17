import { Injector } from 'static-injector'
import { getCurrentInstance, inject, InjectionKey, provide } from 'vue'
import { StaticProvider } from 'static-injector/import/typings/di/interface/provider'
import { VueComponentStaticContructor } from '@/type'

export const InjectorKey: InjectionKey<Injector> = Symbol('Injector')

declare module 'vue' {
  interface App {
    getStore(): any
    getService(token: any): any
  }
}

export function resolveComponent(target: VueComponentStaticContructor) {
  if (!target.ɵfac) return new target()
  const parent = inject(InjectorKey, undefined)
  const providers = [target as unknown as StaticProvider].concat(target.providers || [])
  const injector = Injector.create({
    name: target.name,
    providers,
    parent,
  })
  if (target.asStore) {
    // 如果作为全局的服务，则注入到根上面
    const current = getCurrentInstance()!
    const app = current.appContext.app

    app.provide(InjectorKey, injector)
    app.getStore = () => injector
    app.getService = (token) => injector.get(token)
  } else {
    provide(InjectorKey, injector)
  }
  const compInstance = injector.get(target)
  providers.forEach((k) => injector.get(k))
  return compInstance
}
