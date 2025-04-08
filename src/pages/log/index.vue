<script setup lang="ts">
import HeaderBar from './header-bar.vue'
import useLog from './use-log'

const { list, date, preview, next } = useLog()
</script>

<template>
  <div class="log-layout">
    <HeaderBar :date="date" @preview="preview" @next="next" />
    <div class="log-list">
      <div v-for="n in list" :key="n">
        {{ n }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.log-layout {
  background-color: #f2f5fe;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.log-list {
  flex: 1;
  overflow-y: auto;
}
</style>
