import { computed, CSSProperties, Ref, ref } from "vue"

const CONTEXTMENU_DEFAULT_Z_INDEX = 1000

export default function useContextMenu(el: Ref<HTMLElement | null>) {
  const visible = ref<boolean>(false)
  const posotion = ref<[number, number]>([0, 0])

  const styles = computed<CSSProperties>(() => {
    return {
      position: "fixed",
      zIndex: CONTEXTMENU_DEFAULT_Z_INDEX,
      left: `${posotion.value[0]}px`,
      top: `${posotion.value[1]}px`,
      display: visible.value ? "block" : "none",
    }
  })

  function init(): void {
    if (el.value) {
      el.value.addEventListener("contextmenu", handleContextMenu)
      // TODO click away
    }
  }

  function handleContextMenu(e: MouseEvent): void {
    e.preventDefault()
    posotion.value = [e.clientX, e.clientY]
    visible.value = true
  }

  return { visible, posotion, styles, init }
}