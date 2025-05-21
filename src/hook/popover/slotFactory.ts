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
      mountedCallFun && mountedCallFun(this.$el)
    },
    updated() {
      updatedCallFun && updatedCallFun(this.$el)
    },
    unmounted() {
      unmountedCallFun && unmountedCallFun(this.$el)
    },
    render(props: any) {
      return props.vnode
    },
  })
}

export default factory
