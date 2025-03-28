import { defineComponent } from 'vue'

export type CallFun = (vnodeEl: HTMLElement) => void
export interface RenderCallbackObj {
  mountedCallFun?: CallFun
  updatedCallFun?: CallFun
  unmountedCallFun?: CallFun
}
function factory({ mountedCallFun, updatedCallFun, unmountedCallFun }: RenderCallbackObj) {
  return defineComponent({
    name: 'SlotFactory',
    props: {
      vnode: null,
    },
    mounted() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      mountedCallFun && mountedCallFun(this.$el)
    },
    updated() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      updatedCallFun && updatedCallFun(this.$el)
    },
    unmounted() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      unmountedCallFun && unmountedCallFun(this.$el)
    },
    render(props: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return props.vnode
    },
  })
}

export default factory
