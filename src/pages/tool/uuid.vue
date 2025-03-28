<script setup lang="ts">
import { ref } from 'vue';
import { generateUuid } from '../../invokes/uuid';
import HeaderBar from './header-bar.vue';

const uuid = ref('');

async function handleGenerateUuid(): Promise<void> {
  uuid.value = await generateUuid();
}
</script>

<template>
  <div>
    <HeaderBar />
    <div>
      <button @click="handleGenerateUuid">生成UUID</button>
      <button @click="handleGenerateUuid">生成10个</button>
      <button @click="handleGenerateUuid">复制到剪切板</button>
      <div>{{ uuid }}</div>
    </div>
  </div>
</template>