import type { Ref, SetupContext } from 'vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export default function useContent(slots: SetupContext['slots'], popperNode: Ref<HTMLElement>, content: Ref<string | undefined>) {
  let observer: MutationObserver
  const hasContent = ref(false)

  onMounted(() => {
    if (slots.content !== undefined || content.value)
      hasContent.value = true

    observer = new MutationObserver(checkContent)
    observer.observe(popperNode.value, {
      childList: true,
      subtree: true,
    })
  })

  onBeforeUnmount(() => observer.disconnect())

  /**
   * Watch the content prop
   */
  watch(content, (content) => {
    if (content)
      hasContent.value = true

    else
      hasContent.value = false
  })

  /**
   * Check the content slot
   */
  function checkContent() {
    if (slots.content)
      hasContent.value = true

    else
      hasContent.value = false
  }

  return {
    hasContent,
  }
}
